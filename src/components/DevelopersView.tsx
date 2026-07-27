import React, { useState } from 'react';
import { Code2, PlusCircle, CheckCircle2, Copy, Trash2, KeyRound, Globe, Radio } from 'lucide-react';
import { mockApiKeys } from '../data';
import { DeveloperApiKey } from '../types';

export default function DevelopersView() {
  const [keys, setKeys] = useState<DeveloperApiKey[]>(mockApiKeys);
  const [showModal, setShowModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyScope, setKeyScope] = useState<'read_only' | 'full_access'>('read_only');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    // Generate simulated prefix
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';
    for (let i = 0; i < 8; i++) {
      randomStr += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    const newKey: DeveloperApiKey = {
      id: `key_0${keys.length + 1}`,
      name: keyName,
      keyPrefix: `rk_live_${randomStr}...`,
      created: new Date().toISOString().split('T')[0],
      isActive: true,
      scope: keyScope
    };

    setKeys([...keys, newKey]);
    setKeyName('');
    setShowModal(false);
  };

  const deleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
  };

  const copyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Developer Integration Sandbox</h2>
          <p className="text-xs text-neutral-500 mt-1">Acquire environment secrets and inspect live callback webhook relays</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Generate Live REST Key
        </button>
      </div>

      {/* Grid of endpoint settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Credentials */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/20">
            <div>
              <h4 className="font-semibold text-xs text-neutral-900">Live API Key Repository</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Use these credentials in HTTP auth headers (Bearer)</p>
            </div>
            <KeyRound className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="divide-y divide-neutral-100 flex-1">
            {keys.map((key) => {
              return (
                <div key={key.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 overflow-hidden flex-1">
                    <p className="font-semibold text-neutral-900 truncate pr-2">{key.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-500 bg-neutral-100 text-[10px] px-1.5 py-0.5 rounded-sm select-all">
                        {key.keyPrefix}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">({key.scope === 'full_access' ? 'Full Access' : 'Read Only'})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => copyKey(key.id, `rk_live_${key.id}_secret_payload_value_acme`)}
                      className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 font-semibold"
                      title="Copy exact secret token"
                    >
                      {copiedId === key.id ? (
                        <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button 
                      onClick={() => deleteKey(key.id)}
                      className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-rose-600 font-semibold"
                      title="Revoke key lifecycle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Webhooks Listening Box */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/20">
              <div>
                <h4 className="font-semibold text-xs text-neutral-900">Webhook Endpoints (Callbacks)</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Where Rayvaanah forwards instant event notification payloads</p>
              </div>
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">HTTPS Webhook URL</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://api.acme.com/v3/rayvaanah-receivers"
                    className="w-full text-xs font-mono px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 select-all"
                  />
                  <button className="bg-neutral-900 text-white text-xs font-semibold py-2 px-3.5 rounded-lg border border-neutral-800 shrink-0">
                    Test Delivery
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Subscribed Event Triggers</p>
                <div className="flex flex-wrap gap-1.5">
                  {['escrow.fund_locked', 'escrow.milestone_approved', 'escrow.disbursed', 'escrow.lien_placed', 'escrow.reconciliation_matched'].map(ev => (
                    <span key={ev} className="text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-neutral-100 text-xs text-neutral-500 bg-neutral-50/30 flex items-center justify-between">
            <span>Signing Secret: <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">whsec_192JalXz...</code></span>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold">Regenerate Secret</button>
          </div>
        </div>
      </div>

      {/* Generate REST Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
                <Code2 className="w-5 h-5 text-emerald-600" />
                Generate REST Key
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-500 text-xs font-semibold">✕ Close</button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Key Description (Name)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AWS Lambda transaction sync service"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 hover:border-neutral-300 focus:border-emerald-500 bg-neutral-50 hover:bg-neutral-50/50 focus:bg-white rounded-lg outline-hidden font-medium text-neutral-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Access Permissions / Scope</label>
                <select 
                  value={keyScope}
                  onChange={(e) => setKeyScope(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs py-2 px-3 rounded-lg outline-hidden hover:border-neutral-300 focus:border-emerald-500 font-semibold"
                >
                  <option value="read_only">Read-Only Access (Logs & reporting endpoints)</option>
                  <option value="full_access">Full REST Access (Authorization & refunds allowed)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 font-semibold rounded-lg text-neutral-600 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg cursor-pointer shadow-xs">Generate Secret Key</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
