```
███████╗██╗      ██████╗ ██████╗ ██████╗ ██╗   ██╗███████╗████████╗███████╗██████╗
██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
███████╗██║     ██║   ██║██████╔╝██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝
╚════██║██║     ██║   ██║██╔═══╝ ██╔══██╗██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗
███████║███████╗╚██████╔╝██║     ██████╔╝╚██████╔╝███████║   ██║   ███████╗██║  ██║
╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

> **Stop shipping slop.**

AI coding assistants move fast. That's the problem.

Give one a vague prompt and it makes 47 architectural decisions before you finish your coffee. Auth strategy, schema shape, error handling philosophy, rollback plan — all silently assumed. You review the diff and it *looks right*, which is the most dangerous thing a diff can do.

SlopBuster is the circuit breaker between your idea and your AI's execution. It works in Claude Code, VS Code with Copilot, and Cursor. It forces the constraints to exist before the code does. Your words. Verbatim. Every time.

---

## The Loop

```
PLAN ──▶ GATE ──▶ APPLY ──▶ UNIFY
```

Four phases. No shortcuts. Every unit of work completes the full loop.

**PLAN** — You define what to build. Acceptance criteria, files touched, blast radius. The AI writes a constraint-first plan. `<constraints>` is visibly empty — a signal that the gate hasn't run.

**GATE** — The circuit breaker. It evaluates five triggers against your plan. If any fire, it asks you five architectural questions. Your exact answers — not a summary, not a paraphrase — are injected verbatim into the `<constraints>` section at the top of the plan. Then an 8-point pitfall checklist runs. Simple plans clear the gate automatically. Complex plans block until you've thought it through.

**APPLY** — The AI executes against *your* constraints, not its own interpretation. Tasks run in waves. Checkpoints protect against mid-run interruptions. If a task would touch a file marked DO NOT CHANGE, it stops dead.

**UNIFY** — Reconcile plan vs actual. Document scope drift. Write SUMMARY.md. Close the loop. At no point did the AI make an unconstrained architectural decision.

---

## The Gate

Five triggers. Any one fires, you answer five questions.

| Trigger | What it catches |
|---------|----------------|
| Plan modifies > 5 files | Scope too wide to be safe without a contract |
| New external dependencies | Package surface you haven't audited |
| Database schema changes | Migrations you can't easily roll back |
| API contract changes | Breaking changes to things other code depends on |
| Auth or session changes | Security surface that warrants explicit thought |

**The five questions:**

1. **Connectivity** — What systems does this touch? What's the blast radius?
2. **Performance** — Latency targets? Indexes? Memory profile?
3. **Concurrency** — Idempotency? Race conditions? Locking?
4. **Security** — Protected vs. public? Validation? Secrets?
5. **Rollback** — If this fails mid-execution, what's the path back?

Your answers, verbatim, become the `<constraints>` block. The AI reads them before executing a single task. You can't forget to tell it what you decided — it's in the contract.

Then the 8-point pitfall checklist: business context alignment, schema backward compatibility, idempotency, error handling, YAGNI, state encapsulation, testing strategy, alternatives considered.

---

## Editor Support

SlopBuster runs in Claude Code, VS Code (Copilot Chat), and Cursor. The same loop. The same Gate. The same constraints — regardless of which AI assistant you use.

| Editor | Commands | Gate enforcement |
|--------|----------|-----------------|
| Claude Code | `/sb:gate`, `/sb:plan`, etc. | Hard — `allowed_tools` blocks execution |
| VS Code (Copilot) | `/sb-gate`, `/sb-plan`, etc. | Hard — MCP elicitation form dialog |
| Cursor | `/sb-gate`, `/sb-plan`, etc. | Hard — MCP elicitation form dialog |

VS Code 1.103+ and Cursor 1.5+ support MCP elicitation natively. When the Gate fires, it opens a native form dialog in your editor — not a chat message, an actual structured form. Your answers are written verbatim to `<constraints>` the moment you submit.

---

## Install

**One command. Done.**

```bash
npx github:kwad77/slopbuster
```

Installs slash commands for your AI editor AND scaffolds `.slopbuster/` in your project. Auto-detects Claude Code, VS Code, and Cursor.

**No Node.js?**

```bash
curl -fsSL https://raw.githubusercontent.com/kwad77/slopbuster/master/bin/install.sh | sh
```

Works on any Mac or Linux with curl. Installs Claude Code support. Re-run with Node once you have it for VS Code/Cursor.

**Specific editors:**

```bash
npx github:kwad77/slopbuster --claude     # Claude Code → ~/.claude/
npx github:kwad77/slopbuster --vscode     # VS Code → .github/prompts/ + .vscode/mcp.json
npx github:kwad77/slopbuster --cursor     # Cursor → .cursor/rules/ + .cursor/mcp.json
npx github:kwad77/slopbuster --all        # All three editors
```

**Other options:**

```bash
npx github:kwad77/slopbuster --dry-run    # Preview what would be installed
npx github:kwad77/slopbuster --verbose    # Show each file as it installs
npx github:kwad77/slopbuster --uninstall  # Remove
```

No build step. No compilation. No runtime. SlopBuster is markdown files your editor reads directly. After install, `.slopbuster/` is ready in your project — edit `PROJECT.md` with your project name and core value, then start planning.

```
/sb:plan        (Claude Code)
/sb-plan        (VS Code / Cursor)
```

---

## Example Workflows

- [Greenfield — new project with governance from day one](docs/greenfield-flow.md)
- [Brownfield — dropping governance into an existing codebase](docs/brownfield-flow.md)

---

## Quick Start

```
/sb:init        Scaffold .slopbuster/ in your project (30 seconds)
/sb:discuss     Surface assumptions before writing the plan
/sb:plan        Write a constraint-first plan — Gate thresholds evaluated
/sb:gate        Run the circuit breaker — answer 5 questions
/sb:apply       Execute against your constraints, not the AI's assumptions
/sb:unify       Close the loop — SUMMARY.md written, decisions recorded
```

What this looks like in practice:

```
/sb:init           → .slopbuster/ scaffolded
/sb:plan           → PLAN.md created, <constraints> visibly empty
/sb:apply          → ⛔ blocked — Gate hasn't run
/sb:gate           → 5 questions, answers injected verbatim
/sb:apply          → executes wave by wave, checkpointed
/sb:unify          → loop closed, SUMMARY.md written
/sb:progress       → tells you exactly where you are and what to do next
```

---

## All 17 Commands

### Core Loop
| Command | What it does |
|---------|-------------|
| `/sb:init` | Initialize SlopBuster in a project |
| `/sb:plan [phase]` | Create a constraint-first plan |
| `/sb:gate [plan-path]` | Run the circuit breaker |
| `/sb:apply [plan-path]` | Execute a gate-cleared plan |
| `/sb:unify [plan-path]` | Reconcile plan vs actual, close the loop |

### Navigation
| Command | What it does |
|---------|-------------|
| `/sb:progress` | Current loop position + one next action |
| `/sb:resume` | Restore full context from STATE.md and continue |
| `/sb:pause [reason]` | Write handoff, stop cleanly |
| `/sb:help` | Full command reference with frontmatter field docs |

### Pre-Planning
| Command | What it does |
|---------|-------------|
| `/sb:discuss [phase]` | Articulate vision and surface assumptions before planning |
| `/sb:research [topic]` | Deploy a research agent for external information gathering |

### Roadmap
| Command | What it does |
|---------|-------------|
| `/sb:milestone [name]` | Create or manage milestones |
| `/sb:roadmap` | View roadmap, add/remove phases |

### Quality
| Command | What it does |
|---------|-------------|
| `/sb:verify [scope]` | Guide manual user acceptance testing |
| `/sb:fix [plan-number]` | Plan and execute fixes for UAT issues |
| `/sb:audit [plan-path]` | Enterprise architectural audit |

### Compliance
| Command | What it does |
|---------|-------------|
| `/sb:export [framework]` | Export Gate records as compliance evidence (soc2, hipaa, fedramp, all) |

### Config
| Command | What it does |
|---------|-------------|
| `/sb:config` | View or modify gate thresholds and preferences |

---

## Project Structure

After `/sb:init`, your project gets:

```
.slopbuster/
├── PROJECT.md          # Project name, core value, stack, constraints
├── ROADMAP.md          # Milestones and phases
├── STATE.md            # Current loop position, decisions, resume point
├── config.md           # Gate thresholds, routing, enterprise settings
├── records/            # Change Records — one per plan, named by plan hash
│   └── a3f9c2e1b4d7-CHANGE-RECORD.md   # Standalone artifact: all Gate answers + auth chain
├── stewards/           # Domain team stewardship files (optional)
│   ├── README.md       # Format guide for steward files
│   └── database.md     # Example: DBA team owns Gate questions for DB changes
└── phases/
    └── 01-phase-name/
        ├── 01-01-PLAN.md         # Constraint-first plan
        ├── 01-01-GATE.md         # Circuit breaker clearance artifact
        ├── 01-01-SUMMARY.md      # UNIFY output — loop closed
        └── 01-01-UAT-ISSUES.md   # Verify issues (if any)
```

STATE.md is the session bridge. Under 80 lines. Always current. It's how `/sb:resume` drops you back exactly where you left off.

---

## PLAN.md Frontmatter

Two fields worth knowing:

**`autonomous: true|false`** — When `false`, APPLY pauses before each wave and waits for re-run. Use this when you want human confirmation between execution waves. Default is `true` — run straight through.

**`depends_on: []`** — List plans that must be unified before this one runs. APPLY blocks with a clear error if a dependency hasn't completed.

---

## How It Works

SlopBuster installs as slash commands and editor rules — markdown files your editor loads directly. Nothing runs in the background. When you invoke a command, your editor reads the workflow file and executes the instructions inside.

**Claude Code:** Commands install to `~/.claude/commands/sb/`. Workflows install to `~/.claude/slopbuster-framework/`. The Gate uses `allowed_tools` to block APPLY until the circuit breaker clears.

**VS Code (Copilot):** Prompt files install to `.github/prompts/`. The MCP server registers as `slopbuster-mcp` in `.vscode/mcp.json`. The Gate opens a native elicitation form dialog via MCP — a structured input form, not a chat message.

**Cursor:** MDC rules install to `.cursor/rules/`. The same MCP server registers in `.cursor/mcp.json`. Gate enforcement uses the same elicitation form path.

No service. No daemon. No build step. When SlopBuster isn't running, nothing is running.

---

## Why This Matters

The failure mode in AI-assisted development isn't that the AI writes bad code. It's that it writes *plausible* code against *implicit* constraints — and you don't discover the mismatch until you're three features deep.

SlopBuster makes the constraints explicit before execution starts. The Gate forces the conversation you should have had anyway. The constraint block makes it impossible to forget. The verification checklist makes "done" mean something specific.

This works the same whether your team uses Claude, GPT-4, Gemini, or any other model underneath. The framework is model-agnostic. The loop is what matters.

If you're shipping fast and wondering why things keep needing to be redone — you're paying the slop tax.

---

## Enterprise Roadmap

Every major AI governance framework — NIST AI RMF, ISO 42001, EU AI Act — mandates the same thing: risk assessment before action, human oversight proportional to risk, and a documented decision trail. Current AI coding tools operate after architectural decisions are made. SlopBuster operates before. That distinction is the only place where governance is actually enforceable.

### Goal 1 — Auditable by Default

AI-assisted code changes should produce compliance evidence automatically, not require manual documentation after the fact.

Every Gate clearance becomes a structured audit record — signed with AI model identity, authenticated human identity, plan hash, and timestamp. That record exports directly to SIEM systems (Splunk, Sentinel, QRadar), maps to SOC 2 controls, HIPAA audit requirements, or FedRAMP event standards depending on your compliance posture. The question "who is accountable when AI-generated code causes an incident?" has a non-repudiable answer baked into the development workflow, not reconstructed from git blame after the fact.

### Goal 2 — Risk-Aware, Not Risk-Ignorant

Not every change carries the same risk. The tools should know the difference.

Plans are classified automatically — LOW, MEDIUM, HIGH, CRITICAL — based on what they touch: authentication systems, payment processing, PII handling, external contracts. That classification routes the change accordingly. A junior engineer on a LOW-risk refactor proceeds without friction. A HIGH-risk schema migration routes to an Architecture Review Board before the Gate even opens. Role-based Gate authority maps to your org hierarchy, not to self-selection. SSO and SCIM keep identity authoritative. Jira and ServiceNow receive structured change requests with risk tier pre-populated, eliminating the manual translation layer between development and change management.

### Goal 3 — Institutional Knowledge That Doesn't Walk Out the Door

The biggest governance failure in most organizations isn't that the rules don't exist — it's that the rules live in people's heads, not in systems.

Expert stewardship addresses this directly. Domain teams own versioned markdown files that inject into the Gate whenever their domain is touched:

```
.slopbuster/stewards/
├── network.md        ← Network team — BGP failover, CIDR conflicts, firewall surface
├── database.md       ← DBA team — index strategy, migration reversibility, replication lag
├── payments.md       ← Payments team — PCI-DSS checklist, fraud surface, settlement windows
├── auth.md           ← Security team — threat model questions, token lifecycle, session boundaries
└── infrastructure.md ← Platform/SRE — deployment blast radius, rollback runbooks, on-call scope
```

When a plan touches the payments domain, the payments team's questions and checklist items are added to that Gate interrogation — automatically, every time, without anyone remembering to ask. When a post-incident review reveals a question that should have been asked, the relevant team adds it to their file. Every future plan touching their domain inherits that lesson. The stewardship files are version-controlled. Changes require review. The institutional knowledge is in the system, not in the senior engineer who just gave notice.

**This is live today.** Drop a steward file in `.slopbuster/stewards/`, set its `triggers:` or `file_paths:` frontmatter, and the Gate will import it automatically on every matching plan.

### Goal 4 — Governance as Infrastructure

Compliance shouldn't be a separate workstream that runs alongside engineering. It should be a property of the engineering workflow itself.

Governance framework modes (NIST AI RMF, ISO 42001, EU AI Act, HIPAA, FedRAMP) produce audit evidence formatted to each framework's requirements — not generic exports that someone has to manually map. A Provenance Bill of Materials attaches to every Gate-cleared commit: model identity, plan hash, constraint fingerprint, stewardship file versions, risk classification. A compliance dashboard surfaces Gate clearance rates, override frequency, constraint quality trends, and team-by-team governance posture — the view a CISO or engineering director needs without building it themselves. On-premises and air-gapped deployment packages extend this to regulated industries where cloud dependency is not an option.

---

## License

MIT
