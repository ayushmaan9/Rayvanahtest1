import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Globe, 
  FileText, 
  Users, 
  Building, 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Save, 
  HelpCircle, 
  Upload, 
  FileCheck2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Lock,
  Cpu,
  Bot,
  RefreshCw,
  Scale
} from 'lucide-react';
import { MerchantApplication, MerchantDirector, MerchantDoc } from '../../types';
import { initialMockApplication } from '../../onboardingData';

interface SelfOnboardingWizardProps {
  onCompleteAndLaunchWorkspace: () => void;
  onOpenStatusTracker: () => void;
}

export default function SelfOnboardingWizard({
  onCompleteAndLaunchWorkspace,
  onOpenStatusTracker
}: SelfOnboardingWizardProps) {
  const [appData, setAppData] = useState<MerchantApplication>(initialMockApplication);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);
  const [ocrProcessingId, setOcrProcessingId] = useState<string | null>(null);

  // Steps definition
  const steps = [
    { id: 1, title: "Business Profile", icon: Building2, subtitle: "Legal entity & registration details" },
    { id: 2, title: "Business Operations", icon: Briefcase, subtitle: "TPV estimates, settlement & currencies" },
    { id: 3, title: "Website & Digital Presence", icon: Globe, subtitle: "Checkout domain & policy audit" },
    { id: 4, title: "Business Documents", icon: FileText, subtitle: "GST, PAN & MCA Certificate OCR" },
    { id: 5, title: "Director / Owner KYC", icon: Users, subtitle: "DIN, PAN & Aadhaar verification" },
    { id: 6, title: "Bank Verification", icon: Building, subtitle: "Nodal Escrow penny drop test" },
    { id: 7, title: "Compliance Declarations", icon: CheckSquare, subtitle: "RBI PA/PG e-Signature consent" },
    { id: 8, title: "AI Pre-Screen Evaluation", icon: Sparkles, subtitle: "Readiness score & risk audit" },
    { id: 9, title: "Application Submitted", icon: CheckCircle2, subtitle: "Reference ID & tracking timeline" },
  ];

  // Auto-Save Draft handler
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 3000);
    }, 600);
  };

  // Step Navigation
  const handleNextStep = () => {
    if (activeStep < 9) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // File Upload OCR Simulator
  const handleFileUpload = (docType: MerchantDoc['docType'], title: string) => {
    const newDocId = `doc_${Date.now()}`;
    setOcrProcessingId(newDocId);

    setTimeout(() => {
      const newDoc: MerchantDoc = {
        id: newDocId,
        docType,
        title,
        fileName: `${title.replace(/ /g, '_')}_Upload.pdf`,
        fileSize: '1.4 MB',
        uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'ocr_extracted',
        ocrData: {
          legalName: appData.legalBusinessName,
          panOrGst: appData.gstNumber,
          issueDate: '12-Jan-2022',
          addressMatch: true,
          extractedTextSnippet: `VERIFIED OCR PARSE: Document matches ${appData.legalBusinessName} with 99.4% confidence.`
        }
      };

      setAppData(prev => ({
        ...prev,
        documents: [...prev.documents.filter(d => d.docType !== docType), newDoc]
      }));
      setOcrProcessingId(null);
    }, 1000);
  };

  // Add Director
  const handleAddDirector = () => {
    const newDir: MerchantDirector = {
      id: `dir_${Date.now()}`,
      fullName: 'Siddharth V. Mehta',
      designation: 'Whole Time Director',
      din: '09842110',
      pan: 'SDFGH5678M',
      aadhaar: 'XXXX-XXXX-8821',
      email: 'siddharth@aetheriapay.in',
      mobile: '+91 98330 11200',
      address: 'Plot 12, JVPD Scheme, Juhu, Mumbai MH 400049',
      nationality: 'Indian',
      shareholdingPct: 0.0,
      isKycVerified: true
    };
    setAppData(prev => ({ ...prev, directors: [...prev.directors, newDir] }));
  };

  // Remove Director
  const handleRemoveDirector = (id: string) => {
    setAppData(prev => ({
      ...prev,
      directors: prev.directors.filter(d => d.id !== id)
    }));
  };

  // Calculate completion percentage
  const completionPct = Math.min(100, Math.round((activeStep / 8) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight">Rayvaanah Self-Onboarding</span>
            <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
              INDIAN B2B ESCROW PA/PG
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {draftSavedToast && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-lg animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Draft Auto-Saved to Cloud
            </span>
          )}

          <button 
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSavingDraft ? 'Saving...' : 'Save & Resume Draft'}</span>
          </button>

          <button 
            onClick={onOpenStatusTracker}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Application Status</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Left Sidebar Wizard Stepper + Right Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Left Navigation Stepper (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-fit sticky top-20">
          <div>
            {/* Progress Header */}
            <div className="mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Onboarding Progress</span>
                <span className="text-emerald-400 font-mono">{completionPct}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>Ref: <strong className="text-slate-200 font-mono">{appData.referenceId}</strong></span>
                <span>Est: <strong className="text-emerald-400">~12 Mins</strong></span>
              </div>
            </div>

            {/* Step list */}
            <div className="space-y-1.5">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id || (activeStep === 9 && step.id === 9);

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-white shadow-lg shadow-emerald-950/40' 
                        : isCompleted
                        ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500 text-slate-950' 
                        : isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight truncate">{step.title}</span>
                        {isActive && <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">Active</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Support Helpline Box */}
          <div className="mt-8 pt-4 border-t border-slate-800 bg-slate-950/80 p-3.5 rounded-xl border flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-200">Need Onboarding Assistance?</span>
              <p className="text-slate-400">Escrow Desk: <strong className="text-emerald-400">+91 1800-200-RAYV</strong></p>
            </div>
          </div>
        </div>

        {/* Right Form Content (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            {/* STEP 1: BUSINESS PROFILE */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 1 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Corporate Business Profile</h2>
                  <p className="text-xs text-slate-400 mt-1">Enter legal corporate parameters as registered with MCA and GST portal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Legal Business Name (per MCA / GST)</label>
                    <input 
                      type="text" 
                      value={appData.legalBusinessName}
                      onChange={(e) => setAppData({ ...appData, legalBusinessName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Brand / Trade Name</label>
                    <input 
                      type="text" 
                      value={appData.tradeName}
                      onChange={(e) => setAppData({ ...appData, tradeName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Entity Constitution</label>
                    <select 
                      value={appData.entityType}
                      onChange={(e) => setAppData({ ...appData, entityType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="private_limited">Private Limited Company (Pvt Ltd)</option>
                      <option value="llp">Limited Liability Partnership (LLP)</option>
                      <option value="sole_proprietorship">Sole Proprietorship</option>
                      <option value="public_limited">Public Limited Company</option>
                      <option value="partnership">Partnership Firm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">MCC (Merchant Category Code)</label>
                    <input 
                      type="text" 
                      value={appData.mcc}
                      onChange={(e) => setAppData({ ...appData, mcc: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">GSTIN Registration Number</label>
                    <input 
                      type="text" 
                      value={appData.gstNumber}
                      onChange={(e) => setAppData({ ...appData, gstNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Corporate PAN Number</label>
                    <input 
                      type="text" 
                      value={appData.panNumber}
                      onChange={(e) => setAppData({ ...appData, panNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">CIN / LLPIN (MCA)</label>
                    <input 
                      type="text" 
                      value={appData.cin}
                      onChange={(e) => setAppData({ ...appData, cin: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Date of Incorporation</label>
                    <input 
                      type="date" 
                      value={appData.dateOfIncorporation}
                      onChange={(e) => setAppData({ ...appData, dateOfIncorporation: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">Registered Address (per GST Certificate)</label>
                    <textarea 
                      rows={2}
                      value={appData.registeredAddress}
                      onChange={(e) => setAppData({ ...appData, registeredAddress: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BUSINESS OPERATIONS */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 2 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Transaction Volumes & Settlement Preferences</h2>
                  <p className="text-xs text-slate-400 mt-1">Specify TPV forecasts and Nodal Escrow release modalities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Estimated Monthly TPV (INR ₹)</label>
                    <input 
                      type="number" 
                      value={appData.monthlyTpvEst}
                      onChange={(e) => setAppData({ ...appData, monthlyTpvEst: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Average Order Value (AOV ₹)</label>
                    <input 
                      type="number" 
                      value={appData.avgOrderValue}
                      onChange={(e) => setAppData({ ...appData, avgOrderValue: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Settlement Release Preference</label>
                    <select 
                      value={appData.settlementPreference}
                      onChange={(e) => setAppData({ ...appData, settlementPreference: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="escrow_milestone">RBI Nodal Escrow Milestone Release (Recommended)</option>
                      <option value="t0_instant">T+0 Instant Nodal Sweep</option>
                      <option value="t1_next_day">T+1 Standard Bank Settlement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Delivery Fulfillment Timeline</label>
                    <input 
                      type="text" 
                      value={appData.deliveryTimelineDays}
                      onChange={(e) => setAppData({ ...appData, deliveryTimelineDays: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={appData.isMarketplace}
                        onChange={(e) => setAppData({ ...appData, isMarketplace: e.target.checked })}
                        className="rounded border-slate-700 text-emerald-500 w-4 h-4 bg-slate-900" 
                      />
                      <span className="font-semibold text-slate-200">B2B Marketplace (Multi-Vendor Split Payouts)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={appData.isInternational}
                        onChange={(e) => setAppData({ ...appData, isInternational: e.target.checked })}
                        className="rounded border-slate-700 text-emerald-500 w-4 h-4 bg-slate-900" 
                      />
                      <span className="font-semibold text-slate-200">Cross-Border Foreign Inward Remittance (FIRC)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: WEBSITE & DIGITAL PRESENCE WITH LIVE VALIDATION */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 3 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Website & Checkout URL Audit</h2>
                  <p className="text-xs text-slate-400 mt-1">Automated AI crawler verifies SSL, domain age, and compliance policy availability.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Primary Domain URL</label>
                    <input 
                      type="url" 
                      value={appData.websiteUrl}
                      onChange={(e) => setAppData({ ...appData, websiteUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Checkout / Portal Endpoint</label>
                    <input 
                      type="url" 
                      value={appData.checkoutUrl}
                      onChange={(e) => setAppData({ ...appData, checkoutUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Privacy Policy Link</label>
                    <input 
                      type="url" 
                      value={appData.privacyPolicyUrl}
                      onChange={(e) => setAppData({ ...appData, privacyPolicyUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Refund & Cancellation Policy</label>
                    <input 
                      type="url" 
                      value={appData.refundPolicyUrl}
                      onChange={(e) => setAppData({ ...appData, refundPolicyUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* LIVE WEBSITE AUDIT WIDGET */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Live AI Domain Audit Report</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                      HEALTH SCORE: {appData.websiteAudit?.overallHealthScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="block font-semibold text-slate-200 text-[11px]">HTTPS & SSL</span>
                        <span className="text-[10px] text-slate-400">TLS v1.3 Verified</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="block font-semibold text-slate-200 text-[11px]">Domain Age</span>
                        <span className="text-[10px] text-slate-400">{appData.websiteAudit?.domainAgeYears} Years Active</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="block font-semibold text-slate-200 text-[11px]">Policies Crawled</span>
                        <span className="text-[10px] text-slate-400">Privacy, Terms, Shipping</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="block font-semibold text-slate-200 text-[11px]">Name Match</span>
                        <span className="text-[10px] text-slate-400">Aetheria B2B Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: VERIFICATION DOCUMENTS + OCR */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 4 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Business Verification Documents</h2>
                  <p className="text-xs text-slate-400 mt-1">Upload official PDF certificates. Automated OCR extracts text snippet and validates GSTIN/PAN.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'gst_certificate', title: 'GST REG-06 Registration Certificate' },
                    { type: 'corporate_pan', title: 'Corporate Permanent Account Number (PAN)' },
                    { type: 'coi', title: 'Certificate of Incorporation (MCA)' },
                    { type: 'cancelled_cheque', title: 'Cancelled Cheque linked to Nodal Escrow Account' }
                  ].map((reqDoc) => {
                    const existingDoc = appData.documents.find(d => d.docType === reqDoc.type);
                    const isUploading = ocrProcessingId === `doc_${reqDoc.type}`;

                    return (
                      <div key={reqDoc.type} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-200">{reqDoc.title}</span>
                            {existingDoc ? (
                              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                                {existingDoc.fileName} ({existingDoc.fileSize}) • OCR Verified
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500 mt-0.5">PDF or JPEG, max 10MB</p>
                            )}
                          </div>
                        </div>

                        {existingDoc ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              OCR PARSED
                            </span>
                            <button 
                              onClick={() => handleFileUpload(reqDoc.type as any, reqDoc.title)}
                              className="text-slate-400 hover:text-white underline text-[11px]"
                            >
                              Replace
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleFileUpload(reqDoc.type as any, reqDoc.title)}
                            disabled={isUploading}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            <span>{isUploading ? 'Extracting OCR...' : 'Upload & Scan'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: DIRECTOR KYC */}
            {activeStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 5 of 8</span>
                    <h2 className="text-2xl font-extrabold text-white mt-1">Director & Owner KYB Information</h2>
                    <p className="text-xs text-slate-400 mt-1">Provide DIN, Aadhaar & PAN details for ultimate beneficial owners (UBO).</p>
                  </div>

                  <button 
                    onClick={handleAddDirector}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Director
                  </button>
                </div>

                <div className="space-y-4">
                  {appData.directors.map((dir, idx) => (
                    <div key={dir.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                        <span className="font-extrabold text-white text-sm">Director #{idx + 1}: {dir.fullName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                            DIN: {dir.din}
                          </span>
                          {appData.directors.length > 1 && (
                            <button onClick={() => handleRemoveDirector(dir.id)} className="text-slate-500 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-slate-400 text-[10px]">Designation:</span>
                          <p className="font-semibold text-slate-200">{dir.designation}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Personal PAN:</span>
                          <p className="font-mono font-bold text-emerald-400">{dir.pan}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Aadhaar Vault Ref:</span>
                          <p className="font-mono text-slate-200">{dir.aadhaar}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Shareholding %:</span>
                          <p className="font-bold text-white">{dir.shareholdingPct}%</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">KYC Verification:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> MCA Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: BANK PENNY DROP */}
            {activeStep === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 6 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Bank Account & Penny Drop Verification</h2>
                  <p className="text-xs text-slate-400 mt-1">Specify target settlement account. Real-time ₹1.00 penny drop verifies beneficiary name match.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Bank Name</label>
                    <input 
                      type="text" 
                      value={appData.bankInfo?.bankName}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">IFSC Code</label>
                    <input 
                      type="text" 
                      value={appData.bankInfo?.ifsc}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Account Number</label>
                    <input 
                      type="text" 
                      value={appData.bankInfo?.accountNumber}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">UPI ID for Virtual Collections</label>
                    <input 
                      type="text" 
                      value={appData.bankInfo?.upiId}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* PENNY DROP RESULT CARD */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-white">Banking Penny Drop Test Executed</span>
                        <p className="text-[10px] text-slate-400">NPCI IMPS Real-Time Transfer Reference: {appData.bankInfo?.pennyDropTxnId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full uppercase">
                      MATCH: {appData.bankInfo?.nameMatchScore}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-500 text-[10px]">Transferred Penny Amount:</span>
                      <p className="font-mono font-bold text-emerald-400">₹{appData.bankInfo?.pennyDropAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Beneficiary Name Returned by Bank:</span>
                      <p className="font-bold text-white">{appData.bankInfo?.beneficiaryName}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: DECLARATIONS & ELECTRONIC SIGNATURE */}
            {activeStep === 7 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 7 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Compliance Declarations & e-Signature</h2>
                  <p className="text-xs text-slate-400 mt-1">Sign electronic agreement under Information Technology Act 2000 & DPDP Act 2023.</p>
                </div>

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  {[
                    "I certify that all corporate details, GSTIN, and MCA records provided are true, complete, and accurate.",
                    "I authorize Rayvaanah to open and manage Nodal Escrow Vault accounts under RBI PA/PG Guidelines.",
                    "I consent to continuous AML screening, PEP checks, and rolling reserve risk adjustments.",
                    "I agree to the DPDP Act 2023 consent protocol for processing Director personal identifiers."
                  ].map((decl, i) => (
                    <label key={i} className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                      <input 
                        type="checkbox" 
                        defaultChecked={true}
                        className="rounded border-slate-700 text-emerald-500 w-4 h-4 bg-slate-900 mt-0.5 shrink-0" 
                      />
                      <span className="leading-relaxed">{decl}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Authorized Signatory Name</label>
                    <input 
                      type="text" 
                      value={appData.eSignatureName}
                      onChange={(e) => setAppData({ ...appData, eSignatureName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Signing Timestamp</label>
                    <input 
                      type="text" 
                      value={appData.signedAtDate}
                      readOnly
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>IP Address: <strong className="text-slate-200 font-mono">{appData.ipAddress}</strong></span>
                    <span>Fingerprint: <strong className="text-slate-200 font-mono">{appData.browserFingerprint}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: AI PRE-SCREEN EVALUATION */}
            {activeStep === 8 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 8 of 8</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">AI Automated Pre-Screen Report</h2>
                  <p className="text-xs text-slate-400 mt-1">Automated AI Sentinel audit complete. Review scores before submitting to Compliance Queue.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Merchant Readiness</span>
                    <p className="text-3xl font-black text-emerald-400 mt-1">{appData.aiPreScreen?.readinessScore}/100</p>
                    <span className="text-[10px] text-emerald-400 font-bold">GREEN RISK • AUTO APPROVED</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Commercial Fit</span>
                    <p className="text-3xl font-black text-white mt-1">{appData.aiPreScreen?.commercialFitScore}/100</p>
                    <span className="text-[10px] text-slate-400">High Escrow Volume Potential</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Restricted Items</span>
                    <p className="text-3xl font-black text-emerald-400 mt-1">0 Flagged</p>
                    <span className="text-[10px] text-slate-400">100% Clean Merchant Code</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    AI Recommendation Notes:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {appData.aiPreScreen?.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 9: APPLICATION SUBMITTED */}
            {activeStep === 9 && (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Application Successfully Submitted</span>
                  <h2 className="text-3xl font-black text-white mt-1">Ref: {appData.referenceId}</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                    Your application has been routed to Rayvaanah’s Senior Compliance Queue. Merchant ID <strong className="text-white">{appData.merchantId}</strong> provisioned.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 max-w-xl mx-auto text-xs text-left space-y-3">
                  <span className="font-bold text-slate-200">Current Review Pipeline:</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>1. Automated AI Pre-Screening</span>
                      <span className="text-emerald-400 font-bold">PASSED</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>2. Banking Penny Drop Match</span>
                      <span className="text-emerald-400 font-bold">VERIFIED (98.6%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>3. Senior Officer KYB Signoff</span>
                      <span className="text-amber-400 font-bold animate-pulse">IN PROGRESS (~15 mins)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button 
                    onClick={onCompleteAndLaunchWorkspace}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>Launch Rayvaanah Escrow Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={onOpenStatusTracker}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>View Status Tracker</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Control Buttons */}
          {activeStep < 9 && (
            <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between mt-8">
              <button 
                onClick={handlePrevStep}
                disabled={activeStep === 1}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button 
                onClick={handleNextStep}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>{activeStep === 8 ? 'Submit Application' : 'Save & Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
