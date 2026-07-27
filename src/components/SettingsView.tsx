import React, { useState } from 'react';
import { 
  Settings2, 
  ShieldCheck, 
  User, 
  Building, 
  Key, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle,
  Database,
  CloudLightning,
  Bell
} from 'lucide-react';

export default function SettingsView() {
  const [sandboxMode, setSandboxMode] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [corpName, setCorpName] = useState("Acme International Inc");
  const [supportEmail, setSupportEmail] = useState("ops@acme.com");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/50 pb-5">
        <div>
          <span className="bg-neutral-500/10 text-neutral-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
            Administration
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5 matches">
            Operating Settings & Rails
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure system webhooks, manage B2B sandbox keys, and set spending limits per subsidiary.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-lg border border-emerald-100 font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          Settings Authenticated via MFA Authenticator
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-xs font-bold flex items-center gap-1.5 animate-fade-in select-none">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          System operating parameters saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Config Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold text-neutral-900 uppercase pb-2 border-b border-neutral-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            Corporate Merchant Profile
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-neutral-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Authorized Company Name</label>
                <input 
                  type="text" 
                  value={corpName}
                  onChange={(e) => setCorpName(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-250 hover:border-neutral-300 focus:border-emerald-500 rounded-lg bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-neutral-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Operations Liaison Email</label>
                <input 
                  type="email" 
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full text-xs p-2 border border-neutral-250 hover:border-neutral-300 focus:border-emerald-500 rounded-lg bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-neutral-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Standard Settlement Cycle</label>
                <select className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden font-medium text-neutral-800">
                  <option>T+0 Clearing (Immediate Cash out)</option>
                  <option>T+1 Bank Cycle Standard</option>
                  <option>T+3 Managed Roll-over Reserve</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Escrow Margin Lock (Volume %)</label>
                <select className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden font-medium text-neutral-800">
                  <option>0% Premium Margin swap</option>
                  <option>5% Rolling standard reserve</option>
                  <option>10% High-risk security buffer</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded-lg cursor-pointer text-xs"
            >
              Commit Operating Settings
            </button>
          </form>
        </div>

        {/* Sandbox toggle or keys helper */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-neutral-900 uppercase">Sandbox Mode Switch</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Toggle between the secure staging Sandbox and live clearing production network nodes.
            </p>

            <button 
              onClick={() => setSandboxMode(!sandboxMode)}
              className="w-full flex items-center justify-between p-3 rounded-lg border text-xs font-bold transition-all border-neutral-250 hover:bg-neutral-50 cursor-pointer"
            >
              <span className={sandboxMode ? "text-amber-600" : "text-emerald-600"}>
                {sandboxMode ? "SANDBOX MODE ACTIVE" : "PRODUCTION LIVE NETWORK"}
              </span>
              {sandboxMode ? (
                <ToggleLeft className="w-7 h-7 text-amber-500 shrink-0" />
              ) : (
                <ToggleRight className="w-7 h-7 text-emerald-500 shrink-0" />
              )}
            </button>
          </div>

          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200/80 space-y-3 font-semibold text-xs text-neutral-600">
            <h4 className="text-neutral-900 flex items-center gap-1.5 text-xs font-bold">
              <Database className="w-4 h-4 text-neutral-700" />
              Backup logs & API keys
            </h4>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
              Webhook triggers notify your client servers on transaction success and chargeback files instantly. Manage webhook tokens under the <b>Developers API</b> tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
