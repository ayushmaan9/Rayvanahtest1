import React from 'react';
import { 
  ArrowLeftRight, 
  TrendingDown, 
  Wallet, 
  Users, 
  ShieldAlert, 
  Scale, 
  BarChart3, 
  Sparkles, 
  Code2, 
  Settings2,
  Building2,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const customTabs = [
    { id: 'collections', label: 'Escrow Collections (Pay-In)', icon: ArrowLeftRight, badge: 'ESCROW IN' },
    { id: 'payouts', label: 'Escrow Payouts (Disburse)', icon: TrendingDown, badge: 'ESCROW OUT' },
    { id: 'treasury', label: 'Nodal Escrow Treasury', icon: Wallet, badge: 'RBI NODAL' },
    { id: 'customers', label: 'Escrow Merchants & CRM', icon: Users },
    { id: 'risk', label: 'Escrow Lien & Risk Control', icon: ShieldAlert },
    { id: 'compliance', label: 'RBI Escrow & PA Compliance', icon: Scale },
    { id: 'users', label: 'Multi-Sig Access & Maker-Checker', icon: UserCheck, badge: 'MULTI-SIG' },
    { id: 'analytics', label: 'Escrow Velocity Analytics', icon: BarChart3 },
    { id: 'copilot', label: 'Escrow AI Copilot', icon: Sparkles, highlight: true },
    { id: 'developers', label: 'Escrow API & Webhooks', icon: Code2 },
    { id: 'settings', label: 'Escrow Vault Settings', icon: Settings2 },
  ];

  return (
    <div className="w-68 bg-neutral-950 border-r border-neutral-900 text-neutral-300 flex flex-col h-screen fixed top-0 left-0 z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-900 flex items-center gap-3 bg-neutral-950">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white tracking-widest shadow-lg shadow-emerald-950/25 text-sm uppercase">
          RA
        </div>
        <div>
          <h1 className="font-semibold text-white text-md tracking-tight leading-none bg-gradient-to-r from-neutral-50 to-neutral-200 bg-clip-text text-transparent">Rayvaanah</h1>
          <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mt-1">Escrow Merchant OS</p>
        </div>
      </div>

      {/* Account Switcher */}
      <div className="px-3.5 py-2.5 mx-3 my-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-semibold text-neutral-100 truncate">Acme International</p>
            <p className="text-[9px] text-teal-500 font-medium tracking-wide">Standard Production</p>
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-800">
        <p className="px-3 py-2 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Main Modules</p>
        
        {customTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-500' 
                  : item.highlight 
                  ? 'hover:bg-neutral-900/80 text-teal-400 hover:text-teal-300 font-medium'
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-100 border-l-2 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${
                isActive 
                  ? 'text-emerald-400' 
                  : item.highlight 
                  ? 'text-teal-400 pulse-glow' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-neutral-900 text-neutral-500 border border-neutral-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-neutral-900 bg-neutral-950/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-100 font-bold uppercase tracking-wider">
          JD
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-semibold text-neutral-200 truncate">John Drake</p>
          <p className="text-[10px] text-neutral-600 truncate">j.drake@acme.com</p>
        </div>
      </div>
    </div>
  );
}
