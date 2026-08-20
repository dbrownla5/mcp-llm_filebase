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
  const [activeTab, setActiveTab] = useState<"agents" | "sandbox" | "engines" | "mcp" | "guide" | "export">("agents");
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AgentDefinition | null>(null);
  const [sandboxTargetAgent, setSandboxTargetAgent] = useState<AgentDefinition | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

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
