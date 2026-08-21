# DAYNA MULTI-AGENT OPERATING SYSTEM (GEN AI / GEN SDK PRODUCTION BLUEPRINT)
## ARCHITECTURAL MANIFESTO & SEQUENTIAL PROMPT RUNBOOK

This document acts as your absolute Source of Truth and copy-pasteable execution roadmap. It is designed to be fed directly into high-acumen, agent-based development platforms (such as Lovable.dev, Replit, Cursor, or bolt.new) to generate a professional, production-grade system.

It decouples **dynamic agent intelligence** from **hardcoded skills/tools**, respects the strict 5-domain isolation boundaries, and incorporates a realistic **Human-in-the-Loop (HITL) quality rubric** so you retain absolute operational veto power.

---

## I. SYSTEM CONVERSION PHILOSOPHY
To prevent the system from becoming a static, fragile mock-up or a developer-only terminal labyrinth:
1. **Dynamic Agent Autonomy**: Agents do not have their tools hardcoded directly into their core LLM logic. Instead, they operate through a centralized **Registry & Dispatcher** pattern. They query for required skills dynamically based on the current context.
2. **Platform Portability**: All database and storage operations run through a clean **Adapter Pattern**. If you transition from a local SQLite/PostgreSQL development database to an enterprise cloud instance, you only swap the database driver, not the agent logic.
3. **Zero-Terminal Cloud Setup**: The prompts are designed to instruct any code-generation agent to construct a web-based, cloud-hosted administration dashboard containing visual controls for package installs, database migrations, and environment variables.

---

## II. SEQUENTIAL PRODUCTION PROMPTS

### PROMPT 1: BASELINE ENVIRONMENT & GIT INITIALIZATION
```markdown
Context: You are initializing the backend foundations of the Dayna Multi-Agent System.
Goal: Setup a production-ready, type-safe Node.js/Express framework utilizing TypeScript. Ensure absolute zero-terminal friction for the owner.

SYSTEM CONFIGURATION REQUIREMENTS:
1. Define a scalable file layout:
   - `/src/server.ts` (Core App Entry)
   - `/src/config/` (Environment variables, Global settings)
   - `/src/db/` (Database client, migrations, schemas)
   - `/src/types/` (Strict TypeScript interfaces)
   - `/src/routes/` (Restricted API endpoints)
2. Setup the database client using an Adapter Pattern. Create a simple local database schema with the following tables:
   - `agent_registry` (id, name, cluster, status, current_memory_context)
   - `isolation_domains` (code, title, storage_path, isolated_status)
   - `workflow_tasks` (id, domain_code, assigned_agent_id, status, evidence_hashes, updated_at)
3. Ensure absolute security:
   - Configure a secure token validation middleware verifying Bearer tokens against an environmental `MCP_AUTH_SECRET`.
   - Never expose raw credentials, JWT keys, or server secrets in log traces.

EXECUTION CONSTRAINT:
Do not instruct the user to run any terminal commands or install dependencies manually. Provide the completely written files, package.json scripts, and a web-based "Setup Wizard" route (`/setup`) that allows the user to click to verify database connectivity and configure environment parameters visually.
```

---

### PROMPT 2: THE MULTI-TENANT DOMAIN ISOLATION ROUTER (5 FIREWALLS)
```markdown
Context: The system requires strict containment across five legal/business operating domains (SVP, WA Benefits, Landlords/Flood, Patent, WLC Business).
Goal: Implement the Domain Isolation Router and the Two-Column Provenance Gateway.

SYSTEM CONFIGURATION REQUIREMENTS:
1. Write a secure router module (`/src/routes/mcp.ts`) that handles JSON-RPC 2.0 MCP requests.
2. Implement the `domain_read_file` and `verify_provenance_row` functions:
   - Enforce a strict path normalization utility that rejects any directory traversal attempts (e.g., prevent `../../` injections).
   - Rejection Rules: If a task assigned to "Domain 1: SVP" attempts to read any file path belonging to "Domain 2: WA Benefits", immediately terminate the execution thread, log a critical security event to the audit trail, and return a standardized `DomainViolation` error.
3. Create the "Two-Column Gateway":
   - Every factual claim committed by any agent must be logged in a `claims` database table alongside its verified source document file path.
   - If the source path is missing or the file cannot be accessed within the isolated domain storage, automatically tag the claim with a `[MISSING: source_file_path]` warning.

EXECUTION CONSTRAINT:
Write complete, production-ready modules with comprehensive error trapping. Do not write placeholder code blocks or leave functions to be completed later.
```

---

### PROMPT 3: THE AUTOMATED WORKFLOW & DECOUPLED PHOTO PIPELINE
```markdown
Context: The system must handle high-volume photo batches, automated media routing, and extraction without manual user organization.
Goal: Build the Automated Workflow Engine and Decoupled Photo Processing Pipeline.

SYSTEM CONFIGURATION REQUIREMENTS:
1. Create a decoupled "Skills Engine" module (`/src/services/skills/`):
   - Rather than hardcoding photo processing or resale pricing calculations inside an agent's system prompt, define them as modular, self-contained scripts (skills).
   - Agents must query `/api/skills` to retrieve available tools dynamically based on input metadata.
2. Build the automated "File Intake Listener" routing service:
   - When a new document or photo batch is posted to `/api/intake`:
     - Securely inspect the metadata (file extension, dimensions, text presence).
     - Group related images and flag duplicates or low-resolution files automatically.
     - Dynamically assign a classification category and route the task to the designated domain workspace.
3. Build the "Resale Photo Preparation" skill template:
   - Processes image files to generate derivatives, adjust scales, and create clean, standardized metadata files ready for syndication to luxury retail platforms (Chairish, 1stDibs).

EXECUTION CONSTRAINT:
Ensure memory safety. All image operations and file streaming tasks must utilize Node.js buffers or streaming pipelines to protect the host container from memory leak crashes during large file transfers.
```

---

### PROMPT 4: THE HUMAN-IN-THE-LOOP QUALITY RUBRIC & DASHBOARD
```markdown
Context: Fully autonomous agent execution risks hallucination and run-away cost. Dayna must remain the absolute final authority.
Goal: Implement the 4-Dimension Quality Rubric, the 5-in / 5-out Rolling Memory Matrix, and the User Validation Dashboard.

SYSTEM CONFIGURATION REQUIREMENTS:
1. Build the "Human-in-the-Loop (HITL) Validation Queue":
   - Any agent-generated package, pricing valuation, or legal brief must be placed into a `pending_review` table.
   - It is strictly forbidden for the system to finalize, export, or syndicate any work until a authorized user signs off.
2. Create the "Quality Rubric" evaluator service:
   - Scores pending work against 4 core metrics: Kolbe Congruence, Tone Match, Actionability, and Surprise/Value Factor.
   - Provide a visual slider interface in the dashboard allowing the user to score the draft, input custom corrective comments, and trigger an automated rewriting iteration if the score falls below the 80% threshold.
3. Implement the "5-in / 5-out Rolling Memory Matrix":
   - Maintain an active FIFO cache table (`active_memory`) tracking exactly 5 operating axioms.
   - When the user commits a new operational directive, push it to the active table and automatically archive the oldest axiom to the historical `cold_memory` archive.

EXECUTION CONSTRAINT:
The dashboard must represent true system state. Ensure all actions taken on the UI (reviewing files, sliding rubric scores, committing axioms) perform live POST/PUT requests to the backend database endpoints.
```

---

## III. PRODUCTION GIT ENVIRONMENT SETUP

To initialize your repository without terminal friction:
1. Create your repository on GitHub (e.g., `dayna-master-mcp-workspace`).
2. When configuring your workspace on Replit, Lovable, or Cursor, select **"Import from GitHub"** and connect your repository.
3. The platform will automatically provision your runtime container and read the following file structure.

### TARGET ENVIRONMENT FILE TREE
```text
dayna-master-mcp-workspace/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── routes/
│   │   ├── mcp.ts
│   │   ├── intake.ts
│   │   └── dashboard.ts
│   ├── services/
│   │   ├── skills/
│   │   │   ├── photoProcessor.ts
│   │   │   └── appraisalAppraiser.ts
│   │   └── workflowEngine.ts
│   └── types/
│       └── index.ts
└── storage/
    ├── s_comet/
    └── active_memory.json
```

### SECURE `.gitignore`
```text
# Dependency directories
node_modules/
jspm_packages/

# Local configuration files
.env
.env.local
.env.production

# Build outputs
dist/
build/

# Database files
*.db
*.db-journal
*.sqlite

# OS and Log files
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## IV. ZERO-COST & DECENTRALIZED INFRASTRUCTURE ARCHETYPE

To prevent expensive platform lock-in and keep monthly operating costs at **$0 or close to zero**, run the system using the following decoupled, free-tier-friendly stack. This ensures that even if external agent subscription platforms shut down or raise prices, you retain 100% control of your database, dashboard, and files.

### 1. Database (Cost: $0)
*   **The Recommendation**: Use **SQLite** for development (it is a self-contained, single-file database that runs locally on your machine or inside any host container for free).
*   **The Cloud Upgrade**: Use **Supabase (Free Hobby Tier)**. It provides a full, production-ready PostgreSQL database with automated backups and an integrated web interface.
    *   *Free Limit*: 1 active project, 500 MB database space (sufficient for millions of tracking rows and text logs).

### 2. File & Photo Storage (Cost: $0)
*   **The Recommendation**: Local Storage (`/storage/s_comet/`) stored directly inside your application folder. 
*   **The Cloud Upgrade**: Use **Supabase Storage** or **Cloudflare R2**.
    *   *Cloudflare R2 Free Limit*: First 10 GB of photo/media storage per month is completely free, with zero data transfer (egress) fees.

### 3. Application & Dashboard Hosting (Cost: $0)
*   **The Recommendation**: Host the dashboard on **Render (Free Tier)** or **Railway (Starter Tier)**. 
    *   *Render Free Limit*: Offers free hosting for web services (the app sleeps automatically after 15 minutes of inactivity and wakes up instantly when you visit the URL).
    *   *Local Option*: You can run the entire app offline on your computer by running `npm start`. This costs $0 and will run forever without an internet connection.

### 4. LLM API & Model Cost Control (Cost: < $1 to $5/month)
*   **The Recommendation**: Bypass expensive middleware subscription plans ($20-$100+/mo). Get a direct developer key from **Google AI Studio** and use the **Gemini 2.5 Flash** model.
    *   *Gemini Flash Cost*: The model is highly optimized, fast, and has a **generous free tier** (up to 15 RPM / 1 million TPM completely free). Even when billed under pay-as-you-go, running thousands of complex agent appraisals and file extractions will typically cost less than a cup of coffee per month.

---

## V. CLOUDFLARE CUSTOM DOMAIN & BRANDING MAP

To ensure future AI systems do not break your integrations, confuse active brands, or mess up DNS routing, adhere strictly to this domain mapping configuration:

### 1. The Domain Taxonomy
*   **`thewelllivedcitizenco.com` (THE ".CO" DOMAIN)**:
    *   *Role*: **Offline / Unofficial Backend Infrastructure Only.**
    *   *Usage*: This domain is already paid for but is **no longer used for public customer-facing branding**. It is reserved strictly as the private entrance gateway for your database, your backend cloud containers, and your agent-facing MCP tools (e.g. `api.thewelllivedcitizenco.com`).
*   **`thewelllivedcitizen.com` & `wellcitizen.com` (THE ACTIVE BRANDS)**:
    *   *Role*: **Public-Facing Customer Portals & Showrooms.**
    *   *Usage*: Earmarked for your future customer logins, consignor payout dashboards, live retail sectionals collections, and public brand pages. No raw AI database logs or system console files are ever directly visible on these custom domains.

### 2. Resolving Cloudflare Connection Drops ("Grey-Clouding")
When connecting any external agent, mobile device, or workspace portal to your custom backend domain hosted through Cloudflare:
1.  Log into your **Cloudflare Dashboard**.
2.  Navigate to your domain's **DNS Records**.
3.  Add or locate your subdomain (e.g., `api` or `mcp`).
4.  Toggle the **Proxy Status** switch from **"Proxied (Orange Cloud)"** to **"DNS Only (Grey Cloud)"**.

```
┌─────────────────────────────────┐
│     Cloudflare DNS Dashboard    │
│                                 │
│  Type   Name   Content          │  Proxy Status
│  A      mcp    192.0.2.1        │  [ Grey Cloud / DNS Only ]  ◄── (SELECT THIS)
└─────────────────────────────────┘
```

#### Why This is Required:
*   **No Timeout Drops**: Cloudflare's orange cloud drops inactive TCP connections after 100 seconds. Switching to the Grey Cloud keeps connection tunnels open indefinitely.
*   **No Header Stripping**: Prevents Cloudflare from stripping your custom verification headers (like `X-MCP-Domain` and `Authorization: Bearer`), ensuring flawless agent authentication.
*   **SSL Cert Compatibility**: Keeps SSL trust chains clean, completely preventing common Leaf Signature Verification errors inside Python/Node.js agent runtimes.

