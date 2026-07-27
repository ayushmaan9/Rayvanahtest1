import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  AlertTriangle, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockTransactions, mockCustomers, mockSubscriptions } from '../data';
import { Transaction } from '../types';

// High quality mockup timeline data for the Indian settlement chart
const chartData = [
  { name: '07-16', Volume: 8520000 },
  { name: '07-17', Volume: 9240000 },
  { name: '07-18', Volume: 7810000 },
  { name: '07-19', Volume: 11050000 },
  { name: '07-20', Volume: 14500000 },
  { name: '07-21', Volume: 13200000 },
  { name: '07-22', Volume: 12900000 },
  { name: '07-23', Volume: 16840000 },
  { name: '07-24', Volume: 18950000 },
];

interface DashboardViewProps {
  onNavigate: (tab: string, params?: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  // Safe totals math
  const grossVolume = mockTransactions
    .filter(t => t.status === 'succeeded')
    .reduce((acc, t) => acc + t.amount, 0) + 38200000; // Offset for realism in INR

  const activeSubscriptionsCount = mockSubscriptions.filter(s => s.status === 'active').length;
  
  const highRiskTxns = mockTransactions.filter(t => t.riskScore >= 60).length;

  const handleTxnClick = () => {
    onNavigate('transactions');
  };

  const handleCrmClick = (id: string) => {
    onNavigate('crm_detail', id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">AtmoonPe Indian Merchant Ecosystem</h2>
          <p className="text-xs text-neutral-500 mt-1">BridgRoute™ & Paywize Orchestration Core • NPCI / UPI / Nodal Banks Active and Green.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          UPI & Nodal Clearing Node: Online (100% RBI Compliant)
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Gross Settlement Volume</p>
              <h3 className="text-2xl font-semibold text-neutral-950 mt-1">₹{grossVolume.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% from previous week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Active Subscriptions / Mandates</p>
              <h3 className="text-2xl font-semibold text-neutral-950 mt-1">{activeSubscriptionsCount} Enterprise Accounts</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-purple-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>UPI AutoPay & e-NACH active (89% lock)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">e-Invoicing Pipeline (GSTIN)</p>
              <h3 className="text-2xl font-semibold text-neutral-950 mt-1">₹1,16,80,000.00</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-neutral-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>3 outstanding, 1 past due (TDS auto-applied)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Radar Fraud & Velocity Signals</p>
              <h3 className="text-2xl font-semibold text-neutral-950 mt-1">{highRiskTxns} High Risk</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-amber-600 font-medium">
            <span>0.02% VPA fraud ratio</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h4 className="font-semibold text-sm text-neutral-900">BridgRoute™ Settlement Processing Flow</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Rolling daily settlement cohort projections across ICICI, HDFC, Axis, and YES Bank</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg text-[10px] font-semibold text-neutral-600">
              <button className="px-2 py-1 bg-white rounded shadow-2xs text-neutral-800">INR Cohorts (₹)</button>
              <button className="px-2 py-1">UPI AutoPay</button>
              <button className="px-2 py-1">IMPS / RTGS</button>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={10} tickLine={false} />
                <YAxis stroke="#999" fontSize={10} tickLine={false} tickFormatter={(v)=>`₹${v/100000}L`} />
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Processed Volume']} />
                <Line type="monotone" dataKey="Volume" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations Sidebar in Dashboard */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-sm text-neutral-900">Indian Merchant Directory</h4>
            <p className="text-xs text-neutral-400 mt-0.5 mb-4">Direct merchant pipeline access</p>
            
            <div className="space-y-3">
              {mockCustomers.slice(0, 3).map((cus) => (
                <button
                  key={cus.id}
                  onClick={() => handleCrmClick(cus.id)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">{cus.name}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{cus.company} • MRR: ₹{cus.mrr.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      cus.healthStatus === 'good' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {cus.healthScore}%
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('crm')}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-dashed border-neutral-300 hover:border-emerald-500 hover:text-emerald-600 text-xs font-medium rounded-lg text-neutral-500 transition-colors cursor-pointer"
          >
            Go to Merchant CRM Directory
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Ledger Audit Row */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/40">
          <div>
            <h4 className="font-semibold text-sm text-neutral-900">Real-time Authorized Transactions</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Last 5 API callbacks received from UPI & Nodal payment terminals</p>
          </div>
          <button 
            onClick={handleTxnClick}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            Inspect Ledger
          </button>
        </div>
        <div className="divide-y divide-neutral-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Txn Identifier</th>
                <th className="px-5 py-3 font-medium">Merchant / Customer</th>
                <th className="px-5 py-3 font-medium">Processing Rail</th>
                <th className="px-5 py-3 font-medium">Date & Time</th>
                <th className="px-5 py-3 font-medium text-right">Risk Score</th>
                <th className="px-5 py-3 font-medium text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockTransactions.slice(0, 5).map((txn) => (
                <tr key={txn.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-neutral-900 font-medium">{txn.id}</td>
                  <td className="px-5 py-3.5">
                    {txn.customerId ? (
                      <button 
                        onClick={() => handleCrmClick(txn.customerId!)}
                        className="font-medium text-neutral-900 hover:text-emerald-600 transition-colors flex items-center gap-1 text-left cursor-pointer"
                      >
                        {txn.customerName}
                        <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                      </button>
                    ) : (
                      <span className="text-neutral-500 italic">{txn.customerName}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500 font-medium">{txn.methodDetails}</td>
                  <td className="px-5 py-3.5 text-neutral-400 font-mono text-[11px]">{txn.date}</td>
                  <td className="px-5 py-3.5 text-right font-medium">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                      txn.riskScore > 60 ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100' :
                      txn.riskScore > 30 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      Score {txn.riskScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold font-mono text-neutral-950">
                    <span className={`${txn.status === 'failed' ? 'text-rose-500 line-through' : ''}`}>
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </span>
                    {txn.status === 'failed' && (
                      <span className="text-[9px] text-rose-600 font-bold ml-1 uppercase block">Denied</span>
                    )}
                    {txn.status === 'pending' && (
                      <span className="text-[9px] text-amber-600 font-bold ml-1 uppercase block">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

