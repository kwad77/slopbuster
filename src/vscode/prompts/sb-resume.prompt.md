---
mode: agent
description: Restore context from STATE.md and resume work
---

Restore SlopBuster context and resume work from where it was paused.

## Steps

### 1. Read STATE.md

Read `.slopbuster/STATE.md`. If not found: tell the user to run `/sb-init`.

### 2. Read HANDOFF.md if present

Read `.slopbuster/HANDOFF.md` for session context from the previous pause.

### 3. Verify disk state

Check that what STATE.md describes matches what actually exists on disk:
- If `gate_pending` is set: verify the PLAN.md exists and `gate_cleared: false`
- If `checkpoint_at` is set: verify the plan exists and the task exists in it
- If loop shows APPLY ✓: verify no `checkpoint_at` is set

When STATE.md conflicts with disk state, trust the disk.

### 4. Show restoration summary

```
[RESUME] Context restored.

Phase:     [current phase]
Plan:      [plan path]
Loop:      PLAN ✓ ──▶ GATE [status] ──▶ APPLY [status] ──▶ UNIFY [status]
```

If `checkpoint_at` is set:
```
Checkpoint: [task-name] — resuming from this task
```

### 5. Auto-proceed if state is unambiguous

- If `gate_pending` is clearly set → run the Gate automatically
- If `checkpoint_at` is set → resume APPLY automatically
- If loop is complete → show summary and suggest next phase

Only ask "Ready to continue?" if the state is genuinely ambiguous (e.g., STATE.md and disk conflict, or no clear next action).

### 6. Proceed

Execute the next action based on the restored state.
