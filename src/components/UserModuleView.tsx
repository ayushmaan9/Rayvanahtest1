import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Sliders, 
  Check,
  AlertTriangle,
  Mail,
  Phone,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { AdminUser, ModulePermission } from '../types';

export default function UserModuleView() {
  // Current logged in user details
  const loggedInUserId = "USR10001"; // John Drake
  const loggedInUserEmail = "j.drake@acme.com";

  // Navigation states
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'create'>('dashboard');

  // List states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Accordion state
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<ModulePermission[]>([]);
  const [savingPermissionsId, setSavingPermissionsId] = useState<string | null>(null);

  // Success/Fail Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modules list
  const [activeModules, setActiveModules] = useState<string[]>([
    "Merchant Management",
    "Settlement",
    "Reports",
    "Risk & Fraud",
    "Treasury",
    "Compliance & KYC"
  ]);

  // Form states for Create User
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: true,
    dataAccessDuration: 'All Past Data'
  });

  const [formPermissions, setFormPermissions] = useState<ModulePermission[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingMobile, setIsCheckingMobile] = useState(false);
  
  // Confirmation Popup State
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users when view loaded or refreshed
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Set default initial permissions for Create User
  useEffect(() => {
    const initialPerms = activeModules.map(m => ({
      moduleName: m,
      admin: false,
      maker: false,
      checker: false,
      viewer: m === "Merchant Management" // Give default Viewer access to Merchant Management
    }));
    setFormPermissions(initialPerms);
  }, [activeModules]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Toggle status of a user
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === loggedInUserId) {
      setToast({ message: "Self-deactivation is restricted to prevent account lockout.", type: 'error' });
      return;
    }

    try {
      const nextStatus = !currentStatus;
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
        setToast({ 
          message: `User ${userId} has been ${nextStatus ? 'Activated' : 'Suspended'} successfully.`, 
          type: 'success' 
        });
      } else {
        const errData = await res.json();
        setToast({ message: errData.error || "Failed to update user status.", type: 'error' });
      }
    } catch (err) {
      setToast({ message: "Network error occurred. Please try again.", type: 'error' });
    }
  };

  // Expand or Collapse Row & Load its current permissions
  const handleToggleAccordion = (user: AdminUser) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(user.id);
      // Clone its active permissions to state for local modifications
      setEditingPermissions(JSON.parse(JSON.stringify(user.permissions)));
    }
  };

  // Handle local permission toggle for module row (mutual exclusivity rule checks)
  const handlePermissionChange = (
    moduleIndex: number, 
    role: 'admin' | 'maker' | 'checker' | 'viewer', 
    currentVal: boolean,
    isForm: boolean = false
  ) => {
    const listToUpdate = isForm ? [...formPermissions] : [...editingPermissions];
    const item = { ...listToUpdate[moduleIndex] };
    const nextVal = !currentVal;

    if (role === 'admin') {
      item.admin = nextVal;
      if (nextVal) {
        // If Admin is ON, others should be OFF (business exclusivity)
        item.maker = false;
        item.checker = false;
        item.viewer = false;
      }
    } else {
      item[role] = nextVal;
      if (nextVal) {
        // If any of Maker/Checker/Viewer is turned ON, Admin must be OFF
        item.admin = false;
      }
    }

    listToUpdate[moduleIndex] = item;
    if (isForm) {
      setFormPermissions(listToUpdate);
    } else {
      setEditingPermissions(listToUpdate);
    }
  };

  // Commit updated permissions to back-end
  const handleSavePermissions = async (userId: string) => {
    if (userId === loggedInUserId) {
      setToast({ message: "Self-edit permissions are restricted to prevent lockout escalations.", type: 'error' });
      return;
    }

    // Business validation check: A user must have at least 'Viewer' access to at least one module
    const hasAnyAccess = editingPermissions.some(p => p.admin || p.maker || p.checker || p.viewer);
    if (!hasAnyAccess) {
      setToast({ message: "Mandatory Access: A user must have at least one permission assigned.", type: 'error' });
      return;
    }

    try {
      setSavingPermissionsId(userId);
      const res = await fetch(`/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editingPermissions })
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        setExpandedUserId(null);
        setToast({ message: `Access permissions updated successfully for ${data.user.name}.`, type: 'success' });
      } else {
        const errData = await res.json();
        setToast({ message: errData.error || "Failed to update permissions.", type: 'error' });
      }
    } catch (e) {
      setToast({ message: "Failed to connect to AtmoonPe gateway.", type: 'error' });
    } finally {
      setSavingPermissionsId(null);
    }
  };

  // Validation routines for form
  const validateField = (field: string, val: string) => {
    const errors = { ...formErrors };

    if (field === 'firstName') {
      if (!val) {
        errors.firstName = "First Name is required.";
      } else if (!/^[A-Za-z]+$/.test(val)) {
        errors.firstName = "Only alphabets allowed.";
      } else if (val.length < 2) {
        errors.firstName = "Must be at least 2 characters.";
      } else {
        delete errors.firstName;
      }
    }

    if (field === 'lastName') {
      if (!val) {
        errors.lastName = "Last Name is required.";
      } else if (!/^[A-Za-z]+$/.test(val)) {
        errors.lastName = "Only alphabets allowed.";
      } else if (val.length < 2) {
        errors.lastName = "Must be at least 2 characters.";
      } else {
        delete errors.lastName;
      }
    }

    if (field === 'email') {
      if (!val) {
        errors.email = "Email ID is required.";
      } else if (!val.includes('@') || !val.includes('.')) {
        errors.email = "Invalid Email Format.";
      } else {
        delete errors.email;
      }
    }

    if (field === 'phone') {
      if (!val) {
        errors.phone = "Mobile Number is required.";
      } else if (!/^[6-9]\d{9}$/.test(val)) {
        errors.phone = "Invalid Mobile Number. Must be exactly 10 digits starting with 6-9.";
      } else {
        delete errors.phone;
      }
    }

    if (field === 'password') {
      // Password Policy: Min 8 chars, 1 uppercase, 1 special char, 1 number
      if (!val) {
        errors.password = "Password is required.";
      } else {
        const hasUpper = /[A-Z]/.test(val);
        const hasNumber = /\d/.test(val);
        const hasSpecial = /[^A-Za-z0-9]/.test(val);
        const hasMinLen = val.length >= 8;

        if (!hasUpper || !hasNumber || !hasSpecial || !hasMinLen) {
          errors.password = "Password does not meet complexity requirements.";
        } else {
          delete errors.password;
        }
      }
    }

    if (field === 'confirmPassword') {
      if (!val) {
        errors.confirmPassword = "Confirmation is required.";
      } else if (val !== formData.password) {
        errors.confirmPassword = "Passwords do not match.";
      } else {
        delete errors.confirmPassword;
      }
    }

    setFormErrors(errors);
  };

  // Blur handlers to check unique credentials in backend
  const handleEmailBlur = async () => {
    if (!formData.email || formErrors.email) return;

    try {
      setIsCheckingEmail(true);
      const res = await fetch('/api/users/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setFormErrors(prev => ({ ...prev, email: "Email already exists." }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleMobileBlur = async () => {
    if (!formData.phone || formErrors.phone) return;

    try {
      setIsCheckingMobile(true);
      const res = await fetch('/api/users/check-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.phone })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setFormErrors(prev => ({ ...prev, phone: "Mobile number already exists." }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingMobile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Trigger form validation and show popup
  const handleCreateUserRequest = (e: React.FormEvent) => {
    e.preventDefault();

    // Run validations on all fields
    const errors: Record<string, string> = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    else if (!/^[A-Za-z]+$/.test(formData.firstName)) errors.firstName = "Only alphabets allowed.";
    else if (formData.firstName.length < 2) errors.firstName = "Must be at least 2 characters.";

    if (!formData.lastName) errors.lastName = "Last Name is required.";
    else if (!/^[A-Za-z]+$/.test(formData.lastName)) errors.lastName = "Only alphabets allowed.";
    else if (formData.lastName.length < 2) errors.lastName = "Must be at least 2 characters.";

    if (!formData.email) errors.email = "Email ID is required.";
    else if (!formData.email.includes('@') || !formData.email.includes('.')) errors.email = "Invalid Email Format.";

    if (!formData.phone) errors.phone = "Mobile Number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errors.phone = "Invalid Mobile Number. Must be exactly 10 digits starting with 6-9.";

    if (!formData.password) errors.password = "Password is required.";
    else {
      const v = formData.password;
      if (v.length < 8 || !/[A-Z]/.test(v) || !/\d/.test(v) || !/[^A-Za-z0-9]/.test(v)) {
        errors.password = "Password does not meet complexity requirements.";
      }
    }

    if (!formData.confirmPassword) errors.confirmPassword = "Confirmation is required.";
    else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // Business validation: At least one Viewer, Checker, Maker, or Admin on one module
    const hasAnyAccess = formPermissions.some(p => p.admin || p.maker || p.checker || p.viewer);
    if (!hasAnyAccess) {
      errors.permissions = "Mandatory Access: A user must have at least 'Viewer' access to at least one module.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({ message: "Please correct input errors before committing the user.", type: 'error' });
      return;
    }

    // Everything looks perfect. Open the confirmation modal popup as requested!
    setShowConfirmPopup(true);
  };

  // Submit actual user creation API on confirmation
  const handleConfirmOnboard = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: formData.status,
        dataAccessDuration: formData.dataAccessDuration,
        permissions: formPermissions
      };

      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(prev => [data.user, ...prev]); // Prepend new user to top
        setShowConfirmPopup(false);
        setActiveSubView('dashboard');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          status: true,
          dataAccessDuration: 'All Past Data'
        });
        
        // Reset permissions checklist
        const initialPerms = activeModules.map(m => ({
          moduleName: m,
          admin: false,
          maker: false,
          checker: false,
          viewer: m === "Merchant Management"
        }));
        setFormPermissions(initialPerms);
        setFormErrors({});

        setToast({ message: `Successfully created and onboarded ${data.user.name} on AtmoonPe!`, type: 'success' });
      } else {
        const errVal = await res.json();
        setToast({ message: errVal.error || "Failed/Forbidden to create user.", type: 'error' });
        setShowConfirmPopup(false);
      }
    } catch (e) {
      setToast({ message: "API service failed to execute user registration.", type: 'error' });
      setShowConfirmPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filters calculation
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roleDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ? true : 
      statusFilter === 'active' ? user.status === true :
      user.status === false;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notifier */}
      {toast && (
        <div className={`fixed top-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold shadow-lg animate-fade-in select-none ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle className={`w-4 h-4 shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
          {toast.message}
        </div>
      )}

      {/* SUB-VIEW 1: USERS DASHBOARD */}
      {activeSubView === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/50 pb-5">
            <div>
              <span className="bg-blue-500/10 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                AtmoonPe Gatekeeper
              </span>
              <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5 leading-tight">
                User Management Dashboard
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Configure employees, implement Role-Based Access Control (RBAC), and define historical data access limits safely.
              </p>
            </div>
            <button
              onClick={() => setActiveSubView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Create User
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-3xs text-xs font-semibold">
              <span className="text-neutral-400 text-[10px] uppercase">Total Admin Accounts</span>
              <p className="text-xl font-bold text-neutral-900 font-mono mt-0.5">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-3xs text-xs font-semibold">
              <span className="text-green-600 text-[10px] uppercase">Active Status</span>
              <p className="text-xl font-bold text-green-700 font-mono mt-0.5">
                {users.filter(u => u.status).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-3xs text-xs font-semibold">
              <span className="text-neutral-400 text-[10px] uppercase">Suspended</span>
              <p className="text-xl font-bold text-neutral-500 font-mono mt-0.5">
                {users.filter(u => !u.status).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-3xs text-xs font-semibold">
              <span className="text-amber-600 text-[10px] uppercase">Platform Modules Locked</span>
              <p className="text-xl font-bold text-amber-600 font-mono mt-0.5">{activeModules.length}</p>
            </div>
          </div>

          {/* Directory Box */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
            {/* Search/Filter Controls Header */}
            <div className="p-4 border-b border-neutral-150 bg-neutral-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-xs text-xs">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, role, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-250 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium text-neutral-800 transition-all text-xs"
                />
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
                <span className="text-neutral-500 font-medium">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="bg-white border border-neutral-250 text-neutral-700 font-medium px-3 py-1.5 rounded-lg outline-none text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Profiles</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Table Area */}
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400 font-medium">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                Locking connection and retrieving corporate registry...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-400 font-semibold">
                No organization employees found matching search parameters.
              </div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200/50 uppercase text-[9px] tracking-wider font-bold">
                      <th className="px-5 py-3">User ID</th>
                      <th className="px-5 py-3">Employee Details</th>
                      <th className="px-5 py-3">Email Address</th>
                      <th className="px-5 py-3">Current Access Mapping</th>
                      <th className="px-5 py-3">Onboarded Date</th>
                      <th className="px-5 py-3 text-center">Login Status</th>
                      <th className="px-5 py-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150">
                    {filteredUsers.map((user) => {
                      const isExpanded = expandedUserId === user.id;
                      const isSelf = user.id === loggedInUserId;
                      
                      return (
                        <React.Fragment key={user.id}>
                          {/* Main Row */}
                          <tr 
                            className={`transition-all duration-200 font-medium text-neutral-700 ${
                              isExpanded ? 'bg-blue-50/20 shadow-inner' : 'hover:bg-neutral-50/30'
                            } ${expandedUserId && !isExpanded ? 'opacity-60 saturate-50' : 'opacity-100'}`}
                          >
                            <td className="px-5 py-4 font-mono font-bold text-neutral-900">{user.id}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-neutral-950 flex items-center gap-1.5">
                                  {user.name}
                                  {isSelf && (
                                    <span className="bg-blue-500/10 text-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                                      You
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono font-bold">{user.phone}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-blue-600 hover:underline cursor-pointer">{user.email}</td>
                            <td className="px-5 py-4">
                              <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 text-[10px] rounded font-semibold border border-neutral-200/80 max-w-[200px] inline-block truncate">
                                {user.roleDescription}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-mono text-neutral-500 text-[10px]">{user.activeDate}</td>
                            <td className="px-5 py-4 text-center">
                              <div className="flex items-center justify-center">
                                {isSelf ? (
                                  <div className="flex items-center gap-1 text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-400 px-2 py-1.5 rounded-md cursor-not-allowed select-none">
                                    <Lock className="w-3 h-3 text-neutral-400 shrink-0" />
                                    <span>Active</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                      user.status ? 'bg-green-600' : 'bg-neutral-300'
                                    }`}
                                  >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                      user.status ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() => handleToggleAccordion(user)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                  isExpanded 
                                    ? 'bg-neutral-200 text-neutral-800' 
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                }`}
                              >
                                {isExpanded ? 'Collapse' : 'Edit Access'}
                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                              </button>
                            </td>
                          </tr>

                          {/* Accordion Child Row block */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="px-6 py-5 bg-neutral-50/80 border-t border-b border-neutral-200 shadow-inner">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                                    <div className="flex items-center gap-2">
                                      <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
                                      <h4 className="text-xs font-bold text-neutral-900 uppercase">
                                        Role-Based Permissions Matrix: {user.name} ({user.id})
                                      </h4>
                                    </div>
                                    <span className="text-[10px] text-neutral-400 font-mono font-medium">
                                      MFA session locked • Data scope: {user.dataAccessDuration || "All Past Data"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Permissions matrix column */}
                                    <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-3">
                                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pb-1 border-b border-neutral-100">
                                        Configured Modules Access Control
                                      </span>
                                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                        {editingPermissions.map((perm, mIdx) => (
                                          <div key={perm.moduleName} className="p-3 bg-neutral-50 border border-neutral-150 rounded-lg space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold text-neutral-900">{perm.moduleName}</span>
                                              {perm.admin && (
                                                <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                                  Full Suite
                                                </span>
                                              )}
                                            </div>
                                            
                                            {/* Four discrete checkboxes */}
                                            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold pt-1 text-center">
                                              <div>
                                                <button
                                                  onClick={() => handlePermissionChange(mIdx, 'admin', perm.admin)}
                                                  className={`w-full py-1 rounded transition-colors cursor-pointer ${
                                                    perm.admin 
                                                      ? 'bg-blue-600 text-white border border-blue-600' 
                                                      : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                                                  }`}
                                                >
                                                  Admin
                                                </button>
                                              </div>
                                              <div>
                                                <button
                                                  onClick={() => handlePermissionChange(mIdx, 'maker', perm.maker)}
                                                  className={`w-full py-1 rounded transition-colors cursor-pointer ${
                                                    perm.maker 
                                                      ? 'bg-emerald-600 text-white border border-emerald-600' 
                                                      : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                                                  }`}
                                                >
                                                  Maker
                                                </button>
                                              </div>
                                              <div>
                                                <button
                                                  onClick={() => handlePermissionChange(mIdx, 'checker', perm.checker)}
                                                  className={`w-full py-1 rounded transition-colors cursor-pointer ${
                                                    perm.checker 
                                                      ? 'bg-indigo-600 text-white border border-indigo-600' 
                                                      : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                                                  }`}
                                                >
                                                  Checker
                                                </button>
                                              </div>
                                              <div>
                                                <button
                                                  onClick={() => handlePermissionChange(mIdx, 'viewer', perm.viewer)}
                                                  className={`w-full py-1 rounded transition-colors cursor-pointer ${
                                                    perm.viewer 
                                                      ? 'bg-neutral-700 text-white border border-neutral-700' 
                                                      : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                                                  }`}
                                                >
                                                  Viewer
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Safety check and save control column */}
                                    <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-4 flex flex-col justify-between">
                                      <div className="space-y-2 text-xs">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pb-1 border-b border-neutral-100">
                                          Security Audit & Safeguards
                                        </span>
                                        <p className="text-neutral-500 font-medium leading-relaxed font-sans pt-1">
                                          By clicking save, you declare role mapping changes onto the organization matrix. If the target employee has <b>Maker</b> credentials enabled, they are cleared to log payout instructions but require operational checker approvals under Maker Checker rules.
                                        </p>
                                        <p className="text-neutral-500 font-medium leading-relaxed font-sans bg-amber-50 rounded border border-amber-100 p-2.5 text-[10px] text-amber-700 flex items-start gap-1.5">
                                          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                          Admin role is mutually exclusive with operational roles. Turning Admin ON automatically suspends discrete Maker, Checker, or Viewer roles on the same module.
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 justify-end">
                                        <button
                                          onClick={() => setExpandedUserId(null)}
                                          className="px-4 py-2 border border-neutral-250 text-neutral-600 hover:bg-neutral-100 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleSavePermissions(user.id)}
                                          disabled={savingPermissionsId === user.id}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
                                        >
                                          {savingPermissionsId === user.id ? (
                                            <>
                                              <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                              Saving Changes...
                                            </>
                                          ) : (
                                            <>
                                              <Check className="w-4 h-4" />
                                              Save Changes
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Compliance & Rules Panel */}
          <div className="bg-neutral-100 p-5 rounded-xl border border-neutral-200/80 text-xs font-semibold leading-relaxed text-neutral-500 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-neutral-900 leading-none">RBAC System Compliance Enforcement Module</h4>
              <p className="text-[11px] font-medium text-neutral-500 leading-relaxed">
                AtmoonPe Admin Portal operates under strict Role-Based Access Control standards defined by the security steering committee. Access controls, status updates, and user profile creations are mapped to active security log indexes (IP tracking, action types, and user timestamps) for compliance audits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CREATE USER PAGE */}
      {activeSubView === 'create' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200/50 pb-5">
            <div>
              <span className="bg-blue-500/10 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                AtmoonPe Registry
              </span>
              <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5">
                Create New User
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Enter name, email, credentials, and define initial suite-level permissions for the onboarding employee.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateUserRequest} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side: General Profile Form Fields */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
              <h3 className="text-xs font-bold text-neutral-900 uppercase pb-2 border-b border-neutral-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                Employee Profile Details
              </h3>

              <div className="space-y-4 text-xs font-semibold text-neutral-800">
                
                {/* First and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder="e.g. Abhinav"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                        formErrors.firstName ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors.firstName && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.firstName}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="e.g. Ladole"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                        formErrors.lastName ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors.lastName && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.lastName}</span>
                    )}
                  </div>
                </div>

                {/* Email and Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Email ID *</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="e.g. abhinav@atmoonpe.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        className={`w-full pl-9 pr-4 text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                          formErrors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 shrink-0" />
                      {isCheckingEmail && (
                        <div className="absolute right-3 top-3.5"><span className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin block"></span></div>
                      )}
                    </div>
                    {formErrors.email && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Mobile Number *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="phone"
                        placeholder="e.g. 9876543210 (starts 6-9)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleMobileBlur}
                        className={`w-full pl-9 pr-4 text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                          formErrors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 shrink-0" />
                      {isCheckingMobile && (
                        <div className="absolute right-3 top-3.5"><span className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin block"></span></div>
                      )}
                    </div>
                    {formErrors.phone && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Password *</label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="Min 8 letters, 1 upper, 1 sign, 1 num"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                        formErrors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors.password && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.password}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Confirm Password *</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full text-xs p-2.5 border rounded-lg bg-neutral-50 hover:bg-neutral-100 focus:bg-white outline-none focus:ring-1 transition-all font-medium text-neutral-800 ${
                        formErrors.confirmPassword ? 'border-rose-400 focus:ring-rose-400' : 'border-neutral-250 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <span className="text-[10px] text-rose-600 font-bold block">{formErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                {/* Status Toggle & Help info */}
                <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-900 block">Default Account Status</span>
                    <span className="text-[10px] font-medium text-neutral-500 block">
                      Define if the login capability is activated instantly upon password validation.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    className={`relative inline-flex h-5.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formData.status ? 'bg-green-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formData.status ? 'translate-x-5.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Module wise permissions layout section */}
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase">
                    Module-Wise Suite Permissions Map
                  </h3>
                </div>
                
                {formErrors.permissions && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold rounded-lg leading-snug flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    {formErrors.permissions}
                  </div>
                )}

                <div className="space-y-3">
                  {formPermissions.map((perm, mIdx) => (
                    <div key={perm.moduleName} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block leading-tight">{perm.moduleName}</span>
                        {perm.admin && (
                          <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                            Full Admin
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-center sm:max-w-xs w-full">
                        <div>
                          <label className="text-[8px] text-neutral-400 block mb-1 uppercase font-mono">Admin</label>
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(mIdx, 'admin', perm.admin, true)}
                            className={`w-full py-1.5 rounded-lg transition-all cursor-pointer ${
                              perm.admin 
                                ? 'bg-blue-600 text-white border border-blue-600' 
                                : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            On
                          </button>
                        </div>
                        <div>
                          <label className="text-[8px] text-neutral-400 block mb-1 uppercase font-mono">Maker</label>
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(mIdx, 'maker', perm.maker, true)}
                            className={`w-full py-1.5 rounded-lg transition-all cursor-pointer ${
                              perm.maker 
                                ? 'bg-emerald-600 text-white border border-emerald-600' 
                                : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            On
                          </button>
                        </div>
                        <div>
                          <label className="text-[8px] text-neutral-400 block mb-1 uppercase font-mono">Checker</label>
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(mIdx, 'checker', perm.checker, true)}
                            className={`w-full py-1.5 rounded-lg transition-all cursor-pointer ${
                              perm.checker 
                                ? 'bg-indigo-600 text-white border border-indigo-600' 
                                : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            On
                          </button>
                        </div>
                        <div>
                          <label className="text-[8px] text-neutral-400 block mb-1 uppercase font-mono">Viewer</label>
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(mIdx, 'viewer', perm.viewer, true)}
                            className={`w-full py-1.5 rounded-lg transition-all cursor-pointer ${
                              perm.viewer 
                                ? 'bg-neutral-700 text-white border border-neutral-700' 
                                : 'bg-white border border-neutral-250 text-neutral-600 hover:bg-neutral-100'
                            }`}
                          >
                            On
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Column: Data access duration & footer actions */}
            <div className="space-y-6">
              
              {/* Historical Duration Picker */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase">
                    Data Access Duration
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed pb-2 border-b border-neutral-100">
                  Impose a hard lock on the timeframe of ledger records the user is authorized to extract or query.
                </p>

                <div className="space-y-2 text-xs text-neutral-700">
                  {[
                    "1 Day / Current Day",
                    "3 Days",
                    "7 Days",
                    "15 Days",
                    "30 Days",
                    "90 Days",
                    "All Past Data"
                  ].map((option) => (
                    <label 
                      key={option} 
                      className={`flex items-center gap-3 p-2 border border-neutral-150 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 ${
                        formData.dataAccessDuration === option ? 'bg-blue-50/20 border-blue-400 text-blue-900 font-bold' : ''
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="dataAccessDuration"
                        value={option}
                        checked={formData.dataAccessDuration === option}
                        onChange={() => setFormData(prev => ({ ...prev, dataAccessDuration: option }))}
                        className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-blue-500 shrink-0"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  Onboard Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubView('dashboard');
                    setFormErrors({});
                  }}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-255 font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors block text-center"
                >
                  Cancel Onboarding
                </button>
              </div>

              {/* Security info box */}
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-150 text-xs font-semibold leading-relaxed space-y-2 select-none">
                <h4 className="font-bold flex items-center gap-1.5 text-blue-900">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  Security Credential Policy
                </h4>
                <p className="text-[11px] font-medium leading-relaxed text-blue-800/90">
                  Password rules are validated client side and enforced server side securely. Upon confirmation, a welcome onboarding token will be compiled. Password must include at least:
                </p>
                <ul className="list-disc pl-5 text-[10px] space-y-0.5 text-blue-800 font-bold">
                  <li>8 minimum characters length</li>
                  <li>1 uppercase character (A-Z)</li>
                  <li>1 special character (!, @, #, $, etc.)</li>
                  <li>1 digit number (0-9)</li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 w-full max-w-md shadow-2xl p-6 space-y-4 animate-fade-in text-xs font-semibold">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-150 text-neutral-900 uppercase">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-bold">Confirm User Registry</h3>
            </div>

            <p className="text-neutral-700 text-sm leading-relaxed font-sans font-medium">
              Kindly confirm you want to create <strong className="text-neutral-950 font-bold">'{formData.firstName} {formData.lastName}'</strong> as New User to the AtMoonPe Platform.
            </p>

            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 text-[11px] text-neutral-500 font-medium font-mono space-y-1">
              <div>Email: {formData.email}</div>
              <div>Phone: {formData.phone}</div>
              <div>Access Limit: {formData.dataAccessDuration}</div>
            </div>

            <div className="flex items-center gap-3 pt-3 justify-end">
              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 border border-neutral-250 text-neutral-600 hover:bg-neutral-100 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmOnboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin block"></span>
                    Registering...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    Yes, I Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
