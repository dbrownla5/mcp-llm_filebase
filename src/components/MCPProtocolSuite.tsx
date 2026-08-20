import React, { useState } from "react";
import { 
  CLOUDFLARE_DOMAINS, 
  MCP_TOOLS_LIST, 
  CLOUDFLARE_WORKER_CODE, 
  STDIO_BRIDGE_SCRIPT 
} from "../data/mcpProtocolData";
import { 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Lock, 
  ShieldCheck, 
  FolderTree, 
  Download, 
  FileCode2,
  ExternalLink,
  Cpu
} from "lucide-react";

export const MCPProtocolSuite: React.FC = () => {
  const [platform, setPlatform] = useState<"WINDOWS" | "MACOS" | "LINUX">("WINDOWS");
  const [bridgePath, setBridgePath] = useState<string>("C:\\Users\\Dayna\\Documents\\Dayna_System\\bridge.mjs");
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedWorker, setCopiedWorker] = useState(false);
  const [copiedBridge, setCopiedBridge] = useState(false);
  const [activeMcpTab, setActiveMcpTab] = useState<"config" | "worker" | "bridge" | "tools" | "domains">("config");

  // Format Windows JSON with double backslashes
  const formattedBridgePath = platform === "WINDOWS" 
    ? bridgePath.replace(/\\/g, "\\\\") 
    : bridgePath;

  const claudeDesktopConfig = {
    mcpServers: {
      "dayna-master-mcp": {
        command: "node",
        args: [platform === "WINDOWS" ? formattedBridgePath : bridgePath],
        env: {
          MCP_WORKER_URL: "https://mcp.thewelllivedcitizenco.com/mcp",
          MCP_AUTH_SECRET: "DAYNA_MCP_BEARER_SECRET_KEY"
        }
      }
    }
  };

  const configString = JSON.stringify(claudeDesktopConfig, null, 2);

  const handleCopy = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-700">
              Protocol Infrastructure & MCP Bridge
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Cloudflare Worker • R2 'comet' • JSON-RPC 2.0 • Claude Desktop Stdio
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 tracking-tight">
            Cloudflare MCP Suite & Desktop Bridge
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-neutral-900 text-white px-3 py-2 rounded-xl shadow-xs">
          <Server className="h-4 w-4 text-emerald-400" />
          <span>https://mcp.thewelllivedcitizenco.com/mcp</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveMcpTab("config")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeMcpTab === "config"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <Terminal className="h-4 w-4 text-purple-400" />
          <span>1. Claude Desktop Config</span>
        </button>

        <button
          onClick={() => setActiveMcpTab("worker")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeMcpTab === "worker"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <FileCode2 className="h-4 w-4 text-emerald-400" />
          <span>2. Cloudflare Worker (worker.ts)</span>
        </button>

        <button
          onClick={() => setActiveMcpTab("bridge")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeMcpTab === "bridge"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <Cpu className="h-4 w-4 text-amber-400" />
          <span>3. Stdio Bridge (bridge.mjs)</span>
        </button>

        <button
          onClick={() => setActiveMcpTab("domains")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeMcpTab === "domains"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <Lock className="h-4 w-4 text-red-400" />
          <span>4. 5-Domain Firewall</span>
        </button>

        <button
          onClick={() => setActiveMcpTab("tools")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeMcpTab === "tools"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>5. MCP Tools Catalog ({MCP_TOOLS_LIST.length})</span>
        </button>
      </div>

      {/* TAB 1: CLAUDE DESKTOP CONFIG GENERATOR */}
      {activeMcpTab === "config" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Claude Desktop MCP Configuration Generator
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Generates ready-to-paste JSON with zero Windows backslash escaping errors.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {(["WINDOWS", "MACOS", "LINUX"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlatform(p);
                      if (p === "WINDOWS") setBridgePath("C:\\Users\\Dayna\\Documents\\Dayna_System\\bridge.mjs");
                      if (p === "MACOS") setBridgePath("/Users/dayna/Documents/Dayna_System/bridge.mjs");
                      if (p === "LINUX") setBridgePath("/home/dayna/dayna_system/bridge.mjs");
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      platform === p
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Local Bridge Path on Disk:
                </label>
                <input
                  type="text"
                  value={bridgePath}
                  onChange={(e) => setBridgePath(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-mono text-neutral-900 focus:outline-none"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {platform === "WINDOWS" ? "File Location: %APPDATA%\\Claude\\claude_desktop_config.json" : "File Location: ~/Library/Application Support/Claude/claude_desktop_config.json"}
                </span>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-700">claude_desktop_config.json</span>
                  <button
                    onClick={() => handleCopy(configString, setCopiedConfig)}
                    className="flex items-center space-x-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    {copiedConfig ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Config JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {configString}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUDFLARE WORKER CODE */}
      {activeMcpTab === "worker" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Cloudflare Worker: master-mcp (worker.ts)
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Production TypeScript worker handling JSON-RPC 2.0 MCP requests, R2 'comet' bucket access, and 5-domain isolation.
                </p>
              </div>
              <button
                onClick={() => handleCopy(CLOUDFLARE_WORKER_CODE, setCopiedWorker)}
                className="flex items-center space-x-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                {copiedWorker ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Worker Code</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy worker.ts</span>
                  </>
                )}
              </button>
            </div>

            <pre className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {CLOUDFLARE_WORKER_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: STDIO BRIDGE SCRIPT */}
      {activeMcpTab === "bridge" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Node.js Stdio Bridge (bridge.mjs)
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Bridges Claude Desktop stdin/stdout to the Cloudflare Worker over authenticated HTTPS.
                </p>
              </div>
              <button
                onClick={() => handleCopy(STDIO_BRIDGE_SCRIPT, setCopiedBridge)}
                className="flex items-center space-x-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                {copiedBridge ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Bridge Script</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy bridge.mjs</span>
                  </>
                )}
              </button>
            </div>

            <pre className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {STDIO_BRIDGE_SCRIPT}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: 5-DOMAIN FIREWALL */}
      {activeMcpTab === "domains" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="mb-4 pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
                <Lock className="h-5 w-5 text-red-600" />
                <span>5 Legal & Business Operational Domains (Strict Firewall Isolation)</span>
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                The Master MCP Worker rejects any cross-domain file reads. SVP employment files cannot touch WA benefits, and landlord disputes cannot cross into WLC business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLOUDFLARE_DOMAINS.map((domain) => (
                <div key={domain.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {domain.code}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ISOLATED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900">{domain.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{domain.description}</p>
                  <div className="text-[11px] font-mono text-neutral-500 bg-white p-2 rounded border border-neutral-200">
                    R2 Prefix: <strong className="text-neutral-800">{domain.r2Prefix}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MCP TOOLS CATALOG */}
      {activeMcpTab === "tools" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="mb-4 pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                Master MCP Tool Catalog
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Registered JSON-RPC 2.0 tools exposed to Claude Desktop through the master-mcp bridge.
              </p>
            </div>

            <div className="space-y-4">
              {MCP_TOOLS_LIST.map((tool) => (
                <div key={tool.name} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded border">
                      Category: {tool.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700">{tool.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase">Input Schema</div>
                      <pre className="text-[11px] font-mono text-neutral-800 bg-white p-2 rounded border mt-1">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase">Example Payload</div>
                      <pre className="text-[11px] font-mono text-neutral-800 bg-white p-2 rounded border mt-1">
                        {JSON.stringify(tool.examplePayload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
