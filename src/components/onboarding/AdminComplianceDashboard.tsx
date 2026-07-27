import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck2, 
  Users, 
  Building, 
  Globe, 
  Sparkles, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  ShieldAlert, 
  Bot, 
  Download,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { MerchantApplication } from '../../types';
import { adminQueueApplications } from '../../onboardingData';

interface AdminComplianceDashboardProps {
  onBackToApp: () => void;
}

export default function AdminComplianceDashboard({ onBackToApp }: AdminComplianceDashboardProps) {
  const [applications, setApplications] = useState<MerchantApplication[]>(adminQueueApplications);
  const [activeQueueTab, setActiveQueueTab] = useState<'pending' | 'ai_flagged' | 'high_risk' | 'deficiency' | 'approved' | 'rejected'>('pending');
  const [selectedAppId, setSelectedAppId] = useState<string>(adminQueueApplications[0].id);
  const [officerNote, setOfficerNote] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Filter queue
  const filteredApps = applications.filter(a => {
    if (activeQueueTab === 'pending') return a.status === 'under_review' || a.status === 'draft';
    if (activeQueueTab === 'high_risk') return a.status === 'risk_assessment';
    if (activeQueueTab === 'deficiency') return a.status === 'deficiency_raised';
    if (activeQueueTab === 'approved') return a.status === 'approved';
    if (activeQueueTab === 'rejected') return a.status === 'rejected';
    return true;
  });

  // Action Handlers
  const handleApprove = (withConditions = false) => {
    const updatedApps = applications.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: 'approved' as const,
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          reviewedBy: 'Senior Compliance Officer R. Sharma',
          auditLogs: [
            ...app.auditLogs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: 'Officer R. Sharma',
              action: withConditions ? 'Approved with Conditions (5% Reserve)' : 'Final Compliance Approved',
              notes: officerNote || (withConditions ? 'Conditional approval subject to rolling reserve.' : 'All KYB documents and Penny Drop verified.')
            }
          ]
        };
      }
      return app;
    });

    setApplications(updatedApps);
    showToast(withConditions ? "Approved with 5% Rolling Reserve Condition" : "Merchant Application Approved & MID Bound!");
    setOfficerNote('');
  };

  const handleRaiseDeficiency = () => {
    if (!officerNote) {
      alert("Please enter a note explaining what document or detail is required.");
      return;
    }

    const updatedApps = applications.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: 'deficiency_raised' as const,
          deficiencyNotes: officerNote,
          auditLogs: [
            ...app.auditLogs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: 'Officer R. Sharma',
              action: 'Deficiency Raised',
              notes: officerNote
            }
          ]
        };
      }
      return app;
    });

    setApplications(updatedApps);
    showToast("Deficiency Raised & Dispatched to Merchant Email/SMS!");
    setOfficerNote('');
  };

  const handleReject = () => {
    const updatedApps = applications.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: 'rejected' as const,
          auditLogs: [
            ...app.auditLogs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: 'Officer R. Sharma',
              action: 'Application Rejected',
              notes: officerNote || 'Failed risk or regulatory criteria.'
            }
          ]
        };
      }
      return app;
    });

    setApplications(updatedApps);
    showToast("Application Rejected");
    setOfficerNote('');
  };

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight">Rayvaanah Compliance Admin Portal</span>
            <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-950 border border-amber-500/30 px-2 py-0.5 rounded">
              OFFICER DISPATCH QUEUE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actionSuccessToast && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {actionSuccessToast}
            </span>
          )}

          <button 
            onClick={onBackToApp}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span>Exit Admin & Open Merchant OS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout: Left Queue List + Right Detail Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto">
        
        {/* Left Queue Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4">
          
          {/* Queue Tab Selectors */}
          <div className="flex overflow-x-auto gap-1 border-b border-slate-800 pb-2">
            {[
              { id: 'pending', label: 'Pending' },
              { id: 'high_risk', label: 'High Risk' },
              { id: 'deficiency', label: 'Deficiency' },
              { id: 'approved', label: 'Approved' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveQueueTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeQueueTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search GSTIN, MID, or Name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Application list cards */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            {filteredApps.map((app) => {
              const isSelected = selectedApp.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-950/60 border-amber-500/50 text-white shadow-lg'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-white truncate">{app.legalBusinessName}</span>
                    <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      {app.referenceId}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 truncate">
                    GST: <span className="font-mono text-emerald-400">{app.gstNumber}</span> • TPV: ₹{(app.monthlyTpvEst/100000).toFixed(1)}L
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="text-slate-500">
                      Score: <strong className="text-emerald-400">{app.aiPreScreen?.readinessScore}/100</strong>
                    </span>
                    <span className="capitalize font-semibold text-slate-300">{app.status.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Detail Inspection Panel (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950 border border-amber-500/30 px-2.5 py-0.5 rounded">
                    REF: {selectedApp.referenceId}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    MID: {selectedApp.merchantId}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1.5">{selectedApp.legalBusinessName}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedApp.description}</p>
              </div>

              <div className="text-right bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">AI Readiness</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{selectedApp.aiPreScreen?.readinessScore}/100</p>
                <span className="text-[10px] text-emerald-400 font-semibold">GREEN RISK SCORE</span>
              </div>
            </div>

            {/* Business Profile & Ops Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px]">Entity Type:</span>
                <p className="font-semibold text-slate-200 capitalize">{selectedApp.entityType.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">GSTIN:</span>
                <p className="font-mono font-bold text-emerald-400">{selectedApp.gstNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Corporate PAN:</span>
                <p className="font-mono text-slate-200">{selectedApp.panNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Est. Monthly TPV:</span>
                <p className="font-mono font-bold text-white">₹{(selectedApp.monthlyTpvEst/10000000).toFixed(2)} Cr</p>
              </div>
            </div>

            {/* Website & Domain Audit */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                Domain & Policy Audit: <a href={selectedApp.websiteUrl} target="_blank" className="text-emerald-400 underline font-mono">{selectedApp.websiteUrl}</a>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">SSL Certificate:</span>
                  <p className="text-emerald-400 font-bold">Valid TLS v1.3</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Domain Age:</span>
                  <p className="text-slate-200 font-bold">{selectedApp.websiteAudit?.domainAgeYears} Years</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Privacy & Terms:</span>
                  <p className="text-emerald-400 font-bold">Verified</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Name Match:</span>
                  <p className="text-emerald-400 font-bold">Passed</p>
                </div>
              </div>
            </div>

            {/* Bank Penny Drop Audit */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-400" />
                Nodal Escrow Penny Drop Audit Log:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Bank:</span>
                  <p className="font-bold text-slate-200">{selectedApp.bankInfo?.bankName}</p>
                </div>
                <div>
                  <span className="text-slate-500">IFSC & A/c:</span>
                  <p className="font-mono text-emerald-400">{selectedApp.bankInfo?.ifsc} / {selectedApp.bankInfo?.accountNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Name Match Score:</span>
                  <p className="font-mono font-extrabold text-emerald-400">{selectedApp.bankInfo?.nameMatchScore}%</p>
                </div>
              </div>
            </div>

            {/* Documents & Director KYB List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 mb-2 block">OCR Extracted Documents:</span>
                <div className="space-y-1.5">
                  {selectedApp.documents.map(d => (
                    <div key={d.id} className="flex items-center justify-between text-[11px] bg-slate-900 p-2 rounded-lg">
                      <span className="truncate font-medium text-slate-300">{d.title}</span>
                      <span className="text-emerald-400 font-bold font-mono text-[10px]">VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 mb-2 block">Director DIN & Personal KYB:</span>
                <div className="space-y-1.5">
                  {selectedApp.directors.map(dir => (
                    <div key={dir.id} className="bg-slate-900 p-2 rounded-lg text-[11px] flex justify-between">
                      <span className="font-bold text-white">{dir.fullName} ({dir.designation})</span>
                      <span className="text-emerald-400 font-mono">DIN: {dir.din}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Officer Action & Notes */}
            <div className="space-y-2 pt-2">
              <label className="block text-slate-300 text-xs font-bold">Officer Signoff Notes / Deficiency Reason:</label>
              <textarea 
                rows={2}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="Enter mandatory notes before approving, raising deficiency, or rejecting..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 mt-6">
            <div className="flex gap-2">
              <button 
                onClick={handleReject}
                className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Reject Application
              </button>

              <button 
                onClick={handleRaiseDeficiency}
                className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Raise Deficiency
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleApprove(true)}
                className="bg-teal-900 hover:bg-teal-800 text-teal-200 border border-teal-500/40 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Approve (5% Reserve)
              </button>

              <button 
                onClick={() => handleApprove(false)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Final Approve & Bind MID
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
