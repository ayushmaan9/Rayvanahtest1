import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  PieChart, 
  Cpu, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Layers,
  ArrowBigUpDash
} from 'lucide-react';

export default function AnalyticsView() {
  const [metricTimeline, setMetricTimeline] = useState<'30_days' | '90_days'>('30_days');

  // Multi-platform unified metrics
  const cohortMetrics = [
    { segment: "UPI AutoPay & Dynamic QR", vol: "₹1.85 Cr", share: 55, trend: "+12.4%", color: "bg-emerald-500" },
    { segment: "RuPay & NetBanking Direct", vol: "₹85.0 L", share: 25, trend: "+18.2%", color: "bg-teal-400" },
    { segment: "BBPS & Bill Pay Channels", vol: "₹51.0 L", share: 15, trend: "+24.5%", color: "bg-indigo-500" },
    { segment: "Cross-border Inward Swift", vol: "₹17.1 L", share: 5, trend: "+2.1%", color: "bg-purple-500" }
  ];

  const hourlyFlowData = [
    { label: "00:00", volume: 45, latency: 120 },
    { label: "04:00", volume: 60, latency: 110 },
    { label: "08:00", volume: 92, latency: 125 },
    { label: "12:00", volume: 115, latency: 135 },
    { label: "16:00", volume: 80, latency: 115 },
    { label: "20:00", volume: 55, latency: 98 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/50 pb-5">
        <div>
          <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Intelligence Center
          </span>
          <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight mt-1.5 matches">
            System Analytics Engine
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time aggregate checkout conversions, interbank clearing telemetry, and inbound/outbound flow predictions.
          </p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200">
          <button 
            onClick={() => setMetricTimeline('30_days')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              metricTimeline === '30_days' ? 'bg-white text-neutral-900 shadow-3xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            30 Days Horizon
          </button>
          <button 
            onClick={() => setMetricTimeline('90_days')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              metricTimeline === '90_days' ? 'bg-white text-neutral-900 shadow-3xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            90 Days Horizon
          </button>
        </div>
      </div>

      {/* Aggregate Volume KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Gross System Velocity (LTV)</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-mono mt-1">₹28,85,90,000.00</h3>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">↑ 14.82% processed vs last cohort</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-5 h-5 shrink-0" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Average Gateway Latency</span>
            <h3 className="text-2xl font-bold text-neutral-900 font-mono mt-1">118ms</h3>
            <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded">ELITE NPCI NODE NETWORK</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
            <Cpu className="w-5 h-5 shrink-0" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Failed payment rescue value (Rescue)</span>
            <h3 className="text-2xl font-bold text-indigo-600 font-mono mt-1">₹45,20,000.00</h3>
            <span className="text-[10px] text-neutral-400">Churn recovery engine output (Dunning)</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion share and segments */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase">Inbound Revenue Origin Channels</h3>
          
          <div className="space-y-4">
            {cohortMetrics.map((met, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-neutral-800 font-semibold">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${met.color}`}></span>
                    {met.segment}
                  </span>
                  <span className="font-mono text-neutral-950 font-bold">{met.vol} ({met.share}%)</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${met.color}`} style={{ width: `${met.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly node throughput & latencies */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase">Hourly Interbank Gateway Latencies</h3>
          
          <div className="flex items-end justify-between h-52 pt-4 gap-2.5">
            {hourlyFlowData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-[9px] font-mono font-bold text-neutral-400 flex items-center mb-1">
                  {d.latency}ms
                </span>
                <div className="w-full bg-gradient-to-t from-emerald-500/10 to-teal-400 rounded-md" style={{ height: `${(d.latency/140)*100}%` }}></div>
                <span className="text-[10px] font-bold text-neutral-500 mt-2 block">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
