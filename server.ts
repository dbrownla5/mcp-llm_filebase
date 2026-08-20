import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    runtime: "Dayna Multi-Agent OS & Claude Desktop MCP Protocol Suite",
    version: "4.0.0",
    cloudFlareEndpoint: "https://mcp.thewelllivedcitizenco.com/mcp",
    r2Bucket: "comet",
    hasAiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Agent Execution & Simulation endpoint
app.post("/api/simulate-agent", async (req, res) => {
  try {
    const { agentId, agentName, systemPrompt, userPrompt, parameters, context } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback deterministic simulation when no API key is provided
      const deterministicResponse = {
        agentId,
        agentName,
        executionMode: "simulated_local",
        status: "COMPLETED",
        sharpForks: [
          {
            type: "SAFE",
            title: "Strict Provenance & Baseline Resolution",
            description: `Execute standard extraction for ${agentName} bound to verified records.`,
            actionPlan: `1. Isolate verified source spans.\n2. Apply zero-drift rules.\n3. Output two-column ledger.`,
            confidence: 94
          },
          {
            type: "BOLD",
            title: "Accelerated Turnaround & Strategic Notice",
            description: `Deliver direct, elevated 1-page action draft with hard settlement deadline.`,
            actionPlan: `1. Reconcile primary discrepancies.\n2. Structure non-defensive formal notice.\n3. Stage deliverable for sign-off.`,
            confidence: 89
          },
          {
            type: "DISRUPTIVE",
            title: "Structural Reset & Leverage Pivot",
            description: `Bypass intermediate negotiations; consolidate all claims into single binding ledger.`,
            actionPlan: `1. Cross-reference unverified vendor line-items.\n2. Formulate decisive legal/business position.\n3. Clear cognitive drag immediately.`,
            confidence: 86
          }
        ],
        twoColumnProvenance: [
          { claim: `Primary matter assessment for ${agentName}`, sourcePath: "comet/domains/verified_records/2024_Q3_summary.pdf", verified: true },
          { claim: "Transaction and timeline reconciliation", sourcePath: "comet/domains/receipts/reconciled_ledger.csv", verified: true }
        ],
        rubricScores: {
          kolbeCongruence: 92,
          toneMatch: 95,
          actionability: 96,
          surpriseFactor: 88,
          overallScore: 92.75,
          passedThreshold: true
        },
        outputContent: `### [${agentName}] Executed Analysis\n\n**Core Findings & Heavy-Lift Summary:**\n- All inputs audited against Zero-Truth Baseline.\n- Background synthesis completed to 80% certainty.\n- Formatted into 3 divergent forks below for instant, low-friction decision making.\n\n**Ready-to-Use Artifact:**\nBased on your direct instructions, the matter has been isolated without cross-domain pollution. Zero AI clichés were used.`
      };
      return res.json(deterministicResponse);
    }

    // Call Gemini 2.5 Flash for authentic AI-powered agent execution
    const promptInstructions = `
You are simulating the specialized agent "${agentName}" (ID: ${agentId}) within the Dayna Multi-Agent Operating System for Claude Desktop.

AGENT SYSTEM PROMPT:
${systemPrompt}

USER PROMPT / TASK:
${userPrompt}

ADDITIONAL CONTEXT & PARAMETERS:
${JSON.stringify(parameters || {})}
${context ? `Context: ${context}` : ""}

OPERATIONAL CONSTRAINTS:
1. Zero AI Clichés / Corporate Jargon: Strictly avoid "delve", "revolutionize", "tapestry", "unleash", "game-changer", "supercharge", "beacon".
2. Inferred Heavy-Lift: Do 80% of the cognitive and technical work silently.
3. Deliver 3 Sharp Forks (Option 1: Safe / Baseline, Option 2: Bold / Elevated, Option 3: Disruptive / Non-Obvious).
4. Provide Two-Column Provenance items (Claim vs Source).
5. Score the output on the 4-dimension rubric (Kolbe Congruence, Tone Match, Actionability, Surprise Factor). Every score must be between 80 and 100.

Return a valid JSON object strictly with this format:
{
  "outputContent": "markdown string of the primary response",
  "sharpForks": [
    { "type": "SAFE", "title": "...", "description": "...", "actionPlan": "...", "confidence": 95 },
    { "type": "BOLD", "title": "...", "description": "...", "actionPlan": "...", "confidence": 90 },
    { "type": "DISRUPTIVE", "title": "...", "description": "...", "actionPlan": "...", "confidence": 85 }
  ],
  "twoColumnProvenance": [
    { "claim": "...", "sourcePath": "...", "verified": true }
  ],
  "rubricScores": {
    "kolbeCongruence": 94,
    "toneMatch": 96,
    "actionability": 95,
    "surpriseFactor": 90,
    "overallScore": 93.75,
    "passedThreshold": true
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptInstructions,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({
      agentId,
      agentName,
      executionMode: "live_gemini_2.5_flash",
      status: "COMPLETED",
      ...parsed
    });
  } catch (error: any) {
    console.error("Agent simulation error:", error);
    return res.status(500).json({ error: error.message || "Failed to simulate agent" });
  }
});

// Drift & Voice Auditor endpoint
app.post("/api/audit-drift", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const bannedWords = ["delve", "revolutionize", "tapestry", "unleash", "game-changer", "supercharge", "beacon", "testament", "pivotal", "elevate", "synergy"];
    const foundBanned = bannedWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text));

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        driftScore: foundBanned.length > 0 ? 0.45 : 0.08,
        isClean: foundBanned.length === 0,
        foundBannedWords: foundBanned,
        verdict: foundBanned.length === 0 ? "PASSED_AUTHENTIC" : "DRIFT_DETECTED",
        reasons: foundBanned.length === 0 ? ["Authentic human cadence preserved.", "Zero corporate buzzwords."] : [`Detected banned AI filler: ${foundBanned.join(", ")}`],
        suggestedFix: foundBanned.length === 0 ? null : "Strip synthetic transitions and ground into declarative sentences."
      });
    }

    const auditPrompt = `
Analyze this copy snippet against the authentic voice criteria (Dayna authentic cadence: direct, punchy, human, non-corporate, zero AI clichés):
Snippet: "${text}"

Check for:
1. Banned AI clichés (${bannedWords.join(", ")})
2. Passive corporate tone or synthetic politeness
3. Cadence and sentence structure

Return JSON:
{
  "driftScore": 0.05, // 0.0 to 1.0 (lower is better, <0.2 is passed)
  "isClean": true,
  "foundBannedWords": [],
  "verdict": "PASSED_AUTHENTIC" | "DRIFT_DETECTED",
  "reasons": ["..."],
  "suggestedFix": "..." or null
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: auditPrompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Vite Middleware mounting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dayna Multi-Agent OS & Protocol Suite running on http://localhost:${PORT}`);
  });
}

startServer();
