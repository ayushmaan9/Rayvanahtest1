import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowRightLeft, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Coins, 
  Plus, 
  Search, 
  Building, 
  GraduationCap, 
  Home, 
  Briefcase,
  AlertOctagon,
  Brain,
  Clock,
  Sparkles,
  SearchCode,
  ShieldAlert,
  Sliders,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { Payout, Beneficiary, ApprovalTask } from '../types';

interface PayoutsViewProps {
  payouts: Payout[];
  onAddPayout: (payout: Payout) => void;
  beneficiaries: Beneficiary[];
  onAddBeneficiary: (beneficiary: Beneficiary) => void;
  approvalTasks: ApprovalTask[];
  onUpdateApprovalAction: (taskId: string, status: 'approved' | 'rejected') => void;
}

export default function PayoutsView({
  payouts,
  onAddPayout,
  beneficiaries,
  onAddBeneficiary,
  approvalTasks,
  onUpdateApprovalAction
}: PayoutsViewProps) {
  // Payout Sub Tabs
  const [subTab, setSubTab] = useState<'dashboard' | 'beneficiary' | 'workbench' | 'approvals' | 'industries' | 'risk_engine'>('dashboard');

  // Interactive Form States
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showBeneModal, setShowBeneModal] = useState(false);

  // Workbench Payout Flow
  const [beneId, setBeneId] = useState(beneficiaries[0]?.id || '');
  const [payoutAmount, setPayoutAmount] = useState('1500');
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'imps' | 'neft' | 'rtgs' | 'bank_transfer' | 'international_wire' | 'escrow'>('neft');
  const [payoutType, setPayoutType] = useState<'single' | 'scheduled' | 'conditional'>('single');
  const [scheduledDate, setScheduledDate] = useState('');
  const [industryGroup, setIndustryGroup] = useState<'marketplace' | 'real_estate' | 'education' | 'enterprise'>('enterprise');

  // Create Beneficiary
  const [beneName, setBeneName] = useState('');
  const [beneType, setBeneType] = useState<'vendor' | 'customer' | 'employee'>('vendor');
  const [beneAccount, setBeneAccount] = useState('');
  const [beneBank, setBeneBank] = useState('HDFC Bank');
  const [beneIFSC, setBeneIFSC] = useState('');
  const [beneUPI, setBeneUPI] = useState('');
  const [beneEmail, setBeneEmail] = useState('');

  // Bulk Upload File Simulation
  const [bulkFile, setBulkFile] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  // Verification Simulation logs inside beneficiaries
  const [verificationFeedback, setVerificationFeedback] = useState<string>('');

  const handleAddPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || !beneId) return;

    const selectedBene = beneficiaries.find(b => b.id === beneId);
    if (!selectedBene) return;

    const parsedAmt = parseFloat(payoutAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    // Checker-Maker criteria: Any payout over ₹1 Lakh triggers structural approval workflow
    const triggersApproval = parsedAmt >= 100000;

    const newPayout: Payout = {
      id: `pout_${Math.floor(100000 + Math.random() * 900000)}`,
      amount: parsedAmt,
      currency: "INR",
      status: triggersApproval ? 'pending' : 'paid',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      beneficiaryId: selectedBene.id,
      beneficiaryName: selectedBene.name,
      beneficiaryType: selectedBene.type,
      method: payoutMethod,
      sourceAccount: payoutMethod === 'escrow' ? "Custom Escrow Buffer Vault" : "AtmoonPe Nodal Virtual Account ID: nodal_icici_091",
      approvalStatus: triggersApproval ? 'checker_pending' : 'none',
      riskScore: selectedBene.riskScore > 50 ? selectedBene.riskScore : Math.floor(Math.random() * 30),
      processingTimeMs: triggersApproval ? 0 : Math.floor(150 + Math.random() * 800),
      industryCategory: industryGroup,
      scheduledDate: payoutType === 'scheduled' ? scheduledDate : undefined
    };

    onAddPayout(newPayout);
    setShowPayoutModal(false);
    setPayoutAmount('15000');

    if (triggersApproval) {
      alert(`⚠️ Payout of ₹${parsedAmt.toLocaleString('en-IN')} requires authorized Checker-Maker approval. Created Payout task listed in "Approval Center" Sub-tab.`);
    } else {
      alert(`🎉 Payout of ₹${parsedAmt.toLocaleString('en-IN')} disbursed successfully to ${selectedBene.name} via ${payoutMethod.toUpperCase()}!`);
    }
  };

  const handleAddBeneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneName) return;

    const newBene: Beneficiary = {
      id: `ben_custom_${Math.floor(100 + Math.random() * 900)}`,
      name: beneName,
      type: beneType,
      accountNumber: beneAccount || "918239084122",
      bankName: beneBank,
      ifsc: beneIFSC || "HDFC0001812",
      upiId: beneUPI || `${beneName.toLowerCase().replace(/ /g, '')}@okaxis`,
      verified: true,
      bankVerified: true,
      upiVerified: !!beneUPI,
      pennyDropVerified: true,
      riskScore: Math.floor(Math.random() * 20),
      email: beneEmail || "partner@domain.com",
      joined: new Date().toISOString().split('T')[0],
      industryGroup: beneType === 'employee' ? 'Payroll staff' : 'Vendor operations'
    };

    onAddBeneficiary(newBene);
    setBeneName('');
    setBeneAccount('');
    setBeneficiaryFormState();
    setShowBeneModal(false);
  };

  const setBeneficiaryFormState = () => {
    setBeneUPI('');
    setBeneEmail('');
    setBeneIFSC('');
  };

  // penny drop verification sim
  const triggerPennyDropCheck = (bene: Beneficiary) => {
    setVerificationFeedback(`Initiating Penny Drop Verification for ${bene.name}...`);
    setTimeout(() => {
      setVerificationFeedback(`Successfully deposited ₹1.00 INR. Bank Server replied: Name matched "BENEFICIARY APEX: ${bene.name.toUpperCase()}" with 98% accuracy. VPA structure VALID.`);
    }, 1200);
  };

  // simulated bulk upload
  const handleBulkUploadSimulation = () => {
    setBulkUploading(true);
    setTimeout(() => {
      // Create a mock beneficiary from file
      const extraBene: Beneficiary = {
        id: `ben_bulk_${Math.floor(100 + Math.random() * 900)}`,
        name: "Enterprise Bulk Logistics Gmbh",
        type: 'vendor',
        accountNumber: "2019385818318",
        bankName: "Deutsche Bank Frankfurt",
        ifsc: "DEUT83120",
        upiId: "dbbulk@okaxis",
        verified: true,
        bankVerified: true,
        upiVerified: true,
        pennyDropVerified: true,
        riskScore: 2,
        email: "frankfurt-payouts@db-logistics.de",
        joined: new Date().toISOString().split('T')[0],
        industryGroup: "Supply Chain Vendor"
      };
      onAddBeneficiary(extraBene);
      setBulkUploading(false);
      setBulkFile("payout_vendors_cleared_june.csv");
      setVerificationFeedback("Successfully uploaded csv. 1 Vendor imported. Automated penny-drop cleared.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200/50 pb-5 gap-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Outbound Cash
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5">
            Rayvaanah Escrow Payout & Disbursement Engine
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Nodal Escrow account disbursements, milestone releases, vendor split commissions, and multi-sig Maker-Checker approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPayoutModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-lg text-xs"
          >
            <Plus className="w-4 h-4" />
            Escrow Disburse Workbench
          </button>
        </div>
      </div>

      {/* Payout sub-navigation tab list */}
      <div className="flex overflow-x-auto gap-2 border-b border-neutral-200 pb-px">
        {[
          { id: 'dashboard', label: 'Escrow Payout Dashboard', icon: TrendingUp },
          { id: 'beneficiary', label: 'Escrow Beneficiary Directory', icon: Users },
          { id: 'workbench', label: 'Escrow Outbound Workbench', icon: Sliders },
          { id: 'approvals', label: `Multi-Sig Approval Queue (${approvalTasks.filter(t => t.status === 'pending').length})`, icon: FileCheck },
          { id: 'industries', label: 'Marketplace Escrow Verticals', icon: Briefcase },
          { id: 'risk_engine', label: 'Escrow Risk & Hold Control', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                isActive 
                  ? 'border-emerald-600 text-emerald-600 bg-emerald-50/10' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. PAYOUT DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Outbound statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Completed Payout Volume</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                ₹{payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">Success Rate: <b className="text-emerald-600">99.85%</b></p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Average Processing Lag</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                250 <span className="text-xs text-neutral-400">ms</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">Direct IMPS & UPI Nodal Clearing</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Escrow & Nodal Vaults</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                ₹{payouts.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">Pending approvals: <b className="text-amber-600 font-mono">{approvalTasks.filter(t => t.status === 'pending').length} tasks</b></p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Liquidity Reserve Forecast</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                ₹34,50,00,000
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">Estimated Runway: <b className="text-neutral-900">Unlimited</b></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Outbound analytics list */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase">Payout Destination Share & Success Analytics</h3>
              <div className="grid grid-cols-3 gap-4 border border-neutral-100 rounded-lg p-4 bg-neutral-50/40 text-center">
                <div>
                  <span className="text-[9px] text-neutral-400 block uppercase">UPI Payouts</span>
                  <span className="font-mono text-neutral-900 font-bold block text-sm mt-1">58% volume</span>
                  <span className="text-[9px] text-emerald-600 block mt-0.5">Success: 99.9%</span>
                </div>
                <div className="border-x border-neutral-200">
                  <span className="text-[9px] text-neutral-400 block uppercase">IMPS / NEFT Clearing</span>
                  <span className="font-mono text-neutral-900 font-bold block text-sm mt-1">36% volume</span>
                  <span className="text-[9px] text-emerald-600 block mt-0.5">Success: 99.2%</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block uppercase">RTGS & Escrow Vaults</span>
                  <span className="font-mono text-neutral-900 font-bold block text-sm mt-1">6% volume</span>
                  <span className="text-[9px] text-amber-600 block mt-0.5">Average Delay: 5 mins</span>
                </div>
              </div>

              {/* History list */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Historical Outbound settlements</span>
                <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-lg overflow-hidden">
                  {payouts.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-3 bg-white hover:bg-neutral-50/50 flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          p.status === 'paid' ? 'bg-emerald-500' :
                          p.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></div>
                        <div>
                          <span className="font-bold text-neutral-900 block">{p.beneficiaryName}</span>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-0.5 uppercase">
                            {p.id} • {p.method} • {p.industryCategory}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-neutral-950 block">₹{p.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{p.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Treasury Intelligence */}
            <div className="bg-neutral-950 text-white p-5 rounded-xl border border-neutral-900 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-900">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Treasury AI Intelligence</h3>
                </div>
                <div className="space-y-3 pt-3 font-sans text-xs">
                  <div>
                    <span className="text-neutral-400 text-[10px] block uppercase">Nodal Balance Health Score</span>
                    <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">99.2% Core</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] block uppercase">Projected Net Runway</span>
                    <span className="text-xs text-neutral-300 font-medium leading-relaxed block mt-1">
                      AtmoonPe algorithms projected zero liquidity friction for upcoming vendor disbursements. 7.15% RBI yield generated ₹8,42,000 INR interest across Nodal ICICI & Axis vaults.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900">
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest block">AI RECOMMENDATION</span>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Route June 30 bulk employee disbursements via IMPS batch clearance between 4AM and 8AM to bypass national clearing interbank delays.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BENEFICIARY MANAGER */}
      {subTab === 'beneficiary' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Beneficiary Directory</h3>
              <p className="text-xs text-neutral-500 mt-1">Automated verification networks: Penny Drop, bank lookup codes, and AML sanctions filters</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={handleBulkUploadSimulation}
                disabled={bulkUploading}
                className="flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-50 bg-white font-bold px-3 py-1.5 rounded-lg text-neutral-700"
              >
                <Upload className="w-3.5 h-3.5" />
                {bulkUploading ? "Uploading CSV..." : "Bulk CSV Upload"}
              </button>
              <button 
                onClick={() => setShowBeneModal(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Beneficiary
              </button>
            </div>
          </div>

          {/* Tester feed for pennies */}
          {verificationFeedback && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-purple-800 text-xs font-mono leading-relaxed font-semibold">
              <div className="flex items-center gap-1.5 font-bold pb-1 text-purple-900">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                PENNY-DROP SYSTEM CONSOLE FEEDBACK
              </div>
              {verificationFeedback}
            </div>
          )}

          {/* Table Directory */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-wider text-[9px] border-b border-neutral-100">
                    <th className="px-5 py-3">Beneficiary Account</th>
                    <th className="px-5 py-3">Contact Type</th>
                    <th className="px-5 py-3">Bank Details</th>
                    <th className="px-5 py-3">UPI VPA</th>
                    <th className="px-5 py-3">Check Status</th>
                    <th className="px-5 py-3">Compliance Rep</th>
                    <th className="px-5 py-3 text-right">Penny drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {beneficiaries.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50/20">
                      <td className="px-5 py-4">
                        <span className="font-bold text-neutral-900 block">{b.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{b.id} • {b.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          b.type === 'vendor' ? 'bg-amber-50 text-amber-800' :
                          b.type === 'employee' ? 'bg-indigo-50 text-indigo-800' : 'bg-teal-50 text-teal-800'
                        }`}>
                          {b.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold block text-neutral-900">{b.bankName}</span>
                        <span className="font-mono text-neutral-400 text-[10px] block mt-0.5">IFSC: {b.ifsc} • AC: {b.accountNumber}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-neutral-500 text-[10px]">{b.upiId}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-1 font-mono text-[9px]">
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${b.bankVerified ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                            <span className={b.bankVerified ? 'text-emerald-700 font-semibold' : 'text-rose-600'}>Bank Vrf: {b.bankVerified ? "OK" : "NO"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${b.upiVerified ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                            <span className={b.upiVerified ? 'text-emerald-700 font-semibold' : 'text-rose-600'}>UPI Vrf: {b.upiVerified ? "OK" : "NO"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          b.riskScore > 50 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Risk Score: {b.riskScore}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => triggerPennyDropCheck(b)}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-2 py-1 rounded text-[10px] cursor-pointer transition-colors"
                        >
                          Trigger Drop Check
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. OUTBOUND WORKBENCH */}
      {subTab === 'workbench' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase pb-2 border-b border-neutral-100">
              ⚡ Outbound Payout Ledger Constructor
            </h3>

            <form onSubmit={handleAddPayoutSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Beneficiary Destination Profile</label>
                <select 
                  value={beneId}
                  onChange={(e) => setBeneId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-medium text-neutral-800 focus:border-emerald-500 outline-hidden"
                >
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.bankName} - {b.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Payout Type</label>
                  <select 
                    value={payoutType}
                    onChange={(e) => setPayoutType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg outline-hidden focus:border-emerald-500"
                  >
                    <option value="single">Single Immediate Transfer</option>
                    <option value="scheduled">Scheduled Calendar Release</option>
                    <option value="conditional">Conditional Trigger Match</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Payout Clearing Method</label>
                  <select 
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg outline-hidden focus:border-emerald-500"
                  >
                    <option value="neft">NEFT Clearing Node</option>
                    <option value="imps">IMPS Instant Bank</option>
                    <option value="upi">UPI Realtime Payee</option>
                    <option value="rtgs">RTGS Realtime Large Sum</option>
                    <option value="bank_transfer">Interbank ACH Direct</option>
                    <option value="international_wire">Cross-Border International Swap</option>
                    <option value="escrow">Special Escrow Releases</option>
                  </select>
                </div>
              </div>

              {payoutType === 'scheduled' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase block">Schedule Clearing Date</label>
                  <input 
                    type="date" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-mono text-neutral-800"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Authorized Payout Sum (INR ₹)</label>
                  <input 
                    type="number" 
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Industry Code/Segment</label>
                  <select 
                    value={industryGroup}
                    onChange={(e) => setIndustryGroup(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg outline-hidden"
                  >
                    <option value="enterprise">Corporate Payroll / Vendors</option>
                    <option value="real_estate">Real Estate Brokerage / Partners</option>
                    <option value="education">Staff salary / scholarship</option>
                    <option value="marketplace">Marketplace Split Release</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Initialize Outbound Payout
              </button>
            </form>
          </div>

          {/* Simulated Batch summary logs */}
          <div className="bg-neutral-900 text-neutral-100 p-6 rounded-xl border border-neutral-950 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] font-bold text-neutral-400 uppercase bg-neutral-800/80 border border-neutral-700 px-2 py-0.5 rounded">
                Unified Payout workbench parameters
              </span>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider">Outbound Clearing SLA Matrix</h4>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-neutral-800/40 rounded border border-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-neutral-200">UPI Instant clearing</span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">SLA: Immediate 24X7. Maximum ₹2,00,000 INR per tranche limit.</span>
                  </div>
                  <span className="text-emerald-400 font-bold">1-2s delay</span>
                </div>
                <div className="p-3 bg-neutral-800/40 rounded border border-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-neutral-200">NEFT Batch Clearing Node</span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">SLA: Half-hourly bundles processed by Reserve banking networks.</span>
                  </div>
                  <span className="text-neutral-400 font-bold">30m delay</span>
                </div>
                <div className="p-3 bg-neutral-800/40 rounded border border-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-neutral-200">RTGS Core settlement</span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">SLA: Continuous real-time processing of heavy volume capital sums.</span>
                  </div>
                  <span className="text-teal-400 font-bold">10-15m delay</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-neutral-500 font-mono mt-4 leading-relaxed">
              *Rayvaanah incorporates dynamic interbank fallback parameters. Failures on IMPS routing trigger automated failover cascades to NEFT nodes to secure transactions.
            </p>
          </div>
        </div>
      )}

      {/* 4. APPROVAL CENTER */}
      {subTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase">Maker Checker Approval Center</h3>
            <p className="text-xs text-neutral-500">Dual-custody verification controls: payments initialized by authorized Makers must qualify checker validation profiles before final disbursement</p>
          </div>

          <div className="space-y-4">
            {approvalTasks.filter(t => t.status === 'pending').length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 text-neutral-500 text-xs">
                No active Maker-Checker tasks currently pending approvals. Well cleared.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvalTasks.filter(t => t.status === 'pending').map((task) => (
                  <div key={task.id} className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Task reference: {task.id}</span>
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          Level {task.level} Approval required
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono text-neutral-900">₹{task.amount.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-neutral-400 uppercase font-bold">{task.currency}</span>
                      </div>
                      
                      <div className="space-y-1 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Recipient Payee</span>
                          <span className="text-neutral-900 font-bold">{task.beneficiaryName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Maker requester</span>
                          <span className="text-neutral-900 font-mono text-[11px]">{task.requestedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Dispatch type</span>
                          <span className="text-neutral-900 capitalize font-bold">{task.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded border border-neutral-100 mt-2 font-medium">
                        <b>Maker Note:</b> {task.notes}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs font-semibold">
                      <button 
                        onClick={() => onUpdateApprovalAction(task.id, 'rejected')}
                        className="w-full border border-rose-200 hover:bg-rose-50 text-rose-700 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 shrink-0" />
                        Reject disbursement
                      </button>
                      <button 
                        onClick={() => onUpdateApprovalAction(task.id, 'approved')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Approve & Release
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. INDUSTRIES & VERTICALS */}
      {subTab === 'industries' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase">Sub-clearing payout configurations per industry</h3>
            <p className="text-xs text-neutral-500">Rayvaanah automates split settlements, land owner construction schedules, staff payroll routing, and student fee refunds based on specialized compliance vertical pipelines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "Marketplace settlements", opt: "Vendor escrow commission split logic", icon: Coins, bg: "bg-emerald-50 text-emerald-700" },
              { title: "Real Estate payouts", opt: "Channel partner commission split triggers", icon: Home, bg: "bg-blue-50 text-blue-700" },
              { title: "Education payout modules", opt: "Scholarship & fee refund automation", icon: GraduationCap, bg: "bg-indigo-50 text-indigo-700" },
              { title: "Enterprise payouts", opt: "Corporate expense salary batching", icon: Briefcase, bg: "bg-amber-50 text-amber-700" }
            ].map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-xl border border-neutral-200/50 shadow-xs space-y-3">
                  <div className={`p-2 w-max rounded-lg ${ind.bg}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs leading-snug">{ind.title}</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">{ind.opt}</p>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-500">
                    SLA: <b className="text-neutral-900 font-bold">Priority T+0 Clearing</b>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. RISK ENGINE */}
      {subTab === 'risk_engine' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Suspicious Beneficiaries Velocity Alert Controls</h4>
                <p className="text-[11px] text-neutral-500 mt-1">Real-time alerts, AML monitoring SDN scans, and sanctions validations</p>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-5 h-5 text-rose-600 animate-bounce" />
                    <div>
                      <span className="font-bold text-rose-900 block">Redwood Brokerage hold</span>
                      <span className="text-[10px] text-rose-600 block">Sanctions Checklist Hit: Match probability 78%</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] uppercase tracking-wider">Blocked</span>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between items-center text-[11px]">
                  <span className="text-neutral-500">AML/CFT Screening Node</span>
                  <span className="text-neutral-800 font-bold">100% active, updated daily</span>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between items-center text-[11px]">
                  <span className="text-neutral-500">Outbound Velocity Controls limit</span>
                  <span className="text-rose-600 font-bold font-mono">Max ₹50,00,000 INR cumulative per vendor per day</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-900 text-white flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] font-bold text-teal-400 uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                  Reputation screening algorithm
                </span>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                  Our Payout Risk Engine continuously aggregates VPA bounce rates and interbank failure codes to construct a composite **Payee Reputation index**.
                </p>
              </div>
              <div className="p-3 bg-neutral-900 rounded border border-neutral-800 text-[10px] text-neutral-300 font-mono">
                <b>Composite telemetry:</b> checked 8 corporate payment links today. No abnormal velocity breaches detected. System state: SAFE.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Models / Popup Populators */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-sm text-neutral-950">Outbound Payout workbench</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-xs text-neutral-400 font-bold hover:text-neutral-600">✕ Close</button>
            </div>
            <form onSubmit={handleAddPayoutSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Beneficiary</label>
                <select 
                  value={beneId} 
                  onChange={(e) => setBeneId(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                >
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.bankName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Method</label>
                  <select 
                    value={payoutMethod} 
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full border border-neutral-200 p-2 rounded-lg outline-hidden"
                  >
                    <option value="neft">NEFT Node</option>
                    <option value="imps">IMPS Instant</option>
                    <option value="upi">UPI PAY</option>
                    <option value="rtgs">RTGS Large Sum</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">SLA Category</label>
                  <select 
                    value={industryGroup} 
                    onChange={(e) => setIndustryGroup(e.target.value as any)}
                    className="w-full border border-neutral-200 p-2 rounded-lg outline-hidden"
                  >
                    <option value="enterprise">Payroll / Staff</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Disbursement Sum (INR ₹)</label>
                <input 
                  type="number" 
                  value={payoutAmount} 
                  required 
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg font-bold">Release payout funds</button>
            </form>
          </div>
        </div>
      )}

      {showBeneModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-sm text-neutral-950">Add Beneficiary Contact</h3>
              <button onClick={() => setShowBeneModal(false)} className="text-xs text-neutral-400 font-bold hover:text-neutral-600">✕ Close</button>
            </div>
            <form onSubmit={handleAddBeneSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Full Name</label>
                <input 
                  type="text" 
                  value={beneName} 
                  required 
                  onChange={(e) => setBeneName(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                  placeholder="e.g. Acme Supplier Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Category Profile</label>
                  <select 
                    value={beneType} 
                    onChange={(e) => setBeneType(e.target.value as any)}
                    className="w-full border border-neutral-200 p-2 rounded-lg outline-hidden"
                  >
                    <option value="vendor">Corporate Vendor</option>
                    <option value="employee">Staff Employee</option>
                    <option value="customer">Loyalty Customer</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Bank Institution</label>
                  <input 
                    type="text" 
                    value={beneBank} 
                    onChange={(e) => setBeneBank(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Account Number</label>
                  <input 
                    type="text" 
                    value={beneAccount} 
                    onChange={(e) => setBeneAccount(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">IFSC Code / SWIFT</label>
                  <input 
                    type="text" 
                    value={beneIFSC} 
                    onChange={(e) => setBeneIFSC(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">UPI VPA address</label>
                <input 
                  type="text" 
                  value={beneUPI} 
                  onChange={(e) => setBeneUPI(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                  placeholder="e.g. partner@okhdfc"
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg font-bold">Register Beneficiary</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
