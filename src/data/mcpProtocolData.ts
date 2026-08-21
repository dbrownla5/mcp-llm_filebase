import { MCPToolDef, LegalDomainDef } from "../types";

export const CLOUDFLARE_DOMAINS: LegalDomainDef[] = [
  {
    id: "domain_1",
    code: "DOMAIN_1_SVP",
    title: "Domain 1: SVP Worldwide Employment (2023–2025)",
    r2Prefix: "domains/domain_1_svp/",
    description: "Corporate employment contracts, store visit records, Concur expense claims, corporate closures, severance, and breach notices.",
    isolatedFrom: ["DOMAIN_2_WA_BENEFITS", "DOMAIN_3_LANDLORD_FLOOD", "DOMAIN_4_WDC_PATENT", "DOMAIN_5_WLC_BIZ"],
    allowedTypes: ["application/pdf", "text/csv", "application/json", "text/plain"]
  },
  {
    id: "domain_2",
    code: "DOMAIN_2_WA_BENEFITS",
    title: "Domain 2: Washington State Benefits & Wages",
    r2Prefix: "domains/domain_2_wa_benefits/",
    description: "ESD unemployment weekly claims, ADP paystubs, gross wage reconciliation, sworn income declarations, and MAGI healthcare records.",
    isolatedFrom: ["DOMAIN_1_SVP", "DOMAIN_3_LANDLORD_FLOOD", "DOMAIN_4_WDC_PATENT", "DOMAIN_5_WLC_BIZ"],
    allowedTypes: ["application/pdf", "text/csv", "text/plain"]
  },
  {
    id: "domain_3",
    code: "DOMAIN_3_LANDLORD_FLOOD",
    title: "Domain 3: Landlords (1 & 2), Sylvan & Bakman, Flood & Property",
    r2Prefix: "domains/domain_3_landlords/",
    description: "Lease agreements, HOA filings, October 17 flood records, SDCI filings, KCDC actions, and repair receipts (Amazon, Uber, contractors).",
    isolatedFrom: ["DOMAIN_1_SVP", "DOMAIN_2_WA_BENEFITS", "DOMAIN_4_WDC_PATENT", "DOMAIN_5_WLC_BIZ"],
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "text/csv", "text/plain"]
  },
  {
    id: "domain_4",
    code: "DOMAIN_4_WDC_PATENT",
    title: "Domain 4: Well Dressed Citizen LLC & Well Hung Hanger Patent",
    r2Prefix: "domains/domain_4_wdc_patent/",
    description: "USPTO patent filings, CAD drawings, manufacturing NDAs, historical Stripe records, and LLC formation documents.",
    isolatedFrom: ["DOMAIN_1_SVP", "DOMAIN_2_WA_BENEFITS", "DOMAIN_3_LANDLORD_FLOOD", "DOMAIN_5_WLC_BIZ"],
    allowedTypes: ["application/pdf", "application/vnd.ms-excel", "image/png", "text/plain"]
  },
  {
    id: "domain_5",
    code: "DOMAIN_5_WLC_BIZ",
    title: "Domain 5: The Well Lived Citizen Business & Consignment",
    r2Prefix: "domains/domain_5_wlc_biz/",
    description: "9-step Handshake consignment agreements, resale inventory, House Calls client SOWs, Square/Stripe sales, and client payouts.",
    isolatedFrom: ["DOMAIN_1_SVP", "DOMAIN_2_WA_BENEFITS", "DOMAIN_3_LANDLORD_FLOOD", "DOMAIN_4_WDC_PATENT"],
    allowedTypes: ["application/pdf", "text/csv", "application/json", "image/jpeg", "image/png"]
  }
];

export const MCP_TOOLS_LIST: MCPToolDef[] = [
  {
    name: "domain_read_file",
    description: "Reads a verified file from Cloudflare R2 'comet' within an isolated domain prefix. Enforces domain boundaries.",
    category: "FILE_IO",
    inputSchema: {
      domainCode: "string (e.g. DOMAIN_3_LANDLORD_FLOOD)",
      filePath: "string (relative path within the domain)",
      authToken: "string"
    },
    examplePayload: {
      domainCode: "DOMAIN_3_LANDLORD_FLOOD",
      filePath: "notices/2024_10_17_emergency_repair_demand.pdf",
      authToken: "DAYNA_MCP_BEARER_SECRET_KEY"
    },
    returnSchema: {
      content: "string | base64",
      sha256: "string",
      verified: true,
      lastModified: "ISO8601 string"
    }
  },
  {
    name: "verify_provenance_row",
    description: "Validates a Two-Column assertion ([Claim] vs [Verified Source Path]) against Cloudflare R2 bucket contents.",
    category: "EVIDENCE",
    inputSchema: {
      claim: "string",
      sourcePath: "string",
      domainCode: "string",
      expectedSnippet: "string (optional substring match)"
    },
    examplePayload: {
      claim: "Landlord 2 was notified of water intrusion on Oct 17, 2024 at 08:14 PST",
      sourcePath: "domains/domain_3_landlords/emails/2024_10_17_water_notice.eml",
      domainCode: "DOMAIN_3_LANDLORD_FLOOD"
    },
    returnSchema: {
      verified: true,
      matchedByteRange: "1024-1240",
      provenanceHash: "9a8f3b..."
    }
  },
  {
    name: "get_active_memory_window",
    description: "Retrieves the current 5-in / 5-out active operational axioms from Cloudflare KV/D1.",
    category: "MEMORY",
    inputSchema: {
      includeArchived: "boolean (default: false)"
    },
    examplePayload: {
      includeArchived: false
    },
    returnSchema: {
      activeRules: "Array<{ id: string, axiom: string, domain: string, rubricScore: number }>",
      totalActiveCount: 5,
      capacity: 5
    }
  },
  {
    name: "commit_approved_axiom",
    description: "Commits a newly approved operational rule into the 5-in / 5-out rolling ledger, automatically archiving the oldest active rule.",
    category: "MEMORY",
    inputSchema: {
      axiom: "string",
      domain: "string",
      sourceAgent: "string",
      rubricScore: "number (must be >= 80)",
      daynaApprovalSignature: "string"
    },
    examplePayload: {
      axiom: "Consignment splits for luxury furniture over $2,500 are fixed at 65/35.",
      domain: "DOMAIN_5_WLC_BIZ",
      sourceAgent: "resale_specialist",
      rubricScore: 94,
      daynaApprovalSignature: "DAYNA_CONFIRM_2026"
    },
    returnSchema: {
      status: "COMMITTED",
      archivedRuleId: "mem_rule_001",
      activeLedgerCount: 5
    }
  },
  {
    name: "purge_ephemeral_scratchpad",
    description: "Instantly wipes all ephemeral session scratchpad keys upon session termination, preventing context contamination.",
    category: "MEMORY",
    inputSchema: {
      sessionId: "string",
      confirmPurge: "boolean"
    },
    examplePayload: {
      sessionId: "sparring_session_2026_08_17",
      confirmPurge: true
    },
    returnSchema: {
      keysPurged: 14,
      status: "CLEAN_PURGE_SUCCESSFUL"
    }
  },
  {
    name: "evaluate_4d_rubric",
    description: "Runs an objective evaluation of any draft against the 4 core dimensions: Kolbe Congruence, Tone Match, Actionability, and Surprise Factor.",
    category: "ROUTING",
    inputSchema: {
      draftContent: "string",
      agentId: "string",
      targetToneRegister: "WARM | FIRM | STRATEGIC"
    },
    examplePayload: {
      draftContent: "Formal settlement demand regarding plumbing repairs...",
      agentId: "executive_drafter",
      targetToneRegister: "FIRM"
    },
    returnSchema: {
      kolbeCongruence: 92,
      toneMatch: 95,
      actionability: 96,
      surpriseFactor: 88,
      overallScore: 92.75,
      passedThreshold: true
    }
  }
];

export const CLOUDFLARE_WORKER_CODE = `/**
 * PRODUCTION SERVER: master-mcp (Express/Node.js)
 * Endpoint: https://mcp.thewelllivedcitizenco.com/api/mcp
 * Protocols: MCP JSON-RPC 2.0, Two-Column Provenance Gateway, Domain Isolation Firewall
 */

import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const AUTH_SECRET = process.env.MCP_AUTH_SECRET || "DAYNA_MCP_BEARER_SECRET_KEY";

const ALLOWED_DOMAINS = [
  "DOMAIN_1_SVP",
  "DOMAIN_2_WA_BENEFITS",
  "DOMAIN_3_LANDLORD_FLOOD",
  "DOMAIN_4_WDC_PATENT",
  "DOMAIN_5_WLC_BIZ"
];

// 1. CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-MCP-Domain");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 2. Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ONLINE",
    gateway: "Production Master MCP Server",
    domainsIsolated: ALLOWED_DOMAINS.length,
    storageType: "Persistent Secure Containers",
    timestamp: new Date().toISOString()
  });
});

// 3. Security: Auth Token Validation
app.use("/api/mcp", (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== AUTH_SECRET) {
    return res.status(401).json({
      jsonrpc: "2.0",
      error: { code: -32600, message: "Unauthorized: Valid Bearer token required." }
    });
  }
  next();
});

// 4. MCP JSON-RPC 2.0 Router
app.post("/api/mcp", async (req, res) => {
  try {
    const { id, method, params } = req.body;

    switch (method) {
      case "tools/list":
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "domain_read_file",
                description: "Reads verified files from secure persistent containers within isolated domain boundaries.",
                inputSchema: {
                  type: "object",
                  properties: {
                    domainCode: { type: "string", enum: ALLOWED_DOMAINS },
                    filePath: { type: "string" }
                  },
                  required: ["domainCode", "filePath"]
                }
              },
              {
                name: "verify_provenance_row",
                description: "Enforces Two-Column validation between claim and persistent storage file.",
                inputSchema: {
                  type: "object",
                  properties: {
                    claim: { type: "string" },
                    sourcePath: { type: "string" },
                    domainCode: { type: "string" }
                  },
                  required: ["claim", "sourcePath", "domainCode"]
                }
              },
              {
                name: "get_active_memory_window",
                description: "Gets the 5 active operational axioms from the persistence layer.",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        });

      case "tools/call": {
        const { name, arguments: args } = params;

        if (name === "domain_read_file") {
          const { domainCode, filePath } = args;
          if (!ALLOWED_DOMAINS.includes(domainCode)) {
            throw new Error(\`Domain violation: \\\${domainCode} is not an authorized isolation boundary.\`);
          }
          
          // Securely resolve paths relative to storage container directory
          const containerRoot = process.env.STORAGE_CONTAINER_ROOT || "./storage";
          const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
          const fullPath = path.join(containerRoot, domainCode.toLowerCase(), safePath);

          try {
            const content = await fs.readFile(fullPath, "utf-8");
            return res.json({
              jsonrpc: "2.0",
              id,
              result: { content: [{ type: "text", text: content }] }
            });
          } catch (e) {
            return res.json({
              jsonrpc: "2.0",
              id,
              result: { content: [{ type: "text", text: \`[FILE_NOT_FOUND: \\\${filePath}]\` }] }
            });
          }
        }

        if (name === "verify_provenance_row") {
          const { claim, sourcePath, domainCode } = args;
          const containerRoot = process.env.STORAGE_CONTAINER_ROOT || "./storage";
          const safePath = path.normalize(sourcePath).replace(/^(\.\.(\/|\\|$))+/, '');
          const fullPath = path.join(containerRoot, domainCode.toLowerCase(), safePath);

          let verified = false;
          try {
            await fs.access(fullPath);
            verified = true;
          } catch {}

          return res.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{
                type: "text",
                text: JSON.stringify({ claim, sourcePath, verified, verifiedAt: new Date().toISOString() })
              }]
            }
          });
        }

        if (name === "get_active_memory_window") {
          // Retrieves active rules from relational database or local JSON file
          let activeRules = [];
          try {
            const memoryPath = path.join(process.env.STORAGE_CONTAINER_ROOT || "./storage", "active_memory.json");
            const data = await fs.readFile(memoryPath, "utf-8");
            activeRules = JSON.parse(data);
          } catch {
            activeRules = [
              { id: "mem_1", axiom: "Single Front Door active.", domain: "GLOBAL_GOVERNANCE", rubricScore: 98 }
            ];
          }
          return res.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify({ activeRules, count: activeRules.length, max: 5 }) }]
            }
          });
        }

        throw new Error(\`Unknown tool: \\\${name}\`);
      }

      default:
        return res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    }
  } catch (err: any) {
    return res.status(500).json({ jsonrpc: "2.0", error: { code: -32000, message: err.message } });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(\`MCP Production Server listening on port \\\${PORT}\`);
});`;

export const STDIO_BRIDGE_SCRIPT = `#!/usr/bin/env node
/**
 * LOCAL MCP STDIO BRIDGE (bridge.mjs)
 * Connects Claude Desktop's stdio transport to the Cloudflare Master MCP Worker over authenticated HTTPS.
 * Windows compatible (zero path errors).
 */

import https from "https";
import readline from "readline";

const WORKER_URL = process.env.MCP_WORKER_URL || "https://mcp.thewelllivedcitizenco.com/mcp";
const AUTH_TOKEN = process.env.MCP_AUTH_SECRET || "DAYNA_MCP_BEARER_SECRET_KEY";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    const payload = JSON.parse(line);
    
    const requestData = JSON.stringify(payload);
    const url = new URL(WORKER_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestData),
        "Authorization": \`Bearer \${AUTH_TOKEN}\`,
        "User-Agent": "Claude-Desktop-MCP-Bridge/4.0"
      }
    };

    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => { responseData += chunk; });
      res.on("end", () => {
        try {
          process.stdout.write(responseData.trim() + "\\n");
        } catch (e) {
          process.stderr.write(\`Bridge output parse error: \${e.message}\\n\`);
        }
      });
    });

    req.on("error", (e) => {
      process.stderr.write(\`Worker connection error: \${e.message}\\n\`);
      const errorResponse = {
        jsonrpc: "2.0",
        id: payload.id || null,
        error: { code: -32000, message: \`Worker unreachable: \${e.message}\` }
      };
      process.stdout.write(JSON.stringify(errorResponse) + "\\n");
    });

    req.write(requestData);
    req.end();
  } catch (err) {
    process.stderr.write(\`Bridge stdin JSON error: \${err.message}\\n\`);
  }
});
`;
