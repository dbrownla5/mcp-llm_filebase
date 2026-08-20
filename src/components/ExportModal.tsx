import React, { useState } from "react";
import { AGENTS_DATA } from "../data/agentsData";
import { CLOUDFLARE_DOMAINS, CLOUDFLARE_WORKER_CODE, STDIO_BRIDGE_SCRIPT } from "../data/mcpProtocolData";
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FolderArchive,
  CheckCircle2,
  Terminal,
  Server
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileKey, setSelectedFileKey] = useState<"yaml" | "config" | "worker" | "bridge" | "blueprint">("yaml");

  if (!isOpen) return null;

  // Generate agents.yaml
  const yamlContent = `# DAYNA MULTI-AGENT SYSTEM CONFIGURATION (config/agents.yaml)
# System Version: 4.0.0
# Endpoint: https://mcp.thewelllivedcitizenco.com/mcp
# Primary Bucket: comet

version: "4.0.0"
governance:
  single_front_door: "orchestrator"
  rubric_threshold: 80
  memory_matrix: "5_in_5_out"
  ephemeral_purge: true

domains:
${CLOUDFLARE_DOMAINS.map(d => `  - code: ${d.code}
    title: "${d.title}"
    r2_prefix: "${d.r2Prefix}"
    isolated: true`).join("\n")}

agents:
${AGENTS_DATA.map(a => `  - id: "${a.id}"
    number: ${a.number}
    name: "${a.name}"
    cluster: "${a.cluster}"
    talks_to_dayna: ${a.talksToDayna}
    is_ephemeral: ${a.isEphemeral}
    domain_lock: "${a.domainLock || "NONE"}"
    sharp_forks:
      safe: "${a.sharpForkStrategy.safe.replace(/"/g, '\\"')}"
      bold: "${a.sharpForkStrategy.bold.replace(/"/g, '\\"')}"
      disruptive: "${a.sharpForkStrategy.disruptive.replace(/"/g, '\\"')}"`).join("\n\n")}
`;

  const configContent = JSON.stringify({
    mcpServers: {
      "dayna-master-mcp": {
        command: "node",
        args: ["C:\\\\Users\\\\Dayna\\\\Documents\\\\Dayna_System\\\\bridge.mjs"],
        env: {
          MCP_WORKER_URL: "https://mcp.thewelllivedcitizenco.com/mcp",
          MCP_AUTH_SECRET: "DAYNA_MCP_BEARER_SECRET_KEY"
        }
      }
    }
  }, null, 2);

  const blueprintContent = JSON.stringify({
    system: "Dayna Multi-Agent Operating System",
    version: "4.0.0",
    domains: CLOUDFLARE_DOMAINS,
    totalAgents: AGENTS_DATA.length,
    agents: AGENTS_DATA
  }, null, 2);

  const filesMap: Record<string, { name: string; content: string; lang: string }> = {
    yaml: { name: "config/agents.yaml", content: yamlContent, lang: "yaml" },
    config: { name: "claude_desktop_config.json", content: configContent, lang: "json" },
    worker: { name: "src/worker.ts", content: CLOUDFLARE_WORKER_CODE, lang: "typescript" },
    bridge: { name: "bridge.mjs", content: STDIO_BRIDGE_SCRIPT, lang: "javascript" },
    blueprint: { name: "dayna_system_blueprint.json", content: blueprintContent, lang: "json" }
  };

  const currentFile = filesMap[selectedFileKey];

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename.split("/").pop() || filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <FolderArchive className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Export Complete System Deliverable Package
            </h2>
            <p className="text-xs text-neutral-500">
              All 21 agent definitions, Cloudflare Worker, Stdio Bridge, and Claude Desktop configs ready for overnight execution.
            </p>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex space-x-1.5 border-b border-neutral-200 pb-2 overflow-x-auto">
          {Object.entries(filesMap).map(([key, file]) => (
            <button
              key={key}
              onClick={() => setSelectedFileKey(key as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                selectedFileKey === key
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>

        {/* File Preview */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-600 font-bold">{currentFile.name}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(selectedFileKey, currentFile.content)}
                className="flex items-center space-x-1 rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {copiedFile === selectedFileKey ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Content</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownload(currentFile.name, currentFile.content)}
                className="flex items-center space-x-1 rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Download File</span>
              </button>
            </div>
          </div>

          <pre className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
            {currentFile.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
          <span className="text-xs text-neutral-500 font-medium">
            21 Agents • 5 Isolated Domains • R2 'comet' • JSON-RPC 2.0
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
