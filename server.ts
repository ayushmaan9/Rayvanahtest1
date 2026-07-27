import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
let aiClient: GoogleGenAI | null = null;

// Lazy initialization of Gemini client
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // === AtmoonPe User Module - In-Memory Database & Logic ===
  interface ServerModulePermission {
    moduleName: string;
    admin: boolean;
    maker: boolean;
    checker: boolean;
    viewer: boolean;
  }

  interface ServerAdminUser {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
    activeDate: string;
    status: boolean;
    dataAccessDuration: string;
    permissions: ServerModulePermission[];
    roleDescription: string;
  }

  const activeModulesByCompany = [
    "Merchant Management",
    "Settlement",
    "Reports",
    "Risk & Fraud",
    "Treasury",
    "Compliance & KYC"
  ];

  function calculateServerRoleDescription(permissions: ServerModulePermission[]): string {
    const summaries: string[] = [];
    permissions.forEach(p => {
      let r = "";
      if (p.admin) r = "Admin";
      else if (p.maker && p.checker) r = "Operator";
      else if (p.maker) r = "Maker";
      else if (p.checker) r = "Checker";
      else if (p.viewer) r = "Viewer";
      
      if (r) {
        let short = p.moduleName;
        if (p.moduleName === "Merchant Management") short = "Merchant";
        if (p.moduleName === "Compliance & KYC") short = "Compliance";
        summaries.push(`${short} ${r}`);
      }
    });
    if (summaries.length === 0) return "No Access";
    if (summaries.length > 2) {
      return summaries.slice(0, 2).join(", ") + " + " + (summaries.length - 2) + " more";
    }
    return summaries.join(", ");
  }

  let usersDb: ServerAdminUser[] = [
    {
      id: "USR10001",
      firstName: "John",
      lastName: "Drake",
      name: "John Drake",
      email: "j.drake@acme.com",
      phone: "9876543210",
      activeDate: "01/01/2026",
      status: true,
      dataAccessDuration: "All Past Data",
      permissions: activeModulesByCompany.map(m => ({ moduleName: m, admin: true, maker: false, checker: false, viewer: false })),
      roleDescription: "Super Admin"
    },
    {
      id: "USR10002",
      firstName: "Abhinav",
      lastName: "Ladole",
      name: "Abhinav Ladole",
      email: "abhinav.ladole@atmoonpe.com",
      phone: "8888888888",
      activeDate: "10/02/2026",
      status: true,
      dataAccessDuration: "90 Days",
      permissions: activeModulesByCompany.map((m, i) => ({
        moduleName: m,
        admin: i === 0,
        maker: i === 1,
        checker: false,
        viewer: i > 1
      })),
      roleDescription: "Merchant Admin, Settlement Maker"
    },
    {
      id: "USR10024",
      firstName: "Sarah",
      lastName: "Jenkins",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@atmoonpe.com",
      phone: "7777777777",
      activeDate: "15/03/2026",
      status: true,
      dataAccessDuration: "30 Days",
      permissions: activeModulesByCompany.map((m, i) => ({
        moduleName: m,
        admin: false,
        maker: i < 2,
        checker: false,
        viewer: i >= 2
      })),
      roleDescription: "Merchant Maker, Settlement Maker"
    },
    {
      id: "USR10025",
      firstName: "Raj",
      lastName: "Patel",
      name: "Raj Patel",
      email: "raj.patel@atmoonpe.com",
      phone: "6666666666",
      activeDate: "05/04/2026",
      status: true,
      dataAccessDuration: "15 Days",
      permissions: activeModulesByCompany.map((m, i) => ({
        moduleName: m,
        admin: false,
        maker: false,
        checker: i === 1,
        viewer: i > 1
      })),
      roleDescription: "Settlement Checker"
    },
    {
      id: "USR10026",
      firstName: "David",
      lastName: "Kim",
      name: "David Kim",
      email: "david.kim@atmoonpe.com",
      phone: "9999999999",
      activeDate: "28/05/2026",
      status: false,
      dataAccessDuration: "7 Days",
      permissions: activeModulesByCompany.map((m, i) => ({
        moduleName: m,
        admin: false,
        maker: false,
        checker: false,
        viewer: i === 0 || i === 2
      })),
      roleDescription: "Merchant Viewer"
    }
  ];

  let userIdCounter = 10027;

  // === REST endpoints for User Module ===
  app.get("/api/users", (req, res) => {
    // Sorted from latest to oldest (usersDb is already preloaded, we can slice & reverse or just return as is or by ID desc)
    const sorted = [...usersDb].sort((a, b) => b.id.localeCompare(a.id));
    res.json(sorted);
  });

  app.get("/api/modules/active", (req, res) => {
    res.json(activeModulesByCompany);
  });

  app.post("/api/users/check-email", (req, res) => {
    const { email } = req.body;
    const exists = usersDb.some(u => u.email.toLowerCase() === (email || "").toLowerCase());
    res.json({ exists });
  });

  app.post("/api/users/check-mobile", (req, res) => {
    const { mobile } = req.body;
    const exists = usersDb.some(u => u.phone === mobile);
    res.json({ exists });
  });

  app.put("/api/users/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userIndex = usersDb.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      usersDb[userIndex].status = status;
      res.json({ success: true, user: usersDb[userIndex] });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.put("/api/users/:id/permissions", (req, res) => {
    const { id } = req.params;
    const { permissions } = req.body;
    const userIndex = usersDb.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      usersDb[userIndex].permissions = permissions;
      usersDb[userIndex].roleDescription = calculateServerRoleDescription(permissions);
      res.json({ success: true, user: usersDb[userIndex] });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/users/create", (req, res) => {
    const { firstName, lastName, email, phone, password, status, dataAccessDuration, permissions } = req.body;
    
    // Server validation side check
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(450).json({ error: "Missing required fields" });
    }

    // Duplicate check
    const emailExists = usersDb.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const phoneExists = usersDb.some(u => u.phone === phone);
    if (phoneExists) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    const id = `USR${userIdCounter++}`;
    const formattedDate = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
    
    const newUser: ServerAdminUser = {
      id,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      activeDate: formattedDate,
      status: status !== undefined ? status : true,
      dataAccessDuration: dataAccessDuration || "All Past Data",
      permissions: permissions || activeModulesByCompany.map(m => ({ moduleName: m, admin: false, maker: false, checker: false, viewer: true })),
      roleDescription: ""
    };
    newUser.roleDescription = calculateServerRoleDescription(newUser.permissions);

    usersDb.unshift(newUser); // Added to the top of list
    res.json({ success: true, user: newUser });
  });

  // API router logic

  app.post("/api/gemini/copilot", async (req, res) => {
    try {
      const { messages, context } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback simulated AI response when GEMINI_API_KEY is not configured
        const latestMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
        const fallbackText = getSimulatedCopilotResponse(latestMessage, context);
        return res.json({ 
          text: fallbackText,
          isSimulated: true
        });
      }

      // Formatting messages for the Gemini SDK
      // Using gemini-3.5-flash as indicated by instructions for general Q&A / text tasks
      const systemInstruction = `You are Rayvaanah's Payout & Treasury Intelligence AI Copilot, a elite automated liquidity, risk scoring, and cash flow optimizing expert.
You have full real-time telemetry access to Acme International's Pay-In and Pay-Out ledgers on Rayvaanah.
Here is the current system context:
- Treasury available balance: $4,580,000 USD, €1,520,600 EUR, £894,300 GBP, 734,000 AED
- Upcoming settlements (Pay-In): $45,900 USD, £18,200 GBP
- Upcoming payouts: $1,280,000 corporate vendor dues, £45,000 broker payouts
- Success Rates: Pay-In 98.4%, Pay-Out 99.2%
- High-risk fraud blocks: 231 rules triggered, current risk level LOW
- Maker-Checker Queue: 2 pending payouts requiring Level 2 CFO Approval.

Provide highly actionable, hyper-professional answers detailing:
1. Liquidity Forecasting and cash flow predictions
2. Treasury Optimization and working capital recommendations
3. Payout Failure Predictions (e.g. predicting failures based on Bank downtime or UPI VPAs)
4. Split settlements & escrow health advice
5. Smart Routing optimizations and fraud/AML signals
Make sure to sound like a world-class financial advisory algorithms (Stripe Treasury + Brex + Mercury). Maintain a precise, elite, and quantitative tone. Do not use generic statements.`;

      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "No response received.", isSimulated: false });
    } catch (error: any) {
      console.error("Gemini Copilot Error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI copilot query" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA catch-all for react routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Rayvaanah System] Running full stack server at http://localhost:${PORT}`);
  });
}

// Simulated Copilot Responses fallback in case GEMINI_API_KEY is not supplied in the sandbox
function getSimulatedCopilotResponse(query: string, context: any): string {
  const q = query.toLowerCase();
  
  if (q.includes("forecast") || q.includes("liquidity") || q.includes("flow") || q.includes("prediction")) {
    return `### 📊 Liquidity & Cash Flow Forecast [Simulated Engine]

Based on current accounts ledger telemetry, we have constructed a **30-day working capital projection**:

1. **Inflow Predictions (Pay-In):** We expect **$482,000 USD** from recurring subscriptions and scheduled invoices. The AI model predicts a **98.4% success rate** based on historical cohort routing.
2. **Outflow Requirements (Pay-Out):** Active payroll demands total **$340,000 USD** on 2026-06-30. Real estate broker payouts require **$120,000 USD**.
3. **Optimized Net Runway:** Net working capital remains excellent. Rayvaanah recommends keeping **$850,000 USD** in our high-yield treasury vault (earning **4.85% APY**) and releasing **$150,000 USD** of escrow reserves to offset impending supplier settlements.

**Recommendation:** Route the upcoming €1,500,000 SEPA translation through the Frankfurt Smart Node to save approximately 24 bps in cross-border spread fees.`;
  }
  
  if (q.includes("fraud") || q.includes("risk") || q.includes("AML") || q.includes("suspicious")) {
    return `### 🛡️ Payout Risk & Fraud Insights [Simulated Engine]

Our active risk scoring models have audited current pay-out directories and pending queue items:

- **AML Risk Profile:** Current system risks are rated as **LOW (0.12% aggregate risk score)**.
- **Velocity Alert Flagged:** We detected **3 rapid consecutive trial payouts** matching the footprint of *Aether Capital subsidiary* accounts. This matches our Rule #01 block profile and has been routed to **Maker Checker: Admin Review**.
- **Sanctions & Compliance Node:** 2 new vendor compliance updates received. No active hits detected on current SDN/OFAC checklists for vendor directory additions.

**Risk Mitigation Action:** Enable our **UPI Penny Drop Verification check** for all new employee beneficiaries before scheduling payroll.`;
  }

  if (q.includes("recommend") || q.includes("optimize") || q.includes("save") || q.includes("routing")) {
    return `###  Gateway & Treasury Optimization [Simulated Engine]

Telemetry optimization audit results:

- **Smart Routing Gateway Gain:** By shifting card payments with high friction through the *Singapore Merchant Route #2*, we have reduced checkout failures by **3.1%** and saved **$4,200 USD in transaction fees** this week.
- **Dunning Success Rate:** Failed-payment auto-retries succeeded in rescuing **$18,900 USD** in subscription MRR from *Novus Learn* and related high-value customers.
- **Optimized Settlement Allocation:** Split commission payouts for real estate marketplaces can be optimized using custom virtual escrow routing.

**Suggested Configuration Strategy:** Establish a secondary NEFT bridge to handle bulk payroll payouts exceeding $50k to avoid IMPS cap constraints.`;
  }

  // General default helpful business response
  return `### ⚡ Rayvaanah Treasury & Payout Copilot [Active Node]

Welcome to the central intelligence module. I monitor your Pay-In and Pay-Out infrastructure. Here is a quick snapshot of optimization suggestions:

1. **Maker Checker Queue**: You have **2 pending payouts** waiting in the approvals queue.
2. **UPI Collections Optimization**: The AI predicts a **14% lift in checkouts** if UPI AutoPay is enabled on our SaaS tier.
3. **Treasury Management**: Acme has **$1.16M USD** in uninvested checking balance. Routing this to the **Rayvaanah High Yield Treasury Workspace** (4.85% APY) would generate an estimated **$5,300 USD monthly yield**.

Ask me anything about **Liquidity Forecasting**, **Fraud Intelligence**, **Working Capital**, or **Smart Routing Gateway Optimization**!`;
}

startServer();
