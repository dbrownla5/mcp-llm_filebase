import React, { useState, useMemo } from "react";
import { AgentDefinition, AgentCluster } from "../types";
import { AGENTS_DATA } from "../data/agentsData";
import { 
  Search, 
  Shield, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  MessageSquareOff,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";

interface AgentMatrixViewProps {
  onSelectAgent: (agent: AgentDefinition) => void;
  onLaunchSandbox: (agent: AgentDefinition) => void;
}

const CLUSTERS: { key: AgentCluster | "ALL"; label: string; count: number }[] = [
  { key: "ALL", label: "All Agents", count: 21 },
  { key: "GOVERNANCE", label: "Core Governance", count: 3 },
  { key: "FORENSIC_LEGAL", label: "Forensic & Legal", count: 5 },
  { key: "CAREER_EXECUTIVE", label: "Career & Executive", count: 7 },
  { key: "WLC_BUSINESS", label: "WLC Business Engine", count: 5 },
  { key: "PERSONAL_LIFE", label: "Personal & Sparring", count: 2 },
  { key: "TECH_ASSETS", label: "Tech & Assets", count: 4 }
];

export const AgentMatrixView: React.FC<AgentMatrixViewProps> = ({
  onSelectAgent,
  onLaunchSandbox
}) => {
  const [selectedCluster, setSelectedCluster] = useState<AgentCluster | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomainLockedOnly, setFilterDomainLockedOnly] = useState(false);
  const [filterEphemeralOnly, setFilterEphemeralOnly] = useState(false);

  const filteredAgents = useMemo(() => {
    return AGENTS_DATA.filter((agent) => {
      // Cluster filter
      if (selectedCluster !== "ALL" && agent.cluster !== selectedCluster) {
        return false;
      }
      // Domain lock toggle
      if (filterDomainLockedOnly && !agent.domainLock) {
        return false;
      }
      // Ephemeral toggle
      if (filterEphemeralOnly && !agent.isEphemeral) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = agent.name.toLowerCase().includes(query);
        const inRole = agent.role.toLowerCase().includes(query);
        const inSolution = agent.logicalSolution.toLowerCase().includes(query);
        const inCluster = agent.clusterLabel.toLowerCase().includes(query);
        return inName || inRole || inSolution || inCluster;
      }
      return true;
    });
  }, [selectedCluster, searchQuery, filterDomainLockedOnly, filterEphemeralOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Banner: Roster Strategy */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wider">
                Operating Architecture
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                21 Specialized Agents • 6 Functional Clusters
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900 tracking-tight">
              Dayna Multi-Agent System Matrix
            </h1>
            <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
              Every agent is bound to a strict <strong>logical solution</strong>, objective <strong>4-dimension rubric</strong>, and isolated <strong>domain firewall</strong>. Zero conversational fluff, zero context pollution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
              <div className="text-xs text-neutral-500 font-medium">Front Door</div>
              <div className="text-sm font-bold text-neutral-900">1 Orchestrator</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
              <div className="text-xs text-neutral-500 font-medium">Domain Locks</div>
              <div className="text-sm font-bold text-emerald-700">5 Firewalled</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
              <div className="text-xs text-neutral-500 font-medium">Ephemeral</div>
              <div className="text-sm font-bold text-amber-700">Auto-Purging</div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent name, mandate, domain, or sharp fork..."
              className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterDomainLockedOnly(!filterDomainLockedOnly)}
              className={`flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                filterDomainLockedOnly
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Domain Locked</span>
            </button>

            <button
              onClick={() => setFilterEphemeralOnly(!filterEphemeralOnly)}
              className={`flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                filterEphemeralOnly
                  ? "border-amber-600 bg-amber-50 text-amber-800"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Ephemeral</span>
            </button>
          </div>
        </div>

        {/* Cluster Tabs */}
        <div className="mt-4 flex space-x-1.5 overflow-x-auto pb-1">
          {CLUSTERS.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCluster(c.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCluster === c.key
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/80"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-neutral-400 hover:shadow-md"
          >
            <div>
              {/* Header: Number, Cluster Badge & Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-bold text-white">
                    {agent.number}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                    {agent.clusterLabel}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  {agent.domainLock && (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20" title={`Locked to ${agent.domainLock}`}>
                      <Lock className="mr-1 h-2.5 w-2.5" />
                      Locked
                    </span>
                  )}
                  {agent.isEphemeral && (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20" title="Memory wiped on close">
                      <Flame className="mr-1 h-2.5 w-2.5" />
                      Ephemeral
                    </span>
                  )}
                  {!agent.talksToDayna && (
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600" title="Delegated by Orchestrator">
                      <MessageSquareOff className="mr-1 h-2.5 w-2.5 text-neutral-400" />
                      Sub-Agent
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Short Role */}
              <h3 className="mt-3 text-base font-bold text-neutral-900 group-hover:text-neutral-950">
                {agent.name}
              </h3>
              <p className="mt-1 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {agent.role}
              </p>

              {/* Logical Solution Snippet */}
              <div className="mt-3.5 rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                <div className="text-[11px] font-semibold text-neutral-800 flex items-center space-x-1 mb-1">
                  <Cpu className="h-3 w-3 text-amber-500" />
                  <span>Logical Solution & Mandate:</span>
                </div>
                <p className="text-[11px] text-neutral-600 line-clamp-3 leading-relaxed">
                  {agent.logicalSolution}
                </p>
              </div>

              {/* Sharp Fork Strategy Snippets */}
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Sharp Fork Protocol
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="rounded-md bg-emerald-50/70 border border-emerald-100 p-1.5 text-emerald-800">
                    <span className="font-bold block">Safe</span>
                    <span className="line-clamp-1">{agent.sharpForkStrategy.safe}</span>
                  </div>
                  <div className="rounded-md bg-blue-50/70 border border-blue-100 p-1.5 text-blue-800">
                    <span className="font-bold block">Bold</span>
                    <span className="line-clamp-1">{agent.sharpForkStrategy.bold}</span>
                  </div>
                  <div className="rounded-md bg-purple-50/70 border border-purple-100 p-1.5 text-purple-800">
                    <span className="font-bold block">Disruptive</span>
                    <span className="line-clamp-1">{agent.sharpForkStrategy.disruptive}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 gap-2">
              <button
                onClick={() => onSelectAgent(agent)}
                className="flex items-center space-x-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                <span>Full Blueprint</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onLaunchSandbox(agent)}
                className="flex items-center space-x-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Test Live</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="mt-12 text-center py-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50">
          <p className="text-sm text-neutral-600">No agents match your current filters or search term.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCluster("ALL");
              setFilterDomainLockedOnly(false);
              setFilterEphemeralOnly(false);
            }}
            className="mt-3 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
