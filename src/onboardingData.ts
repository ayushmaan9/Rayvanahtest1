import { MerchantApplication } from './types';

export const initialMockApplication: MerchantApplication = {
  id: 'app_ray_991',
  referenceId: 'RAY-2026-IN8849',
  merchantId: 'MID-IND-9021',
  currentStep: 1,
  status: 'draft',
  
  // Step 1: Business Profile
  legalBusinessName: 'Aetheria B2B Commerce Solutions India Pvt Ltd',
  tradeName: 'Aetheria PayEscrow',
  entityType: 'private_limited',
  category: 'eCommerce & B2B Marketplace',
  subCategory: 'SaaS & Enterprise Procurement',
  mcc: '5734 - Computer Software Stores / B2B SaaS',
  description: 'AI-assisted B2B marketplace facilitating high-value industrial machinery procurement with automated tri-party escrow holdbacks.',
  dateOfIncorporation: '2021-08-14',
  gstNumber: '27AABCA1234H1ZM',
  panNumber: 'AABCA1234H',
  cin: 'U72900MH2021PTC368912',
  officialEmail: 'compliance@aetheriapay.in',
  supportEmail: 'support@aetheriapay.in',
  supportPhone: '+91 98201 44892',
  registeredAddress: 'Unit 402, B-Wing, Express Towers, Nariman Point, Mumbai, MH 400021',
  operatingAddress: 'Tower 3, 7th Floor, Mindspace Tech Park, HITEC City, Hyderabad, TS 500081',

  // Step 2: Operations
  monthlyTpvEst: 45000000, // ₹4.5 Cr / month
  dailyTpvEst: 1500000,
  avgOrderValue: 85000,
  maxOrderValue: 1200000,
  isDomestic: true,
  isInternational: true,
  settlementPreference: 'escrow_milestone',
  isMarketplace: true,
  isSubscription: true,
  isHighRiskCategory: false,
  deliveryTimelineDays: '3 to 7 business days',
  refundTimelineDays: '5 to 7 business days',
  supportedCurrencies: ['INR', 'USD', 'EUR', 'AED', 'SGD'],

  // Step 3: Digital Presence
  websiteUrl: 'https://aetheriapay.in',
  checkoutUrl: 'https://checkout.aetheriapay.in',
  webhookUrl: 'https://api.aetheriapay.in/v1/webhooks/escrow',
  privacyPolicyUrl: 'https://aetheriapay.in/privacy-policy',
  refundPolicyUrl: 'https://aetheriapay.in/cancellation-refunds',
  shippingPolicyUrl: 'https://aetheriapay.in/shipping-fulfillment',
  termsUrl: 'https://aetheriapay.in/terms-of-service',
  socialLinkedin: 'https://linkedin.com/company/aetheria-pay',
  socialX: 'https://x.com/aetheriapay',
  
  websiteAudit: {
    isHttps: true,
    sslValid: true,
    dnsResolved: true,
    domainAgeYears: 3.8,
    isAccessible: true,
    isMobileFriendly: true,
    businessNameMatch: true,
    contactMatch: true,
    policyPrivacy: true,
    policyRefund: true,
    policyTerms: true,
    policyShipping: true,
    overallHealthScore: 96
  },

  // Step 4: Verification Documents
  documents: [
    {
      id: 'doc_1',
      docType: 'gst_certificate',
      title: 'GST REG-06 Registration Certificate',
      fileName: 'GST_Certificate_Aetheria.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2026-07-25 10:30',
      status: 'ocr_extracted',
      ocrData: {
        legalName: 'Aetheria B2B Commerce Solutions India Pvt Ltd',
        panOrGst: '27AABCA1234H1ZM',
        issueDate: '18-Aug-2021',
        addressMatch: true,
        extractedTextSnippet: 'FORM GST REG-06 [See Rule 10(1)] Registration Certificate Principal Place of Business...'
      }
    },
    {
      id: 'doc_2',
      docType: 'corporate_pan',
      title: 'Corporate Permanent Account Number (PAN)',
      fileName: 'PAN_Card_Corporate.pdf',
      fileSize: '840 KB',
      uploadDate: '2026-07-25 10:32',
      status: 'verified',
      ocrData: {
        legalName: 'AETHETIA B2B COMMERCE SOLUTIONS INDIA PVT LTD',
        panOrGst: 'AABCA1234H',
        issueDate: '20-Aug-2021',
        addressMatch: true,
        extractedTextSnippet: 'INCOME TAX DEPARTMENT GOVT OF INDIA AABCA1234H'
      }
    },
    {
      id: 'doc_3',
      docType: 'coi',
      title: 'Certificate of Incorporation (MCA)',
      fileName: 'Certificate_of_Incorporation.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2026-07-25 10:35',
      status: 'verified'
    },
    {
      id: 'doc_4',
      docType: 'cancelled_cheque',
      title: 'HDFC Bank Cancelled Cheque (Nodal Escrow Linked)',
      fileName: 'HDFC_Cancelled_Cheque.jpg',
      fileSize: '1.1 MB',
      uploadDate: '2026-07-25 10:40',
      status: 'verified'
    }
  ],

  // Step 5: Directors
  directors: [
    {
      id: 'dir_1',
      fullName: 'Vikramaditya Roy',
      designation: 'Managing Director & CEO',
      din: '08942104',
      pan: 'ABCDE1234F',
      aadhaar: 'XXXX-XXXX-9481',
      email: 'vikram@aetheriapay.in',
      mobile: '+91 98210 99482',
      address: 'Apt 1402, Crest Tower, Worli Sea Face, Mumbai MH 400018',
      nationality: 'Indian',
      shareholdingPct: 62.5,
      isKycVerified: true
    },
    {
      id: 'dir_2',
      fullName: 'Ananya Deshmukh',
      designation: 'Chief Technology Officer & Director',
      din: '09102488',
      pan: 'XYZPD9876K',
      aadhaar: 'XXXX-XXXX-3021',
      email: 'ananya@aetheriapay.in',
      mobile: '+91 97110 44810',
      address: 'Flat 401, Cypress Heights, HSR Layout, Bengaluru KA 560102',
      nationality: 'Indian',
      shareholdingPct: 37.5,
      isKycVerified: true
    }
  ],

  // Step 6: Bank
  bankInfo: {
    bankName: 'HDFC Bank Ltd',
    branch: 'Fort Main Branch, Mumbai',
    ifsc: 'HDFC0000060',
    accountNumber: '50200049281044',
    beneficiaryName: 'AETHERIA B2B COMMERCE SOLUTIONS PVT LTD',
    upiId: 'aetheriapay@hdfcbank',
    pennyDropStatus: 'verified',
    pennyDropTxnId: 'P392010482910',
    pennyDropAmount: 1.00,
    nameMatchScore: 98.6,
    isVerified: true
  },

  // Step 7: Declarations
  declarationsAccepted: true,
  eSignatureName: 'Vikramaditya Roy',
  signedAtDate: '2026-07-27 13:30',
  ipAddress: '103.21.244.12',
  browserFingerprint: 'Chrome 127.0.0.1 (Win64 / SHA-256 Verified)',

  // Step 8: AI Pre-Screen
  aiPreScreen: {
    readinessScore: 94,
    commercialFitScore: 98,
    riskLevel: 'green',
    legitimacyScore: 97,
    policyCompletenessScore: 100,
    restrictedProductsDetected: false,
    restrictedKeywordsFound: [],
    missingDocs: [],
    fraudIndicators: [],
    recommendations: [
      'High commercial fit for B2B Escrow Nodal accounts.',
      'All 4 policies (Privacy, Terms, Shipping, Refund) fully validated on SSL target domain.',
      'Penny Drop name match 98.6% verified against HDFC Nodal Vault.',
      'Clear e-Sign with MCA CIN matching Director DIN records.'
    ]
  },

  auditLogs: [
    {
      id: 'log_1',
      timestamp: '2026-07-27 13:10',
      actor: 'System Automated Sentinel',
      action: 'Account Created & Email/SMS OTP Verified',
      notes: 'Mobile +91 98201 44892 verified via SMS gateway.'
    },
    {
      id: 'log_2',
      timestamp: '2026-07-27 13:20',
      actor: 'AI Document OCR Parser',
      action: 'GST REG-06 and Corporate PAN Parsed',
      notes: 'Extracted GSTIN 27AABCA1234H1ZM with 99.1% optical accuracy.'
    },
    {
      id: 'log_3',
      timestamp: '2026-07-27 13:25',
      actor: 'Banking Penny Drop Service',
      action: 'Penny Drop Executed',
      notes: '₹1.00 transferred to HDFC A/c 50200049281044. Beneficiary match verified.'
    },
    {
      id: 'log_4',
      timestamp: '2026-07-27 13:30',
      actor: 'Merchant Director',
      action: 'Application Finalized & Pre-Screen Passed',
      notes: 'AI Pre-Screen score 94/100 (GREEN RISK).'
    }
  ]
};

export const adminQueueApplications: MerchantApplication[] = [
  {
    ...initialMockApplication,
    id: 'app_admin_001',
    referenceId: 'RAY-2026-IN8849',
    merchantId: 'MID-IND-9021',
    status: 'under_review',
    submittedAt: '2026-07-27 10:15'
  },
  {
    ...initialMockApplication,
    id: 'app_admin_002',
    referenceId: 'RAY-2026-ZN4012',
    merchantId: 'MID-IND-7712',
    legalBusinessName: 'Zenith Heavy Logistics & Freight Ltd',
    tradeName: 'ZenithEscrow Cargo',
    entityType: 'public_limited',
    category: 'Logistics & Supply Chain',
    monthlyTpvEst: 180000000, // ₹18 Cr
    status: 'risk_assessment',
    submittedAt: '2026-07-26 16:40',
    aiPreScreen: {
      readinessScore: 78,
      commercialFitScore: 88,
      riskLevel: 'amber',
      legitimacyScore: 82,
      policyCompletenessScore: 85,
      restrictedProductsDetected: false,
      restrictedKeywordsFound: ['cross-border customs freight clearing'],
      missingDocs: ['MOA Amendment Clause 4B'],
      fraudIndicators: ['High TPV spike from Month 1'],
      recommendations: [
        'Require additional rolling reserve of 5% for first 90 days due to freight volume spikes.',
        'Request CISO signoff on international customs settlement sub-gateways.'
      ]
    }
  },
  {
    ...initialMockApplication,
    id: 'app_admin_003',
    referenceId: 'RAY-2026-DF9012',
    merchantId: 'MID-IND-3391',
    legalBusinessName: 'PayCraft Global Software LLP',
    tradeName: 'PayCraft SaaS',
    entityType: 'llp',
    status: 'deficiency_raised',
    deficiencyNotes: 'Please re-upload Director 2 (Ananya) clear Aadhaar scan. Current image is blurry.',
    submittedAt: '2026-07-25 11:20'
  },
  {
    ...initialMockApplication,
    id: 'app_admin_004',
    referenceId: 'RAY-2026-AP1029',
    merchantId: 'MID-IND-1002',
    legalBusinessName: 'Nexa Enterprise Cloud Systems Pvt Ltd',
    tradeName: 'NexaCloud',
    entityType: 'private_limited',
    status: 'approved',
    submittedAt: '2026-07-24 09:00',
    reviewedAt: '2026-07-24 14:30',
    reviewedBy: 'Rajesh K. (Senior Compliance Lead)'
  }
];
