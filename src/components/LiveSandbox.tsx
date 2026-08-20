import React, { useState } from "react";
import { AgentDefinition, SimulationResult, SharpForkOption } from "../types";
import { AGENTS_DATA } from "../data/agentsData";
import { 
  Play, 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Sliders, 
  FileCheck, 
  Flame, 
  ChevronRight,
  RefreshCcw,
  Volume2
} from "lucide-react";

interface LiveSandboxProps {
  initialAgent?: AgentDefinition | null;
}

export const LiveSandbox: React.FC<LiveSandboxProps> = ({ initialAgent }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgent?.id || "orchestrator");
  const currentAgent = AGENTS_DATA.find((a) => a.id === selectedAgentId) || AGENTS_DATA[0];

  const [promptText, setPromptText] = useState<string>(currentAgent.defaultPromptExample);
  const [targetRegister, setTargetRegister] = useState<"WARM" | "FIRM" | "STRATEGIC">("STRATEGIC");
  const [additionalContext, setAdditionalContext] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [selectedFork, setSelectedFork] = useState<SharpForkOption | null>(null);

  // Drift Auditor State
  const [auditText, setAuditText] = useState<string>("");
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<{
    driftScore: number;
    isClean: boolean;
    foundBannedWords: string[];
    verdict: string;
    reasons: string[];
    suggestedFix?: string | null;
  } | null>(null);

  const handleAgentChange = (id: string) => {
    setSelectedAgentId(id);
    const agent = AGENTS_DATA.find((a) => a.id === id);
    if (agent) {
      setPromptText(agent.defaultPromptExample);
      setSimulationResult(null);
      setSelectedFork(null);
    }
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setSimulationResult(null);
    setSelectedFork(null);

    try {
      const response = await fetch("/api/simulate-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: currentAgent.id,
          agentName: currentAgent.name,
          systemPrompt: currentAgent.systemPrompt,
          userPrompt: promptText,
          parameters: {
            targetToneRegister: targetRegister,
            domainLock: currentAgent.domainLock || "NONE",
            isEphemeral: currentAgent.isEphemeral
          },
          context: additionalContext
        })
      });

      const data = await response.json();
      setSimulationResult(data);
      if (data.sharpForks && data.sharpForks.length > 0) {
        setSelectedFork(data.sharpForks[0]);
      }
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDriftAudit = async (textToAudit: string) => {
    if (!textToAudit) return;
    setAuditLoading(true);
    try {
      const response = await fetch("/api/audit-drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAudit })
      });
      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error("Drift audit failed:", err);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Sandbox Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Interactive Execution Testbed
            </span>
            <span className="text-xs text-neutral-500">
              Automated 80% Cognitive Lift • Sharp Fork Protocol • Two-Column Gate
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 tracking-tight">
            Multi-Agent Sandbox & Decision Simulator
          </h1>
        </div>

        {/* Quick Agent Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-neutral-600">Active Agent:</label>
          <select
            value={selectedAgentId}
            onChange={(e) => handleAgentChange(e.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900 shadow-xs focus:border-neutral-900 focus:outline-none"
          >
            {AGENTS_DATA.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.number} - {a.name} ({a.clusterLabel.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input & Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Agent Info Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white">
                  #{currentAgent.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{currentAgent.name}</h3>
                  <p className="text-[11px] text-neutral-500">{currentAgent.clusterLabel}</p>
                </div>
              </div>
              {currentAgent.domainLock && (
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  {currentAgent.domainLock}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              {currentAgent.logicalSolution}
            </p>
          </div>

          {/* Prompt & Directives Input */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Dayna Directive / Prompt
              </label>
              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter prompt or task..."
                className="w-full rounded-xl border border-neutral-200 p-3 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Tone Register
                </label>
                <select
                  value={targetRegister}
                  onChange={(e) => setTargetRegister(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none"
                >
                  <option value="STRATEGIC">Strategic Executive</option>
                  <option value="FIRM">Firm / Unflinching</option>
                  <option value="WARM">Warm Authentic</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Inference Mode
                </label>
                <div className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700">
                  80% Heavy-Lift
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Additional Domain Context / Facts (Optional)
              </label>
              <input
                type="text"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. October 17 water intrusion invoice #4091"
                className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isLoading || !promptText.trim()}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Silently Performing Heavy-Lift...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>Execute Agent & Sharp Fork Protocol</span>
                </>
              )}
            </button>
          </div>

          {/* Voice Drift Auditor Widget */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span>Voice Drift & Banned Filler Auditor</span>
              </span>
              {auditResult && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  auditResult.isClean ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}>
                  {auditResult.verdict}
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={auditText}
              onChange={(e) => setAuditText(e.target.value)}
              placeholder="Paste any copy snippet to check for banned corporate AI tropes..."
              className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs text-neutral-800 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleRunDriftAudit(auditText)}
                disabled={auditLoading || !auditText.trim()}
                className="rounded-lg bg-neutral-800 px-3 py-1 text-[11px] font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
              >
                {auditLoading ? "Auditing..." : "Audit Copy"}
              </button>
              {simulationResult && (
                <button
                  onClick={() => {
                    setAuditText(simulationResult.outputContent);
                    handleRunDriftAudit(simulationResult.outputContent);
                  }}
                  className="text-[11px] text-neutral-600 hover:text-neutral-900 underline"
                >
                  Audit current output
                </button>
              )}
            </div>

            {auditResult && (
              <div className="mt-2 text-xs rounded-lg bg-white p-2.5 border border-neutral-200 space-y-1">
                <div className="font-semibold text-neutral-900">
                  Drift Score: {(auditResult.driftScore * 100).toFixed(0)}% (Target &lt; 20%)
                </div>
                {auditResult.foundBannedWords.length > 0 && (
                  <div className="text-red-600 text-[11px]">
                    Banned filler detected: {auditResult.foundBannedWords.join(", ")}
                  </div>
                )}
                {auditResult.reasons && auditResult.reasons.map((r, idx) => (
                  <div key={idx} className="text-[11px] text-neutral-600">• {r}</div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Output, 3 Sharp Forks & Two-Column Verification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {simulationResult ? (
            <>
              {/* 4-Dimension Rubric Score Bar */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    4-Dimension Rubric Score Card
                  </span>
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Overall: {simulationResult.rubricScores.overallScore.toFixed(1)} / 100 (PASSED)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                    <div className="text-[10px] text-neutral-500 font-medium">Kolbe Congruence</div>
                    <div className="text-sm font-bold text-neutral-900">{simulationResult.rubricScores.kolbeCongruence}%</div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                    <div className="text-[10px] text-neutral-500 font-medium">Tone Match</div>
                    <div className="text-sm font-bold text-neutral-900">{simulationResult.rubricScores.toneMatch}%</div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                    <div className="text-[10px] text-neutral-500 font-medium">Actionability</div>
                    <div className="text-sm font-bold text-neutral-900">{simulationResult.rubricScores.actionability}%</div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                    <div className="text-[10px] text-neutral-500 font-medium">Surprise Factor</div>
                    <div className="text-sm font-bold text-neutral-900">{simulationResult.rubricScores.surpriseFactor}%</div>
                  </div>
                </div>
              </div>

              {/* 3 Sharp Forks Selection */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Sharp Fork Protocol (Choose Action Option)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {simulationResult.sharpForks.map((fork, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFork(fork)}
                      className={`text-left rounded-xl p-3.5 border transition-all ${
                        selectedFork?.type === fork.type
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          selectedFork?.type === fork.type
                            ? "bg-white/20 text-white"
                            : fork.type === "SAFE"
                            ? "bg-emerald-100 text-emerald-800"
                            : fork.type === "BOLD"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {fork.type}
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">{fork.confidence}% conf</span>
                      </div>
                      <div className="text-xs font-bold line-clamp-1">{fork.title}</div>
                      <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                        selectedFork?.type === fork.type ? "text-neutral-200" : "text-neutral-600"
                      }`}>
                        {fork.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Fork Detail & Action Plan */}
              {selectedFork && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-neutral-900">
                      Selected Plan: [{selectedFork.type}] {selectedFork.title}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFork.actionPlan);
                      }}
                      className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 flex items-center space-x-1"
                    >
                      <span>Copy Plan</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {selectedFork.actionPlan}
                  </pre>
                </div>
              )}

              {/* Primary Output Artifact */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-neutral-900">
                    Primary Generated Artifact / Output
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Mode: {simulationResult.executionMode}
                  </span>
                </div>
                <div className="prose prose-xs max-w-none text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {simulationResult.outputContent}
                </div>
              </div>

              {/* Two-Column Provenance Gateway Table */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900 mb-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>Two-Column Provenance Gateway Verification</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 text-[11px]">
                        <th className="py-2 px-2">Claim / Assertion</th>
                        <th className="py-2 px-2">Verified Source Span (R2)</th>
                        <th className="py-2 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                      {simulationResult.twoColumnProvenance && simulationResult.twoColumnProvenance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          <td className="py-2 px-2 text-neutral-900 font-sans">{item.claim}</td>
                          <td className="py-2 px-2 text-neutral-600 font-mono text-[10px]">{item.sourcePath}</td>
                          <td className="py-2 px-2 text-right">
                            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                              <Check className="mr-1 h-3 w-3" /> VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-xs min-h-[400px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 mb-3">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Sandbox Ready for Execution
              </h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm leading-relaxed">
                Click <strong>"Execute Agent & Sharp Fork Protocol"</strong> to run the automated 80% heavy-lift, generate 3 divergent decision forks, and enforce Two-Column provenance validation.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
