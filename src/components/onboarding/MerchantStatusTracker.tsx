import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileCheck2, 
  Upload, 
  ArrowRight, 
  Key, 
  Globe, 
  ShieldCheck,
  ChevronLeft,
  Building2,
  AlertCircle
} from 'lucide-react';
import { initialMockApplication } from '../../onboardingData';

interface MerchantStatusTrackerProps {
  onBackToWizard: () => void;
  onLaunchWorkspace: () => void;
}

export default function MerchantStatusTracker({
  onBackToWizard,
  onLaunchWorkspace
}: MerchantStatusTrackerProps) {
  const [appState, setAppState] = useState(initialMockApplication);
  const [hasUploadedDeficiencyDoc, setHasUploadedDeficiencyDoc] = useState(false);

  // Status timeline steps
  const timeline = [
    { title: "Application Submitted", date: "2026-07-27 13:30", status: "completed" },
    { title: "Documents Under Review (OCR)", date: "2026-07-27 13:32", status: "completed" },
    { title: "KYB & Penny Drop Verification", date: "2026-07-27 13:35", status: "completed" },
    { title: "Senior Compliance Review", date: "In Progress", status: "current" },
    { title: "Risk & Rolling Reserve Audit", date: "Pending", status: "upcoming" },
    { title: "Final Approval & MID Binding", date: "Pending", status: "upcoming" },
    { title: "Technical Onboarding", date: "Pending", status: "upcoming" },
    { title: "Production API Keys Generated", date: "Pending", status: "upcoming" },
    { title: "Go Live On Nodal Escrow Rails", date: "Pending", status: "upcoming" },
  ];

  const handleResolveDeficiency = () => {
    setHasUploadedDeficiencyDoc(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToWizard}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:text-emerald-400 text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-lg font-black text-white">Merchant Application Status Tracker</span>
            <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-950 border border-amber-500/30 px-2 py-0.5 rounded">
              REF: {appState.referenceId}
            </span>
          </div>
        </div>

        <button 
          onClick={onLaunchWorkspace}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span>Open Escrow Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-5xl w-full mx-auto p-6 space-y-8">
        
        {/* Main Status Hero Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
              Current Status: Under Compliance Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              {appState.legalBusinessName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Merchant ID: <strong className="text-slate-200 font-mono">{appState.merchantId}</strong> • GSTIN: <strong className="text-emerald-400 font-mono">{appState.gstNumber}</strong>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Signoff</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">~15 Minutes</p>
            <span className="text-[10px] text-slate-500">Auto SLA Priority Queue</span>
          </div>
        </div>

        {/* DEFICIENCY ALERT BANNER (If raised) */}
        {appState.status === 'deficiency_raised' || !hasUploadedDeficiencyDoc ? (
          <div className="bg-amber-950/80 border border-amber-500/40 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-200 text-sm">Action Required: Compliance Requested Document Update</span>
                <p className="text-amber-300/80 mt-1">
                  Officer Note: "Please re-upload Director 2 (Ananya Deshmukh) clear Aadhaar scan. Current image is slightly blurry."
                </p>
              </div>
            </div>

            <button 
              onClick={handleResolveDeficiency}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Corrected Document</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Deficiency document re-uploaded successfully! Re-submitted to Senior Officer Queue.</span>
          </div>
        )}

        {/* TIMELINE LIST */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-extrabold text-white mb-6">Onboarding & Approval Timeline</h3>

          <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pl-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                  item.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : item.status === 'current'
                    ? 'bg-amber-500 border-amber-400 text-slate-950 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}>
                  {item.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className={`text-sm font-bold ${
                    item.status === 'completed' ? 'text-white' : item.status === 'current' ? 'text-amber-300' : 'text-slate-500'
                  }`}>
                    {item.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
