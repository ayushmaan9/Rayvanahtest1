import React from 'react';
import { Repeat, ChevronRight, Activity, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mockSubscriptions } from '../data';

interface SubscriptionsViewProps {
  onNavigateToCustomer: (id: string) => void;
}

export default function SubscriptionsView({ onNavigateToCustomer }: SubscriptionsViewProps) {
  const mrrTotal = mockSubscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">UPI AutoPay & e-NACH Subscriptions Engine</h2>
          <p className="text-xs text-neutral-500 mt-1">Configure plan tiers, e-NACH mandate limits, UPI AutoPay recurring frequencies, and NPCI dunning workflows</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-lg border border-purple-100 font-semibold">
          <Activity className="w-4 h-4 text-purple-600" />
          UPI AutoPay VPA Mandate Status: Green
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Monthly Recurring Revenue (MRR)</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950">₹{mrrTotal.toLocaleString('en-IN')}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12.4% month-over-month (INR)</p>
            </div>
            <TrendingUp className="w-8 h-8 text-neutral-300" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Active Mandates Locked</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950">6 Enterprise Accounts</h3>
              <p className="text-[11px] text-neutral-400 font-semibold mt-1">1 Past due state (NPCI Retry Queue)</p>
            </div>
            <Repeat className="w-8 h-8 text-neutral-300" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Gross Customer Lifetime Value</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950">₹12,43,00,000</h3>
              <p className="text-[11px] text-indigo-500 font-semibold mt-1">Calculated across active Indian cohorts</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-neutral-300" />
          </div>
        </div>
      </div>

      {/* Table listing existing plans */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/20">
          <div>
            <h4 className="font-semibold text-sm text-neutral-900">Active Mandate Agreements Ledger</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Real-time dunning statuses, UPI AutoPay pre-debit notifications, and e-NACH collection intervals</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Agreement ID</th>
                <th className="px-5 py-3 font-medium">Customer Beneficiary</th>
                <th className="px-5 py-3 font-medium">Service Plan Details</th>
                <th className="px-5 py-3 font-medium">Billing Interval</th>
                <th className="px-5 py-3 font-medium">Next Anchor Billing</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Invoice Sum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50/35 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-neutral-900">{sub.id}</td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => onNavigateToCustomer(sub.customerId)}
                      className="font-semibold text-neutral-900 hover:text-emerald-600 transition-colors flex items-center gap-1 font-mono text-[11px] text-left"
                    >
                      {sub.customerName}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-neutral-500 font-medium">{sub.planName}</td>
                  <td className="px-5 py-4 text-neutral-500 capitalize">{sub.interval}ly</td>
                  <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">{sub.nextBilling}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      sub.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      sub.status === 'past_due' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        sub.status === 'active' ? 'bg-emerald-500' : 
                        sub.status === 'past_due' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      <span className="capitalize">{sub.status === 'active' ? 'Active Mandate' : sub.status === 'past_due' ? 'Pre-debit Retry' : 'Revoked'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold font-mono text-neutral-950">
                    ₹{sub.amount.toLocaleString('en-IN')}
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
