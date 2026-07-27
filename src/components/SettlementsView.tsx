import React, { useState } from 'react';
import { TrendingDown, Calendar, ArrowRightLeft, CreditCard, ChevronRight, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { mockSettlements } from '../data';
import { Settlement } from '../types';

export default function SettlementsView() {
  const [settlements, setSettlements] = useState<Settlement[]>(mockSettlements);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInstantSettlement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSettlements(prev => 
        prev.map(set => ({ ...set, status: 'paid' }))
      );
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Nodal Escrow Settlement Hub</h2>
          <p className="text-xs text-neutral-500 mt-1">Automated T+0/T+1 Nodal Escrow fund releases to merchant clearing bank accounts with milestone locks</p>
        </div>
        <button 
          onClick={handleInstantSettlement}
          disabled={isProcessing || !settlements.some(s => s.status === 'scheduled')}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white disabled:text-neutral-400 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          {isProcessing ? 'Initiating Escrow Wires...' : 'Initiate Instant Escrow Sweep'}
        </button>
      </div>

      {/* Overview stats for settlements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Next Scheduled Nodal Sweep</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-950">₹64,10,000.00</h3>
              <p className="text-[11px] text-neutral-400 font-medium mt-1">Est. arrival: Today, 17:00 IST (IMPS Batch)</p>
            </div>
            <Clock className="w-8 h-8 text-neutral-300" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Default Settlement Pathway</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-950">HDFC Bank Nodal Core</h3>
              <p className="text-[11px] text-neutral-400 font-medium mt-1">Virtual Nodal Account *8904 (IFSC: HDFC0000060)</p>
            </div>
            <CreditCard className="w-8 h-8 text-neutral-300" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Total Settled (MTD)</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-950">₹1,64,34,000.00</h3>
              <p className="text-[11px] text-neutral-400 font-medium mt-1">Zero failed RBI bank settlements reported</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-neutral-300" />
          </div>
        </div>
      </div>

      {/* Master Settlement Cohorts */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200/60 bg-neutral-50/20 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-sm text-neutral-950">Settlement Cohorts History</h4>
            <p className="text-xs text-neutral-400 mt-1">Batched transaction clearings processed or queueing for IMPS/RTGS/NEFT transfer</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">Rolling T+0 / T+1 Window</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Batch ID</th>
                <th className="px-5 py-3 font-medium">Cohort Reference</th>
                <th className="px-5 py-3 font-medium">Target Bank Registry</th>
                <th className="px-5 py-3 font-medium">Execution Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Sum Cleared</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {settlements.map((set) => (
                <tr key={set.id} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-neutral-900">{set.id}</td>
                  <td className="px-5 py-4 font-medium text-neutral-500">{set.cohortRef}</td>
                  <td className="px-5 py-4 text-neutral-600">{set.targetAccount}</td>
                  <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">{set.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      set.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${set.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                      <span className="capitalize">{set.status === 'paid' ? 'Paid & Audited' : 'Pending Sweep'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold font-mono text-neutral-950">
                    ₹{set.amount.toLocaleString('en-IN')}
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
