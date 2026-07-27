import { 
  Customer, 
  TimelineEvent, 
  Transaction, 
  Settlement, 
  TreasuryBalance, 
  Subscription, 
  Invoice, 
  FraudRule, 
  DeveloperApiKey, 
  Payout, 
  Beneficiary, 
  ApprovalTask, 
  PaymentLink, 
  QRPayment 
} from './types';

// ==========================================
// 1. PAY-IN CUSTOMERS (Indian Enterprises & Merchants)
// ==========================================
export const mockCustomers: Customer[] = [
  {
    id: "cus_01HM9ZX2W",
    name: "Zepto Hyperlocal Logistics Pvt Ltd",
    email: "billing@zeptonow.com",
    company: "Zepto Quick-Commerce",
    joinedDate: "2024-11-12",
    revenue: 45200000, // INR LTV
    mrr: 3850000,
    healthScore: 96,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-purple-100 text-purple-800",
    status: 'active',
    country: "India",
    tags: ["quick-commerce", "high-volume-upi", "bengaluru-tech"],
    description: "10-minute grocery delivery leader in Tier 1 Indian metros. Processing massive daily UPI micro-transactions & auto-payout rider settlements.",
    phone: "+91 98201 92834",
    billingAddress: "Outer Ring Road, Bellandur, Bengaluru, KA 560103",
    npsScore: 10,
    lastActive: "2026-07-24 11:21"
  },
  {
    id: "cus_01HM9ZX4K",
    name: "Swiggy Gourmet Kitchen Partners",
    email: "finance@swiggy.in",
    company: "Swiggy India Tech Pvt Ltd",
    joinedDate: "2025-01-08",
    revenue: 18900000,
    mrr: 1420000,
    healthScore: 88,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-amber-100 text-amber-800",
    status: 'active',
    country: "India",
    tags: ["foodtech", "cloud-kitchen", "instant-payouts"],
    description: "Restaurant vendor network payout node across Mumbai, Delhi NCR, and Hyderabad. Powered by AtmoonPe instant IMPS/UPI routing.",
    phone: "+91 98112 09482",
    billingAddress: "HSR Layout Sector 6, Bengaluru, KA 560102",
    npsScore: 9,
    lastActive: "2026-07-24 09:12"
  },
  {
    id: "cus_01HM9ZX5M",
    name: "Meesho Merchant Hub Network",
    email: "seller-payouts@meesho.com",
    company: "Fashnear Technologies India",
    joinedDate: "2024-05-20",
    revenue: 62100000,
    mrr: 5200000,
    healthScore: 98,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-pink-100 text-pink-800",
    status: 'active',
    country: "India",
    tags: ["social-commerce", "tier2-tier3-india", "cod-settlements"],
    description: "Pan-India reseller & micro-entrepreneur marketplace. Direct integrations with ICICI Nodal Vaults for COD automated reconciliation.",
    phone: "+91 99002 48100",
    billingAddress: "Indiranagar 100 Feet Rd, Bengaluru, KA 560038",
    npsScore: 9,
    lastActive: "2026-07-24 10:45"
  },
  {
    id: "cus_01HM9ZX7P",
    name: "CultFit Wellness Infrastructure",
    email: "corporate@cult.fit",
    company: "Curefit Healthcare India",
    joinedDate: "2023-09-14",
    revenue: 29000000,
    mrr: 2450000,
    healthScore: 74,
    healthStatus: 'average',
    riskLevel: 'medium',
    riskDetails: "Periodic UPI mandate e-NACH bounce rate on 1st of month. Managed via BridgRoute dunning engines.",
    logoColor: "bg-emerald-100 text-emerald-800",
    status: 'active',
    country: "India",
    tags: ["fitness", "upi-autopay", "recurring-mandates"],
    description: "Nationwide fitness chain leveraging UPI AutoPay for monthly membership billing and trainer commissions.",
    phone: "+91 98400 49210",
    billingAddress: "Koramangala 8th Block, Bengaluru, KA 560095",
    npsScore: 8,
    lastActive: "2026-07-24 11:34"
  },
  {
    id: "cus_01HM9ZX8Q",
    name: "PhysicsWallah EdTech Solutions",
    email: "accounts@pw.live",
    company: "PhysicsWallah Pvt Ltd",
    joinedDate: "2025-03-30",
    revenue: 15400000,
    mrr: 1210000,
    healthScore: 91,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-blue-100 text-blue-800",
    status: 'active',
    country: "India",
    tags: ["edtech", "student-payments", "bbps-billers"],
    description: "Affordable competitive exam prep network. Uses BBPS & UPI Dynamic QR for offline center course fees.",
    phone: "+91 97110 55014",
    billingAddress: "Noida Sector 62, Uttar Pradesh 201309",
    npsScore: 9,
    lastActive: "2026-07-24 16:22"
  },
  {
    id: "cus_01HM9ZX9S",
    name: "Lenskart Solutions India",
    email: "treasury@lenskart.in",
    company: "Valyoo Technologies India",
    joinedDate: "2024-03-11",
    revenue: 34100000,
    mrr: 2880000,
    healthScore: 92,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-teal-100 text-teal-800",
    status: 'active',
    country: "India",
    tags: ["omnichannel", "soundbox-qr", "pos-terminals"],
    description: "Retail eyewear giant operating 1,500+ stores in India. Utilizes AtmoonPe Soundbox & QR payment settlement pipelines.",
    phone: "+91 98112 34567",
    billingAddress: "DLF Cyber City, Gurugram, Haryana 122002",
    npsScore: 10,
    lastActive: "2026-07-24 08:30"
  },
  {
    id: "cus_01HM9ZXBB",
    name: "Nykaa Beauty & Retail Hub",
    email: "vendor-settlements@nykaa.com",
    company: "FSN E-Commerce Ventures",
    joinedDate: "2024-08-01",
    revenue: 47700000,
    mrr: 3950000,
    healthScore: 95,
    healthStatus: 'good',
    riskLevel: 'low',
    logoColor: "bg-rose-100 text-rose-800",
    status: 'active',
    country: "India",
    tags: ["beauty-ecommerce", "vendor-payouts", "tds-automation"],
    description: "Omnichannel lifestyle marketplace with automated TDS deduction & GST reconciliation on vendor payouts.",
    phone: "+91 98219 38211",
    billingAddress: "Lower Parel, Mumbai, Maharashtra 400013",
    npsScore: 9,
    lastActive: "2026-07-24 11:05"
  }
];

// ==========================================
// 2. PAY-IN TRANSACTIONS (INR / UPI / RuPay / NetBanking)
// ==========================================
export const mockTransactions: Transaction[] = [
  {
    id: "txn_01HZ1XA3B",
    amount: 125000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 11:21",
    customerId: "cus_01HM9ZX2W",
    customerName: "Zepto Hyperlocal Logistics Pvt Ltd",
    method: "upi",
    methodDetails: "UPI AutoPay (e-Mandate) - zepto.hub@icici",
    riskScore: 2
  },
  {
    id: "txn_01HZ2XB4C",
    amount: 21500.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 11:15",
    customerId: "cus_01HM9ZX7P",
    customerName: "CultFit Wellness Infrastructure",
    method: "upi",
    methodDetails: "Google Pay UPI ID: subscriber@okaxis",
    riskScore: 12
  },
  {
    id: "txn_01HZ3XC5D",
    amount: 42000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 09:12",
    customerId: "cus_01HM9ZX4K",
    customerName: "Swiggy Gourmet Kitchen Partners",
    method: "net_banking",
    methodDetails: "HDFC Corporate Direct Banking (IFSC: HDFC0000240)",
    riskScore: 4
  },
  {
    id: "txn_01HZ4XD6E",
    amount: 180000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 10:45",
    customerId: "cus_01HM9ZX5M",
    customerName: "Meesho Merchant Hub Network",
    method: "card",
    methodDetails: "RuPay Select Corporate Credit Card ending 8812",
    riskScore: 1
  },
  {
    id: "txn_01HZ5XF7G",
    amount: 8900.00,
    currency: "INR",
    status: "failed",
    date: "2026-07-24 11:34",
    customerId: "cus_01HM9ZX7P",
    customerName: "CultFit Wellness Infrastructure",
    method: "upi",
    methodDetails: "UPI AutoPay - BLOCKED BY ROUTER (Bank Bank Rate > 120ms timeout)",
    riskScore: 84
  },
  {
    id: "txn_01HZ6XG8H",
    amount: 4500.00,
    currency: "INR",
    status: "pending",
    date: "2026-07-24 11:30",
    customerName: "Guest Soundbox Scan",
    method: "upi",
    methodDetails: "PhonePe QR Dynamic Soundbox #SB-8812",
    riskScore: 10
  },
  {
    id: "txn_01HZ7XH9I",
    amount: 245000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 11:05",
    customerId: "cus_01HM9ZXBB",
    customerName: "Nykaa Beauty & Retail Hub",
    method: "net_banking",
    methodDetails: "ICICI CIB Virtual Nodal Vault",
    riskScore: 3
  },
  {
    id: "txn_01HZ8XJ0K",
    amount: 88000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 08:30",
    customerId: "cus_01HM9ZX9S",
    customerName: "Lenskart Solutions India",
    method: "upi",
    methodDetails: "Paytm Business Soundbox QR Scan",
    riskScore: 5
  },
  {
    id: "txn_01HZ9XK1L",
    amount: 154000.00,
    currency: "INR",
    status: "succeeded",
    date: "2026-07-24 16:22",
    customerId: "cus_01HM9ZX8Q",
    customerName: "PhysicsWallah EdTech Solutions",
    method: "bnpl",
    methodDetails: "BBPS Student Fee Collection / Axio BNPL",
    riskScore: 8
  }
];

// ==========================================
// 3. SETTLEMENT HOOKS (Indian Nodal Clearing)
// ==========================================
export const mockSettlements: Settlement[] = [
  {
    id: "set_01HZST100A",
    amount: 13540000.00,
    currency: "INR",
    date: "2026-07-23",
    status: "paid",
    targetAccount: "HDFC Nodal Escrow Account - *8904",
    cohortRef: "COHORT-2026-07-23-T1"
  },
  {
    id: "set_01HZST200B",
    amount: 2894000.00,
    currency: "INR",
    date: "2026-07-23",
    status: "paid",
    targetAccount: "ICICI CIB Nodal Vault - *4451",
    cohortRef: "COHORT-2026-07-23-UPI"
  },
  {
    id: "set_01HZST300C",
    amount: 4590000.00,
    currency: "INR",
    date: "2026-07-24",
    status: "scheduled",
    targetAccount: "Axis Bank Corporate Nodal - *1203",
    cohortRef: "COHORT-2026-07-24-T0"
  },
  {
    id: "set_01HZST400D",
    amount: 1820000.00,
    currency: "INR",
    date: "2026-07-24",
    status: "scheduled",
    targetAccount: "YES Bank Current Escrow - *9201",
    cohortRef: "COHORT-2026-07-24-IMPS"
  }
];

// ==========================================
// 4. TREASURY ASSETS & LIQUIDITY SNAPSHOTS (INR Focus)
// ==========================================
export const mockTreasuryBalances: TreasuryBalance[] = [
  { currency: "INR", amount: 458000000.00, rate: 7.25, yieldEarned: 1162000.00, projectedInflow: 48200000.00, projectedOutflow: 34000000.00 },
  { currency: "USD", amount: 1520600.00, rate: 4.85, yieldEarned: 5120.00, projectedInflow: 120500.00, projectedOutflow: 95000.00 },
  { currency: "EUR", amount: 894300.00, rate: 3.25, yieldEarned: 3950.00, projectedInflow: 65000.00, projectedOutflow: 45000.00 },
  { currency: "AED", amount: 734000.00, rate: 2.10, yieldEarned: 1210.00, projectedInflow: 30000.00, projectedOutflow: 12000.00 }
];

// ==========================================
// 5. SUBSCRIPTION REVENUE AGENT (INR Plans)
// ==========================================
export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_01HM9ZX2W_PLAN",
    customerId: "cus_01HM9ZX2W",
    customerName: "Zepto Hyperlocal Logistics Pvt Ltd",
    planName: "Hyperlocal Quick-Commerce API Tier",
    amount: 3850000,
    interval: "month",
    status: "active",
    startDate: "2024-11-12",
    nextBilling: "2026-08-12"
  },
  {
    id: "sub_01HM9ZX4K_PLAN",
    customerId: "cus_01HM9ZX4K",
    customerName: "Swiggy Gourmet Kitchen Partners",
    planName: "Cloud Kitchen Payout Automation",
    amount: 1420000,
    interval: "month",
    status: "active",
    startDate: "2025-01-08",
    nextBilling: "2026-08-08"
  },
  {
    id: "sub_01HM9ZX5M_PLAN",
    customerId: "cus_01HM9ZX5M",
    customerName: "Meesho Merchant Hub Network",
    planName: "Enterprise COD Reconciliation Pro",
    amount: 5200000,
    interval: "month",
    status: "active",
    startDate: "2024-05-20",
    nextBilling: "2026-08-20"
  },
  {
    id: "sub_01HM9ZX7P_PLAN",
    customerId: "cus_01HM9ZX7P",
    customerName: "CultFit Wellness Infrastructure",
    planName: "UPI AutoPay Subscription Engine",
    amount: 2450000,
    interval: "month",
    status: "active",
    startDate: "2023-09-14",
    nextBilling: "2026-08-14"
  },
  {
    id: "sub_01HM9ZX8Q_PLAN",
    customerId: "cus_01HM9ZX8Q",
    customerName: "PhysicsWallah EdTech Solutions",
    planName: "BBPS Student Collection Suite",
    amount: 1210000,
    interval: "month",
    status: "past_due",
    startDate: "2025-03-30",
    nextBilling: "2026-07-30"
  },
  {
    id: "sub_01HM9ZX9S_PLAN",
    customerId: "cus_01HM9ZX9S",
    customerName: "Lenskart Solutions India",
    planName: "POS Soundbox Hardware & API Plan",
    amount: 2880000,
    interval: "month",
    status: "active",
    startDate: "2024-03-11",
    nextBilling: "2026-08-11"
  },
  {
    id: "sub_01HM9ZXBB_PLAN",
    customerId: "cus_01HM9ZXBB",
    customerName: "Nykaa Beauty & Retail Hub",
    planName: "Vendor TDS & GST Automated Suite",
    amount: 3950000,
    interval: "month",
    status: "active",
    startDate: "2024-08-01",
    nextBilling: "2026-08-01"
  }
];

// ==========================================
// 6. INVOICES & SMART RECOVERY (Indian Tax / GSTIN)
// ==========================================
export const mockInvoices: Invoice[] = [
  {
    id: "inv_120938",
    customerName: "Zepto Hyperlocal Logistics Pvt Ltd",
    customerEmail: "billing@zeptonow.com",
    amount: 3850000,
    currency: "INR",
    dueDate: "2026-08-12",
    status: "paid",
    createdDate: "2026-07-12",
    recoveryRetries: 0,
    routingRouteName: "ICICI Nodal Instant Direct"
  },
  {
    id: "inv_120939",
    customerName: "Meesho Merchant Hub Network",
    customerEmail: "seller-payouts@meesho.com",
    amount: 5200000,
    currency: "INR",
    dueDate: "2026-08-20",
    status: "unpaid",
    createdDate: "2026-07-20",
    recoveryRetries: 0,
    routingRouteName: "HDFC Nodal Bulk Direct"
  },
  {
    id: "inv_120940",
    customerName: "Swiggy Gourmet Kitchen Partners",
    customerEmail: "finance@swiggy.in",
    amount: 1420000,
    currency: "INR",
    dueDate: "2026-07-28",
    status: "paid",
    createdDate: "2026-07-01",
    recoveryRetries: 1, // Rescued by auto dunning!
    routingRouteName: "Axis Bank FastClear Node"
  },
  {
    id: "inv_120941",
    customerName: "PhysicsWallah EdTech Solutions",
    customerEmail: "accounts@pw.live",
    amount: 1210000,
    currency: "INR",
    dueDate: "2026-07-10",
    status: "overdue",
    createdDate: "2026-06-25",
    recoveryRetries: 3, 
    routingRouteName: "YES Bank Secondary Clearer"
  }
];

// ==========================================
// 7. PAYMENT LINKS (Pay-In Links)
// ==========================================
export const mockPaymentLinks: PaymentLink[] = [
  {
    id: "plnk_912803",
    title: "Bengaluru Tech Summit 2026 VIP Delegate Pass",
    amount: 15000,
    currency: "INR",
    url: "https://pay.atmoonpe.in/acme/bts-vip-2026",
    status: "active",
    clicks: 4420,
    conversions: 2890,
    created: "2026-04-18"
  },
  {
    id: "plnk_912804",
    title: "SaaS Accelerator Franchise Setup Token Fee",
    amount: 50000,
    currency: "INR",
    url: "https://pay.atmoonpe.in/acme/franchise-fee",
    status: "active",
    clicks: 1345,
    conversions: 412,
    created: "2026-05-01"
  },
  {
    id: "plnk_912805",
    title: "Enterprise Consulting Deposit (Includes GST 18%)",
    amount: 250000,
    currency: "INR",
    url: "https://pay.atmoonpe.in/acme/consulting-gst",
    status: "active",
    clicks: 358,
    conversions: 94,
    created: "2026-05-15"
  }
];

// ==========================================
// 8. QR PAYMENTS (UPI Soundbox / QR)
// ==========================================
export const mockQRPayments: QRPayment[] = [
  {
    id: "qrcode_01",
    name: "Bengaluru HQ Executive Reception QR & Soundbox",
    upiString: "upi://pay?pa=atmoonpe.acme@icici&pn=AtmoonPeAcme&am=1&cu=INR",
    amountCollected: 1250000,
    scansCount: 4200,
    created: "2026-01-20",
    status: "active"
  },
  {
    id: "qrcode_02",
    name: "Tech Park Cafeteria Spot Soundbox #SB-102",
    upiString: "upi://pay?pa=atmoonpe.acme.cafe@icici&pn=AtmoonPe&cu=INR",
    amountCollected: 890000,
    scansCount: 12800,
    created: "2026-05-10",
    status: "active"
  }
];

// ==========================================
// 9. BENE DIRECTORY (Indian Pay-Out Entities)
// ==========================================
export const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben_v_01",
    name: "Helix Infra Logistics India Pvt Ltd",
    type: "vendor",
    accountNumber: "91209384812",
    bankName: "HDFC Bank Ltd",
    ifsc: "HDFC0001203",
    upiId: "helixinfra@okhdfc",
    verified: true,
    bankVerified: true,
    upiVerified: true,
    pennyDropVerified: true,
    riskScore: 4,
    email: "payouts@helixcorp.in",
    joined: "2024-02-14",
    industryGroup: "Real Estate Developer (GSTIN: 29AAAAA0000A1Z5)"
  },
  {
    id: "ben_v_02",
    name: "Oracle Cloud Infrastructure India",
    type: "vendor",
    accountNumber: "77201938590",
    bankName: "Citibank N.A. Mumbai",
    ifsc: "CITI0000002",
    upiId: "oci.dues@okaxis",
    verified: true,
    bankVerified: true,
    upiVerified: false,
    pennyDropVerified: true,
    riskScore: 8,
    email: "billing-in@oracle.com",
    joined: "2023-11-09",
    industryGroup: "Enterprise Cloud Partner"
  },
  {
    id: "ben_c_01",
    name: "Ayushman Sharma (Vendor / Partner Cashback)",
    type: "customer",
    accountNumber: "50100481948",
    bankName: "ICICI Bank Ltd",
    ifsc: "ICIC0000104",
    upiId: "ayushmaanchandra9@okicici",
    verified: true,
    bankVerified: true,
    upiVerified: true,
    pennyDropVerified: true,
    riskScore: 2,
    email: "ayushmaanchandra9@gmail.com",
    joined: "2025-06-01",
    industryGroup: "VIP Merchant Rewards Program"
  },
  {
    id: "ben_e_01",
    name: "Rohan Verma (Principal Tech Architect)",
    type: "employee",
    accountNumber: "20193849129",
    bankName: "State Bank of India",
    ifsc: "SBIN0001928",
    upiId: "rohanverma@oksbi",
    verified: true,
    bankVerified: true,
    upiVerified: true,
    pennyDropVerified: true,
    riskScore: 2,
    email: "r.verma@acme.in",
    joined: "2024-05-18",
    industryGroup: "Engineering Payroll (PAN: ABCDE1234F)"
  },
  {
    id: "ben_v_03",
    name: "Redwood Brokerage Associates",
    type: "vendor",
    accountNumber: "11928394812",
    bankName: "Axis Bank Ltd",
    ifsc: "UTIB0000084",
    upiId: "redwoodbrokerage@okaxis",
    verified: false,
    bankVerified: false,
    upiVerified: false, // Under penalty hold
    pennyDropVerified: false,
    riskScore: 78,
    email: "commissions@redwoodleads.in",
    joined: "2026-06-02",
    industryGroup: "Channel Partner (Hold Status)"
  },
  {
    id: "ben_e_02",
    name: "Ananya Mehta (Senior Lead Consultant)",
    type: "employee",
    accountNumber: "30048194910",
    bankName: "Kotak Mahindra Bank",
    ifsc: "KKBK0000958",
    upiId: "ananyamehta@okkotak",
    verified: true,
    bankVerified: true,
    upiVerified: true,
    pennyDropVerified: true,
    riskScore: 6,
    email: "a.mehta@acme.in",
    joined: "2025-09-01",
    industryGroup: "Education Consulting Staff"
  }
];

// ==========================================
// 10. PAY-OUT RECORD LOGS (INR / IMPS / UPI / NEFT)
// ==========================================
export const mockPayouts: Payout[] = [
  {
    id: "pout_910238",
    amount: 1450000,
    currency: "INR",
    status: "paid",
    date: "2026-07-24 10:14",
    beneficiaryId: "ben_v_01",
    beneficiaryName: "Helix Infra Logistics India Pvt Ltd",
    beneficiaryType: "vendor",
    method: "rtgs",
    sourceAccount: "HDFC Escrow Nodal *8904",
    approvalStatus: "approved",
    riskScore: 4,
    processingTimeMs: 1450,
    industryCategory: "real_estate"
  },
  {
    id: "pout_910239",
    amount: 125000,
    currency: "INR",
    status: "pending",
    date: "2026-07-24 11:45",
    beneficiaryId: "ben_c_01",
    beneficiaryName: "Ayushman Sharma (Vendor / Partner Cashback)",
    beneficiaryType: "customer",
    method: "upi",
    sourceAccount: "Virtual Nodal ID: atmoon_acme_set",
    approvalStatus: "checker_pending", // Maker Checker Triggered!
    riskScore: 12,
    processingTimeMs: 0,
    industryCategory: "enterprise"
  },
  {
    id: "pout_910240",
    amount: 680000,
    currency: "INR",
    status: "paid",
    date: "2026-07-23 16:30",
    beneficiaryId: "ben_v_02",
    beneficiaryName: "Oracle Cloud Infrastructure India",
    beneficiaryType: "vendor",
    method: "neft",
    sourceAccount: "Virtual Nodal ID: atmoon_acme_set",
    approvalStatus: "approved",
    riskScore: 8,
    processingTimeMs: 450,
    industryCategory: "enterprise"
  },
  {
    id: "pout_910241",
    amount: 85000,
    currency: "INR",
    status: "failed",
    date: "2026-07-23 12:11",
    beneficiaryId: "ben_v_03",
    beneficiaryName: "Redwood Brokerage Associates",
    beneficiaryType: "vendor",
    method: "imps",
    sourceAccount: "HDFC Escrow Nodal *8904",
    approvalStatus: "rejected", 
    riskScore: 78, // High-risk trigger block!
    processingTimeMs: 300,
    industryCategory: "real_estate"
  },
  {
    id: "pout_910242",
    amount: 450000,
    currency: "INR",
    status: "paid",
    date: "2026-07-22 09:12",
    beneficiaryId: "ben_e_01",
    beneficiaryName: "Rohan Verma",
    beneficiaryType: "employee",
    method: "imps",
    sourceAccount: "ICICI Salary Account *9921",
    approvalStatus: "approved",
    riskScore: 2,
    processingTimeMs: 420,
    industryCategory: "enterprise"
  },
  {
    id: "pout_910243",
    amount: 320000,
    currency: "INR",
    status: "pending",
    date: "2026-07-24 11:30",
    beneficiaryId: "ben_e_02",
    beneficiaryName: "Ananya Mehta",
    beneficiaryType: "employee",
    method: "imps",
    sourceAccount: "ICICI Salary Account *9921",
    approvalStatus: "maker_pending",
    riskScore: 6,
    processingTimeMs: 0,
    industryCategory: "education"
  }
];

// ==========================================
// 11. MAKER CHECKER APPROVAL CENTER
// ==========================================
export const mockApprovalTasks: ApprovalTask[] = [
  {
    id: "task_01",
    payoutId: "pout_910239",
    amount: 125000,
    currency: "INR",
    beneficiaryName: "Ayushman Sharma (Vendor / Partner Cashback)",
    requestedBy: "j.drake@acme.in (Maker)",
    requestedDate: "2026-07-24 11:45",
    level: 2, // Level 2 CFO Approval Required
    status: "pending",
    notes: "VIP Merchant Partner cashback payout disbursement under high-volume loyalty framework.",
    type: "escrow_release"
  },
  {
    id: "task_02",
    payoutId: "pout_910243",
    amount: 320000,
    currency: "INR",
    beneficiaryName: "Ananya Mehta",
    requestedBy: "b.vance@acme.in (Maker)",
    requestedDate: "2026-07-24 11:30",
    level: 1, // Level 1 Finance Manager
    status: "pending",
    notes: "Monthly retainer payout for curriculum consultant (TDS deducted @ 10% under Sec 194J).",
    type: "single"
  },
  {
    id: "task_03",
    amount: 1450000,
    currency: "INR",
    beneficiaryName: "Helix Infra Logistics India Pvt Ltd",
    requestedBy: "j.drake@acme.in (Maker)",
    requestedDate: "2026-07-24 09:00",
    level: 2,
    status: "approved",
    notes: "RTGS warehouse lease settlement release for Bangalore logistics park.",
    type: "split_settlement"
  }
];

// ==========================================
// 12. RADAR FRAUD & REAL-TIME COMPLIANCE (RBI / NPCI Rules)
// ==========================================
export const mockFraudRules: FraudRule[] = [
  {
    id: "rule_01",
    name: "Block UPI VPA handles with >3 bank decline retries in 15 mins",
    action: "block",
    matchingCriteria: "attempts_count > 3 AND window_size = 15m AND method = 'upi'",
    hits: 231,
    isActive: true
  },
  {
    id: "rule_02",
    name: "Flag and Review UPI AutoPay recurring debit > ₹15,000 without AFA (RBI Mandate)",
    action: "review",
    matchingCriteria: "charge_amount > 15000 AND mandate_type = 'recurring_upi' AND afa_present = false",
    hits: 42,
    isActive: true
  },
  {
    id: "rule_03",
    name: "Auto-approve ICICI & HDFC Nodal Escrow payouts with Penny Drop verification",
    action: "allow",
    matchingCriteria: "penny_drop_status = 'verified' AND source_vault IN ('icici_nodal', 'hdfc_escrow')",
    hits: 2512,
    isActive: true
  },
  {
    id: "rule_04",
    name: "Restrict payouts to unverified PAN/GSTIN beneficiary accounts with risk score > 70",
    action: "block",
    matchingCriteria: "pan_verified = false AND risk_reputation > 70",
    hits: 61,
    isActive: true
  }
];

// ==========================================
// 13. DEVELOPER CREDENTIALS
// ==========================================
export const mockApiKeys: DeveloperApiKey[] = [
  {
    id: "key_01",
    name: "AtmoonPe / BridgConnect live webhook listener node",
    keyPrefix: "rk_live_8F1aJ99z...",
    created: "2025-02-14",
    isActive: true,
    scope: "full_access"
  },
  {
    id: "key_02",
    name: "GST Reconciliation & TDS automated pull cron",
    keyPrefix: "rk_live_0QzB139x...",
    created: "2025-05-01",
    isActive: true,
    scope: "read_only"
  },
  {
    id: "key_03",
    name: "Sandbox local developer engine test",
    keyPrefix: "rk_test_5Y2Xp01b...",
    created: "2026-01-10",
    isActive: true,
    scope: "full_access"
  }
];

// Timeline event getter
export const getCustomerTimeline = (customerId: string): TimelineEvent[] => {
  const commonEvents: TimelineEvent[] = [
    {
      id: "ev_01",
      timestamp: "2026-07-24 11:21",
      type: "payment",
      title: "Invoice settlement success",
      description: "UPI AutoPay e-Mandate processing completed. Invoice #inv_120938. ₹38,50,000 resolved.",
      badge: "₹38,50,000.00",
      badgeColor: "bg-emerald-100 text-emerald-800"
    }
  ];

  switch (customerId) {
    case "cus_01HM9ZX2W": // Zepto
      return [
        {
          id: "ev_aeth_1",
          timestamp: "2026-07-24 11:21",
          type: "payment",
          title: "Zepto Hyperlocal Nodal Settlement Completed",
          description: "Settled payment of ₹38,50,000.00 via ICICI Nodal Vault route.",
          badge: "Paid",
          badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200"
        }
      ];

    case "cus_01HM9ZX4K": // Swiggy
      return [
        {
          id: "ev_lux_1",
          timestamp: "2026-07-24 09:12",
          type: "payment",
          title: "Vendor Payout Settled",
          description: "Captured payout of ₹14,20,000.00 via HDFC Bank Direct Clearer.",
          badge: "Succeeded",
          badgeColor: "bg-emerald-100 text-emerald-800"
        }
      ];

    default:
      return commonEvents;
  }
};

