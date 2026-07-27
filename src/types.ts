export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  joinedDate: string;
  revenue: number; // LTV
  mrr: number; // Monthly recurring revenue
  healthScore: number; // 0-100
  healthStatus: 'good' | 'average' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
  riskDetails?: string;
  logoColor: string;
  status: 'active' | 'churned' | 'inactive';
  country: string;
  tags: string[];
  description: string;
  phone: string;
  billingAddress: string;
  npsScore: number;
  lastActive: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'payment' | 'email' | 'subscription' | 'risk' | 'system';
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: string;
  customerId?: string;
  customerName: string;
  method: 'card' | 'bank' | 'apple_pay' | 'google_pay' | 'upi' | 'net_banking' | 'bnpl';
  methodDetails: string;
  riskScore: number; // 0-100
  type?: 'payin' | 'payout'; // Added to distinguish in unified histories
  paymentLink?: string;
}

export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryType: 'vendor' | 'customer' | 'employee';
  method: 'upi' | 'imps' | 'neft' | 'rtgs' | 'bank_transfer' | 'wallet' | 'international_wire' | 'virtual_account' | 'escrow';
  sourceAccount: string;
  approvalStatus: 'maker_pending' | 'checker_pending' | 'approved' | 'rejected' | 'none';
  riskScore: number; // 0-100
  processingTimeMs: number;
  industryCategory?: 'marketplace' | 'real_estate' | 'education' | 'enterprise';
  scheduledDate?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  type: 'vendor' | 'customer' | 'employee';
  accountNumber: string;
  bankName: string;
  ifsc: string;
  upiId: string;
  verified: boolean;
  bankVerified: boolean;
  upiVerified: boolean;
  pennyDropVerified: boolean;
  riskScore: number; // 0-100
  email: string;
  joined: string;
  industryGroup?: string;
}

export interface ApprovalTask {
  id: string;
  payoutId?: string;
  amount: number;
  currency: string;
  beneficiaryName: string;
  requestedBy: string;
  requestedDate: string;
  level: number; // e.g. Level 1 Finance, Level 2 CFO
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  type: 'single' | 'bulk' | 'escrow_release' | 'split_settlement';
}

export interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  url: string;
  status: 'active' | 'expired';
  clicks: number;
  conversions: number;
  created: string;
}

export interface QRPayment {
  id: string;
  name: string;
  upiString: string;
  amountCollected: number;
  scansCount: number;
  created: string;
  status: 'active' | 'inactive';
}

export interface Settlement {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'scheduled' | 'failed';
  targetAccount: string;
  cohortRef: string;
}

export interface TreasuryBalance {
  currency: string;
  amount: number;
  rate: number; // APY / Interest
  yieldEarned: number;
  projectedInflow: number;
  projectedOutflow: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planName: string;
  amount: number;
  interval: 'month' | 'year';
  status: 'active' | 'past_due' | 'canceled';
  startDate: string;
  nextBilling: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  createdDate: string;
  recoveryRetries?: number;
  routingRouteName?: string;
}

export interface FraudRule {
  id: string;
  name: string;
  action: 'block' | 'review' | 'allow';
  matchingCriteria: string;
  hits: number;
  isActive: boolean;
}

export interface DeveloperApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  isActive: boolean;
  scope: 'read_only' | 'full_access';
}

export interface ModulePermission {
  moduleName: string;
  admin: boolean;
  maker: boolean;
  checker: boolean;
  viewer: boolean;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  activeDate: string;
  status: boolean;
  dataAccessDuration: string;
  permissions: ModulePermission[];
  roleDescription: string;
}

