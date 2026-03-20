---
mode: agent
description: Execute a gate-cleared plan
---

Execute a gate-cleared SlopBuster plan.

## Step 1 — Load the plan

Read the PLAN.md path from the user's message or from `.slopbuster/STATE.md` current context.

## Step 2 — Dependency check

Read `depends_on` from PLAN.md frontmatter. For each listed plan path, verify a SUMMARY.md exists in the same phase directory. If any dependency lacks a SUMMARY.md, stop:
```
⛔ Dependency not satisfied: [plan-path] has not been unified.
Complete that plan first: /sb-unify [plan-path]
```

## Step 3 — Gate clearance check

Read `gate_cleared` from PLAN.md frontmatter.

**If `gate_cleared: false`:**
Check if the user typed `override`. If yes: log to STATE.md Decisions table and proceed.
If no override:
```
⛔ Gate not cleared.

Run: /sb-gate [plan-path]
Or type 'override' to bypass (logged to STATE.md Decisions).
```
Stop.

## Step 4 — Read constraints first

Read `<constraints>` from PLAN.md before touching any code. These are the developer's Gate answers — the execution contract. All work must stay within these constraints.

If `<constraints>` is empty and gate was not overridden: warn and proceed with caution.

## Step 5 — Check for checkpoint resume

If STATE.md has `# checkpoint_at: [task-name]`: resume from that task. Skip completed tasks.

## Step 6 — Execute wave by wave

Read all `<tasks>` in PLAN.md. Group by wave number. Execute Wave 1 first (all independent tasks), then Wave 2, etc.

For each task:
1. Read `<steps>` and execute them
2. Stay within the `<files>` list — do not modify files not listed
3. Run the `<verify>` steps
4. If verify fails: stop and report — do not advance to the next task
5. Update `# checkpoint_at: [task-name]` in STATE.md after each completed task

## Step 7 — Final verification

Once all tasks complete: run the `<verification>` checklist in PLAN.md. All items must pass.

## Step 8 — Update STATE.md

Update loop position to `APPLY ✓`. Remove `# checkpoint_at:`. Set Next to `/sb-unify [plan-path]`.

```
[APPLY ✓] All tasks complete.

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ✓ ──▶ UNIFY ○

Next: /sb-unify [plan-path]
```
