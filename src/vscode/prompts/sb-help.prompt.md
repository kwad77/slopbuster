---
mode: ask
description: SlopBuster command reference
---

Show the SlopBuster command reference for this editor.

## SlopBuster — Command Reference

The loop: **PLAN → GATE → APPLY → UNIFY**

### Core Loop

| Command | Purpose |
|---------|---------|
| `/sb-init` | Initialize SlopBuster in this project |
| `/sb-plan` | Create a constraint-first plan |
| `/sb-gate` | Run the Gate circuit breaker |
| `/sb-apply` | Execute a gate-cleared plan |
| `/sb-unify` | Reconcile plan vs actual, close the loop |

### Planning

| Command | Purpose |
|---------|---------|
| `/sb-discuss` | Articulate vision before planning |
| `/sb-roadmap` | View and manage phases |
| `/sb-milestone` | Create and track milestones |

### Execution Support

| Command | Purpose |
|---------|---------|
| `/sb-verify` | Guide manual UAT |
| `/sb-fix` | Plan and execute UAT fixes |
| `/sb-research` | External information gathering |

### Session Management

| Command | Purpose |
|---------|---------|
| `/sb-progress` | Show loop position and next action |
| `/sb-pause` | Create handoff, pause cleanly |
| `/sb-resume` | Restore context and resume |

### Configuration

| Command | Purpose |
|---------|---------|
| `/sb-config` | View or modify settings |
| `/sb-audit` | Enterprise architectural audit |

---

### The Gate

The Gate fires when a plan touches > 5 files, adds dependencies, changes the DB schema, modifies API contracts, or touches auth/session logic.

When fired, it asks 5 questions. Your answers are injected **verbatim** into `<constraints>` — Claude executes against your words, not its interpretation of them.

**MCP enforcement:** If the SlopBuster MCP server is connected (`slopbuster_gate` tool), the Gate opens a native form dialog in your editor. No chat required.

---

### Key Design Rules

- `<constraints>` is the **first thing Claude reads** before executing any task
- Developer answers are never summarized or rephrased
- APPLY is **blocked** until gate_cleared: true (or `override` is typed)
- STATE.md is ground truth; disk wins on conflict
