import React, { useState } from 'react';
import { 
  Wallet, 
  Percent, 
  TrendingUp, 
  Compass, 
  Globe, 
  Info, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  AreaChart, 
  Zap,
  Sparkles,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { mockTreasuryBalances } from '../data';

export default function TreasuryView() {
  const [balances, setBalances] = useState(mockTreasuryBalances);
  const [transferFrom, setTransferFrom] = useState('USD');
  const [transferTo, setTransferTo] = useState('EUR');
  const [transferAmount, setTransferAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Connected corporate banking simulation inspired by BridgConnect / Paywize Linked banking
  const [bankingBalances, setBankingBalances] = useState({
    icici: 4250000,
    hdfc: 2890000,
    yes: 1210000,
    axis: 800000
  });
  const [isSyncingBanks, setIsSyncingBanks] = useState(false);
  const [bankSyncLog, setBankSyncLog] = useState("");

  const handleBankSync = () => {
    setIsSyncingBanks(true);
    setBankSyncLog("Connecting to corporate API vaults at ICICI, HDFC, YES, and Axis Bank...");
    setTimeout(() => {
      setBankingBalances(prev => ({
        icici: prev.icici + Math.floor(1000 + Math.random() * 5000),
        hdfc: prev.hdfc + Math.floor(2000 + Math.random() * 4000),
        yes: prev.yes + Math.floor(500 + Math.random() * 2000),
        axis: prev.axis + Math.floor(1000 + Math.random() * 3000)
      }));
      setIsSyncingBanks(false);
      setBankSyncLog("✅ Reconciled! Synced live node ledger pools and matched 18 inbound UPI collection items.");
    }, 1200);
  };

  const totalUSDValue = balances.reduce((acc, bal) => {
    const rates: {[key: string]: number} = { USD: 1, EUR: 1.08, GBP: 1.25, AED: 0.27 };
    return acc + (bal.amount * (rates[bal.currency] || 1));
  }, 0);

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    const sourceBal = balances.find(b => b.currency === transferFrom);
    if (!sourceBal || sourceBal.amount < amount) {
      alert("⚠️ Insufficient working capital balance in source reserve nodes!");
      return;
    }

    setIsSwapping(true);
    setFeedback(`Quoting spot rate swap of ${amount} ${transferFrom} into ${transferTo}...`);

    setTimeout(() => {
      // Conversion mock
      const ratesToUSD: {[key: string]: number} = { USD: 1, EUR: 1.08, GBP: 1.25, AED: 0.27 };
      let inUSD = amount * ratesToUSD[transferFrom];
      let finalAmt = inUSD / ratesToUSD[transferTo];

      setBalances(prev => prev.map(b => {
        if (b.currency === transferFrom) {
          return { ...b, amount: b.amount - amount };
        }
        if (b.currency === transferTo) {
          return { ...b, amount: b.amount + finalAmt };
        }
        return b;
      }));

      setIsSwapping(false);
      setTransferAmount('');
      setFeedback(`✅ Swap complete. Transferred ${amount} ${transferFrom} into ${finalAmt.toFixed(2)} ${transferTo} instantly at spot price.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
            Liquidity Infrastructure
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5">
            Financial Treasury Workspace
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Maximize interest yield, execute real-time multi-currency swaps, and analyze liquid working capital reserves.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-lg border border-emerald-100 font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          Reserves Insured up to ₹10,00,00,000 (DICGC & RBI Custody)
        </div>
      </div>

      {/* Aggregate Balance Panel */}
      <div className="bg-neutral-950 p-6 rounded-2xl text-white shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-neutral-900">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">COMPOSITE LIQUID TREASURY VALUE (INR ₹)</span>
          <h3 className="text-3xl font-bold font-mono tracking-tight text-white mt-1.5">
            ₹{(totalUSDValue * 83.5).toLocaleString('en-IN', {maximumFractionDigits: 0})}
          </h3>
          <p className="text-xs text-neutral-400 font-sans pt-1">
            Allocated across 4 high-yield active multi-currency custodian nodes (INR, USD, EUR, AED)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-800 flex-1 lg:flex-initial">
            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider block">Weighted Interest Rate</span>
            <p className="text-lg font-bold mt-1 text-white font-mono">6.85% APY</p>
          </div>
          <div className="bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-800 flex-1 lg:flex-initial">
            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider block">MTD Yield Harvested</span>
            <p className="text-lg font-bold mt-1 text-emerald-400 font-mono">₹18,28,650.00</p>
          </div>
          <div className="bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-800 flex-1 lg:flex-initial">
            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider block">Treasury Health Score</span>
            <p className="text-lg font-bold mt-1 text-teal-400 font-mono">99.2% EXCELLENT</p>
          </div>
        </div>
      </div>

      {/* Sub-Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {balances.map((bal) => (
          <div key={bal.currency} className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-700 font-mono">
                  {bal.currency === 'INR' ? '₹' : bal.currency === 'USD' ? '$' : bal.currency === 'EUR' ? '€' : 'د.إ'}
                </div>
                <span className="font-bold text-neutral-950 text-sm">{bal.currency} Reserve</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 font-mono">
                {bal.rate}% APY
              </span>
            </div>
            <div className="mt-5">
              <h4 className="text-2xl font-bold text-neutral-950 font-mono tracking-tight">
                {bal.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
              </h4>
              <p className="text-[10px] text-neutral-400 font-medium mt-1">Accumulated interest: ₹{bal.yieldEarned.toLocaleString('en-IN')} MTD</p>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time multi-currency Swap Workbench & Cashflow forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic spot rates swapper */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <h3 className="font-bold font-sans text-xs uppercase text-neutral-950 tracking-wider flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
              Dynamic Currency Swap Workbench
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono">
              REAL-TIME QUOTES
            </span>
          </div>

          {feedback && (
            <div className="p-2.5 bg-neutral-50 rounded text-[11px] font-mono font-semibold border border-neutral-200/50 text-neutral-700">
              {feedback}
            </div>
          )}

          <form onSubmit={handleSwap} className="space-y-4 text-xs font-semibold text-neutral-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Transfer From Reserve</label>
                <select 
                  value={transferFrom} 
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden font-medium text-neutral-800"
                >
                  {balances.map(b => (
                    <option key={b.currency} value={b.currency}>{b.currency} Balance (${b.amount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block">Transfer To Reserve</label>
                <select 
                  value={transferTo} 
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden font-medium text-neutral-800"
                >
                  {balances.filter(b => b.currency !== transferFrom).map(b => (
                    <option key={b.currency} value={b.currency}>{b.currency} Balance</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">Swap Amount</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 10000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded-lg font-mono"
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  disabled={isSwapping}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin' : ''}`} />
                  {isSwapping ? "Executing Swap..." : "Execute Instant Swap"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 🏦 BridgConnect / Paywize Connected Banking Dashboard */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">Connected Banking Hub</span>
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  BridgConnect™ corporate links
                </h4>
              </div>
              <button
                onClick={handleBankSync}
                disabled={isSyncingBanks}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all select-none cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingBanks ? 'animate-spin' : ''}`} />
                {isSyncingBanks ? "Syncing API APIs..." : "Sync Live Vault Channels"}
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold mt-2.5">
              Securely connected via corporate open banking rails. Check actual INR reserves, push bulk payroll transactions, and coordinate multi-node treasury reconciliations.
            </p>

            {/* Live Bank Links Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 bg-neutral-50 hover:bg-neutral-100/50 rounded-lg border border-neutral-200/60 transition-colors">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                  <span>HDFC Bank</span>
                  <span className="text-emerald-600">Live API</span>
                </div>
                <div className="text-sm font-bold font-mono text-neutral-950 mt-1">₹{bankingBalances.hdfc.toLocaleString()}</div>
                <div className="text-[9px] text-neutral-400 font-mono mt-0.5">xxxx0812 • 9ms ping</div>
              </div>

              <div className="p-3 bg-neutral-50 hover:bg-neutral-100/50 rounded-lg border border-neutral-200/60 transition-colors">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                  <span>ICICI CIB</span>
                  <span className="text-emerald-700">Live API</span>
                </div>
                <div className="text-sm font-bold font-mono text-neutral-950 mt-1">₹{bankingBalances.icici.toLocaleString()}</div>
                <div className="text-[9px] text-neutral-400 font-mono mt-0.5">xxxx2104 • 7ms ping</div>
              </div>

              <div className="p-3 bg-neutral-50 hover:bg-neutral-100/50 rounded-lg border border-neutral-200/60 transition-colors">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                  <span>YES Corporate</span>
                  <span className="text-emerald-600">Live API</span>
                </div>
                <div className="text-sm font-bold font-mono text-neutral-950 mt-1">₹{bankingBalances.yes.toLocaleString()}</div>
                <div className="text-[9px] text-neutral-400 font-mono mt-0.5">xxxx9038 • 12ms ping</div>
              </div>

              <div className="p-3 bg-neutral-50 hover:bg-neutral-100/50 rounded-lg border border-neutral-200/60 transition-colors">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                  <span>Axis Treasury</span>
                  <span className="text-amber-600">PRE-HEAT</span>
                </div>
                <div className="text-sm font-bold font-mono text-neutral-950 mt-1">₹{bankingBalances.axis.toLocaleString()}</div>
                <div className="text-[9px] text-neutral-400 font-mono mt-0.5">xxxx4839 • 15ms ping</div>
              </div>
            </div>
          </div>

          {bankSyncLog ? (
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100/80 text-[10px] font-mono font-medium text-emerald-800 animate-fade-in animate-duration-300">
              {bankSyncLog}
            </div>
          ) : (
            <div className="p-2.5 bg-neutral-50/50 rounded-lg border border-neutral-100 text-[10px] text-neutral-400 leading-snug font-medium">
              💡 <b>Paywize Reconciliation Rule:</b> auto-reconcile dynamic collections ledger hourly to balance UPI soundbox and receipt nodes in Bangalore channels.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
