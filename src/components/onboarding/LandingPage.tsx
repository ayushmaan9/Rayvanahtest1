import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Building2, 
  CheckCircle2, 
  Users, 
  Scale, 
  Wallet, 
  BarChart3, 
  Zap, 
  Globe2, 
  Cpu, 
  FileCheck2, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  Layers,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onCreateAccountClick: () => void;
  onOpenAppDirectly: () => void;
  onOpenAdminCompliance: () => void;
}

export default function LandingPage({
  onLoginClick,
  onCreateAccountClick,
  onOpenAppDirectly,
  onOpenAdminCompliance
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Banner - RBI PA/PG Nodal Compliance */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/90 to-slate-900 border-b border-emerald-500/20 px-4 py-2 text-center text-xs text-emerald-200 font-medium flex items-center justify-center gap-2">
        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
          RBI Compliant
        </span>
        <span>Built for Indian B2B Payment Aggregators & Nodal Escrow Infrastructure</span>
        <span className="hidden md:inline text-emerald-400/60">•</span>
        <span className="hidden md:inline text-slate-300">DPDP Act 2023 & ISO 27001 Certified</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenAppDirectly}>
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Rayvaanah
            </span>
            <span className="ml-2 text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
              ESCROW MERCHANT OS
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Platform Modules</a>
          <a href="#compliance" className="hover:text-emerald-400 transition-colors">RBI Nodal Security</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">Enterprise Architecture</a>
          <a href="#benefits" className="hover:text-emerald-400 transition-colors">Merchant Benefits</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenAdminCompliance}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Compliance Admin Portal
          </button>

          <button 
            onClick={onLoginClick}
            className="text-xs font-semibold text-slate-200 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
          >
            Sign In
          </button>

          <button 
            onClick={onCreateAccountClick}
            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>Start Merchant Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Glow background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 backdrop-blur-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Next-Gen Escrow & PA/PG Infrastructure for Indian Enterprises</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.12]">
          AI-Native Merchant Operating System for India’s B2B Payments Ecosystem
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Unify Escrow Nodal Accounts, Automated Vendor Disbursements, Multi-Sig Maker-Checker Approvals, Real-Time KYB Onboarding, and AI-Powered Risk Intelligence in one enterprise platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={onCreateAccountClick}
            className="w-full sm:w-auto text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 cursor-pointer"
          >
            <span>Apply for Escrow Merchant OS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button 
            onClick={onOpenAppDirectly}
            className="w-full sm:w-auto text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Launch Live Merchant Workspace</span>
          </button>
        </div>

        {/* Security Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400 text-xs">
          <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">PCI-DSS Level 1</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-200">RBI Nodal Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">ISO 27001 Certified</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">DPDP Act 2023 Ready</span>
          </div>
        </div>

        {/* Product Screenshot / Preview Mock */}
        <div className="mt-14 w-full max-w-5xl bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-2xl shadow-emerald-950/50 overflow-hidden relative group cursor-pointer" onClick={onOpenAppDirectly}>
          <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-500">https://os.rayvaanah.in/workspace/nodal-treasury</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">LIVE ESCROW VAULT ACTIVE</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RBI Nodal Escrow Reserve</span>
                <p className="text-2xl font-black text-white mt-1">₹142,850,000.00</p>
                <span className="text-[11px] text-emerald-400 font-medium">100% Reserve Audit Verified • DICGC Compliant</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Disbursed (Today)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">₹38,410,200.00</p>
                <span className="text-[11px] text-slate-400 font-medium">482 Automated Tri-Party Releases</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">KYB Merchant Status</span>
                <p className="text-2xl font-black text-white mt-1">99.4% Verified</p>
                <span className="text-[11px] text-amber-400 font-medium">Auto Penny Drop + MCA API Synced</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity flex items-end justify-center pb-6">
            <span className="text-xs font-bold text-emerald-400 bg-slate-900/90 border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-xs">
              <span>Click to Enter Rayvaanah Escrow Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            Complete Enterprise Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Designed for High-Volume B2B & Marketplace Platforms
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Rayvaanah replaces disconnected tools with one tightly integrated Escrow Merchant OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Wallet,
              title: "Nodal Escrow Treasury",
              desc: "100% RBI regulated Nodal Escrow vault management, real-time multi-currency balances, and auto-sweep yields.",
              badge: "RBI MANDATE"
            },
            {
              icon: Sliders,
              title: "Tri-Party Milestone Holds",
              desc: "Lock funds until buyer acceptance, milestone sign-off, or logistics proof before releasing to vendors.",
              badge: "ESCROW ENGINE"
            },
            {
              icon: Users,
              title: "Multi-Sig Maker-Checker",
              desc: "Granular dual-authorization approval matrix for enterprise disbursements and high-value wire releases.",
              badge: "ENTERPRISE SECURITY"
            },
            {
              icon: FileCheck2,
              title: "Real-Time KYB & Penny Drop",
              desc: "Automated GSTIN, MCA CIN, Corporate PAN, and penny drop verification in seconds during merchant onboarding.",
              badge: "AUTOMATED ONBOARDING"
            },
            {
              icon: ShieldAlert,
              title: "AI Risk & Lien Control",
              desc: "Detect suspicious velocity, enforce rolling chargeback reserves, and trigger automated lien holds.",
              badge: "AI SENTINEL"
            },
            {
              icon: Bot,
              title: "Escrow Copilot Assistant",
              desc: "Conversational natural language assistant for querying settlement variances, reserve audits, and API logs.",
              badge: "GENAI POWERED"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Benefits */}
      <section id="benefits" className="py-16 px-6 max-w-7xl mx-auto w-full bg-slate-900/40 rounded-3xl border border-slate-800 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Why Enterprises Choose Rayvaanah</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
              Speed, Regulatory Peace of Mind, and Automated Reconciliation
            </h2>
            <div className="mt-6 space-y-4 text-xs text-slate-300">
              {[
                "Reduce merchant onboarding cycle time from 14 days to under 15 minutes with automated AI Pre-Screening.",
                "Zero regulatory exposure under RBI PA/PG Guidelines with mandatory 100% Nodal Escrow vault auditing.",
                "Streamline B2B vendor payouts via NEFT, RTGS, IMPS, and dynamic UPI Virtual Accounts.",
                "Audit-ready e-Sign signatures, IP timestamping, and DPDP Act 2023 compliance logs."
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">Real-Time Onboarding Benchmark</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Traditional PA/PG Onboarding</span>
                  <span className="font-mono text-red-400">7 to 14 Days</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold text-emerald-400">Rayvaanah Merchant OS</span>
                  <span className="font-mono text-emerald-400 font-bold">&lt; 15 Minutes</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-6 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-300">Rayvaanah Merchant OS India</span>
            <span>• © 2026 All Rights Reserved.</span>
          </div>

          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400">RBI Escrow Mandates</a>
            <a href="#" className="hover:text-emerald-400">Security & ISO 27001</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
