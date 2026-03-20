---
mode: agent
description: Reconcile plan vs actual and close the loop
---

Reconcile what was planned against what was actually built, then close the loop.

## Step 1 — Load the plan

Read the PLAN.md path from the user or STATE.md. Verify APPLY is complete (`APPLY ✓` in STATE.md loop position).

## Step 2 — Compare plan vs actual

For each task in `<tasks>`:
- Were all listed files modified as planned?
- Were any files modified that were NOT in the plan?
- Did any verify steps fail or get skipped?
- Were any `<boundaries>` violated (files that must not change)?

## Step 3 — Run acceptance criteria

Check each item in `<acceptance_criteria>`. For each:
- ✓ Passes — criterion is met
- ⚠ Partial — partially met, describe gap
- ✗ Fails — criterion not met, describe what's missing

## Step 4 — Run success criteria

Check each item in `<success_criteria>`. Mark pass/fail.

## Step 5 — Assess drift

Classify any drift from the plan:
- **Acceptable drift** — minor, does not affect constraints or scope
- **Constraint violation** — something contradicts the `<constraints>` answers
- **Scope creep** — work done outside `<boundaries>`
- **Missing work** — planned tasks not completed

Constraint violations and unresolved scope creep block UNIFY. Show what must be fixed.

## Step 6 — Write SUMMARY.md

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-SUMMARY.md`:

```markdown
# Summary — [Phase] Plan [PP]

**Completed:** [ISO date]
**Plan:** [plan path]

## Acceptance Criteria
| Criterion | Status | Notes |
|-----------|--------|-------|
| [criterion] | ✓/⚠/✗ | [notes] |

## Drift
[None / describe any drift from plan]

## Decisions Made During Execution
[Any decisions made mid-execution that weren't in the plan]

## Carry-forward
[Anything discovered that should go into the next plan]
```

## Step 7 — Update STATE.md

Update loop position to `UNIFY ✓`. Update Last and Next.

```
[UNIFY ✓] Loop closed.

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ✓ ──▶ UNIFY ✓

[If more phases remain]: Next: /sb-plan [next phase]
[If project complete]:   Next: /sb-roadmap to review overall progress
```
