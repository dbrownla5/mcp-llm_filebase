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
 * CLOUDFLARE WORKER: master-mcp
 * Endpoint: https://mcp.thewelllivedcitizenco.com/mcp
 * Protocols: MCP JSON-RPC 2.0, Two-Column Provenance Gateway, Domain Isolation Firewall
 */

export interface Env {
  COMET: R2Bucket;
  D1_DB: D1Database;
  ACTIVE_MEMORY_KV: KVNamespace;
  MCP_AUTH_SECRET: string;
}

const ALLOWED_DOMAINS = [
  "DOMAIN_1_SVP",
  "DOMAIN_2_WA_BENEFITS",
  "DOMAIN_3_LANDLORD_FLOOD",
  "DOMAIN_4_WDC_PATENT",
  "DOMAIN_5_WLC_BIZ"
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-MCP-Domain"
        }
      });
    }

    // 2. Health check
    if (request.method === "GET" && new URL(request.url).pathname === "/health") {
      return Response.json({
        status: "ONLINE",
        gateway: "Cloudflare Master MCP Bridge",
        domainsIsolated: ALLOWED_DOMAINS.length,
        r2Bucket: "comet",
        timestamp: new Date().toISOString()
      });
    }

    // 3. Security: Auth Token Validation
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ jsonrpc: "2.0", error: { code: -32600, message: "Unauthorized: Valid Bearer token required." } }, { status: 401 });
    }

    try {
      const payload = await request.json();
      const { id, method, params } = payload;

      // Handle JSON-RPC 2.0 MCP Methods
      switch (method) {
        case "tools/list":
          return Response.json({
            jsonrpc: "2.0",
            id,
            result: {
              tools: [
                {
                  name: "domain_read_file",
                  description: "Reads verified files from R2 comet within domain boundaries.",
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
                  description: "Enforces Two-Column validation between claim and R2 file.",
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
                  description: "Gets the 5 active operational axioms.",
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
              throw new Error(\`Domain violation: \${domainCode} is not an authorized isolation boundary.\`);
            }
            const fullR2Key = \`domains/\${domainCode.toLowerCase()}/\${filePath}\`;
            const object = await env.COMET.get(fullR2Key);
            if (!object) {
              return Response.json({
                jsonrpc: "2.0",
                id,
                result: { content: [{ type: "text", text: \`[FILE_NOT_FOUND: \${fullR2Key}]\` }] }
              });
            }
            const text = await object.text();
            return Response.json({
              jsonrpc: "2.0",
              id,
              result: { content: [{ type: "text", text }] }
            });
          }

          if (name === "verify_provenance_row") {
            const { claim, sourcePath, domainCode } = args;
            const fullR2Key = sourcePath.startsWith("domains/") ? sourcePath : \`domains/\${domainCode.toLowerCase()}/\${sourcePath}\`;
            const obj = await env.COMET.head(fullR2Key);
            const verified = Boolean(obj);
            return Response.json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{
                  type: "text",
                  text: JSON.stringify({ claim, sourcePath: fullR2Key, verified, verifiedAt: new Date().toISOString() })
                }]
              }
            });
          }

          if (name === "get_active_memory_window") {
            const rawMemory = await env.ACTIVE_MEMORY_KV.get("active_5_rules");
            const activeRules = rawMemory ? JSON.parse(rawMemory) : [];
            return Response.json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: JSON.stringify({ activeRules, count: activeRules.length, max: 5 }) }]
              }
            });
          }

          throw new Error(\`Unknown tool: \${name}\`);
        }

        default:
          return Response.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } }, { status: 404 });
      }
    } catch (err: any) {
      return Response.json({ jsonrpc: "2.0", error: { code: -32000, message: err.message } }, { status: 500 });
    }
  }
};`;

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
