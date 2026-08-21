import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AgentMatrixView } from "./components/AgentMatrixView";
import { AgentDetailModal } from "./components/AgentDetailModal";
import { LiveSandbox } from "./components/LiveSandbox";
import { CoreEnginesView } from "./components/CoreEnginesView";
import { MCPProtocolSuite } from "./components/MCPProtocolSuite";
import { GuidekitView } from "./components/GuidekitView";
import { ExportModal } from "./components/ExportModal";
import { AgentDefinition, RollingMemoryItem } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<"agents" | "sandbox" | "engines" | "mcp" | "guide" | "export">("sandbox");
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AgentDefinition | null>(null);
  const [sandboxTargetAgent, setSandboxTargetAgent] = useState<AgentDefinition | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Secure Passcode Portal Gate (Zero-config local security)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("dayna_portal_unlocked") === "true";
  });
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcodeInput.trim().toLowerCase();
    // Accept user preference codes (310, dayna-mcp, dayna310)
    if (cleanPass === "310" || cleanPass === "dayna-mcp" || cleanPass === "dayna310") {
      localStorage.setItem("dayna_portal_unlocked", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid master passcode. Access denied.");
    }
  };

  // Shared 5-in / 5-out active memory matrix
  const [activeMemoryList, setActiveMemoryList] = useState<RollingMemoryItem[]>([
    {
      id: "mem_1",
      axiom: "Single Front Door: Only the Master Orchestrator speaks directly to Dayna. All specialist sub-agents operate silently.",
      domain: "GLOBAL_GOVERNANCE",
      sourceAgent: "Master Orchestrator",
      status: "ACTIVE",
      dateCommitted: "2026-08-17",
      rubricScore: 98
    },
    {
      id: "mem_2",
      axiom: "Two-Column Gateway: Block any factual claim lacking an exact verified source path in Cloudflare R2 'comet'.",
      domain: "GLOBAL_GOVERNANCE",
      sourceAgent: "Memory Sentinel",
      status: "ACTIVE",
      dateCommitted: "2026-08-17",
      rubricScore: 96
    },
    {
      id: "mem_3",
      axiom: "Sharp Fork Protocol: Never ask 'How do you want to proceed?'. Deliver 3 finished divergent forks (Safe, Bold, Disruptive).",
      domain: "GLOBAL_GOVERNANCE",
      sourceAgent: "Master Orchestrator",
      status: "ACTIVE",
      dateCommitted: "2026-08-17",
      rubricScore: 95
    },
    {
      id: "mem_4",
      axiom: "4-Dimension Rubric (Threshold >= 80): Auto-reject any draft with corporate filler ('delve', 'tapestry', 'game-changer').",
      domain: "GLOBAL_GOVERNANCE",
      sourceAgent: "Reality-Check Sentinel",
      status: "ACTIVE",
      dateCommitted: "2026-08-17",
      rubricScore: 94
    },
    {
      id: "mem_5",
      axiom: "Domain Isolation Firewall: Strict R2 prefix barriers between SVP, WA Benefits, Landlords/Flood, Patent, and WLC Business.",
      domain: "GLOBAL_GOVERNANCE",
      sourceAgent: "Cloudflare Master MCP",
      status: "ACTIVE",
      dateCommitted: "2026-08-17",
      rubricScore: 97
    }
  ]);

  const handleLaunchSandbox = (agent: AgentDefinition) => {
    setSandboxTargetAgent(agent);
    setActiveTab("sandbox");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100/50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-sm mb-4">
              <span className="text-xl font-bold text-amber-400">D</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Secure Gatekeeper Portal
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Dayna Multi-Agent Operating System Workspace
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Master Passcode
              </label>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setAuthError("");
                }}
                placeholder="••••"
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-center text-sm tracking-widest focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-100 pt-4 text-center">
            <p className="text-[11px] text-neutral-400">
              For security, this workspace runs locally or in isolated sandboxes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        activeMemoryCount={activeMemoryList.filter((i) => i.status === "ACTIVE").length}
      />

      {/* Main Workspace View */}
      <main className="pb-16">
        {activeTab === "agents" && (
          <AgentMatrixView
            onSelectAgent={(agent) => setSelectedAgentForModal(agent)}
            onLaunchSandbox={handleLaunchSandbox}
          />
        )}

        {activeTab === "sandbox" && (
          <LiveSandbox initialAgent={sandboxTargetAgent} />
        )}

        {activeTab === "engines" && (
          <CoreEnginesView
            activeMemoryList={activeMemoryList}
            setActiveMemoryList={setActiveMemoryList}
          />
        )}

        {activeTab === "mcp" && <MCPProtocolSuite />}

        {activeTab === "guide" && <GuidekitView />}
      </main>

      {/* Agent Detail Blueprint Modal */}
      <AgentDetailModal
        agent={selectedAgentForModal}
        onClose={() => setSelectedAgentForModal(null)}
        onLaunchSandbox={handleLaunchSandbox}
      />

      {/* Export Deliverable Bundle Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}

export default App;
