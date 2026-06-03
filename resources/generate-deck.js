const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Deloitte Consulting";
pres.title = "Claude Support Training Program - 5-Day Intensive";

const GREEN = "86BC25";
const GREEN_DARK = "6B9B1E";
const GREEN_LIGHT = "E8F5D0";
const BLACK = "000000";
const WHITE = "FFFFFF";
const GRAY_100 = "F2F2F2";
const GRAY_500 = "888888";
const GRAY_700 = "555555";
const DARK = "1A1A1A";

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

// --- SLIDE 1: Title ---
const s1 = pres.addSlide();
s1.background = { color: BLACK };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 5.625, fill: { color: GREEN } });
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.0, w: 10, h: 0.04, fill: { color: GREEN } });
s1.addText("D", {
  x: 0.6, y: 0.4, w: 0.7, h: 0.7, fontSize: 32, fontFace: "Arial Black",
  color: BLACK, fill: { color: GREEN }, align: "center", valign: "middle"
});
s1.addText("Claude Support Training Program", {
  x: 0.6, y: 1.5, w: 8.5, h: 1.0, fontSize: 36, fontFace: "Georgia",
  color: WHITE, bold: true, margin: 0
});
s1.addText("5-Day Intensive", {
  x: 0.6, y: 2.5, w: 8.5, h: 0.7, fontSize: 28, fontFace: "Georgia",
  color: GREEN, margin: 0
});
s1.addText("Prepared for L0/L1 Support Engineers", {
  x: 0.6, y: 4.3, w: 5, h: 0.4, fontSize: 14, fontFace: "Calibri",
  color: GRAY_500, margin: 0
});
s1.addText("Deloitte Consulting | 2026", {
  x: 0.6, y: 4.8, w: 5, h: 0.4, fontSize: 12, fontFace: "Calibri",
  color: GRAY_700, margin: 0
});

// --- SLIDE 2: Program Overview ---
const s2 = pres.addSlide();
s2.background = { color: WHITE };
s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: GREEN } });
s2.addText("Program Overview", {
  x: 0.6, y: 0.35, w: 9, h: 0.6, fontSize: 30, fontFace: "Georgia",
  color: BLACK, bold: true, margin: 0
});
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 1.2, h: 0.04, fill: { color: GREEN } });

const scheduleData = [
  [
    { text: "Block", options: { bold: true, color: WHITE, fill: { color: BLACK }, fontSize: 11 } },
    { text: "Time", options: { bold: true, color: WHITE, fill: { color: BLACK }, fontSize: 11 } },
    { text: "Activity", options: { bold: true, color: WHITE, fill: { color: BLACK }, fontSize: 11 } }
  ],
  [
    { text: "Morning Session 1", options: { fontSize: 10 } },
    { text: "8:30 - 10:00", options: { fontSize: 10 } },
    { text: "Concept review + live demo (Topic A)", options: { fontSize: 10 } }
  ],
  [
    { text: "Lab 1", options: { fontSize: 10 } },
    { text: "10:15 - 11:30", options: { fontSize: 10 } },
    { text: "Hands-on exercise (Topic A)", options: { fontSize: 10 } }
  ],
  [
    { text: "Morning Session 2", options: { fontSize: 10 } },
    { text: "11:30 - 12:30", options: { fontSize: 10 } },
    { text: "Concept review (Topic B)", options: { fontSize: 10 } }
  ],
  [
    { text: "Afternoon Session", options: { fontSize: 10 } },
    { text: "13:15 - 14:30", options: { fontSize: 10 } },
    { text: "Live demo + troubleshooting (Topic B)", options: { fontSize: 10 } }
  ],
  [
    { text: "Lab 2", options: { fontSize: 10 } },
    { text: "14:45 - 16:30", options: { fontSize: 10 } },
    { text: "Hands-on exercise (Topic B)", options: { fontSize: 10 } }
  ],
  [
    { text: "Knowledge Check", options: { fontSize: 10, bold: true, color: GREEN_DARK } },
    { text: "16:30 - 17:00", options: { fontSize: 10 } },
    { text: "15 MCQs per day", options: { fontSize: 10 } }
  ]
];
s2.addTable(scheduleData, {
  x: 0.6, y: 1.4, w: 5.2, colW: [1.6, 1.3, 2.3],
  border: { pt: 0.5, color: "CCCCCC" }, rowH: 0.35,
  autoPage: false
});

s2.addShape(pres.shapes.RECTANGLE, {
  x: 6.3, y: 1.4, w: 3.3, h: 1.2, fill: { color: GRAY_100 },
  shadow: makeShadow()
});
s2.addText([
  { text: "Audience", options: { bold: true, fontSize: 13, breakLine: true, color: BLACK } },
  { text: "New hire support engineers (L0/L1)", options: { fontSize: 11, breakLine: true, color: GRAY_700 } },
  { text: "10-12 learners per cohort", options: { fontSize: 11, color: GRAY_700 } }
], { x: 6.5, y: 1.5, w: 2.9, h: 1.0 });

s2.addShape(pres.shapes.RECTANGLE, {
  x: 6.3, y: 2.85, w: 3.3, h: 1.2, fill: { color: GRAY_100 },
  shadow: makeShadow()
});
s2.addText([
  { text: "Duration", options: { bold: true, fontSize: 13, breakLine: true, color: BLACK } },
  { text: "5 days, 9 hours/day", options: { fontSize: 11, breakLine: true, color: GRAY_700 } },
  { text: "1-hour trainer session + self-paced study", options: { fontSize: 11, color: GRAY_700 } }
], { x: 6.5, y: 2.95, w: 2.9, h: 1.0 });

s2.addShape(pres.shapes.RECTANGLE, {
  x: 6.3, y: 4.3, w: 3.3, h: 0.9, fill: { color: GREEN_LIGHT },
  shadow: makeShadow()
});
s2.addText([
  { text: "Pre-Work", options: { bold: true, fontSize: 13, breakLine: true, color: GREEN_DARK } },
  { text: "Skim Claude 101, install Node.js 18+", options: { fontSize: 11, color: GRAY_700 } }
], { x: 6.5, y: 4.4, w: 2.9, h: 0.7 });

// --- Helper for Day Slides ---
function createDaySlide(dayNum, title, blockA, blockB, topicsA, topicsB) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: GREEN } });

  s.addText(`DAY ${dayNum}`, {
    x: 0.6, y: 0.25, w: 2, h: 0.35, fontSize: 12, fontFace: "Calibri",
    color: GREEN_DARK, bold: true, margin: 0, charSpacing: 2
  });
  s.addText(title, {
    x: 0.6, y: 0.55, w: 9, h: 0.5, fontSize: 24, fontFace: "Georgia",
    color: BLACK, bold: true, margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 1.0, h: 0.04, fill: { color: GREEN } });

  // Block A
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.45, w: 4.3, h: 3.8, fill: { color: GRAY_100 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.45, w: 4.3, h: 0.45, fill: { color: BLACK } });
  s.addText(`Block A: ${blockA}`, {
    x: 0.7, y: 1.48, w: 3.9, h: 0.4, fontSize: 12, fontFace: "Calibri",
    color: GREEN, bold: true, margin: 0
  });

  const bulletsA = topicsA.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < topicsA.length - 1, fontSize: 10, color: DARK }
  }));
  s.addText(bulletsA, { x: 0.7, y: 2.05, w: 3.9, h: 3.0, fontFace: "Calibri", paraSpaceAfter: 4 });

  // Block B
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.45, w: 4.3, h: 3.8, fill: { color: GRAY_100 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.45, w: 4.3, h: 0.45, fill: { color: BLACK } });
  s.addText(`Block B: ${blockB}`, {
    x: 5.4, y: 1.48, w: 3.9, h: 0.4, fontSize: 12, fontFace: "Calibri",
    color: GREEN, bold: true, margin: 0
  });

  const bulletsB = topicsB.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < topicsB.length - 1, fontSize: 10, color: DARK }
  }));
  s.addText(bulletsB, { x: 5.4, y: 2.05, w: 3.9, h: 3.0, fontFace: "Calibri", paraSpaceAfter: 4 });

  return s;
}

// --- SLIDE 3: Day 1 ---
createDaySlide(1, "Foundations: Claude Chat & Projects",
  "Claude Chat Fundamentals", "Projects & Memory",
  [
    "Anthropic mission & Acceptable Use Policy",
    "Model family: Opus, Sonnet, Haiku",
    "Surfaces: web, desktop, mobile, extension",
    "Plans & limits: Free, Pro, Max, Team, Enterprise",
    "Chat essentials: conversations, branch, share",
    "Artifacts: code, docs, diagrams, HTML previews",
    "File uploads: PDF, DOCX, XLSX, CSV, images",
    "Web search & research mode"
  ],
  [
    "What is a Project: persistent context container",
    "Project knowledge: up to 200K tokens",
    "Custom instructions: per-Project prompts",
    "Team collaboration: Viewer vs. Editor roles",
    "Memory: global vs. Project-scoped",
    "Incognito mode & privacy controls",
    "Best practices: Projects vs. single chats"
  ]
);

// --- SLIDE 4: Day 2 ---
createDaySlide(2, "Skills & Connectors",
  "Agent Skills", "Connectors & Integrations",
  [
    "Skill anatomy: SKILL.md + YAML frontmatter",
    "Required fields: name and description",
    "Trigger model: auto-invocation by description",
    "Public vs. Private vs. User skills",
    "Writing effective descriptions",
    "Bundling assets: Python, Node.js, shell scripts",
    "Distribution via plugins & marketplace"
  ],
  [
    "Connector model: first-party vs. third-party MCP",
    "Authentication: OAuth 2.0 flows & scopes",
    "Catalog: Drive, Gmail, Slack, GitHub, Jira, etc.",
    "Per-conversation vs. per-account scope",
    "Enabling/disabling in chat and settings",
    "Enterprise admin controls: allow/deny lists",
    "Data flow, retention & privacy"
  ]
);

// --- SLIDE 5: Day 3 ---
createDaySlide(3, "Claude Code (Basics to Advanced)",
  "Installation & Basics", "Advanced Features",
  [
    "What is Claude Code: agentic coding in terminal",
    "Prerequisites: Node.js 18+, npm, git",
    "Install: npm install -g @anthropic-ai/claude-code",
    "First run & browser authentication",
    "Project init: CLAUDE.md & .claude/ directory",
    "Core commands: /help, /init, /model, /cost, /doctor",
    "File operations & permission system",
    "Models & cost tracking"
  ],
  [
    "Sub-agents: .claude/agents/*.md definitions",
    "Plugins: /plugins list, install, update, disable",
    "Skills inside Claude Code: .claude/skills/",
    "Hooks: pre/post-tool callbacks (linting, audit)",
    "Logging: ~/.claude/logs/session-*.jsonl",
    "claude doctor: comprehensive diagnostics",
    "CI/CD integration: -p flag (non-interactive)"
  ]
);

// --- SLIDE 6: Day 4 ---
createDaySlide(4, "MCP Servers & Claude Cowork",
  "Model Context Protocol (MCP)", "Claude Cowork",
  [
    "MCP: open protocol for LLM-to-system connections",
    "Three primitives: Tools, Resources, Prompts",
    "Transports: stdio, SSE, streamable HTTP",
    "Server discovery: claude mcp add, JSON config",
    "Auth patterns: API keys, OAuth, none",
    "Security: sandboxing, allow-lists, per-tool consent",
    "Authoring: Python SDK & TypeScript SDK"
  ],
  [
    "Cowork: agentic desktop workspace",
    "Availability: paid plans (Pro/Max/Team/Enterprise)",
    "Task loop: plan, execute, review",
    "Sandbox: Apple Virtualization (macOS)",
    "Outputs: Excel, PowerPoint, Word, PDF, images",
    "11 plugins: GitHub, Slack, Notion, Jira, etc.",
    "Scheduled tasks, Live Artifacts & Dispatch"
  ]
);

// --- SLIDE 7: Day 5 ---
createDaySlide(5, "Plugins, Troubleshooting & Final Assessment",
  "Plugins & Marketplaces", "Cross-Product Troubleshooting",
  [
    "Plugin anatomy: plugin.json manifest",
    "Bundles: Skills, MCP servers, sub-agents, Connectors",
    "Public marketplace: browse, install, rate",
    "Private marketplaces: Enterprise admin catalogs",
    "Trust & security: signing, allow-lists, review",
    "Commands: /plugins list, install, update, disable",
    "Cross-product portability (Code + Cowork)"
  ],
  [
    "Triage matrix: symptom > product > first 3 checks",
    "Log locations across all Claude surfaces",
    "Common categories: auth, network, rate-limit",
    "Model errors, plugin/skill issues, billing",
    "Escalation packets: repro, timestamps, request IDs",
    "status.anthropic.com: check first always"
  ]
);

// --- SLIDE 8: Assessment & Success Criteria ---
const s8 = pres.addSlide();
s8.background = { color: WHITE };
s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: GREEN } });
s8.addText("Assessment & Success Criteria", {
  x: 0.6, y: 0.35, w: 9, h: 0.6, fontSize: 30, fontFace: "Georgia",
  color: BLACK, bold: true, margin: 0
});
s8.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.05, w: 1.2, h: 0.04, fill: { color: GREEN } });

// Daily checks card
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.4, w: 4.3, h: 2.5, fill: { color: GRAY_100 },
  shadow: makeShadow()
});
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 0.08, h: 2.5, fill: { color: GREEN } });
s8.addText("Daily Knowledge Checks", {
  x: 0.85, y: 1.55, w: 3.8, h: 0.35, fontSize: 16, fontFace: "Calibri",
  color: BLACK, bold: true, margin: 0
});
s8.addText([
  { text: "15 multiple-choice questions per day", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "10 from training plan + 5 additional", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Unlimited retakes allowed", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Best score tracked automatically", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Immediate scoring and answer review", options: { bullet: true, fontSize: 12, color: DARK } }
], { x: 0.85, y: 2.05, w: 3.8, h: 1.7, fontFace: "Calibri", paraSpaceAfter: 4 });

// Final assessment card
s8.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.4, w: 4.3, h: 2.5, fill: { color: GRAY_100 },
  shadow: makeShadow()
});
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 0.08, h: 2.5, fill: { color: GREEN } });
s8.addText("Final Assessment (Day 5)", {
  x: 5.55, y: 1.55, w: 3.8, h: 0.35, fontSize: 16, fontFace: "Calibri",
  color: BLACK, bold: true, margin: 0
});
s8.addText([
  { text: "50 multiple-choice questions (Days 1-5)", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "1 live troubleshooting scenario", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Passing score: 80%", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Tracked via Microsoft Forms", options: { bullet: true, breakLine: true, fontSize: 12, color: DARK } },
  { text: "Judged on triage quality & write-up clarity", options: { bullet: true, fontSize: 12, color: DARK } }
], { x: 5.55, y: 2.05, w: 3.8, h: 1.7, fontFace: "Calibri", paraSpaceAfter: 4 });

// Big stats
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.2, w: 2.8, h: 1.1, fill: { color: BLACK }
});
s8.addText([
  { text: "75", options: { fontSize: 36, bold: true, color: GREEN, breakLine: true } },
  { text: "Total Questions (Daily)", options: { fontSize: 10, color: GRAY_500 } }
], { x: 0.5, y: 4.25, w: 2.8, h: 1.0, align: "center", valign: "middle" });

s8.addShape(pres.shapes.RECTANGLE, {
  x: 3.6, y: 4.2, w: 2.8, h: 1.1, fill: { color: BLACK }
});
s8.addText([
  { text: "80%", options: { fontSize: 36, bold: true, color: GREEN, breakLine: true } },
  { text: "Final Pass Threshold", options: { fontSize: 10, color: GRAY_500 } }
], { x: 3.6, y: 4.25, w: 2.8, h: 1.0, align: "center", valign: "middle" });

s8.addShape(pres.shapes.RECTANGLE, {
  x: 6.7, y: 4.2, w: 2.8, h: 1.1, fill: { color: BLACK }
});
s8.addText([
  { text: "5", options: { fontSize: 36, bold: true, color: GREEN, breakLine: true } },
  { text: "Days of Training", options: { fontSize: 10, color: GRAY_500 } }
], { x: 6.7, y: 4.25, w: 2.8, h: 1.0, align: "center", valign: "middle" });

// --- SLIDE 9: Resources & Support ---
const s9 = pres.addSlide();
s9.background = { color: WHITE };
s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: GREEN } });
s9.addText("Resources & Support", {
  x: 0.6, y: 0.35, w: 9, h: 0.6, fontSize: 30, fontFace: "Georgia",
  color: BLACK, bold: true, margin: 0
});
s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.05, w: 1.2, h: 0.04, fill: { color: GREEN } });

const resources = [
  ["Resource", "URL"],
  ["Anthropic Skilljar Academy", "anthropic.skilljar.com"],
  ["Claude 101 Course", "anthropic.skilljar.com/claude-101"],
  ["Claude Code 101", "anthropic.skilljar.com/claude-code-101"],
  ["Intro to Cowork", "anthropic.skilljar.com/introduction-to-claude-cowork"],
  ["Intro to MCP", "anthropic.skilljar.com/introduction-to-model-context-protocol"],
  ["Claude Help Center", "support.anthropic.com"],
  ["Claude API Docs", "docs.anthropic.com"],
  ["Anthropic Status Page", "status.anthropic.com"],
  ["Anthropic Trust Center", "trust.anthropic.com"]
];
const resTable = resources.map((row, i) => {
  if (i === 0) {
    return row.map(cell => ({ text: cell, options: { bold: true, color: WHITE, fill: { color: BLACK }, fontSize: 11 } }));
  }
  return row.map((cell, ci) => ({
    text: cell,
    options: {
      fontSize: 10,
      color: ci === 1 ? GREEN_DARK : DARK,
      fill: { color: i % 2 === 0 ? GRAY_100 : WHITE }
    }
  }));
});
s9.addTable(resTable, {
  x: 0.6, y: 1.35, w: 8.8, colW: [3.5, 5.3],
  border: { pt: 0.5, color: "CCCCCC" }, rowH: 0.35,
  autoPage: false
});

// --- SLIDE 10: Q&A ---
const s10 = pres.addSlide();
s10.background = { color: BLACK };
s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 5.625, fill: { color: GREEN } });
s10.addText("D", {
  x: 4.4, y: 1.0, w: 1.2, h: 1.2, fontSize: 52, fontFace: "Arial Black",
  color: BLACK, fill: { color: GREEN }, align: "center", valign: "middle"
});
s10.addText("Questions?", {
  x: 1, y: 2.5, w: 8, h: 0.8, fontSize: 40, fontFace: "Georgia",
  color: WHITE, bold: true, align: "center", margin: 0
});
s10.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.4, w: 3, h: 0.04, fill: { color: GREEN } });
s10.addText([
  { text: "Contact your training coordinator", options: { fontSize: 14, color: GRAY_500, breakLine: true } },
  { text: "for any follow-up questions or support.", options: { fontSize: 14, color: GRAY_500 } }
], { x: 1, y: 3.7, w: 8, h: 0.8, align: "center", fontFace: "Calibri" });
s10.addText("Thank you", {
  x: 1, y: 4.6, w: 8, h: 0.5, fontSize: 16, fontFace: "Georgia",
  color: GREEN, align: "center", italic: true, margin: 0
});

const outPath = path.join(__dirname, "session-deck.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Presentation saved to:", outPath);
}).catch(err => {
  console.error("Error:", err);
});
