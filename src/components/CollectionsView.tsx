import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowLeftRight, 
  Link as LinkIcon, 
  QrCode, 
  Cpu, 
  TrendingUp, 
  Coins, 
  Repeat, 
  CreditCard,
  Building,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle
} from 'lucide-react';
import { Invoice, PaymentLink, QRPayment, Transaction } from '../types';

interface CollectionsViewProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  transactions: Transaction[];
  onAddTransaction: (txn: Transaction) => void;
}

export default function CollectionsView({ 
  invoices, 
  onAddInvoice, 
  transactions, 
  onAddTransaction 
}: CollectionsViewProps) {
  // Pay-In Sub Tabs
  const [subTab, setSubTab] = useState<'dashboard' | 'gateway' | 'links' | 'invoices' | 'upi_qr' | 'rev_intel'>('dashboard');

  // Modal / Form States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Payment Link States
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([
    { id: "plink_01", title: "Acme SaaS Pro annual tier lock", amount: 1200, currency: "USD", url: "https://pay.rayvaan.com/acme/saas-pro", clicks: 128, conversions: 89, created: "2026-06-01", status: "active" },
    { id: "plink_02", title: "Helix Construction Phase 1 retainer", amount: 45000, currency: "USD", url: "https://pay.rayvaan.com/helix/retainer", clicks: 45, conversions: 42, created: "2026-06-03", status: "active" },
    { id: "plink_03", title: "Custom advisory fee setup", amount: 5000, currency: "USD", url: "https://pay.rayvaan.com/consult/deposit", clicks: 12, status: "expired", conversions: 4, created: "2026-05-12" }
  ]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkAmount, setLinkAmount] = useState('');

  // QR and UPI Collections States
  const [qrCollections, setQrCollections] = useState<QRPayment[]>([
    { id: "qr_01", name: "Premium Reception Terminal Desk", upiString: "upi://pay?pa=rayvaan@icici&pn=Rayvaanah&am=10&cu=INR", amountCollected: 23100, scansCount: 1450, created: "2026-01-20", status: "active" },
    { id: "qr_02", name: "DevCon Bangalore main gate spot", upiString: "upi://pay?pa=rayvaan.bangalore@axis&pn=Rayvaanah&am=5&cu=INR", amountCollected: 89000, scansCount: 3120, created: "2026-05-01", status: "active" }
  ]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrName, setQrName] = useState('');

  // Gateway Simulator State
  const [gatewayAmount, setGatewayAmount] = useState('250');
  const [gatewayCard, setGatewayCard] = useState('4111 1111 1111 1111');
  const [gatewayMethod, setGatewayMethod] = useState<'card' | 'net_banking' | 'bnpl'>('card');
  const [gatewayClient, setGatewayClient] = useState('Sarah Jenkins (LuxStay)');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Gateway node idle. Ready to process dynamic card, netbanking, or BNPL transactions."
  ]);
  const [smartRoutingOn, setSmartRoutingOn] = useState(true);

  // Dynamic Route percentages inspired by BridgRoute / Paywize multi-bank routing
  const [iciciShare, setIciciShare] = useState(40);
  const [hdfcShare, setHdfcShare] = useState(30);
  const [axisShare, setAxisShare] = useState(20);
  const [yesShare, setYesShare] = useState(10);

  const handleAutoReoptimize = () => {
    addLog("⚡ Initiating BridgRoute™ multi-bank success-rate audit sequence...");
    setTimeout(() => {
      setIciciShare(45);
      setHdfcShare(35);
      setAxisShare(15);
      setYesShare(5);
      addLog("✅ Optimization SUCCESSFUL (BridgRoute Engine - inspired by bridg.money): YES Bank nodes reported latencies > 140ms. Re-routed 5% to ICICI Bank Node 1 (72ms latency, 99.4% Auth rate) and 5% to HDFC Bank.");
    }, 1000);
  };

  // Failed payment recovery queue
  const failedInvoices = invoices.filter(i => i.status === 'overdue');

  const addLog = (msg: string) => {
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // Dispatch invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount || !dueDate) return;

    const newInvoice: Invoice = {
      id: `inv_${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      customerEmail: customerEmail || 'billing@customer.com',
      amount: parseFloat(amount),
      currency: "USD",
      dueDate,
      status: 'unpaid',
      createdDate: new Date().toISOString().split('T')[0],
      recoveryRetries: 0,
      routingRouteName: smartRoutingOn ? "SF Smart Route Tier A" : "Legacy Static Bank-Pipe"
    };

    onAddInvoice(newInvoice);
    addLog(`Invoiced customer ${customerName} for $${amount} USD.`);
    setCustomerName('');
    setCustomerEmail('');
    setAmount('');
    setDueDate('');
    setShowInvoiceModal(false);
  };

  // Dispatch payment link
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkAmount) return;

    const newLink: PaymentLink = {
      id: `plink_${Math.floor(100000 + Math.random() * 900000)}`,
      title: linkTitle,
      amount: parseFloat(linkAmount),
      currency: "USD",
      url: `https://pay.rayvaan.com/acme/${encodeURIComponent(linkTitle.toLowerCase().replace(/ /g, '-'))}`,
      clicks: 0,
      conversions: 0,
      created: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPaymentLinks([newLink, ...paymentLinks]);
    addLog(`Generated premium Merchant Payment Link: ${newLink.title}`);
    setLinkTitle('');
    setLinkAmount('');
    setShowLinkModal(false);
  };

  // Dispatch QR
  const handleCreateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrName) return;

    const newQR: QRPayment = {
      id: `qr_${Math.floor(100 + Math.random() * 900)}`,
      name: qrName,
      upiString: `upi://pay?pa=rayvaan.${encodeURIComponent(qrName.toLowerCase().replace(/ /g, ''))}@hdfc&pn=Rayvaanah&cu=INR`,
      amountCollected: 0,
      scansCount: 0,
      created: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setQrCollections([newQR, ...qrCollections]);
    addLog(`Provisioned Dinamic UPI QR POS terminal: ${newQR.name}`);
    setQrName('');
    setShowQRModal(false);
  };

  // Simulate Gateway payment
  const handleGatewayPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(gatewayAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    addLog(`Initiating authorization for $${parsedAmt} USD from "${gatewayClient}" via ${gatewayMethod.toUpperCase()}...`);
    
    // Smart routing calculation
    const route = smartRoutingOn 
      ? "Rayvaan Smart-Node (Success Probability 99.4%)" 
      : "Fallback Legacy Core (Success Probability 87%)";

    addLog(`Applying Smart routing optimization: Selected Node -> ${route}`);

    setTimeout(() => {
      const isSucceeded = Math.random() > 0.05; // 5% failure
      if (isSucceeded) {
        // Add transaction
        const newTxn: Transaction = {
          id: `txn_${Math.floor(100000 + Math.random() * 900000)}`,
          amount: parsedAmt,
          currency: "USD",
          status: 'succeeded',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          customerName: gatewayClient,
          method: gatewayMethod,
          methodDetails: gatewayMethod === 'card' 
            ? `Card Visa (Smart-Routed) ending in ${gatewayCard.slice(-4)}` 
            : gatewayMethod === 'bnpl' 
            ? 'BNPL Affirm Split Integration' 
            : 'NetBanking ICICI API Clearer',
          riskScore: Math.floor(Math.random() * 25),
          type: 'payin'
        };

        onAddTransaction(newTxn);
        addLog(`SUCCESS: Transaction authorized. Captured on terminal node. Ref: ${newTxn.id}`);
      } else {
        addLog(`FAILED: Transaction decined by issuer code (CVV match limit or insufficient limits).`);
      }
    }, 800);
  };

  // Trigger Recovery Retry
  const handleTriggerRecovery = (invId: string) => {
    addLog(`Initiating Revenue Intelligence Failed Payment Recovery Protocol on Invoice ${invId}...`);
    addLog(`Attempting smart retry sequence. Smart Retry algorithms checking client card history...`);
    
    setTimeout(() => {
      // simulate success
      addLog(`RECOVERY SUCCESS: Rescued failed pay-in of Invoice ${invId}. Balance settled.`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Platform Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200/50 pb-5 gap-4">
        <div>
          <span className="bg-teal-500/10 text-teal-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Inbound Cash
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5">
            Rayvaanah Escrow Pay-In Engine
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            RBI Nodal Escrow accounts, Virtual Account Numbering (VAN), dynamic UPI QR collections, smart routing, and tri-party escrow holdbacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 bg-neutral-100 px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold select-none">
            <Cpu className={`w-4 h-4 ${smartRoutingOn ? 'text-emerald-500 animate-spin' : 'text-neutral-400'}`} />
            <span className="text-neutral-700">Nodal Escrow Routing:</span>
            <input 
              type="checkbox" 
              checked={smartRoutingOn} 
              onChange={() => setSmartRoutingOn(!smartRoutingOn)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 select-none"
            />
            <span className={`font-bold ${smartRoutingOn ? 'text-emerald-600' : 'text-neutral-500'}`}>
              {smartRoutingOn ? 'ESCROW OPTIMIZED' : 'DIRECT BYPASS'}
            </span>
          </label>
        </div>
      </div>

      {/* Pay-In Sub Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-neutral-200 pb-px">
        {[
          { id: 'dashboard', label: 'Collections Dashboard', icon: TrendingUp },
          { id: 'gateway', label: 'BridgRoute™ PG Orchestrator', icon: CreditCard },
          { id: 'links', label: 'BridgCollect™ PayLinks', icon: LinkIcon },
          { id: 'invoices', label: 'e-Invoicing Control', icon: FileText },
          { id: 'upi_qr', label: 'UPI, AutoPay & QR Systems', icon: QrCode },
          { id: 'rev_intel', label: 'Paywize™ Witty Revenue Intelligence', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                isActive 
                  ? 'border-emerald-600 text-emerald-600 bg-emerald-50/10' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. MERCHANT COLLECTIONS DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Aggregate Pay-In Volume</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-neutral-900">$3,485,900</span>
                <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-1 py-0.5 rounded">+14.2%</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Based on last 30-day processed cohort</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Smart Routing Authorization Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-neutral-900">98.42%</span>
                <span className="text-[10px] text-emerald-500 font-bold bg-neutral-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> ELITE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Directly attributed to gateway optimization</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Collections Pipeline</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-neutral-900">
                  ${invoices.filter(i => i.status === 'unpaid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-600 font-medium font-mono">Uncollected</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Maturity due date within 15 days</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Failed Inbounds Recovered (AI)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-teal-600">$54,200</span>
                <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-1 py-0.5 rounded">Rescued</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Automatic failed payment retry system value</p>
            </div>
          </div>

          {/* Forecast Box & Smart Node Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 tracking-wider uppercase">
                📥 Collection Forecasting (Quant AI Engine)
              </h3>
              <div className="h-48 border border-neutral-100/80 rounded-lg p-4 bg-neutral-50/50 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Confidence Threshold: <b className="text-neutral-900 font-bold">95% Match</b></span>
                  <span>Horizon: <b className="text-neutral-900 font-bold">30 Days Projections</b></span>
                </div>
                <div className="flex items-end justify-between h-28 pt-4 gap-2">
                  {[
                    { day: 'Jun 10', vol: 48, col: 'bg-emerald-600' },
                    { day: 'Jun 15', vol: 62, col: 'bg-emerald-600' },
                    { day: 'Jun 20', vol: 78, col: 'bg-gradient-to-t from-emerald-600 to-teal-400' },
                    { day: 'Jun 25', vol: 51, col: 'bg-emerald-600/60' },
                    { day: 'Jun 30', vol: 110, col: 'bg-gradient-to-t from-emerald-600 to-emerald-400 animate-pulse' },
                    { day: 'Jul 05', vol: 85, col: 'bg-teal-500' }
                  ].map((f, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div className={`w-full ${f.col} rounded-md`} style={{ height: `${f.vol}%` }}></div>
                      <span className="text-[9px] font-mono font-medium text-neutral-400 mt-2 block">{f.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-neutral-500">
                <b>Predictive Alert:</b> subscription clusters on June 30 are expected to surge to **$110k USD**. Autopay routing has been pre-heated on Merchant Bank Node #2 to absorb peak velocity.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-950 p-5 rounded-xl text-neutral-100 space-y-4 shadow-md">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Gateway Optimization Telemetry</h3>
              </div>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Active Merchants Channels</span>
                  <span className="font-mono text-white font-medium">8 active nodes</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Average gateway latency</span>
                  <span className="font-mono text-teal-400 font-bold">124ms (Instant)</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>International routing path</span>
                  <span className="font-mono text-white">Cross-border Multi Currency Swaps enabled</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Interbank settlement speed</span>
                  <span className="font-mono text-emerald-400 font-bold">Real-time T+0 Clearing</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Dynamic Failover Node</span>
                <p className="text-[11px] text-neutral-400 mt-1">
                  SF smart routing gateway is configured to instantly failover from SVB main ledger to Deutsche Bank if latency reaches &gt; 350ms.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Pay-In logs */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Historical Pay-In Ledger (Direct Gateway Collections)</h3>
            </div>
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-400 uppercase tracking-wider text-[9px] font-bold border-b border-neutral-100">
                    <th className="px-4 py-3">Txn Reference</th>
                    <th className="px-4 py-3">Sender Debtor</th>
                    <th className="px-4 py-3">Inbound Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Friction Score</th>
                    <th className="px-4 py-3 text-right">Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {transactions.slice(0, 5).map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3 font-mono font-bold text-neutral-800">{t.id}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900">{t.customerName}</td>
                      <td className="px-4 py-3 text-neutral-500 uppercase font-mono">{t.method} - {t.methodDetails}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider ${
                          t.status === 'succeeded' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-500">{t.riskScore}%</td>
                      <td className="px-4 py-3 text-right font-bold font-mono text-neutral-900">${t.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT GATEWAY NODE */}
      {subTab === 'gateway' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Virtual Terminal (5 cols) */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    Terminal Card Processor
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    LIVE TERMINAL
                  </span>
                </div>

                <form onSubmit={handleGatewayPayment} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block">Choose Pay-In Method</label>
                    <select 
                      value={gatewayMethod} 
                      onChange={(e) => setGatewayMethod(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg outline-hidden font-medium text-neutral-800 focus:border-emerald-500 bg-white"
                    >
                      <option value="card">Card Processing (3D Secure 2.0)</option>
                      <option value="net_banking">Net Banking (ICICI Direct Clearer)</option>
                      <option value="bnpl">BNPL (Paywize Split Integration)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block">Customer Name</label>
                    <input 
                      type="text" 
                      value={gatewayClient}
                      onChange={(e) => setGatewayClient(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-medium outline-hidden focus:border-emerald-500 bg-white"
                    />
                  </div>

                  {gatewayMethod === 'card' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-widest block">Primary Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4111 1111 1111 1111" 
                        value={gatewayCard}
                        onChange={(e) => setGatewayCard(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono focus:border-emerald-500 text-neutral-800 bg-white"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block">Charge Sum (USD)</label>
                    <input 
                      type="number" 
                      value={gatewayAmount}
                      onChange={(e) => setGatewayAmount(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono focus:border-emerald-500 text-neutral-800 bg-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 tracking-wide cursor-pointer transition-colors shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    Authorized Charge Match
                  </button>
                </form>
              </div>

              <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-500 space-y-1 font-medium">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Acquiring Compliance Rails</span>
                <div className="flex flex-wrap gap-2 text-[10px] text-neutral-500 mt-1">
                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[9px] font-mono">PCI-DSS Level 1</span>
                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[9px] font-mono">3DS Secure v2.2</span>
                  <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[9px] font-mono">ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Right: BridgRoute Cockpit (7 cols) */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4 lg:col-span-7">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    BridgRoute™ Multi-Bank Gateway Optimizer
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Configured with real-time success audits (inspired by bridg.money)</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoReoptimize}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Auto Scan & Align
                </button>
              </div>

              {/* Slider Slates */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-neutral-500">Total Assigned Route Weights:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    (iciciShare + hdfcShare + axisShare + yesShare) === 100 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {iciciShare + hdfcShare + axisShare + yesShare}% / 100%
                  </span>
                </div>

                <div className="space-y-2 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/50">
                  {/* ICICI Bank */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-neutral-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        ICICI Bank Multi-Route Node
                      </span>
                      <span className="font-mono text-neutral-900 font-bold">{iciciShare}% weight (72ms latency)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={iciciShare} 
                      onChange={(e) => setIciciShare(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 bg-neutral-200 h-1 rounded-lg cursor-pointer" 
                    />
                  </div>

                  {/* HDFC Bank */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-neutral-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        HDFC Bank Core Gateway
                      </span>
                      <span className="font-mono text-neutral-900 font-bold">{hdfcShare}% weight (95ms latency)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={hdfcShare} 
                      onChange={(e) => setHdfcShare(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 bg-neutral-200 h-1 rounded-lg cursor-pointer" 
                    />
                  </div>

                  {/* Axis Bank */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-neutral-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Axis Bank Routing Node
                      </span>
                      <span className="font-mono text-neutral-900 font-bold">{axisShare}% weight (105ms latency)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={axisShare} 
                      onChange={(e) => setAxisShare(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 bg-neutral-200 h-1 rounded-lg cursor-pointer" 
                    />
                  </div>

                  {/* Yes Bank */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-neutral-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        YES Bank Failover Node
                      </span>
                      <span className="font-mono text-neutral-950 font-bold">{yesShare}% weight (145ms delay)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={yesShare} 
                      onChange={(e) => setYesShare(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 bg-neutral-200 h-1 rounded-lg cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Direct Presets links */}
                <div className="flex gap-2 text-[10px] font-bold">
                  <button 
                    type="button" 
                    onClick={() => { setIciciShare(25); setHdfcShare(25); setAxisShare(25); setYesShare(25); }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Equal Balance Split
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIciciShare(70); setHdfcShare(20); setAxisShare(10); setYesShare(0); }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Priority Node Peak (ICICI 70%)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIciciShare(40); setHdfcShare(30); setAxisShare(20); setYesShare(10); }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-lg text-emerald-800 text-[11px]">
                <span className="font-bold block text-emerald-900">💡 BridgRoute Telemetry Notice</span>
                The engine actively logs API responses and drops nodes when threshold falls below **97%**. YES Bank is locked at 5% due to recurring network latency in Northern corridors.
              </div>
            </div>
            
          </div>

          {/* Operational Console Telemetry Logs below both */}
          <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-900 shadow-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                BridgRoute™ Live Transaction Telemetry Logs
              </h3>
              <span className="font-mono text-[9px] text-neutral-500">Core Router Protocol v4.22</span>
            </div>
            <div className="h-44 font-mono text-[10px] text-zinc-300 space-y-2 overflow-y-auto mt-4 pr-2 select-none">
              {simulationLogs.map((log, index) => (
                <p key={index} className="leading-relaxed border-l-2 border-neutral-800 pl-2">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYMENT LINKS PANEL */}
      {subTab === 'links' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Inbound Merchant Payment Links</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Quickly generate high-converting checkout links to collect payments wire-free</p>
            </div>
            <button 
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Generate Payment Link
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentLinks.map((link) => (
              <div key={link.id} className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-neutral-800 text-xs block truncate max-w-[80%]">{link.title}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      link.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {link.status}
                    </span>
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-950 mt-1">
                    ${link.amount.toLocaleString()} <span className="text-xs text-neutral-400">USD</span>
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={link.url}
                    className="w-full text-[10px] font-mono bg-neutral-50 p-1.5 border border-neutral-100 rounded text-neutral-500 select-all outline-hidden mt-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-center text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Clicks</span>
                    <span className="font-mono text-neutral-900 font-bold">{link.clicks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Conversions</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      {link.clicks ? `${((link.conversions / link.clicks) * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INVOICES & INVOICING */}
      {subTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Invoices Ledger</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Automated B2B invoicing pipeline, structured collections, and scheduled settlements</p>
            </div>
            <button 
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Dispatch Corporate Invoice
            </button>
          </div>

          {/* Table list */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-wider text-[9px] border-b border-neutral-100">
                    <th className="px-5 py-3">Invoice Ref</th>
                    <th className="px-5 py-3">Customer Debtor</th>
                    <th className="px-5 py-3">Distribution Date</th>
                    <th className="px-5 py-3">Maturity Date</th>
                    <th className="px-5 py-3">Smart Routing Path</th>
                    <th className="px-5 py-3">Audit Status</th>
                    <th className="px-5 py-3 text-right">Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-neutral-50/20">
                      <td className="px-5 py-4 font-mono text-neutral-800">{inv.id}</td>
                      <td className="px-5 py-4 font-bold text-neutral-900">{inv.customerName}</td>
                      <td className="px-5 py-4 text-neutral-500 font-mono">{inv.createdDate}</td>
                      <td className="px-5 py-4 text-neutral-500 font-mono">{inv.dueDate}</td>
                      <td className="px-5 py-4 font-mono text-neutral-500">{inv.routingRouteName || 'SF Smart Route Tier A'}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-50 text-emerald-800' :
                          inv.status === 'unpaid' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-neutral-900">${inv.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. UPI / QR PAYMENTS */}
      {subTab === 'upi_qr' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">UPI Collections & QR Terminal Arrays</h3>
              <p className="text-[11px] text-neutral-500">Real-time smartphone scan collectors, instant merchant channels, and UPI AutoPay systems</p>
            </div>
            <button 
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Provision UPI QR Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qrCollections.map((qr) => (
              <div key={qr.id} className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
                {/* Simulated QR Code Visual */}
                <div className="w-32 h-32 flex-none bg-neutral-100 rounded-lg p-2 flex flex-col justify-between items-center border border-neutral-200 shadow-inner">
                  <div className="bg-neutral-900 w-24 h-24 p-2 rounded relative flex items-center justify-center">
                    {/* Retro QR Grid block */}
                    <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-90">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${
                          i % 3 === 0 || i % 5 === 0 ? 'bg-neutral-950' : 'bg-transparent'
                        }`}></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 m-auto w-6 h-6 bg-white border-2 border-neutral-900 text-neutral-900 flex items-center justify-center font-bold text-[8px] rounded-md tracking-widest leading-none">
                      R
                    </div>
                  </div>
                  <span className="text-[8px] font-bold font-mono text-neutral-400 uppercase tracking-widest">{qr.id}</span>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {qr.status} Terminal
                  </span>
                  <h4 className="font-bold text-neutral-900 text-sm leading-tight">{qr.name}</h4>
                  <div className="font-mono text-neutral-400 text-[10px] truncate max-w-[200px]">{qr.upiString}</div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[9px] text-neutral-400 block uppercase">Total Scans</span>
                      <span className="font-mono text-neutral-900 font-bold">{qr.scansCount} scans</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 block uppercase">Inbound Collected</span>
                      <span className="font-mono text-emerald-600 font-bold">₹{qr.amountCollected.toLocaleString()} INR</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* UPI AutoPay Setup & Analytics */}
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200/60 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs select-none">
            <div className="space-y-2">
              <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                UPI AutoPay Infrastructure
              </span>
              <h4 className="font-bold text-neutral-900">Configure UPI Mandate Auto-Deductions</h4>
              <p className="text-neutral-500 leading-relaxed text-[11px]">
                Pre-authorize recurring subscription collections directly from consumer banking accounts over Indian interfaces. Setup smart mandate limits and trial period loops.
              </p>
              <div className="flex gap-4 mt-1 font-mono text-[10px] text-neutral-600">
                <span>✓ NPCI Standard compliant</span>
                <span>✓ Real-time trigger lag &lt; 2s</span>
              </div>
            </div>
            <div className="space-y-3 flex flex-col justify-center">
              <div className="flex justify-between items-center bg-white p-2.5 rounded border border-neutral-200 text-[11px] font-semibold">
                <span className="text-neutral-600">Active AutoPay Mandates</span>
                <span className="font-mono text-neutral-900">4,310 mandates active</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded border border-neutral-200 text-[11px] font-semibold">
                <span className="text-neutral-600">UPI Success Rate Optimization</span>
                <span className="font-mono text-emerald-600">99.1% transaction success</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REVENUE INTELLIGENCE & RECOVERY */}
      {subTab === 'rev_intel' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-neutral-900 text-white p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Revenue Intelligence AI Engine</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
              Our automated models analyze micro-bounces, network settlement queues, and cardholder decline codes to schedule fail-safe payment recovery protocols. Prevent customer churn effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Failed Payment Recovery List */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Dunning Recovery Queue</h4>
                <p className="text-[11px] text-neutral-500 mt-1">Pending failed invoices mapped for automatic dunning retries</p>
              </div>

              {failedInvoices.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  No active invoice payment failures reported today. Revenue rescue secure.
                </div>
              ) : (
                <div className="space-y-3">
                  {failedInvoices.map((inv) => (
                    <div key={inv.id} className="p-3.5 bg-rose-50/50 rounded-lg border border-rose-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold block text-neutral-900 text-xs">{inv.customerName}</span>
                        <span className="font-mono text-rose-700 text-[10px] block mt-0.5">
                          Failed {inv.dueDate} — {inv.recoveryRetries || 1} previous retries
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold font-mono text-xs text-neutral-900">${inv.amount}</span>
                        <button 
                          onClick={() => handleTriggerRecovery(inv.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 rounded text-[10px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                          Rescue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Routing intelligence indicators */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3 text-xs font-semibold">
              <h4 className="text-xs font-bold text-neutral-900 uppercase pb-2 border-b border-neutral-100">
                Gateway Optimization Metrics
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-neutral-500">
                  <span>Routing Strategy</span>
                  <span className="text-neutral-900 font-bold">Dynamic failover multirouting</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Failed retry capture probability</span>
                  <span className="text-emerald-600 font-bold">84% of churn rescued</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Issuer failure decline mapping</span>
                  <span className="text-neutral-900">42 distinct fallback rules active</span>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-teal-800 text-[11px]">
                <span className="font-bold block text-teal-900">💡 Active Revenue Signal</span>
                Routing cards of Japanese origin (e.g. Kyoto Tea Co.) through our Pacific Rim Bridge Node decreases checkout rejection probability by up to **420 bps**.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Generate Modal popup */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-sm text-neutral-950">Dispatch Corporate Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-xs text-neutral-400 font-bold hover:text-neutral-600">✕ Close</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Client Company Name</label>
                <input 
                  type="text" 
                  required 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Customer E-mail</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Sum (USD)</label>
                  <input 
                    type="number" 
                    required 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Due Date</label>
                  <input 
                    type="date" 
                    required 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-neutral-200 p-2 rounded-lg font-mono outline-hidden"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg font-bold">Dispatch Ledger</button>
            </form>
          </div>
        </div>
      )}

      {/* Link Generate Modal popup */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-sm text-neutral-950">Generate Merchant Payment Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-xs text-neutral-400 font-bold">✕ Close</button>
            </div>
            <form onSubmit={handleCreateLink} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Payment Link Title</label>
                <input 
                  type="text" 
                  required 
                  value={linkTitle} 
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Amount (USD)</label>
                <input 
                  type="number" 
                  required 
                  value={linkAmount} 
                  onChange={(e) => setLinkAmount(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-mono"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg font-bold">Produce Dynamic URL</button>
            </form>
          </div>
        </div>
      )}

      {/* QR Generate Modal popup */}
      {showQRModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="font-bold text-sm text-neutral-950">Provision UPI QR POS Spot</h3>
              <button onClick={() => setShowQRModal(false)} className="text-xs text-neutral-400 font-bold">✕ Close</button>
            </div>
            <form onSubmit={handleCreateQR} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Specify Terminal Location/Name</label>
                <input 
                  type="text" 
                  required 
                  value={qrName} 
                  onChange={(e) => setQrName(e.target.value)}
                  className="w-full border border-neutral-200 p-2 rounded-lg font-medium outline-hidden"
                  placeholder="e.g. reception desk main gate"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg font-bold">Bind QR Terminal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
