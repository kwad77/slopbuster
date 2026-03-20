---
mode: ask
description: Show loop position and one next action
---

Show the current SlopBuster loop position and the single most important next action.

## Steps

1. Read `.slopbuster/STATE.md`.

2. If not found: tell the user SlopBuster is not initialized. Suggest `/sb-init`.

3. Show loop position:
   ```
   PLAN [status] ──▶ GATE [status] ──▶ APPLY [status] ──▶ UNIFY [status]
   ```

4. Show current context (phase, plan number if active).

5. Show **one** next action — not a list, just the single most important thing to do:
   - If no plan exists: `/sb-plan`
   - If gate_pending: `/sb-gate [plan-path]`
   - If gate cleared, apply not started: `/sb-apply [plan-path]`
   - If checkpoint_at set: `/sb-apply [plan-path]` (resume from checkpoint)
   - If apply complete, unify not done: `/sb-unify [plan-path]`
   - If loop complete: `/sb-plan` (next phase) or `/sb-roadmap`

Keep the output short — this is a quick status check, not a full report.
