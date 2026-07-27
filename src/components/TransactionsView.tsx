import React, { useState } from 'react';
import { Search, Filter, PlusCircle, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddMockTransaction: (txn: Transaction) => void;
  onNavigateToCustomer: (id: string) => void;
}

export default function TransactionsView({ transactions, onAddMockTransaction, onNavigateToCustomer }: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'card' | 'bank' | 'apple_pay' | 'google_pay'>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                          t.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          t.methodDetails.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || t.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleSimulatePayment = () => {
    // Generate a randomized Indian payment simulation
    const mockCusList = [
      { id: "cus_01HM9ZX2W", name: "Zepto Quick Commerce" },
      { id: "cus_01HM9ZX4K", name: "Swiggy Gourmet Partners" },
      { id: "cus_01HM9ZX5M", name: "Meesho Social Sellers" },
      { id: "cus_01HM9ZX7P", name: "Nykaa Beauty & Fashion" },
      { id: "cus_01HM9ZXBB", name: "Unacademy EdTech" }
    ];
    
    const randomCus = mockCusList[Math.floor(Math.random() * mockCusList.length)];
    const amounts = [499, 1499, 4850, 18900, 125000];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const methods: ('card' | 'bank' | 'apple_pay')[] = ['card', 'bank', 'apple_pay'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const status_options: ('succeeded' | 'failed')[] = ['succeeded', 'succeeded', 'succeeded', 'failed'];
    const status = status_options[Math.floor(Math.random() * status_options.length)];
    const riskScore = Math.floor(Math.random() * 95);

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const vpaHandles = ['@okaxis', '@okhdfcbank', '@icici', '@ybl', '@sbi'];
    const randomVPA = `${randomCus.name.toLowerCase().split(' ')[0]}${vpaHandles[Math.floor(Math.random()*vpaHandles.length)]}`;

    const newTxn: Transaction = {
      id: `txn_in_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      amount,
      currency: "INR",
      status,
      date: dateStr,
      customerId: randomCus.id,
      customerName: randomCus.name,
      method,
      methodDetails: method === 'card' ? 'RuPay Platinum ending *' + Math.floor(Math.random() * 8999 + 1000) : 
                     method === 'bank' ? 'HDFC NetBanking (Corporate)' : `UPI Payee: ${randomVPA}`,
      riskScore
    };

    onAddMockTransaction(newTxn);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Financial Ledger Audit</h2>
          <p className="text-xs text-neutral-500 mt-1">Direct terminal query on active transaction processing nodes</p>
        </div>
        <button 
          onClick={handleSimulatePayment}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Simulate Sandbox Payment
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by txn hash, customer, details..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 hover:border-neutral-300 focus:border-emerald-500 rounded-lg outline-hidden text-neutral-800 transition-all font-medium"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-lg text-xs font-semibold text-neutral-600 max-w-full overflow-x-auto">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${statusFilter === 'all' ? 'bg-white text-neutral-900 shadow-3xs' : 'hover:text-neutral-950'}`}
            >
              All Status
            </button>
            <button 
              onClick={() => setStatusFilter('succeeded')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${statusFilter === 'succeeded' ? 'bg-white text-emerald-600 shadow-3xs' : 'hover:text-emerald-700'}`}
            >
              Succeeded
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${statusFilter === 'pending' ? 'bg-white text-amber-600 shadow-3xs' : 'hover:text-amber-700'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${statusFilter === 'failed' ? 'bg-white text-rose-600 shadow-3xs' : 'hover:text-rose-700'}`}
            >
              Failed
            </button>
          </div>

          {/* Method Filter */}
          <select 
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
            className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs py-1.5 px-3 rounded-lg outline-hidden hover:border-neutral-300 focus:border-emerald-500 font-semibold"
          >
            <option value="all">All Channels</option>
            <option value="card">Card Authorizations</option>
            <option value="bank">ACH / SEPA Escrow</option>
            <option value="apple_pay">Apple Pay Wallet</option>
            <option value="google_pay">Google Pay Hub</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/70 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                <th className="px-5 py-3 font-medium">Txn Hash</th>
                <th className="px-5 py-3 font-medium">Customer Account</th>
                <th className="px-5 py-3 font-medium">Verification Method</th>
                <th className="px-5 py-3 font-medium">Auth Date</th>
                <th className="px-5 py-3 font-medium text-center">Threat Rating</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-neutral-400 font-semibold">
                    <p>No transactions match the selected filters.</p>
                    <p className="text-[11px] text-neutral-400 font-normal mt-1">Try resetting the status/channel filter or simulate a mock txn.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-neutral-900">{txn.id}</td>
                    <td className="px-5 py-4">
                      {txn.customerId ? (
                        <button
                          onClick={() => onNavigateToCustomer(txn.customerId!)}
                          className="font-medium text-neutral-900 hover:text-emerald-600 transition-colors flex items-center gap-1 font-mono text-[11px]"
                        >
                          {txn.customerName}
                        </button>
                      ) : (
                        <span className="text-neutral-500 italic text-[11px]">{txn.customerName}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-500 font-medium">{txn.methodDetails}</td>
                    <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">{txn.date}</td>
                    <td className="px-5 py-4 text-center font-semibold text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full inline-block font-mono ${
                        txn.riskScore > 60 ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100' :
                        txn.riskScore > 30 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {txn.riskScore}/100
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        txn.status === 'succeeded' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        txn.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {txn.status === 'succeeded' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                         txn.status === 'pending' ? <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" /> : 
                         <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        <span className="capitalize">{txn.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold font-mono text-neutral-950">
                      <span className={txn.status === 'failed' ? 'text-rose-500 line-through' : ''}>
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
