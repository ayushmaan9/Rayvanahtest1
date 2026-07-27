import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import SettlementsView from './components/SettlementsView';
import TreasuryView from './components/TreasuryView';
import SubscriptionsView from './components/SubscriptionsView';
import CollectionsView from './components/CollectionsView';
import RiskFraudView from './components/RiskFraudView';
import DevelopersView from './components/DevelopersView';
import CRMView from './components/CRMView';

// Newly created state-of-the-art views
import PayoutsView from './components/PayoutsView';
import ComplianceView from './components/ComplianceView';
import AnalyticsView from './components/AnalyticsView';
import AICopilotView from './components/AICopilotView';
import SettingsView from './components/SettingsView';
import UserModuleView from './components/UserModuleView';

// Onboarding & Entry Flow Components
import LandingPage from './components/onboarding/LandingPage';
import AuthPage from './components/onboarding/AuthPage';
import SelfOnboardingWizard from './components/onboarding/SelfOnboardingWizard';
import MerchantStatusTracker from './components/onboarding/MerchantStatusTracker';
import AdminComplianceDashboard from './components/onboarding/AdminComplianceDashboard';

import { 
  mockCustomers, 
  mockTransactions, 
  mockInvoices, 
  mockPayouts, 
  mockBeneficiaries, 
  mockApprovalTasks 
} from './data';
import { Customer, Transaction, Invoice, Payout, Beneficiary, ApprovalTask } from './types';
import { Globe, ShieldCheck, Scale, Sparkles, UserCheck, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function App() {
  // Navigation Flow State
  const [entryMode, setEntryMode] = useState<'landing' | 'login' | 'signup' | 'wizard' | 'tracker' | 'admin_compliance' | 'workspace'>('landing');

  // Workspace Tab State
  const [currentTab, setCurrentTab] = useState('collections');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Payout Platform States
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);
  const [approvalTasks, setApprovalTasks] = useState<ApprovalTask[]>(mockApprovalTasks);

  // Dynamic Routing Handler
  const handleNavigate = (tab: string, arg?: string) => {
    if (tab === 'crm_detail' && arg) {
      setCurrentTab('customers');
      setSelectedCustomerId(arg);
    } else {
      setCurrentTab(tab);
      setSelectedCustomerId(null);
    }
  };

  // State Updates - Update Customer Profiles
  const handleUpdateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedFields } as Customer : c)
    );
  };

  // State Updates - Simulate payment and recalculate CRM LTV total
  const handleAddMockTransaction = (newTxn: Transaction) => {
    setTransactions(prev => [newTxn, ...prev]);

    // If transaction associated with a customer succeeded, increase their total revenue
    if (newTxn.customerId && newTxn.status === 'succeeded') {
      setCustomers(prev => 
        prev.map(c => c.id === newTxn.customerId ? { ...c, revenue: c.revenue + newTxn.amount } : c)
      );
    }
  };

  // State Updates - Refund transaction and decrease LTV
  const handleRefundTransaction = (txnId: string) => {
    setTransactions(prev => 
      prev.map(t => {
        if (t.id === txnId) {
          return { ...t, status: 'failed', methodDetails: `${t.methodDetails} (REFUNDED)` } as Transaction;
        }
        return t;
      })
    );

    // Find the refunded txn amount
    const targetTxn = transactions.find(t => t.id === txnId);
    if (targetTxn && targetTxn.customerId) {
      setCustomers(prev => 
        prev.map(c => {
          if (c.id === targetTxn.customerId) {
            const adjustedRev = Math.max(0, c.revenue - targetTxn.amount);
            return { ...c, revenue: adjustedRev } as Customer;
          }
          return c;
        })
      );
    }
  };

  // State Updates - Add corporate Invoice
  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  // State Updates - Add custom Payout
  const handleAddPayout = (newPayout: Payout) => {
    setPayouts(prev => [newPayout, ...prev]);

    // If payout requires Maker Checker approvals, auto-append task to Approval Queue
    if (newPayout.status === 'pending' && newPayout.approvalStatus === 'checker_pending') {
      const newTask: ApprovalTask = {
        id: `task_dyn_${Math.floor(100 + Math.random() * 900)}`,
        payoutId: newPayout.id,
        amount: newPayout.amount,
        currency: newPayout.currency,
        beneficiaryName: newPayout.beneficiaryName,
        requestedBy: "j.drake@acme.com (Maker)",
        requestedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        level: 2,
        status: "pending",
        notes: "Authorized B2B disbursement node transfer triggered via outbound compiler.",
        type: "single"
      };
      setApprovalTasks(prev => [newTask, ...prev]);
    }
  };

  // State Updates - Add custom Beneficiary contact
  const handleAddBeneficiary = (newBene: Beneficiary) => {
    setBeneficiaries(prev => [newBene, ...prev]);
  };

  // State Updates - Resolve Maker Checker Task and flip Payout state to paid
  const handleUpdateApprovalAction = (taskId: string, status: 'approved' | 'rejected') => {
    setApprovalTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, status } : t)
    );

    const task = approvalTasks.find(t => t.id === taskId);
    if (task && task.payoutId) {
      setPayouts(prev => 
        prev.map(p => {
          if (p.id === task.payoutId) {
            return { 
              ...p, 
              status: status === 'approved' ? 'paid' : 'failed', 
              approvalStatus: status === 'approved' ? 'approved' : 'rejected',
              processingTimeMs: status === 'approved' ? Math.floor(120 + Math.random() * 500) : 0
            };
          }
          return p;
        })
      );
    }
  };

  // VIEW ROUTER: LANDING PAGE
  if (entryMode === 'landing') {
    return (
      <LandingPage 
        onLoginClick={() => setEntryMode('login')}
        onCreateAccountClick={() => setEntryMode('signup')}
        onOpenAppDirectly={() => setEntryMode('workspace')}
        onOpenAdminCompliance={() => setEntryMode('admin_compliance')}
      />
    );
  }

  // VIEW ROUTER: AUTHENTICATION PAGE (LOGIN / SIGNUP / OTPs)
  if (entryMode === 'login' || entryMode === 'signup') {
    return (
      <AuthPage 
        initialMode={entryMode === 'login' ? 'login' : 'signup'}
        onAuthComplete={() => setEntryMode('wizard')}
        onBackToLanding={() => setEntryMode('landing')}
      />
    );
  }

  // VIEW ROUTER: SELF ONBOARDING WIZARD (STEPS 1 - 9)
  if (entryMode === 'wizard') {
    return (
      <SelfOnboardingWizard 
        onCompleteAndLaunchWorkspace={() => setEntryMode('workspace')}
        onOpenStatusTracker={() => setEntryMode('tracker')}
      />
    );
  }

  // VIEW ROUTER: MERCHANT STATUS TRACKER
  if (entryMode === 'tracker') {
    return (
      <MerchantStatusTracker 
        onBackToWizard={() => setEntryMode('wizard')}
        onLaunchWorkspace={() => setEntryMode('workspace')}
      />
    );
  }

  // VIEW ROUTER: ADMIN COMPLIANCE REVIEW DASHBOARD
  if (entryMode === 'admin_compliance') {
    return (
      <AdminComplianceDashboard 
        onBackToApp={() => setEntryMode('workspace')}
      />
    );
  }

  // VIEW ROUTER: MAIN WORKSPACE (FULL RAYVAANAH ESCROW OS)
  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col text-neutral-800 antialiased font-sans">
      
      {/* Top Experience Navigation Switcher Banner */}
      <div className="bg-slate-950 text-slate-200 px-6 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs font-sans">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-extrabold text-white tracking-tight">Rayvaanah Merchant OS</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-emerald-400 font-medium">RBI PA/PG Escrow Nodal Infrastructure Active</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setEntryMode('landing')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Landing Page</span>
          </button>

          <button 
            onClick={() => setEntryMode('login')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
          >
            <UserCheck className="w-3 h-3 text-teal-400" />
            <span>Auth Flow</span>
          </button>

          <button 
            onClick={() => setEntryMode('wizard')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Onboarding Wizard</span>
          </button>

          <button 
            onClick={() => setEntryMode('admin_compliance')}
            className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
          >
            <Scale className="w-3 h-3 text-amber-400" />
            <span>Compliance Admin Queue</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex text-neutral-800 relative">
        {/* Sidebar Navigation Panel */}
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={(tab) => handleNavigate(tab)} 
        />

        {/* Main Container scrolled separately */}
        <main className="flex-1 ml-68 p-8 overflow-y-auto h-[calc(100vh-41px)] bg-neutral-50/30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* TAB DETECTOR ROUTER */}
            {currentTab === 'collections' && (
              <CollectionsView 
                invoices={invoices} 
                onAddInvoice={handleAddInvoice} 
                transactions={transactions}
                onAddTransaction={handleAddMockTransaction}
              />
            )}

            {currentTab === 'payouts' && (
              <PayoutsView 
                payouts={payouts}
                onAddPayout={handleAddPayout}
                beneficiaries={beneficiaries}
                onAddBeneficiary={handleAddBeneficiary}
                approvalTasks={approvalTasks}
                onUpdateApprovalAction={handleUpdateApprovalAction}
              />
            )}

            {currentTab === 'treasury' && (
              <TreasuryView />
            )}

            {currentTab === 'customers' && (
              <CRMView 
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={setSelectedCustomerId}
                onUpdateCustomer={handleUpdateCustomer}
                transactions={transactions}
                onRefundTransaction={handleRefundTransaction}
              />
            )}

            {currentTab === 'risk' && (
              <RiskFraudView />
            )}

            {currentTab === 'compliance' && (
              <ComplianceView />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView />
            )}

            {currentTab === 'copilot' && (
              <AICopilotView />
            )}

            {currentTab === 'developers' && (
              <DevelopersView />
            )}

            {currentTab === 'settings' && (
              <SettingsView />
            )}

            {currentTab === 'users' && (
              <UserModuleView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

