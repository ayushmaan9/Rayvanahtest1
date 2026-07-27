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

import { 
  mockCustomers, 
  mockTransactions, 
  mockInvoices, 
  mockPayouts, 
  mockBeneficiaries, 
  mockApprovalTasks 
} from './data';
import { Customer, Transaction, Invoice, Payout, Beneficiary, ApprovalTask } from './types';

export default function App() {
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

  return (
    <div className="min-h-screen bg-neutral-50/50 flex text-neutral-800 antialiased font-sans">
      {/* Sidebar Navigation Panel */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => handleNavigate(tab)} 
      />

      {/* Main Container scrolled separately */}
      <main className="flex-1 ml-68 p-8 overflow-y-auto h-screen bg-neutral-50/30">
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
  );
}
