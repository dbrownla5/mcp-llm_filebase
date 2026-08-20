import React, { useState } from "react";
import { AgentDefinition } from "../types";
import { 
  X, 
  Copy, 
  Check, 
  ShieldAlert, 
  Cpu, 
  Sparkles, 
  Lock, 
  Flame, 
  CheckCircle2, 
  RotateCw,
  FileCode2,
  TableProperties
} from "lucide-react";

interface AgentDetailModalProps {
  agent: AgentDefinition | null;
  onClose: () => void;
  onLaunchSandbox: (agent: AgentDefinition) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onLaunchSandbox
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "prompt" | "guardrails" | "io">("overview");

  if (!agent) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 pr-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white font-bold text-sm">
            #{agent.number}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {agent.clusterLabel}
              </span>
              {agent.domainLock && (
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <Lock className="mr-1 h-3 w-3" />
                  {agent.domainLock}
                </span>
              )}
              {agent.isEphemeral && (
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  <Flame className="mr-1 h-3 w-3" />
                  Ephemeral Purge
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-bold text-neutral-900">{agent.name}</h2>
            <p className="text-xs text-neutral-600 mt-0.5">{agent.role}</p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="mt-6 flex space-x-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Logical Solution & Mandate
          </button>

          <button
            onClick={() => setActiveTab("guardrails")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "guardrails"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Guardrails & Two-Column
          </button>

          <button
            onClick={() => setActiveTab("prompt")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "prompt"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            System Prompt (Claude Desktop)
          </button>

          <button
            onClick={() => setActiveTab("io")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "io"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            I/O & Learning Loop
          </button>
        </div>

        {/* Modal Content Bodies */}
        <div className="mt-4 max-h-[55vh] overflow-y-auto pr-1">
          
          {/* TAB 1: OVERVIEW & SHARP FORKS */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900 mb-1">
                  <Cpu className="h-4 w-4 text-amber-500" />
                  <span>Logical Solution Blueprint</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {agent.logicalSolution}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Sharp Fork Protocol (3 Divergent Options)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 mb-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      <span>Safe (Baseline)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      {agent.sharpForkStrategy.safe}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 mb-1">
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                      <span>Bold (Elevated)</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      {agent.sharpForkStrategy.bold}
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900 mb-1">
                      <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                      <span>Disruptive (Pivot)</span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      {agent.sharpForkStrategy.disruptive}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-3">
                <div className="text-[11px] font-bold text-neutral-800 mb-1">Sample Prompt Directives</div>
                <p className="text-xs font-mono text-neutral-600 bg-neutral-100 p-2.5 rounded-lg">
                  "{agent.defaultPromptExample}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GUARDRAILS & TWO-COLUMN */}
          {activeTab === "guardrails" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900 mb-2">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <span>Non-Negotiable Containment Guardrails</span>
                </div>
                <ul className="space-y-2">
                  {agent.guardrails.map((g, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-neutral-700 bg-red-50/40 border border-red-100 rounded-lg p-2.5">
                      <span className="font-bold text-red-600 text-xs">#{idx + 1}</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900 mb-1">
                  <TableProperties className="h-4 w-4 text-blue-600" />
                  <span>Two-Column Gateway Verification Standard</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {agent.twoColumnRequirements}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM PROMPT */}
          {activeTab === "prompt" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500">Exact Markdown system prompt configured for Claude Desktop</span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center space-x-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {agent.systemPrompt}
              </pre>
            </div>
          )}

          {/* TAB 4: I/O & LEARNING LOOP */}
          {activeTab === "io" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                  <div className="text-xs font-bold text-neutral-900 mb-1">Input Ingestion Standard</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{agent.inputsDescription}</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
                  <div className="text-xs font-bold text-neutral-900 mb-1">Output Packaging Standard</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{agent.outputsDescription}</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-950 mb-1">
                  <RotateCw className="h-4 w-4 text-blue-600" />
                  <span>Dynamic Feedback & Calibration Loop</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">{agent.learningLoop}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Close Blueprint
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchSandbox(agent);
            }}
            className="flex items-center space-x-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Launch in Live Sandbox</span>
          </button>
        </div>

      </div>
    </div>
  );
};
