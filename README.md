```
███████╗██╗      ██████╗ ██████╗ ██████╗ ██╗   ██╗███████╗████████╗███████╗██████╗
██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
███████╗██║     ██║   ██║██████╔╝██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝
╚════██║██║     ██║   ██║██╔═══╝ ██╔══██╗██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗
███████║███████╗╚██████╔╝██║     ██████╔╝╚██████╔╝███████║   ██║   ███████╗██║  ██║
╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

> **Stop shipping slop.**

Claude writes fast. That's the problem.

Give it a vague prompt and it makes 47 architectural decisions before you finish your coffee. Auth strategy, schema shape, error handling philosophy, rollback plan — all silently assumed. You review the diff and it *looks right*, which is the most dangerous thing a diff can do.

SlopBuster is the circuit breaker between your idea and Claude's execution. It forces the constraints to exist before the code does. Your words. Verbatim. Every time.

---

## The Loop

```
PLAN ──▶ GATE ──▶ APPLY ──▶ UNIFY
```

Four phases. No shortcuts. Every unit of work completes the full loop.

**PLAN** — You define what to build. Acceptance criteria, files touched, blast radius. Claude writes a constraint-first plan. `<constraints>` is visibly empty — a signal that the gate hasn't run.

**GATE** — The circuit breaker. It evaluates five triggers against your plan. If any fire, it asks you five architectural questions. Your exact answers — not a summary, not a paraphrase — are injected verbatim into the `<constraints>` section at the top of the plan. Then an 8-point pitfall checklist runs. Simple plans clear the gate automatically. Complex plans block until you've thought it through.

**APPLY** — Claude executes against *your* constraints, not its own interpretation. Tasks run in waves. Checkpoints protect against mid-run interruptions. If a task would touch a file marked DO NOT CHANGE, it stops dead.

**UNIFY** — Reconcile plan vs actual. Document scope drift. Write SUMMARY.md. Close the loop. At no point did Claude make an unconstrained architectural decision.

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

Your answers, verbatim, become the `<constraints>` block. Claude reads them before executing a single task. You can't forget to tell Claude what you decided — it's in the contract.

Then the 8-point pitfall checklist: business context alignment, schema backward compatibility, idempotency, error handling, YAGNI, state encapsulation, testing strategy, alternatives considered.

---

## Install

```bash
npx slopbuster --global    # Install to ~/.claude/ — works in every project
npx slopbuster --local     # Install to ./.claude/ — this project only
npx slopbuster --dry-run   # Preview what would be installed
npx slopbuster --verbose   # Show each file as it installs
npx slopbuster --uninstall # Remove
```

No build step. No compilation. No runtime. SlopBuster is markdown files that Claude Code reads directly. The installer copies them into place and rewrites path references. That's the whole system.

Then open Claude Code and run:

```
/sb:help
```

---

## Quick Start

```
/sb:init        Scaffold .slopbuster/ in your project (30 seconds)
/sb:discuss     Surface assumptions before writing the plan
/sb:plan        Write a constraint-first plan — Gate thresholds evaluated
/sb:gate        Run the circuit breaker — answer 5 questions
/sb:apply       Execute against your constraints, not Claude's assumptions
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
| `/sb:research [topic]` | Deploy a research agent for external information |

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
├── config.md           # Gate thresholds, enterprise settings
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

SlopBuster installs as Claude Code slash commands — markdown files in `~/.claude/commands/sb/`. When you run `/sb:plan`, Claude Code loads `plan.md` and executes the instructions inside. Workflows in `~/.claude/slopbuster-framework/workflows/` contain the logic. Templates in `~/.claude/slopbuster-framework/templates/` are the file scaffolding.

`bin/install.js` copies `src/` to `~/.claude/` and rewrites all `@src/` path references to their installed absolute paths so cross-file references resolve correctly after install.

No service. No daemon. No build step. When SlopBuster isn't running, nothing is running.

---

## Why This Matters

The failure mode in AI-assisted development isn't that Claude writes bad code. It's that Claude writes *plausible* code against *implicit* constraints — and you don't discover the mismatch until you're three features deep.

SlopBuster makes the constraints explicit before execution starts. The Gate forces the conversation you should have had anyway. The constraint block makes it impossible to forget. The verification checklist makes "done" mean something specific.

If you're shipping fast and wondering why things keep needing to be redone — you're paying the slop tax.

---

## License

MIT
