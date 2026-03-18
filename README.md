```
 ____  _     ___  ____  ____  _  _  ____  ____  ____  ____
/ ___\/ \   /   \/  __\/  _ \/ \/ \/  __\/  __\/  __\/  __\
|    \| |   | / ||  \/|| / \|| \/ ||  \/||  \/||  \/||  \/|
\___ || |_/\|   ||  __/| \_/|| \/ ||  __/|  __/|    /|    /
\____/\____/\_/\_|_|   \____/\_/\_/\_/   \_/   \_/\_\\_/\_\
```
> *Stop shipping slop.*

SlopBuster is a Claude Code slash command framework for **constraint-first AI-assisted development**. It sits between your plan and Claude's execution with a circuit breaker — the Gate — that refuses to let Claude touch a file until you've answered five architectural questions and signed your name to the constraints.

Your words. Verbatim. Into the plan. Every time.

---

## The Problem

AI-assisted development is execution-first by default. You describe what to build, Claude builds it. Nobody stops to define what the plan *cannot* do — the blast radius, the performance ceiling, the rollback path if it fails halfway through.

The result is architectural drift, silent assumptions, and slop.

SlopBuster is the circuit breaker between intent and execution.

---

## The Loop

```
PLAN ──▶ GATE ──▶ APPLY ──▶ UNIFY
```

Every unit of work runs through this loop. No shortcuts.

**PLAN** — Define what to build and why. Acceptance criteria first.

**GATE** — The circuit breaker. Fires on: >5 files, new dependencies, schema changes, API changes, auth changes. When it fires, you answer 5 questions. Your answers are injected verbatim into the plan's `<constraints>` section — the first thing Claude reads before executing any task. Simple plans auto-clear. Complex plans block until you've thought it through.

**APPLY** — Execute against *your* constraints, not Claude's interpretation of them. Tasks run in waves. Checkpoints protect against mid-run interruptions.

**UNIFY** — Reconcile plan vs actual. Document scope drift. Close the loop. Every loop ends with a SUMMARY.md.

---

## Install

```bash
npx slopbuster --global    # Install to ~/.claude/ (all projects)
npx slopbuster --local     # Install to ./.claude/ (this project only)
npx slopbuster --dry-run   # Preview what would be installed
npx slopbuster --verbose   # Show each file as it installs
npx slopbuster --uninstall # Remove
```

No build step. No compilation. SlopBuster is markdown — it installs as slash command files that Claude Code reads directly.

Then open Claude Code and run:

```
/sb:help
```

---

## Quick Start

```
/sb:init        Initialize SlopBuster in your project
/sb:discuss     Surface assumptions before writing a plan (recommended)
/sb:plan        Write a constraint-first plan
/sb:gate        Run the circuit breaker
/sb:apply       Execute against your constraints
/sb:unify       Close the loop
```

---

## The Gate

The Gate fires when any of these are true:

| Trigger | Signal |
|---------|--------|
| Plan modifies > 5 files | `file-count` |
| New external dependencies | `new-dependencies` |
| Database schema changes | `database-schema` |
| API contract changes | `api-contract` |
| Auth or session changes | `auth-session` |

When it fires, you answer **5 questions**:

1. **Connectivity** — What systems does this plan touch? What's the blast radius?
2. **Performance** — Latency targets? DB indexes? Memory profile?
3. **Concurrency** — Write idempotency? Race conditions? Locking strategy?
4. **Security** — Protected vs. public? Input validation? Secrets management?
5. **Rollback** — If this fails mid-execution, what's the recovery path?

Your exact answers — not a summary, not Claude's interpretation — are injected into `<constraints>` at the top of the plan. Claude executes against your words.

Then an **8-point pitfall checklist** runs: Business context alignment, schema backward compatibility, idempotency, error handling, YAGNI, state encapsulation, testing strategy, alternatives considered.

---

## All 17 Commands

### Core Loop
| Command | Purpose |
|---------|---------|
| `/sb:init` | Initialize SlopBuster in a project |
| `/sb:plan [phase]` | Create a constraint-first plan |
| `/sb:gate [plan-path]` | Run the circuit breaker |
| `/sb:apply [plan-path]` | Execute a gate-cleared plan |
| `/sb:unify [plan-path]` | Reconcile and close the loop |

### Navigation
| Command | Purpose |
|---------|---------|
| `/sb:progress` | Loop position + one next action |
| `/sb:resume` | Restore context from STATE.md |
| `/sb:pause [reason]` | Create handoff, pause cleanly |
| `/sb:help` | Command reference |

### Pre-Planning
| Command | Purpose |
|---------|---------|
| `/sb:discuss [phase]` | Articulate vision, surface assumptions |
| `/sb:research [topic]` | Research agent for external information |

### Roadmap
| Command | Purpose |
|---------|---------|
| `/sb:milestone [name]` | Create or manage milestones |
| `/sb:roadmap` | View roadmap, add/remove phases |

### Quality
| Command | Purpose |
|---------|---------|
| `/sb:verify [scope]` | Guide manual acceptance testing |
| `/sb:fix [plan-number]` | Plan and execute fixes for UAT issues |
| `/sb:audit [plan-path]` | Enterprise architectural audit |

### Config
| Command | Purpose |
|---------|---------|
| `/sb:config` | View or modify SlopBuster settings |

---

## Project Structure

After `/sb:init`, your project gets:

```
.slopbuster/
├── PROJECT.md          # Project name, core value, constraints
├── ROADMAP.md          # Milestones and phases
├── STATE.md            # Current loop position, decisions, resume point
├── config.md           # Gate thresholds, enterprise settings
└── phases/
    └── 01-phase-name/
        ├── 01-01-PLAN.md     # Constraint-first plan
        ├── 01-01-GATE.md     # Circuit breaker clearance artifact
        ├── 01-01-SUMMARY.md  # UNIFY output
        └── 01-01-UAT-ISSUES.md  # Verify issues (if any)
```

---

## Why 17 Commands

PAUL has 27. GSD has 37. SlopBuster has 17.

Fewer commands means better discoverability, less documentation debt, and less room for Claude to guess which command to run. Every command does one thing clearly.

---

## How It Works

SlopBuster installs as Claude Code slash commands — markdown files in `~/.claude/commands/sb/`. There is no runtime, no service, no compilation. When you run `/sb:plan`, Claude Code loads `~/.claude/commands/sb/plan.md` and executes the instructions inside. The workflows in `~/.claude/slopbuster-framework/workflows/` contain the logic. The templates in `~/.claude/slopbuster-framework/templates/` are the file scaffolding.

`bin/install.js` copies `src/` to `~/.claude/` and rewrites `@src/` path references to their installed absolute paths so cross-references between command and workflow files resolve correctly.

That's the whole system.

---

## What Success Looks Like

```
/sb:init           → .slopbuster/ scaffolded in 2 minutes
/sb:plan           → PLAN.md created, <constraints> visibly empty
/sb:apply          → ⛔ blocked — Gate hasn't run
/sb:gate           → 5 questions asked, answers injected verbatim
/sb:apply          → executes against your constraints, not Claude's assumptions
/sb:unify          → loop closed, SUMMARY.md written
/sb:progress       → tells you exactly where you are and what to do next
```

At no point did Claude make an unconstrained architectural decision.
At no point did slop have room to enter.

---

## License

MIT
