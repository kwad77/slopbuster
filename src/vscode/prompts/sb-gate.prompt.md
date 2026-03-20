---
mode: agent
description: Run the Gate circuit breaker on a plan
---

Run the SlopBuster Gate circuit breaker.

## Step 1 — Use MCP tool if available

**If the `slopbuster_gate` MCP tool is connected:** call it with the plan path (or omit to auto-detect from STATE.md). The tool opens a native form dialog for the 5 questions, collects answers, and writes them verbatim to `<constraints>`. You are done when the tool returns.

**If MCP is not available:** continue with the manual flow below.

---

## Manual Gate flow

### 1. Load the plan

Read `.slopbuster/STATE.md` for `# gate_pending:` to find the plan, or use the user-supplied path.

Check `gate_cleared` in PLAN.md frontmatter. If `true`: report gate already cleared, show `Next: /sb-apply`, stop.

### 2. Check thresholds

| Threshold | Evidence |
|-----------|----------|
| `file-count` | > 5 distinct files in `<files>` tags |
| `new-dependencies` | npm/pip/cargo/go get, new external service |
| `database-schema` | migration, schema, ORM, table change |
| `api-contract` | endpoint change, API version, shared utility |
| `auth-session` | auth, login, JWT, session, permissions, roles |

If no thresholds fire: auto-clear and stop.

### 3. Ask the 5 questions (one at a time, wait for full answer)

**Q1 — Connectivity**
What systems does this plan connect to or affect? List all downstream dependencies, webhooks, and clients. What is the blast radius if this rolls back?

**Q2 — Performance**
What are the latency targets? Where are the DB queries and do they use indexes? What is the memory profile under load?

**Q3 — Concurrency**
Are write operations idempotent? What are the race conditions? What is the locking and tie-break strategy?

**Q4 — Security**
Which endpoints are protected vs. public? What inputs are validated? What must never be logged? How are secrets managed?

**Q5 — Rollback**
If this plan fails mid-execution, how do you recover? Is the migration reversible? Can services restart safely? What is the manual recovery path?

### 4. Inject verbatim

Write exact answers into `<constraints>` in PLAN.md — never summarize, never rephrase.

```xml
<constraints>
## Q1 — Connectivity
[developer's exact words]

## Q2 — Performance
[developer's exact words]

## Q3 — Concurrency
[developer's exact words]

## Q4 — Security
[developer's exact words]

## Q5 — Rollback
[developer's exact words]
</constraints>
```

### 5. Update PLAN.md and STATE.md

Set `gate_cleared: true`, `gate_date: [ISO timestamp]`, `gate_triggered_by: "[triggers]"` in PLAN.md frontmatter.
Remove `# gate_pending:` from STATE.md. Update loop to `GATE ✓`.

### 6. Confirm

```
[GATE ✓] Circuit breaker cleared.

Triggers:    [list]
Constraints: 5 answers injected verbatim

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ○ ──▶ UNIFY ○

Next: /sb-apply
```
