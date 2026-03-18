---
allowed-tools: Read
description: SlopBuster command reference
---

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ███████╗██╗      ██████╗ ██████╗                          ║
║   ██╔════╝██║     ██╔═══██╗██╔══██╗                         ║
║   ███████╗██║     ██║   ██║██████╔╝  Stop shipping slop.    ║
║   ╚════██║██║     ██║   ██║██╔═══╝                          ║
║   ███████║███████╗╚██████╔╝██║       v0.1.0                 ║
║   ╚══════╝╚══════╝ ╚═════╝ ╚═╝                              ║
║                                                              ║
║   ██████╗ ██╗   ██╗███████╗████████╗███████╗██████╗         ║
║   ██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗        ║
║   ██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝        ║
║   ██╔══██╗██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗        ║
║   ██████╔╝╚██████╔╝███████║   ██║   ███████╗██║  ██║        ║
║   ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝        ║
║                                                              ║
║   Constraint-first development for Claude Code              ║
╚══════════════════════════════════════════════════════════════╝
```

```
PLAN ──▶ GATE ──▶ APPLY ──▶ UNIFY
```

**The Gate is not optional.** Simple plans auto-clear it in seconds. Complex plans block until you answer 5 architectural questions. Your answers become the execution contract — verbatim, never summarized, never interpreted.

---

## Core Loop

| Command | Purpose |
|---------|---------|
| `/sb:init` | Initialize SlopBuster in a project |
| `/sb:plan [phase]` | Create a constraint-first plan |
| `/sb:gate [plan-path]` | Run the circuit breaker |
| `/sb:apply [plan-path]` | Execute a gate-cleared plan |
| `/sb:unify [plan-path]` | Reconcile plan vs actual, close the loop |

## Navigation

| Command | Purpose |
|---------|---------|
| `/sb:progress` | Loop position + one next action |
| `/sb:resume` | Restore context from STATE.md |
| `/sb:pause [reason]` | Create handoff, prepare for break |
| `/sb:help` | This reference |

## Pre-Planning

| Command | Purpose |
|---------|---------|
| `/sb:discuss [phase]` | Articulate vision, surface assumptions before planning |
| `/sb:research [topic]` | Deploy research agent for external information |

## Roadmap

| Command | Purpose |
|---------|---------|
| `/sb:milestone [name]` | Create or manage milestones |
| `/sb:roadmap` | View roadmap, add/remove phases |

## Quality

| Command | Purpose |
|---------|---------|
| `/sb:verify [scope]` | Guide manual user acceptance testing |
| `/sb:fix [plan-number]` | Plan fixes for UAT issues |
| `/sb:audit [plan-path]` | Enterprise architectural audit (requires config: enabled) |

## Config

| Command | Purpose |
|---------|---------|
| `/sb:config` | View or modify SlopBuster settings |

---

## The Gate

Fires when any threshold is met:

| Trigger | Signal |
|---------|--------|
| Plan modifies > 5 files | `file-count` |
| New external dependencies | `new-dependencies` |
| Database schema changes | `database-schema` |
| API contract changes | `api-contract` |
| Auth/session changes | `auth-session` |

When fired: 5 questions asked, 8-point pitfall checklist run. Your answers are injected verbatim into `<constraints>` — the first section Claude reads before executing any task.

Type `override` when APPLY is blocked to bypass (logged to STATE.md Decisions).

---

## Loop States

```
PLAN ◉ ──▶ GATE ── ──▶ APPLY ○ ──▶ UNIFY ○    [Planning]
PLAN ✓ ──▶ GATE ⚠  ──▶ APPLY ○ ──▶ UNIFY ○    [Gate pending]
PLAN ✓ ──▶ GATE ✓  ──▶ APPLY ◉ ──▶ UNIFY ○    [Applying]
PLAN ✓ ──▶ GATE ✓  ──▶ APPLY ✓ ──▶ UNIFY ◉    [Unifying]
PLAN ✓ ──▶ GATE ✓  ──▶ APPLY ✓ ──▶ UNIFY ✓    [Complete]
```
