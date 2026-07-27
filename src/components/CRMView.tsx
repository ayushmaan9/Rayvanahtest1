import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Activity, 
  DollarSign, 
  ShieldAlert, 
  CalendarDays, 
  Heart, 
  Clock, 
  MessageSquare, 
  UserMinus, 
  CheckCircle, 
  AlertCircle, 
  FileCheck,
  Building,
  Star,
  ChevronRight,
  Info,
  RefreshCcw,
  Edit2
} from 'lucide-react';
import { Customer, TimelineEvent, Transaction } from '../types';
import { getCustomerTimeline, mockTransactions } from '../data';

interface CRMViewProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string | null) => void;
  onUpdateCustomer: (id: string, updatedFields: Partial<Customer>) => void;
  transactions: Transaction[];
  onRefundTransaction: (txnId: string) => void;
}

export default function CRMView({ 
  customers, 
  selectedCustomerId, 
  onSelectCustomer, 
  onUpdateCustomer,
  transactions,
  onRefundTransaction
}: CRMViewProps) {
  // Directory state
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | 'good' | 'average' | 'poor'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'churned' | 'inactive'>('all');

  // Customer Detail specific state
  const [detailTab, setDetailTab] = useState<'overview' | 'timeline' | 'revenue' | 'payments' | 'risk' | 'communication' | 'subscriptions' | 'health'>('overview');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescText, setEditDescText] = useState('');
  
  // Find customer if any is selected
  const activeCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filtered customer directory list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.company.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesHealth = healthFilter === 'all' || c.healthStatus === healthFilter;
    const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesHealth && matchesRisk && matchesStatus;
  });

  // Handle opening customer profile
  const handleViewCustomer = (id: string) => {
    onSelectCustomer(id);
    setDetailTab('overview');
    const cust = customers.find(c => c.id === id);
    if (cust) {
      setEditDescText(cust.description);
    }
  };

  // Handle description save
  const handleSaveDescription = () => {
    if (activeCustomer) {
      onUpdateCustomer(activeCustomer.id, { description: editDescText });
      setIsEditingDesc(false);
    }
  };

  // Close customer detail and return to directory list
  const handleBackToDirectory = () => {
    onSelectCustomer(null);
  };

  // Get filtered payments for active customer
  const customerPayments = transactions.filter(t => t.customerId === selectedCustomerId);

  // Fetch timeline events for active customer
  const timelineEvents = activeCustomer ? getCustomerTimeline(activeCustomer.id) : [];

  return (
    <div className="space-y-6">
      {!activeCustomer ? (
        /* ========================================================================= */
        /*                          1. CUSTOMER DIRECTORY LAYOUT                     */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Active CRM Directory</h2>
              <p className="text-xs text-neutral-500 mt-1">Cross-reference real-time accounts profiles, LTV margins, and customer health parameters</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {customers.length} Accounts Synchronized
              </span>
            </div>
          </div>

          {/* Table Filters Panel */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search by directory account name, corp..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full text-xs bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 hover:border-neutral-300 focus:border-emerald-500 rounded-lg outline-hidden text-neutral-800 transition-colors font-medium"
              />
            </div>

            {/* Quick Filter select controls */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Health Score Select filter */}
              <div className="flex flex-col">
                <select 
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value as any)}
                  className="bg-neutral-50 border border-neutral-250 text-neutral-700 text-xs py-1.5 px-3 rounded-lg hover:border-neutral-350 focus:border-emerald-500 font-semibold outline-hidden"
                >
                  <option value="all">Health: All</option>
                  <option value="good">Good (&gt;80%)</option>
                  <option value="average">Average (60%-80%)</option>
                  <option value="poor">Poor (&lt;60%)</option>
                </select>
              </div>

              {/* Risk Filter Select */}
              <div>
                <select 
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="bg-neutral-50 border border-neutral-250 text-neutral-700 text-xs py-1.5 px-3 rounded-lg hover:border-neutral-350 focus:border-emerald-500 font-semibold outline-hidden"
                >
                  <option value="all">Risk Score: All</option>
                  <option value="low">Low Threat Level</option>
                  <option value="medium">Medium Flagged</option>
                  <option value="high">High Alert</option>
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-neutral-50 border border-neutral-250 text-neutral-700 text-xs py-1.5 px-3 rounded-lg hover:border-neutral-350 focus:border-emerald-500 font-semibold outline-hidden"
                >
                  <option value="all">Life Status: All</option>
                  <option value="active">Active Plan Subscribed</option>
                  <option value="inactive">Inactive</option>
                  <option value="churned">Churned (Archived)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CRM Account Ledger Index */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-50/70 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                    <th className="px-5 py-3.5 font-medium">Customer Beneficiary Name</th>
                    <th className="px-5 py-3.5 font-medium">Corporate Division</th>
                    <th className="px-5 py-3.5 font-medium">Life Status</th>
                    <th className="px-5 py-3.5 font-medium text-center">Threat Rating</th>
                    <th className="px-5 py-3.5 text-center font-medium">Health Indicator</th>
                    <th className="px-5 py-3.5 text-right font-medium">Active MRR</th>
                    <th className="px-5 py-3.5 text-right font-medium">Gross LTV sum</th>
                    <th className="px-5 py-4 text-center font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-neutral-400 font-semibold">
                        <p>No customers match the active filters in this segment</p>
                        <p className="text-[11px] text-neutral-400 font-normal mt-1">Refine selection tags or query with broader keywords.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cus) => {
                      return (
                        <tr 
                          key={cus.id} 
                          onClick={() => handleViewCustomer(cus.id)}
                          className="hover:bg-neutral-50/50 cursor-pointer transition-colors"
                        >
                          {/* Name / email */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold tracking-tight text-xs shadow-xs ${cus.logoColor}`}>
                                {cus.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-900 text-xs hover:text-emerald-600 transition-colors">{cus.name}</p>
                                <p className="text-[10px] text-neutral-400 font-medium font-mono lowercase">{cus.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Company / country */}
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-neutral-800 text-[11px]">{cus.company}</p>
                            <p className="text-[10px] text-neutral-400">{cus.country}</p>
                          </td>

                          {/* Life Status badge */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                              cus.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              cus.status === 'inactive' ? 'bg-gray-50 text-gray-700 border-gray-100' :
                              'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                cus.status === 'active' ? 'bg-emerald-500' :
                                cus.status === 'inactive' ? 'bg-gray-400' : 'bg-rose-500'
                              }`}></span>
                              {cus.status}
                            </span>
                          </td>

                          {/* Risk Level Badge */}
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              cus.riskLevel === 'low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              cus.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                            }`}>
                              {cus.riskLevel.toUpperCase()}
                            </span>
                          </td>

                          {/* Health Score */}
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`inline-block rounded-sm w-2 h-2 ${
                                cus.healthStatus === 'good' ? 'bg-emerald-500' :
                                cus.healthStatus === 'average' ? 'bg-amber-400' : 'bg-rose-500'
                              }`}></span>
                              <span className="font-semibold text-neutral-900 text-xs">{cus.healthScore}%</span>
                            </div>
                          </td>

                          {/* MRR */}
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-neutral-900 text-xs">
                            ₹{cus.mrr.toLocaleString('en-IN')}
                          </td>

                          {/* Revenue */}
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-700 text-xs">
                            ₹{cus.revenue.toLocaleString('en-IN')}
                          </td>

                          {/* Inspect row arrow action */}
                          <td className="px-5 py-4 text-center">
                            <ChevronRight className="w-4 h-4 text-neutral-300 inline hover:text-emerald-500 transition-colors" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /*                          2. CUSTOMER 360 & CUSTOMER DETAIL VIEW           */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Detailed View Breadcrumb & Top bar */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <button 
              onClick={handleBackToDirectory}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Customer Directory index
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const newHealth = activeCustomer.healthScore >= 90 ? 45 : 92;
                  const newHealthStatus = newHealth > 80 ? 'good' : 'average';
                  onUpdateCustomer(activeCustomer.id, { 
                    healthScore: newHealth, 
                    healthStatus: newHealthStatus 
                  });
                }}
                className="text-[11px] font-semibold text-neutral-700 border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-neutral-400" />
                Cycle Health Score Flag
              </button>
            </div>
          </div>

          {/* Customer Header summary banner */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0 ${activeCustomer.logoColor}`}>
                {activeCustomer.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-neutral-950 tracking-tight leading-tight">{activeCustomer.name}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border inline-block ${
                    activeCustomer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 border-gray-100 text-gray-500'
                  }`}>
                    {activeCustomer.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    activeCustomer.riskLevel === 'low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    activeCustomer.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  }`}>
                    Risk: {activeCustomer.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono font-medium lowercase">Beneficiary Key: {activeCustomer.id} • Registered company: {activeCustomer.company}</p>
                
                {/* Visual tags rendering */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeCustomer.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold bg-neutral-100 text-neutral-500 uppercase tracking-wide border border-neutral-200/50 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro Dashboard segment inside Customer Banner */}
            <div className="grid grid-cols-3 gap-5 border-t md:border-t-0 md:border-l border-neutral-150 pt-4 md:pt-0 pl-0 md:pl-6 w-full md:w-auto text-left">
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Gross Revenue</p>
                <p className="text-base font-bold font-mono text-emerald-700 mt-0.5">₹{activeCustomer.revenue.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Recurring MRR</p>
                <p className="text-base font-bold font-mono text-neutral-950 mt-0.5">₹{activeCustomer.mrr.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">NPS rating</p>
                <div className="flex items-center gap-1 mt-0.5 text-base font-bold text-neutral-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{activeCustomer.npsScore}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABBED CRM NAVIGATION RAIL */}
          <div className="border-b border-neutral-200/60 overflow-x-auto flex items-center gap-1 scrollbar-thin text-xs font-semibold text-neutral-500">
            {[
              { id: 'overview', label: 'Customer Detail Card', icon: Building },
              { id: 'timeline', label: 'Timeline & Events', icon: CalendarDays },
              { id: 'revenue', label: 'Revenue View', icon: DollarSign },
              { id: 'payments', label: 'Payment History', icon: Clock },
              { id: 'risk', label: 'Risk Profile', icon: ShieldAlert },
              { id: 'communication', label: 'Communication History', icon: MessageSquare },
              { id: 'subscriptions', label: 'Subscription History', icon: RefreshCcw },
              { id: 'health', label: 'Health Score KPI', icon: Heart }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = detailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'border-emerald-500 text-emerald-600 font-semibold bg-emerald-50/10' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-neutral-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS RENDERER */}
          <div className="bg-white rounded-xl border border-neutral-200/85 p-6 shadow-3xs min-h-[300px]">
            
            {/* 1. OVERVIEW / CUSTOMER DETAIL CARD */}
            {detailTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Profile Specs */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-neutral-950 border-b border-neutral-100 pb-2">Business Registry Settings</h4>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-neutral-400" />
                        <span className="font-bold text-neutral-400 w-24">Company</span>
                        <span className="text-neutral-800 font-medium">{activeCustomer.company}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="font-bold text-neutral-400 w-24">Primary Mail</span>
                        <span className="text-neutral-800 font-medium font-mono">{activeCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        <span className="font-bold text-neutral-400 w-24">Phone Line</span>
                        <span className="text-neutral-800 font-medium font-mono">{activeCustomer.phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="font-bold text-neutral-400 w-24">Billing Address</span>
                        <span className="text-neutral-800 font-medium leading-relaxed">{activeCustomer.billingAddress}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-neutral-400 animate-pulse" />
                        <span className="font-bold text-neutral-400 w-24">Joined Date</span>
                        <span className="text-neutral-800 font-medium font-mono">{activeCustomer.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Box with dynamic Client-side updates */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                      <h4 className="font-semibold text-sm text-neutral-950">Merchant Profile Description</h4>
                      <button 
                        onClick={() => {
                          if (isEditingDesc) {
                            handleSaveDescription();
                          } else {
                            setIsEditingDesc(true);
                          }
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        {isEditingDesc ? (
                          'Save changes'
                        ) : (
                          <>
                            <Edit2 className="w-3.5 h-3.5" />
                            Update
                          </>
                        )}
                      </button>
                    </div>
                    {isEditingDesc ? (
                      <div className="space-y-2">
                        <textarea 
                          rows={4}
                          value={editDescText}
                          onChange={(e) => setEditDescText(e.target.value)}
                          className="w-full text-xs p-3 border border-neutral-250 focus:border-emerald-500 rounded-lg outline-hidden font-medium text-neutral-800 bg-neutral-50 focus:bg-white transition-all resize-none"
                        />
                        <button 
                          onClick={handleSaveDescription}
                          className="bg-neutral-900 text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg"
                        >
                          Commit Description
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 font-medium">
                        {activeCustomer.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CUSTOMER TIMELINE AND EVENTS */}
            {detailTab === 'timeline' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">Security & Billing Event Chronology</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Last audited events triggered by the corporate customer profile</p>
                </div>

                <div className="relative border-l border-neutral-200 ml-3.5 space-y-6 pt-3">
                  {timelineEvents.map((ev) => {
                    return (
                      <div key={ev.id} className="relative pl-6">
                        {/* Bullet circle anchor */}
                        <span className={`absolute -left-2 top-0.5 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center ${
                          ev.type === 'payment' ? 'bg-emerald-500' :
                          ev.type === 'risk' ? 'bg-rose-500' :
                          ev.type === 'subscription' ? 'bg-purple-500' :
                          ev.type === 'email' ? 'bg-blue-500' : 'bg-neutral-500'
                        }`} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-neutral-400 font-mono font-medium">{ev.timestamp}</span>
                            <span className="text-xs font-bold text-neutral-900">{ev.title}</span>
                            {ev.badge && (
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-sm border ${
                                ev.badgeColor || 'bg-neutral-50 text-neutral-600 border-neutral-200/60'
                              }`}>
                                {ev.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed max-w-2xl font-medium">{ev.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. REVENUE VIEW */}
            {detailTab === 'revenue' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">LTV Margin & Active Subscription Revenue Analysis</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Summary metrics and expansion forecasting logs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  <div className="space-y-4 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Aggregate Gross Revenue (LTV)</p>
                      <h4 className="text-3xl font-extrabold text-emerald-700 tracking-tight mt-1">₹{activeCustomer.revenue.toLocaleString('en-IN')}</h4>
                      <p className="text-xs text-neutral-500 mt-2 font-medium">Sum authorization ledger totals resolved since join date.</p>
                    </div>
                    <div className="border-t border-neutral-200/50 pt-3 flex justify-between text-xs text-neutral-500">
                      <span>Gateway Processing Method: Multi-router</span>
                      <span className="font-semibold text-neutral-700">Account status active</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Yield-generating MRR Anchor</p>
                      <h4 className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1">₹{activeCustomer.mrr.toLocaleString('en-IN')}/mo</h4>
                      <p className="text-xs text-neutral-500 mt-2 font-medium">Automatic contract lock renewing on designated cycle.</p>
                    </div>
                    <div className="border-t border-neutral-200/50 pt-3 flex justify-between text-xs text-neutral-500">
                      <span>Renew rate lock: 97.4%</span>
                      <span className="font-semibold text-emerald-600">Secure pipeline</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-neutral-900">Enterprise Expansion Opportunities</h5>
                    <p className="text-[11px] text-neutral-500 max-w-3xl mt-0.5 leading-relaxed font-semibold">
                      Account shows consistent monthly ledger growth of &gt;10% on payments. Recommended for dedicated white-glove credit limit extensions and treasury tier allocations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CUSTOMER PAYMENT HISTORY */}
            {detailTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-950">Customer Authorization Ledger History</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Isolated transaction history resolved for this specific account</p>
                  </div>
                </div>

                <div className="border border-neutral-200/60 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider text-[9px] border-b border-neutral-100">
                        <th className="px-4 py-2.5">Txn ID</th>
                        <th className="px-4 py-2.5">Auth Method</th>
                        <th className="px-4 py-2.5">Audit Timestamp</th>
                        <th className="px-4 py-2.5 text-center">Threat Score</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-right">Sum Total</th>
                        <th className="px-4 py-2.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {customerPayments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                            No payment history exists for this sub_account.
                          </td>
                        </tr>
                      ) : (
                        customerPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-neutral-50/40">
                            <td className="px-4 py-3 font-mono font-medium text-neutral-900">{pay.id}</td>
                            <td className="px-4 py-3 text-neutral-500 font-medium">{pay.methodDetails}</td>
                            <td className="px-4 py-3 text-neutral-400 font-mono text-[11px]">{pay.date}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                                {pay.riskScore}/100
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                pay.status === 'succeeded' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${pay.status === 'succeeded' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                {pay.status === 'succeeded' ? 'Settled' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold font-mono text-neutral-950">
                              ₹{pay.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => {
                                  onRefundTransaction(pay.id);
                                }}
                                disabled={pay.status !== 'succeeded'}
                                className="text-[10px] bg-neutral-50 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-400 px-2.5 py-1 rounded border border-neutral-200 transition-colors cursor-pointer text-neutral-500 font-semibold"
                              >
                                Refund txn
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. RISK PROFILE */}
            {detailTab === 'risk' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">Security Fraud & Radar Risk Assessment Profile</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">Verify custom gateway policies and chargeback representations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-4 rounded-xl border border-neutral-150 shadow-3xs">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Radar Integrity Threat Band</p>
                    <h3 className="text-xl font-bold mt-1 text-emerald-600 capitalize">
                      {activeCustomer.riskLevel === 'low' ? 'Standard Safe Level' : activeCustomer.riskLevel === 'medium' ? 'Attention review' : 'High Alert level'}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1">Average authorization failure risk metric: 3%</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-150 shadow-3xs">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Resolved Disputed Funds</p>
                    <h3 className="text-xl font-bold mt-1 text-neutral-900">$0.00 dispute balance</h3>
                    <p className="text-[11px] text-neutral-400 mt-1">Involved chargebacks (Lifetime): 0 files</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-150 shadow-3xs">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">3D-Secure Enforcement Status</p>
                    <h3 className="text-xl font-bold mt-1 text-indigo-600">Conditional bypass</h3>
                    <p className="text-[11px] text-neutral-400 mt-1">SLA requires strict CVV match</p>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-neutral-150 pt-5 text-xs text-neutral-600 font-semibold">
                  <h5 className="font-bold text-neutral-900 text-xs">Configure Threat Level manually:</h5>
                  <div className="flex gap-2.5">
                    {['low', 'medium', 'high'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => onUpdateCustomer(activeCustomer.id, { riskLevel: lvl as any })}
                        className={`px-4 py-2 border rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                          activeCustomer.riskLevel === lvl 
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-3xs' 
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {lvl} Risk Settings
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. COMMUNICATION HISTORY */}
            {detailTab === 'communication' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">E-mail Delivery & Core Outages Dispatch History</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Automated compliance syncs and transactional warnings sent to the client</p>
                </div>

                <div className="divide-y divide-neutral-100 text-xs border border-neutral-200/60 rounded-xl overflow-hidden bg-neutral-50/20">
                  {[
                    { id: "com_01", date: "2026-06-09 11:21", subj: "Receipt of ACH Direct Debit #inv_120938", status: "Delivered", open: "Opened" },
                    { id: "com_02", date: "2026-06-03 15:44", subj: "Core API platform release notice v3.12", status: "Delivered", open: "Opened" },
                    { id: "com_03", date: "2026-05-30 11:00", subj: "Billing cycle renewal reminder details", status: "Delivered", open: "Unopened" }
                  ].map(com => (
                    <div key={com.id} className="p-4 flex items-center justify-between text-xs hover:bg-white transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-900">{com.subj}</p>
                        <p className="text-[10px] text-neutral-400 font-mono font-medium">Outage batch: {com.id} • Sent via rayvaanah core relay</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono block text-neutral-400 font-medium">{com.date}</span>
                        <div className="flex gap-2 items-center justify-end mt-1">
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-100 border px-1.5 py-0.2 rounded-full font-bold">
                            {com.status}
                          </span>
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200/60 px-1.5 py-0.2 rounded-full font-bold">
                            {com.open}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SUBSCRIPTION HISTORY */}
            {detailTab === 'subscriptions' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">Active Recurring Plan Contracts</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Existing service level agreements and volume anchors</p>
                </div>

                <div className="p-5 border border-dashed border-neutral-200 rounded-xl flex items-center justify-between text-xs bg-neutral-50/30">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Enterprise Recurring Agreement</p>
                    <h5 className="font-bold text-sm text-neutral-900">
                      {activeCustomer.mrr > 0 ? 'Quantum Core Platform Plan API' : 'No active recurring subscription plan identified'}
                    </h5>
                    <p className="text-xs text-neutral-400 font-medium">Renew lock: Perpetual cycle automatic collection.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-neutral-950">${activeCustomer.mrr.toLocaleString()}/mo</p>
                    <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1.5 inline-block">Renew guaranteed</span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. CUSTOMER HEALTH SCORE DETAILS */}
            {detailTab === 'health' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-950">CRM Customer Health Score Evaluation Details</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Automated weighted telemetry measuring account wellness</p>
                </div>

                {/* Big dial / meter design */}
                <div className="flex flex-col md:flex-row items-center gap-6 border border-neutral-150 p-6 rounded-2xl bg-neutral-50/20">
                  <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-full border-4 border-neutral-100 shadow-3xs shrink-0">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-neutral-950 tracking-tight">{activeCustomer.healthScore}%</p>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">Weighted Score</p>
                    </div>
                    {/* Visual colored circle indicator */}
                    <div className={`absolute top-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold font-mono ${
                      activeCustomer.healthStatus === 'good' ? 'bg-emerald-500' :
                      activeCustomer.healthStatus === 'average' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}>
                      !
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 text-left">
                    <h5 className="font-bold text-xs text-neutral-900 capitalize">Health Bracket: {activeCustomer.healthStatus}</h5>
                    <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl font-medium">
                      Account health index incorporates transaction success rates (98%+ threshold), active subscription prompt renewal intervals, API developer playground query rates, and direct communication callback logs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
