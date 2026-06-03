# Claude Training Hub

A self-paced training companion web app for the 5-day Claude Support Engineer Training Program. Built for L0/L1 support engineers (new hires) to study topics, take quizzes, and track progress.

---

## How to Run Locally

### Prerequisites
- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/)
- **npm** — Comes with Node.js

### Setup (3 steps)

```bash
# 1. Navigate to the project directory
cd claude-training-hub

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The app will be running at **http://localhost:3000**

### Accessing the App
- **Learners:** Open `http://localhost:3000` — register with name and email to begin.
- **Trainer/Admin:** Open `http://localhost:3000/admin` — view all learner progress and scores.
- **LAN Access:** Other machines on the same network can access via `http://<your-ip>:3000`.

### Development Mode
```bash
npm run dev
```
This uses `--watch` to auto-restart the server when files change.

---

## Training Topics Explained

### Day 1 — Foundations: Claude Chat & Projects

**Block A: Claude Chat Fundamentals**
- **Anthropic at a Glance** — Anthropic's mission, safety-first approach, and Acceptable Use Policy (AUP) that governs all Claude usage.
- **Model Family** — Three tiers: Opus (most capable, complex reasoning), Sonnet (balanced speed/quality), Haiku (fastest, cost-effective). Choosing the right model depends on task complexity and latency needs.
- **Surfaces** — Claude is available on: claude.ai (web), desktop app (macOS/Windows), mobile app (iOS/Android), and browser extension.
- **Plans & Limits** — Free, Pro, Max, Team, Enterprise. Each has different message caps, file limits, and feature access.
- **Chat Essentials** — Conversations, regenerate (new response), branch (explore alternatives), share via link.
- **Artifacts** — Rich inline outputs: code snippets, documents, Mermaid diagrams, and live HTML/React previews.
- **File Uploads** — Supports PDF, DOCX, XLSX, CSV, images, audio. Max 30 MB per file.
- **Web Search & Research Mode** — Real-time web data with citations. Research mode performs multi-step searches.

**Block B: Projects & Memory**
- **Projects** — Persistent context containers that maintain reference files and custom instructions across conversations.
- **Project Knowledge** — Upload up to 200K tokens of reference files. Claude grounds answers in these files.
- **Custom Instructions** — Per-Project system prompts. Take precedence over user preferences.
- **Team Collaboration** — Viewer (read + chat) and Editor (modify files + instructions) roles.
- **Memory** — Global (all conversations) vs. Project-scoped. Incognito mode disables memory writing.
- **Privacy** — Users control data usage. Team/Enterprise have stricter defaults.

---

### Day 2 — Skills & Connectors

**Block A: Agent Skills**
- **Skill Anatomy** — Defined by SKILL.md with YAML frontmatter (`name` and `description` required).
- **Trigger Model** — Claude reads the description and auto-invokes Skills matching user intent. No manual commands needed.
- **Skill Levels** — User > Private > Public precedence order.
- **Writing Descriptions** — Too generic = false triggers. Too narrow = missed triggers. Be specific but generalizable.
- **Bundling Assets** — Skills can include Python, Node.js, and shell scripts alongside templates and data.
- **Distribution** — Package Skills into plugins for marketplace sharing.

**Block B: Connectors & Integrations**
- **Connectors** — First-party Anthropic integrations (OAuth-based). Different from third-party MCP apps.
- **Available Connectors** — Google Drive, Gmail, Calendar, Slack, GitHub, Jira, Asana, Notion, Linear.
- **Scopes** — Per-conversation (single chat) or per-account (all conversations).
- **Enterprise Controls** — Allow-lists, deny-lists, and audit logs for compliance.

---

### Day 3 — Claude Code (Basics to Advanced)

**Block A: Installation & Basics**
- **What is Claude Code** — Agentic coding tool that runs from the terminal. Reads, writes, and executes code locally.
- **Prerequisites** — Node.js 18+, npm, git. Windows requires WSL.
- **Installation** — `npm install -g @anthropic-ai/claude-code`, then run `claude`.
- **Authentication** — Browser-based auth on first run. Credentials stored in `~/.claude/credentials`.
- **CLAUDE.md** — Project-level config created by `/init`. Describes codebase and conventions.
- **Core Commands** — `/help`, `/clear`, `/init`, `/model`, `/cost`, `/exit`, `/doctor`.
- **Permission System** — Read, write, execute permissions with user consent prompts.

**Block B: Advanced**
- **Sub-Agents** — Specialized agents in `.claude/agents/*.md`. Delegated by description matching.
- **Plugins** — Extend capabilities. Managed via `/plugins list|install|update|disable`.
- **Hooks** — Pre/post-tool callbacks (e.g., auto-linting after edits).
- **Logging** — Session logs at `~/.claude/logs/session-*.jsonl`. `claude doctor` for diagnostics.
- **CI/CD** — Non-interactive mode with `-p` flag for pipeline integration.

---

### Day 4 — MCP Servers & Claude Cowork

**Block A: Model Context Protocol (MCP)**
- **MCP** — Open protocol connecting LLMs to external systems. Universal adapter for AI.
- **Three Primitives** — Tools (actions), Resources (data), Prompts (templates).
- **Transports** — stdio (local), SSE (persistent), streamable HTTP (request/response).
- **Configuration** — `claude mcp add <name> <command>` or JSON config. Restart client after adding.
- **Security** — Sandboxing, allow-lists, per-tool consent.
- **Authoring** — Python SDK (`mcp` package) or TypeScript SDK.

**Block B: Claude Cowork**
- **Cowork** — Agentic desktop workspace. Autonomously executes multi-step tasks in a sandbox.
- **Availability** — Paid plans only (Pro/Max/Team/Enterprise). Desktop app required.
- **Sandbox** — Apple Virtualization on macOS. Isolated VM for safe execution.
- **Outputs** — Excel with formulas, PowerPoint, Word, PDFs, images.
- **Plugins** — 11 integrations: Asana, Canva, Cloudflare, Figma, GitHub, Drive, Jira, Linear, Notion, Sentry, Slack.
- **Advanced** — `/schedule` for recurring tasks, Live Artifacts, Dispatch for mobile-initiated tasks.

---

### Day 5 — Plugins, Troubleshooting & Final Assessment

**Block A: Plugins & Marketplaces**
- **Plugin Anatomy** — `plugin.json` manifest bundling Skills, MCP servers, sub-agents, and Connectors.
- **Marketplaces** — Public (open to all) and Private (Enterprise-curated internal catalogs).
- **Security** — Code signing, allow-lists, automated + manual review.
- **Commands** — `/plugins list|install|update|disable`.
- **Portability** — Plugins can work across Claude Code and Cowork.

**Block B: Cross-Product Troubleshooting**
- **Triage Matrix** — Symptom > Product > First 3 checks > Escalate if unresolved.
- **Log Locations** — Claude.ai (browser console), Desktop (`~/Library/Logs/Claude/`), Code (`~/.claude/logs/`), Cowork (app logs + VM), MCP (server stderr/stdout).
- **Common Categories** — Auth, network, rate limiting, model errors, plugin/skill issues, billing.
- **Escalation Packets** — Repro steps, timestamps, request IDs, log excerpts, environment details.
- **Status Page** — Always check `status.anthropic.com` first.

---

## Project Structure

```
claude-training-hub/
├── package.json         — Dependencies and scripts
├── server.js            — Express server with API routes
├── data/
│   ├── content.json     — All 5 days of training content
│   ├── quizzes.json     — 75 quiz questions (15 per day)
│   └── users.json       — Auto-generated learner data
├── public/
│   ├── index.html       — Main HTML shell
│   ├── style.css        — Deloitte-branded styles
│   └── script.js        — Frontend SPA logic
├── readme.md            — This file
└── resources/
    ├── reference-links.md   — Curated links per topic
    └── session-deck.pptx    — Trainer kickoff slides
```

## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Storage:** JSON file (server-side, persists across sessions)
- **Styling:** Deloitte branding (green #86BC25, black, white)

## Final Assessment
The Day 5 final assessment uses Microsoft Forms for formal tracking. The trainer will share the Forms link during the session.
