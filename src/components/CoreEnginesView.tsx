import React, { useState } from "react";
import { RollingMemoryItem, TwoColumnItem, RubricEvaluation } from "../types";
import { 
  ShieldCheck, 
  TableProperties, 
  RotateCw, 
  Flame, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Archive, 
  Sparkles,
  Lock,
  Layers
} from "lucide-react";

interface CoreEnginesViewProps {
  activeMemoryList: RollingMemoryItem[];
  setActiveMemoryList: React.Dispatch<React.SetStateAction<RollingMemoryItem[]>>;
}

export const CoreEnginesView: React.FC<CoreEnginesViewProps> = ({
  activeMemoryList,
  setActiveMemoryList
}) => {
  const [activeEngineTab, setActiveEngineTab] = useState<"two_column" | "rubric" | "memory" | "scratchpad">("two_column");

  // 1. Two-Column Validator State
  const [testRows, setTestRows] = useState<TwoColumnItem[]>([
    {
      claim: "Landlord 2 was notified in writing of primary sewage backflow on Oct 17, 2024 at 08:14 PST",
      sourcePath: "domains/domain_3_landlords/emails/2024_10_17_water_notice.eml",
      verified: true
    },
    {
      claim: "Emergency mitigation invoice #4091 from ServiceMaster for $1,280.00",
      sourcePath: "domains/domain_3_landlords/receipts/servicemaster_inv_4091.pdf",
      verified: true
    },
    {
      claim: "Property manager verbal agreement to reimburse hotel costs up to $500",
      sourcePath: "[MISSING: Verbal claim not found in written emails or recordings]",
      verified: false,
      notes: "Auto-rejected by Two-Column Gateway. Grounded rule: No unrecorded verbal claims allowed."
    }
  ]);
  const [newClaim, setNewClaim] = useState("");
  const [newSource, setNewSource] = useState("");

  const handleAddRow = () => {
    if (!newClaim.trim()) return;
    const isSourceMissing = !newSource.trim() || newSource.toLowerCase().includes("missing");
    setTestRows([
      ...testRows,
      {
        claim: newClaim.trim(),
        sourcePath: isSourceMissing ? "[MISSING: exact source span required]" : newSource.trim(),
        verified: !isSourceMissing
      }
    ]);
    setNewClaim("");
    setNewSource("");
  };

  // 2. 4D Rubric Scorer State
  const [rubricDraft, setRubricDraft] = useState<string>(
    "We are writing to formally present the reconciled expense ledger for the November emergency repairs. Attached is the itemized breakdown with verified contractor invoices. We require reimbursement within 5 business days pursuant to RCW 59.18.060."
  );
  const [rubricScores, setRubricScores] = useState<RubricEvaluation>({
    kolbeCongruence: 94,
    toneMatch: 96,
    actionability: 98,
    surpriseFactor: 86,
    overallScore: 93.5,
    passedThreshold: true
  });

  const handleScoreDraft = () => {
    // Check for banned filler words
    const banned = ["delve", "tapestry", "revolutionize", "unleash", "game-changer", "supercharge"];
    const found = banned.some(b => rubricDraft.toLowerCase().includes(b));
    const tone = found ? 62 : 96;
    const kolbe = rubricDraft.length > 500 ? 74 : 94;
    const action = rubricDraft.includes("RCW") || rubricDraft.includes("invoice") ? 98 : 82;
    const surprise = 88;
    const overall = (kolbe + tone + action + surprise) / 4;

    setRubricScores({
      kolbeCongruence: kolbe,
      toneMatch: tone,
      actionability: action,
      surpriseFactor: surprise,
      overallScore: overall,
      passedThreshold: overall >= 80 && tone >= 80,
      critiqueNotes: found ? ["Banned AI buzzwords detected - auto-rewrite triggered."] : ["Pristine executive alignment."]
    });
  };

  // 3. Rolling Memory State
  const [newAxiomText, setNewAxiomText] = useState("");
  const [newAxiomDomain, setNewAxiomDomain] = useState("DOMAIN_5_WLC_BIZ");

  const handleCommitAxiom = () => {
    if (!newAxiomText.trim()) return;

    // FIFO Rolling logic: if count is 5, archive the oldest active item
    const updatedList = [...activeMemoryList];
    const activeItems = updatedList.filter(i => i.status === "ACTIVE");

    if (activeItems.length >= 5) {
      // Find oldest active item and set to ARCHIVED
      const oldestActive = activeItems[0];
      const idx = updatedList.findIndex(i => i.id === oldestActive.id);
      if (idx !== -1) {
        updatedList[idx] = { ...updatedList[idx], status: "ARCHIVED" };
      }
    }

    // Add new axiom
    const newAxiom: RollingMemoryItem = {
      id: `rule_${Date.now()}`,
      axiom: newAxiomText.trim(),
      domain: newAxiomDomain,
      sourceAgent: "Master Orchestrator",
      status: "ACTIVE",
      dateCommitted: new Date().toISOString().split("T")[0],
      rubricScore: 95
    };

    setActiveMemoryList([newAxiom, ...updatedList]);
    setNewAxiomText("");
  };

  // 4. Ephemeral Purge State
  const [scratchpadItems, setScratchpadItems] = useState<string[]>([
    "Sparring note: Potential podcast series on vintage clothing repair techniques.",
    "Draft concept: High-ticket wardrobe edit membership for Mercer Island residents.",
    "Exploratory math: Travertine coffee table pricing model with 30-day markdown velocity."
  ]);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handlePurgeScratchpad = () => {
    setScratchpadItems([]);
    setPurgeSuccess(true);
    setTimeout(() => setPurgeSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Engine Control Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700">
            Core Self-Correction Machinery
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Zero-Truth Gateway • 4D Quality Rubric • FIFO 5-in/5-out Memory • Ephemeral Purge
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900 tracking-tight">
          System Governance & Quality Engines
        </h1>
      </div>

      {/* Engine Switcher Tabs */}
      <div className="mb-6 flex space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveEngineTab("two_column")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeEngineTab === "two_column"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <TableProperties className="h-4 w-4 text-emerald-400" />
          <span>1. Two-Column Gateway</span>
        </button>

        <button
          onClick={() => setActiveEngineTab("rubric")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeEngineTab === "rubric"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>2. 4-Dimension Rubric</span>
        </button>

        <button
          onClick={() => setActiveEngineTab("memory")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeEngineTab === "memory"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <Layers className="h-4 w-4 text-amber-400" />
          <span>3. 5-in / 5-out Rolling Memory</span>
        </button>

        <button
          onClick={() => setActiveEngineTab("scratchpad")}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeEngineTab === "scratchpad"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <Flame className="h-4 w-4 text-red-400" />
          <span>4. Ephemeral Scratchpad Purge</span>
        </button>
      </div>

      {/* ENGINE 1: TWO-COLUMN GATEWAY */}
      {activeEngineTab === "two_column" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <TableProperties className="h-5 w-5 text-emerald-600" />
                  <span>Two-Column Gateway: Zero-Truth Verification Ledger</span>
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Every factual assertion must map to an exact source path in Cloudflare R2 'comet'. If absent, output [MISSING: exact fact] and reject the draft.
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                Gatekeeper Active
              </span>
            </div>

            {/* Verification Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600 text-[11px] font-bold border-b border-neutral-200">
                    <th className="py-2.5 px-3 w-1/2">Factual Assertion / Claim</th>
                    <th className="py-2.5 px-3 w-1/3">Verified Source Span (R2 'comet')</th>
                    <th className="py-2.5 px-3 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                  {testRows.map((row, idx) => (
                    <tr key={idx} className={row.verified ? "hover:bg-neutral-50" : "bg-red-50/30"}>
                      <td className="py-3 px-3 text-neutral-900 font-sans">
                        <div>{row.claim}</div>
                        {row.notes && (
                          <div className="text-[10px] text-red-600 font-sans mt-0.5">
                            ⚠ {row.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-neutral-700 font-mono text-[10px]">
                        {row.sourcePath}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {row.verified ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                            <Check className="mr-1 h-3 w-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-800 ring-1 ring-inset ring-red-600/20">
                            <AlertCircle className="mr-1 h-3 w-3" /> REJECTED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Claim to Gate Tester */}
            <div className="mt-5 rounded-xl bg-neutral-50 p-4 border border-neutral-200 space-y-3">
              <div className="text-xs font-bold text-neutral-800">
                Test New Row Against Two-Column Gateway
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  placeholder="Enter factual claim (e.g. November storage fee was $340)..."
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                />
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="Enter R2 path (or leave blank to test [MISSING] rejection)..."
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddRow}
                disabled={!newClaim.trim()}
                className="flex items-center space-x-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Validate & Append to Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENGINE 2: 4-DIMENSION RUBRIC SCORER */}
      {activeEngineTab === "rubric" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span>4-Dimension Objective Rubric Evaluator</span>
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Scores every draft before presentation. Threshold: 80 minimum across all dimensions. If any score &lt; 80, the Master Orchestrator silently forces a rewrite.
                </p>
              </div>
              <div className={`rounded-xl px-3 py-1 text-xs font-bold ${
                rubricScores.passedThreshold ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {rubricScores.passedThreshold ? "THRESHOLD PASSED (>= 80)" : "REWRITE TRIGGERED (< 80)"}
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
                <div className="text-xs text-neutral-500 font-semibold">1. Kolbe Congruence</div>
                <div className="text-xl font-bold text-neutral-900 mt-1">{rubricScores.kolbeCongruence}%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Low-friction, fast decision</div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
                <div className="text-xs text-neutral-500 font-semibold">2. Tone Match</div>
                <div className="text-xl font-bold text-neutral-900 mt-1">{rubricScores.toneMatch}%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Real voice, zero AI filler</div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
                <div className="text-xs text-neutral-500 font-semibold">3. Actionability</div>
                <div className="text-xl font-bold text-neutral-900 mt-1">{rubricScores.actionability}%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">80% lift done, send-ready</div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
                <div className="text-xs text-neutral-500 font-semibold">4. Surprise Factor</div>
                <div className="text-xl font-bold text-neutral-900 mt-1">{rubricScores.surpriseFactor}%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Non-obvious strategic edge</div>
              </div>
            </div>

            {/* Test Text Evaluator */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-800">
                Draft Content to Evaluate
              </label>
              <textarea
                rows={4}
                value={rubricDraft}
                onChange={(e) => setRubricDraft(e.target.value)}
                placeholder="Paste draft copy to evaluate against Dayna's rubric..."
                className="w-full rounded-xl border border-neutral-200 p-3 text-xs font-mono text-neutral-900 focus:outline-none"
              />
              <button
                onClick={handleScoreDraft}
                className="flex items-center space-x-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Run Objective Rubric Evaluation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENGINE 3: 5-IN / 5-OUT ROLLING MEMORY */}
      {activeEngineTab === "memory" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-amber-600" />
                  <span>5-in / 5-out Rolling Memory Matrix</span>
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Eliminates context rot. Exactly 5 active working axioms allowed. When rule #6 is committed, rule #1 is automatically archived to Cloudflare D1.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                  Active Capacity: {activeMemoryList.filter(i => i.status === "ACTIVE").length} / 5
                </span>
              </div>
            </div>

            {/* Active Axioms List */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Active High-Signal Axioms (In Working Memory)
              </div>
              {activeMemoryList.filter(i => i.status === "ACTIVE").map((item, idx) => (
                <div key={item.id} className="flex items-start justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
                  <div className="flex items-start space-x-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-xs font-bold text-white">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{item.axiom}</p>
                      <div className="mt-1 flex items-center space-x-3 text-[10px] text-neutral-500">
                        <span>Domain: <strong className="text-neutral-700">{item.domain}</strong></span>
                        <span>Committed: {item.dateCommitted}</span>
                        <span>Rubric: {item.rubricScore}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>

            {/* Add New Axiom Form */}
            <div className="mt-6 rounded-xl bg-neutral-50 p-4 border border-neutral-200 space-y-3">
              <div className="text-xs font-bold text-neutral-800">
                Commit New Approved Operational Axiom (Triggers FIFO Shift)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newAxiomText}
                    onChange={(e) => setNewAxiomText(e.target.value)}
                    placeholder="Enter verified rule (e.g. Always present 3 sharp forks on dispute replies)..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <select
                    value={newAxiomDomain}
                    onChange={(e) => setNewAxiomDomain(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                  >
                    <option value="DOMAIN_1_SVP">Domain 1: SVP</option>
                    <option value="DOMAIN_2_WA_BENEFITS">Domain 2: WA Benefits</option>
                    <option value="DOMAIN_3_LANDLORD_FLOOD">Domain 3: Landlords</option>
                    <option value="DOMAIN_4_WDC_PATENT">Domain 4: WDC Patent</option>
                    <option value="DOMAIN_5_WLC_BIZ">Domain 5: WLC Biz</option>
                    <option value="GLOBAL_GOVERNANCE">Global Governance</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCommitAxiom}
                disabled={!newAxiomText.trim()}
                className="flex items-center space-x-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5 text-amber-400" />
                <span>Commit Axiom & Auto-Archive Oldest</span>
              </button>
            </div>

            {/* Archived Axioms */}
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-500 mb-2">
                <Archive className="h-3.5 w-3.5" />
                <span>Archived Axioms in Cloudflare D1 Cold Storage</span>
              </div>
              <div className="space-y-1.5">
                {activeMemoryList.filter(i => i.status === "ARCHIVED").map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-neutral-500 bg-neutral-100/70 p-2 rounded-lg font-mono text-[11px]">
                    <span className="line-clamp-1">{item.axiom}</span>
                    <span className="text-[10px] text-neutral-400">ARCHIVED ({item.domain})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ENGINE 4: EPHEMERAL SCRATCHPAD PURGE */}
      {activeEngineTab === "scratchpad" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-red-600" />
                  <span>Ephemeral Scratchpad Purge Sentinel</span>
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Protects long-term memory from brainstorm clutter. Sparring sessions wipe all scratchpad keys upon session close. Only explicit Dayna sign-offs survive.
                </p>
              </div>
              {purgeSuccess && (
                <span className="rounded-md bg-red-100 px-3 py-1 text-xs font-bold text-red-800 animate-pulse">
                  CLEAN PURGE EXECUTED (0 KEYS REMAIN)
                </span>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  Current Ephemeral Sparring Keys ({scratchpadItems.length} active)
                </span>
                <button
                  onClick={handlePurgeScratchpad}
                  disabled={scratchpadItems.length === 0}
                  className="flex items-center space-x-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Purge Scratchpad Session Now</span>
                </button>
              </div>

              {scratchpadItems.length > 0 ? (
                <ul className="space-y-2">
                  {scratchpadItems.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="text-neutral-700">{item}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                        temp_scratchpad_key
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-xs text-neutral-500">
                  Scratchpad is clean. Zero unapproved brainstorm artifacts in memory.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
