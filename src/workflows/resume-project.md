# Resume Project Workflow

Restore context and resume work from a previous session.

## Steps

### 1. Load STATE.md

Read `.slopbuster/STATE.md`.

If STATE.md does not exist: "SlopBuster is not initialized here. Run `/sb:init` to start."

### 2. Load PROJECT.md

Read `.slopbuster/PROJECT.md` for project name and core value.

### 3. Check for active signals

Look for in STATE.md:
- `# gate_pending: [plan-path]` — Gate waiting for interrogation
- `# checkpoint_at: [task-name]` — APPLY paused at a checkpoint

### 4. Load current plan

If a plan path is referenced in STATE.md's Current Position or in active signals, read that PLAN.md.

If gate_pending: read PLAN.md to show what needs gating.
If checkpoint_at: read PLAN.md to show the task being resumed.

### 5. Cross-check disk state

Trust the disk over STATE.md. Verify:
- Does the current PLAN.md file actually exist?
- Does GATE.md exist if `gate_cleared: true` in the plan?
- Do phase directories exist for phases listed in ROADMAP.md?

If STATE.md and disk disagree, note the discrepancy and trust the disk.

### 6. Report context

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Project name]
[Core value]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase:  [N] of [N] — [phase name]
Plan:   [NN-PP]
Status: [status]
Last:   [timestamp] — [what happened]

[LOOP POSITION]
PLAN [symbol] ──▶ GATE [symbol] ──▶ APPLY [symbol] ──▶ UNIFY [symbol]

[If gate_pending:]
⚠ Gate pending — run: /sb:gate [plan-path]

[If checkpoint_at:]
⚠ Checkpoint active — resuming at: [task-name]
   Run: /sb:apply [plan-path]

Next: [exact command]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Ask to proceed

"Ready to continue with [next command]?"

If yes: load the appropriate workflow and proceed.
If no: wait for user direction.
