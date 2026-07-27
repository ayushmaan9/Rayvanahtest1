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

// ==========================================
// ONBOARDING & COMPLIANCE TYPES
// ==========================================

export interface MerchantDirector {
  id: string;
  fullName: string;
  designation: string;
  din: string;
  pan: string;
  aadhaar: string;
  email: string;
  mobile: string;
  address: string;
  nationality: string;
  shareholdingPct: number;
  panDocUrl?: string;
  aadhaarDocUrl?: string;
  photoUrl?: string;
  isKycVerified: boolean;
}

export interface MerchantDoc {
  id: string;
  docType: 'gst_certificate' | 'corporate_pan' | 'coi' | 'moa' | 'aoa' | 'cancelled_cheque' | 'bank_statement' | 'office_photos' | 'utility_bill' | 'additional_license';
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected' | 'ocr_extracted';
  ocrData?: {
    legalName?: string;
    panOrGst?: string;
    issueDate?: string;
    addressMatch?: boolean;
    extractedTextSnippet?: string;
  };
  rejectionReason?: string;
}

export interface WebsiteAuditResult {
  isHttps: boolean;
  sslValid: boolean;
  dnsResolved: boolean;
  domainAgeYears: number;
  isAccessible: boolean;
  isMobileFriendly: boolean;
  businessNameMatch: boolean;
  contactMatch: boolean;
  policyPrivacy: boolean;
  policyRefund: boolean;
  policyTerms: boolean;
  policyShipping: boolean;
  overallHealthScore: number; // 0-100
}

export interface BankVerificationResult {
  bankName: string;
  branch: string;
  ifsc: string;
  accountNumber: string;
  beneficiaryName: string;
  upiId?: string;
  pennyDropStatus: 'verified' | 'pending' | 'failed';
  pennyDropTxnId: string;
  pennyDropAmount: number;
  nameMatchScore: number; // e.g. 98.4%
  isVerified: boolean;
}

export interface AIPreScreenResult {
  readinessScore: number; // 0-100
  commercialFitScore: number; // 0-100
  riskLevel: 'green' | 'amber' | 'red';
  legitimacyScore: number;
  policyCompletenessScore: number;
  restrictedProductsDetected: boolean;
  restrictedKeywordsFound: string[];
  missingDocs: string[];
  fraudIndicators: string[];
  recommendations: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string; // e.g. "Compliance Officer R. Sharma" or "AI System Pre-Screen"
  action: string;
  notes: string;
  statusTag?: string;
}

export interface MerchantApplication {
  id: string;
  referenceId: string;
  merchantId?: string;
  currentStep: number; // 1-9
  status: 'draft' | 'submitted' | 'under_review' | 'kyb_pending' | 'compliance_review' | 'risk_assessment' | 'deficiency_raised' | 'approved' | 'rejected';
  
  // Step 1: Business Profile
  legalBusinessName: string;
  tradeName: string;
  entityType: 'private_limited' | 'llp' | 'sole_proprietorship' | 'public_limited' | 'partnership';
  category: string;
  subCategory: string;
  mcc: string;
  description: string;
  dateOfIncorporation: string;
  gstNumber: string;
  panNumber: string;
  cin: string;
  officialEmail: string;
  supportEmail: string;
  supportPhone: string;
  registeredAddress: string;
  operatingAddress: string;

  // Step 2: Operations
  monthlyTpvEst: number;
  dailyTpvEst: number;
  avgOrderValue: number;
  maxOrderValue: number;
  isDomestic: boolean;
  isInternational: boolean;
  settlementPreference: 't0_instant' | 't1_next_day' | 'escrow_milestone';
  isMarketplace: boolean;
  isSubscription: boolean;
  isHighRiskCategory: boolean;
  deliveryTimelineDays: string;
  refundTimelineDays: string;
  supportedCurrencies: string[];

  // Step 3: Website & Digital
  websiteUrl: string;
  checkoutUrl: string;
  webhookUrl: string;
  privacyPolicyUrl: string;
  refundPolicyUrl: string;
  shippingPolicyUrl: string;
  termsUrl: string;
  socialLinkedin?: string;
  socialX?: string;
  websiteAudit?: WebsiteAuditResult;

  // Step 4 & 5: Documents & Directors
  documents: MerchantDoc[];
  directors: MerchantDirector[];

  // Step 6: Bank
  bankInfo?: BankVerificationResult;

  // Step 7: Declarations & e-Sign
  declarationsAccepted: boolean;
  eSignatureName: string;
  signedAtDate: string;
  ipAddress: string;
  browserFingerprint: string;

  // Step 8: AI Pre-Screen
  aiPreScreen?: AIPreScreenResult;

  // Audit Logs & Timeline
  auditLogs: AuditLogEntry[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  deficiencyNotes?: string;
}


