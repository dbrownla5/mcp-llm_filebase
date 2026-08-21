export interface GuideSection {
  id: string;
  title: string;
  category: "ARCHITECTURE" | "PROTOCOL" | "LLM_GOVERNANCE" | "MCP_SDK" | "OVERNIGHT_RUNBOOK";
  summary: string;
  contentMarkdown: string;
  keyPrinciples: string[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "llm_agent_protocol_foundations",
    title: "1. Core Philosophy: Building & Sustaining a Scalable Multi-Agent Protocol",
    category: "ARCHITECTURE",
    summary: "How to design multi-agent systems for high-velocity executive users (Kolbe Quick Start) with zero interrogation and automated cognitive heavy-lifting.",
    keyPrinciples: [
      "Inference over Interrogation: Do 80% of the cognitive work silently.",
      "Single Front Door: Only the Master Orchestrator communicates directly with the user.",
      "Zero-Truth Baseline: Treat existing files as unvalidated raw artifacts until verified.",
      "Automated Rejection: System auto-rejects drafts scoring under 80 on the 4-dimension rubric."
    ],
    contentMarkdown: `### The Problem with Conventional AI Assistants
Standard conversational AI creates immense cognitive drag by doing three counter-productive things:
1. **Asking open-ended homework questions** (*"How would you like me to structure this?"*, *"What tone do you prefer?"*).
2. **Accepting corrupted, drifting context** from previous hallucinated conversations and messy file systems.
3. **Using synthetic corporate filler** (*"delve"*, *"tapestry"*, *"game-changer"*, *"I would be thrilled to help"*).

### The Dayna Multi-Agent Architecture
For an executive with high Quick Start velocity (Kolbe 6-4-9-3), the agent ecosystem operates under 4 unbreakable pillars:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    DAYNA (Human Principal)                  │
│                     Kolbe 6-4-9-3 Quick Start               │
└──────────────────────────────▲──────────────────────────────┘
                               │ (1 Single Conversational Door)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 #1 MASTER ORCHESTRATOR                      │
│       • Enforces 4-Dimension Rubric (Threshold >= 80)       │
│       • Formats Outputs into 3 Sharp Divergent Forks        │
│       • Enforces Two-Column Provenance Gateway              │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐        ┌──────────────┐
│  FORENSIC &  │       │   CAREER &   │        │     WLC      │
│ LEGAL DOMAIN │       │  EXECUTIVE   │        │   BUSINESS   │
│  (1, 2, 3, 4)│       │  POSITIONING │        │    ENGINE    │
└──────┬───────┘       └──────┬───────┘        └──────┬───────┘
       │                      │                       │
       └──────────────────────┼───────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               PRODUCTION MCP SERVER (master-mcp)            │
│   • Storage Container: comet  • Relational DB  • Cache KV   │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`
  },
  {
    id: "sharp_fork_protocol",
    title: "2. The Sharp Fork Protocol: Inference Over Interrogation",
    category: "PROTOCOL",
    summary: "Why executive agents must present 3 divergent, fully-baked choices (Safe, Bold, Disruptive) rather than asking what to do next.",
    keyPrinciples: [
      "Option 1 (Safe): The defensible baseline adhering strictly to standard historical norms.",
      "Option 2 (Bold): High-impact, direct language that accelerates settlement or hiring decisions.",
      "Option 3 (Disruptive): Non-obvious leverage pivot that bypasses intermediate friction entirely."
    ],
    contentMarkdown: `### Eliminating Cognitive Drag
When a busy human opens an agent response, they should never be asked to write prompts. They should simply choose between **3 calibrated paths**:

#### The 3 Sharp Fork Archetypes:
1. **SAFE (Conservative / Baseline)**
   - Minimal legal/operational exposure.
   - Leverages only explicitly documented historical receipts.
   - Example: *"Itemize only undisputed out-of-pocket receipts with direct merchant proof."*

2. **BOLD (Elevated / High-Impact)**
   - Direct, unhedged executive tone.
   - Asserts full statutory or operational rights with a clear, short deadline.
   - Example: *"Deliver direct 1-page formal notice citing exact lease breach clauses with a 5-day cure notice."*

3. **DISRUPTIVE (Leverage Pivot / Strategic Redesign)**
   - Flips standard dynamics on their head.
   - Bypasses endless back-and-forth negotiations by offering a single comprehensive term sheet.
   - Example: *"Consolidate all pending disputes across all domains into a clean, binding settlement packet ready for signature."*
`
  },
  {
    id: "two_column_gateway",
    title: "3. The Two-Column Gateway: Zero-Truth Forensic Verification",
    category: "LLM_GOVERNANCE",
    summary: "Guarantees zero AI hallucination by enforcing an unshakeable link between every asserted claim and a verified file source span.",
    keyPrinciples: [
      "Left Column: Assertion of Fact (Date, Amount, Event, Clause).",
      "Right Column: Exact Verified Source Path in Cloudflare R2 'comet'.",
      "Missing Fact Handling: If a document does not exist, the agent outputs [MISSING: exact fact] and stops."
    ],
    contentMarkdown: `### The Zero-Truth Corpus Rule
**There is no assumed truth in existing disk files.**
All past text files, messy AI summaries, and scratchpads are treated as unvalidated noise until verified against primary source artifacts (PDFs, bank statements, official emails, state filings).

### Ledger Format
| Assertion / Claim | Verified Source Span (R2 / Primary Artifact) | Status |
| :--- | :--- | :--- |
| Emergency plumbing failure reported Oct 17, 2024 at 08:14 PST | \`domains/domain_3_landlords/emails/2024_10_17_water_notice.eml\` | VERIFIED |
| Out-of-pocket lodging expense of $412.50 at Silver Cloud | \`domains/domain_3_landlords/receipts/2024_10_18_hotel_invoice.pdf\` | VERIFIED |
| Written acknowledgment from property manager received Oct 19 | [MISSING: property manager email response not found] | PENDING AUDIT |
`
  },
  {
    id: "rubric_and_rolling_memory",
    title: "4. The 4-Dimension Rubric & 5-In / 5-Out Rolling Memory Matrix",
    category: "LLM_GOVERNANCE",
    summary: "Automated quality grading and strict context window management to eliminate AI drift permanently.",
    keyPrinciples: [
      "Kolbe Congruence (Target >= 80): Low friction, quick decision ready.",
      "Tone Match (Target >= 80): Dayna's real voice (Warm or Firm register; zero corporate fluff).",
      "Actionability (Target >= 80): 80% complete deliverable ready to send/file.",
      "Surprise Factor (Target >= 80): Unlocks unexpected leverage or insight.",
      "5-in / 5-out Rule: Exactly 5 active working axioms in memory. Rule #6 archives Rule #1."
    ],
    contentMarkdown: `### The 4-Dimension Rubric
Every draft created by a specialist agent is scored by the Master Orchestrator before presentation:
- **Kolbe Congruence (Weight: 25%)**: Does this require zero administrative busywork from Dayna?
- **Tone Match (Weight: 25%)**: Does this sound like Dayna's real writing (unhedged, witty, rhythmically sharp) rather than ChatGPT?
- **Actionability (Weight: 25%)**: Can she paste this into an email, sign the PDF, or file the claim immediately?
- **Surprise Factor (Weight: 25%)**: Does it bring a sharp, non-obvious insight that saves money or eliminates stress?

### 5-In / 5-Out Rolling Memory Matrix
Context bloat is the #1 killer of LLM reliability. We enforce a strict FIFO window:
- Active memory is capped at **5 axioms**.
- When an agent proposes a new operational rule and Dayna approves it, the oldest rule is archived into Cloudflare D1 cold storage.
- **Ephemeral Brainstorms**: Sparring partner sessions are marked \`isEphemeral: true\` and their scratchpad keys are purged immediately upon session close.
`
  },
  {
    id: "overnight_execution_runbook",
    title: "5. Overnight Claude Desktop Autonomous Execution Protocol",
    category: "OVERNIGHT_RUNBOOK",
    summary: "Step-by-step checklist to leave Claude Desktop running overnight to reconcile domains and package deliverables.",
    keyPrinciples: [
      "Phase 1: Handshake & MCP Bridge Confirmation.",
      "Phase 2: Domain-Isolated Evidence Indexing.",
      "Phase 3: Two-Column Dispute Ledger Generation.",
      "Phase 4: Final Deliverable Packaging into Secure Storage 'comet'."
    ],
    contentMarkdown: `### How to Execute Overnight in Claude Desktop

#### Step 1: Place the Configuration
Ensure your \`claude_desktop_config.json\` is placed in your Claude Desktop configuration folder (e.g. \`%APPDATA%\\Claude\\claude_desktop_config.json\` on Windows).

#### Step 2: Start the Overnight Prompt
Copy and paste this master prompt into a fresh Claude Desktop conversation:

\`\`\`markdown
You are the MASTER ORCHESTRATOR operating the Dayna Multi-Agent System.
Connect to the master-mcp production bridge (https://mcp.thewelllivedcitizenco.com/api/mcp) and execute the OVERNIGHT PROTOCOL:

PHASE 1: Verify tool connections and active 5-rule memory window.
PHASE 2: For each isolated domain (Domain 1: SVP, Domain 2: WA Benefits, Domain 3: Landlords/Flood, Domain 4: Patent, Domain 5: WLC):
  - Ingest raw documents into the Two-Column Gateway.
  - Flag any missing receipts with [MISSING: exact artifact].
  - Calculate reconciled mathematical totals.
PHASE 3: Generate the 3 Sharp Forks (Safe, Bold, Disruptive) for each domain.
PHASE 4: Run the 4-dimension rubric scoring pass (force rewrite if < 80).
PHASE 5: Commit final signed packages to secure storage container 'comet' and output the executive morning brief.
\`\`\`
`
  }
];
