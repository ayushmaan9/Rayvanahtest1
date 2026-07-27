import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Upload, 
  Eye, 
  FileText,
  BadgeAlert,
  Sliders,
  TrendingUp,
  BrainCircuit,
  Lock
} from 'lucide-react';

interface KYCFile {
  id: string;
  corpName: string;
  riskRating: 'low' | 'medium' | 'high';
  country: string;
  status: 'approved' | 'pending' | 'rejected';
  submitted: string;
  documents: string[];
  amlScore: number;
}

export default function ComplianceView() {
  const [kycList, setKycList] = useState<KYCFile[]>([
    { id: "kyc_01", corpName: "Aether Capital Inc", riskRating: "low", country: "United States", status: "approved", submitted: "2026-05-12", documents: ["Certificate of Incorporation", "HNW Beneficiary Registry", "AML Audit"], amlScore: 12 },
    { id: "kyc_02", corpName: "LuxStay Rentals Gmbh", riskRating: "medium", country: "Germany", status: "pending", submitted: "2026-06-08", documents: ["EU Taxation VAT registry", "Director Passport Copy"], amlScore: 42 },
    { id: "kyc_03", corpName: "Redwood Brokerage Associates", riskRating: "high", country: "Maldives", status: "rejected", submitted: "2026-06-02", documents: ["Offshore Holder Statement"], amlScore: 89 },
    { id: "kyc_04", corpName: "Kyoto Tea Co Ltd", riskRating: "low", country: "Japan", status: "approved", submitted: "2026-04-10", documents: ["Export clearance doc", "Japanese Corporate Number"], amlScore: 4 }
  ]);

  const [activeKyc, setActiveKyc] = useState<KYCFile | null>(kycList[1]);
  const [amlFilter, setAmlFilter] = useState<number>(100);

  const handleUpdateKycStatus = (id: string, nextStatus: 'approved' | 'rejected') => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: nextStatus } : k));
    if (activeKyc && activeKyc.id === id) {
      setActiveKyc(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/50 pb-5">
        <div>
          <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            RBI PA/PG & Regulatory Escrow
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5 animate-fade-in">
            RBI Escrow & KYB Compliance Portal
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time merchant KYB onboarding, RBI Nodal Escrow audit logs, PEP screening registers, and DICGC 100% reserve verification.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-lg border border-emerald-100 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          RBI PA/PG Nodal Escrow Audit Validated
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding List */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase">Merchant KYC Files directory</h3>
            <span className="text-[10px] text-neutral-400 font-mono">Showing {kycList.length} entities</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-wider text-[9px] border-b border-neutral-100">
                  <th className="px-4 py-2.5">Corporation</th>
                  <th className="px-4 py-2.5">Jurisdiction</th>
                  <th className="px-4 py-2.5 text-center">Threat Class</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-center">AML Score</th>
                  <th className="px-4 py-2.5 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {kycList.map((kyc) => (
                  <tr 
                    key={kyc.id} 
                    onClick={() => setActiveKyc(kyc)}
                    className={`cursor-pointer transition-colors ${
                      activeKyc?.id === kyc.id ? 'bg-neutral-50/80 border-l-2 border-emerald-500 font-bold' : 'hover:bg-neutral-50/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="block text-neutral-900">{kyc.corpName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{kyc.id}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 font-sans">{kyc.country}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        kyc.riskRating === 'high' ? 'bg-rose-50 text-rose-700' :
                        kyc.riskRating === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {kyc.riskRating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase ${
                        kyc.status === 'approved' ? 'text-emerald-700' :
                        kyc.status === 'pending' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {kyc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-neutral-800">{kyc.amlScore}%</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[10px] text-neutral-400 hover:text-emerald-600 font-bold flex items-center justify-end gap-1 ml-auto">
                        <Eye className="w-3 w-3" /> Inspect profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed review panel for active file */}
        {activeKyc && (
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 pb-3">
              <span className="bg-neutral-100 text-neutral-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                Active KYC File: {activeKyc.id}
              </span>
              <h3 className="text-sm font-bold text-neutral-900 mt-2">{activeKyc.corpName}</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">Submitted profile from {activeKyc.country} on {activeKyc.submitted}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Submitted Documents package</span>
                <div className="space-y-1.5 mt-1.5">
                  {activeKyc.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-neutral-50 border border-neutral-200 rounded text-neutral-700 font-mono text-[10px]">
                      <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Sanctions & AML Check Integrity</span>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>OFAC/PEP Sanction hit:</span>
                  <span className={`font-bold ${activeKyc.amlScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {activeKyc.amlScore > 50 ? "POTENTIAL MATCH" : "CLEAR"}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Consolidated Risk score:</span>
                  <span className="font-bold text-neutral-900">{activeKyc.amlScore}% Threat</span>
                </div>
              </div>

              {activeKyc.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleUpdateKycStatus(activeKyc.id, 'rejected')}
                    className="border border-rose-200 text-rose-700 font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer hover:bg-rose-50"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    Reject File
                  </button>
                  <button 
                    onClick={() => handleUpdateKycStatus(activeKyc.id, 'approved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Clear Merchant
                  </button>
                </div>
              )}

              {activeKyc.status !== 'pending' && (
                <div className={`p-3 rounded-lg text-center text-[11px] font-bold border capitalize ${
                  activeKyc.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                  FILE DECISION: {activeKyc.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compliance policies & requirements */}
      <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200/80 text-xs font-semibold select-none leading-relaxed text-neutral-500">
        <h4 className="font-semibold text-neutral-900 flex items-center gap-2 mb-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          PCI-DSS Compliance Level 1 Checklist rules
        </h4>
        <p className="text-[11px] font-medium leading-relaxed max-w-4xl">
          Rayvaanah is a master Node processing settlement gateway adhering strictly to FATF corporate PEP guidelines. Merchant bank transfers with anomalous risk index scores (&gt;75) are automatically frozen server-side pending dunning and dual-factor escrow clearance validation.
        </p>
      </div>
    </div>
  );
}
