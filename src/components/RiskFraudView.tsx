import React, { useState } from 'react';
import { ShieldAlert, PlusCircle, CheckCircle2, AlertTriangle, Play, Pause, Trash2, ShieldX } from 'lucide-react';
import { mockFraudRules } from '../data';
import { FraudRule } from '../types';

export default function RiskFraudView() {
  const [rules, setRules] = useState<FraudRule[]>(mockFraudRules);
  const [showModal, setShowModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleAction, setRuleAction] = useState<'block' | 'review' | 'allow'>('block');
  const [criteria, setCriteria] = useState('');

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !criteria) return;

    const newRule: FraudRule = {
      id: `rule_0${rules.length + 1}`,
      name: ruleName,
      action: ruleAction,
      matchingCriteria: criteria,
      hits: 0,
      isActive: true
    };

    setRules([...rules, newRule]);
    setRuleName('');
    setCriteria('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Radar Risk & Fraud Radar</h2>
          <p className="text-xs text-neutral-500 mt-1">Configure automated, server-side block patterns and transaction verification overrides</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Deploy Radar Custom Filter
        </button>
      </div>

      {/* Overview Block */}
      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-xs text-neutral-900">Radar Threat Level Assessment: Standard</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xl mt-0.5">
              Active block rules scanned 1,842 transaction routes yesterday. 0.04% of routes were hard bypassed, meeting standard visa chargeback rules. Threat indexing is normal.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
          Scans: Active (T+0)
        </span>
      </div>

      {/* List Rules */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/20">
          <div>
            <h4 className="font-semibold text-sm text-neutral-900">Automated Radar Fraud Policies</h4>
            <p className="text-xs text-neutral-400 mt-1">These rule trees execute server-side immediately during payment gateway callbacks</p>
          </div>
        </div>
        
        <div className="divide-y divide-neutral-100">
          {rules.map((rule) => {
            return (
              <div key={rule.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-neutral-50/20 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm border ${
                      rule.action === 'block' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      rule.action === 'review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {rule.action}
                    </span>
                    <h5 className="font-semibold text-xs text-neutral-900">{rule.name}</h5>
                    <span className="text-[10px] text-neutral-400 font-mono font-medium opacity-80">({rule.id})</span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 bg-neutral-50 border border-neutral-100 p-2 rounded-md max-w-3xl overflow-x-auto">
                    {rule.matchingCriteria}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">Hits recorded: <span className="font-semibold font-mono text-neutral-700">{rule.hits.toLocaleString()} calls</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                      rule.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50' 
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {rule.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Active
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Deactivated
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deploy Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2">
                <ShieldX className="w-5 h-5 text-rose-600" />
                Deploy Radar Custom Rule
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-500 text-xs font-semibold">✕ Close</button>
            </div>
            
            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Rule / Policy Label</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Block credit card mismatches from high-surge geolocations"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 bg-neutral-50 hover:bg-neutral-50/50 focus:bg-white rounded-lg outline-hidden font-medium text-neutral-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Gate Action</label>
                <select 
                  value={ruleAction}
                  onChange={(e) => setRuleAction(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs py-2 px-3 rounded-lg outline-hidden hover:border-neutral-300 focus:border-emerald-500 font-semibold"
                >
                  <option value="block">Hard Block (Error payment callback)</option>
                  <option value="review">Soft Flag (Route to manual operations dashboard queue)</option>
                  <option value="allow">Whitelist Explicitly</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Boolean Conditional Logic Statement (DSL)</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. amount_val > 5000 AND user_tier == 'tier_1' AND age_hours < 24"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 hover:border-neutral-300 focus:border-emerald-500 bg-neutral-50 hover:bg-neutral-50/50 focus:bg-white rounded-lg outline-hidden font-mono text-neutral-800 transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 font-semibold rounded-lg text-neutral-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg cursor-pointer shadow-xs">Deploy Filter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
