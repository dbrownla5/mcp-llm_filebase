import React, { useState } from "react";
import { GUIDE_SECTIONS, GuideSection } from "../data/guidekitData";
import { 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Moon,
  Layers,
  ArrowRight
} from "lucide-react";

export const GuidekitView: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(GUIDE_SECTIONS[0].id);
  const currentSection = GUIDE_SECTIONS.find((s) => s.id === selectedSectionId) || GUIDE_SECTIONS[0];
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const overnightPrompt = `You are the MASTER ORCHESTRATOR operating the Dayna Multi-Agent System.
Connect to the master-mcp Cloudflare bridge (https://mcp.thewelllivedcitizenco.com/mcp) and execute the OVERNIGHT PROTOCOL:

PHASE 1: Verify tool connections and active 5-rule memory window.
PHASE 2: For each isolated domain (Domain 1: SVP, Domain 2: WA Benefits, Domain 3: Landlords/Flood, Domain 4: Patent, Domain 5: WLC):
  - Ingest raw documents into the Two-Column Gateway.
  - Flag any missing receipts with [MISSING: exact artifact].
  - Calculate reconciled mathematical totals.
PHASE 3: Generate the 3 Sharp Forks (Safe, Bold, Disruptive) for each domain.
PHASE 4: Run the 4-dimension rubric scoring pass (force rewrite if < 80).
PHASE 5: Commit final signed packages to Cloudflare R2 'comet' and output the executive morning brief.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            Official System Manual & Guidekit
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Building & Sustaining Multi-Agent Protocols • Zero-Truth Baseline • Overnight Runbook
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900 tracking-tight">
          Multi-Agent Protocol Guidekit & Master Manual
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Navigation: Chapter List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 px-1">
            Manual Chapters
          </div>
          {GUIDE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSectionId(section.id)}
              className={`w-full text-left rounded-xl p-3.5 border transition-all flex items-start justify-between ${
                selectedSectionId === section.id
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
              }`}
            >
              <div>
                <div className={`text-[10px] font-bold uppercase ${
                  selectedSectionId === section.id ? "text-neutral-300" : "text-neutral-400"
                }`}>
                  {section.category}
                </div>
                <div className="text-xs font-bold mt-0.5">{section.title}</div>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSectionId === section.id ? "text-neutral-300" : "text-neutral-500"
                }`}>
                  {section.summary}
                </p>
              </div>
              <ChevronRight className={`h-4 w-4 shrink-0 mt-1 ${
                selectedSectionId === section.id ? "text-white" : "text-neutral-400"
              }`} />
            </button>
          ))}

          {/* Quick Overnight Launch Card */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 mt-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 mb-1">
              <Moon className="h-4 w-4 text-amber-700" />
              <span>Overnight Execution Card</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Launch Phase 1 through Phase 5 before sleep. Claude Desktop runs unattended via MCP.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(overnightPrompt);
                setCopiedPrompt(true);
                setTimeout(() => setCopiedPrompt(false), 2000);
              }}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-900 shadow-xs"
            >
              {copiedPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedPrompt ? "Copied Overnight Prompt!" : "Copy Master Overnight Prompt"}</span>
            </button>
          </div>
        </div>

        {/* Right Content: Detailed Chapter View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="mb-4 pb-4 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {currentSection.category}
              </span>
              <h2 className="text-xl font-bold text-neutral-900 mt-1">
                {currentSection.title}
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                {currentSection.summary}
              </p>
            </div>

            {/* Key Principles Pills */}
            <div className="mb-6 rounded-xl bg-neutral-50 p-4 border border-neutral-200">
              <div className="text-xs font-bold text-neutral-800 mb-2 flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Key Operating Principles</span>
              </div>
              <ul className="space-y-1.5">
                {currentSection.keyPrinciples.map((p, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-neutral-700">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chapter Markdown Content */}
            <div className="prose prose-xs max-w-none text-xs text-neutral-800 whitespace-pre-wrap font-sans leading-relaxed">
              {currentSection.contentMarkdown}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
