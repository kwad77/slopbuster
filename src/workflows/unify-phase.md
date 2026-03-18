# Unify Phase Workflow

Reconcile plan vs actual, write summary, close the loop.

## Steps

### 1. Load artifacts

Read:
- PLAN.md at the path from $ARGUMENTS or STATE.md current plan
- GATE.md if it exists (for constraint reference)
- Any UAT-ISSUES.md in the same phase directory

### 2. Reconcile acceptance criteria

For each AC in `<acceptance_criteria>`, assess whether it was met:

```
AC-1: [Name]
  Given [precondition]
  When  [action]
  Then  [expected outcome]
  → Status: MET / PARTIAL / NOT MET
  → Notes: [what was observed]
```

If any AC is NOT MET: note it clearly. UNIFY does not block — it documents.

### 3. Assess scope drift

Compare `files_modified` in PLAN.md frontmatter against what was actually changed.

Note:
- Files changed that were not in the plan (expansion)
- Files listed in the plan that were not changed (reduction)
- Constraints from `<constraints>` that could not be honored (with reason)

### 4. Write SUMMARY.md

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-SUMMARY.md`

Use the template at @src/templates/SUMMARY.md

Fill in:
- Plan reference and completion timestamp
- Acceptance criteria table (MET / PARTIAL / NOT MET)
- Scope drift analysis
- Constraints honored or not (per each Q in `<constraints>`)
- Decisions made during execution
- Deferred items (anything that came up during apply that was out of scope)

### 5. Update PLAN.md

If all ACs are MET: no frontmatter change needed — APPLY ✓ already set.
If any ACs are NOT MET: add a note in the SUMMARY, defer the failing criteria to a fix plan.

### 6. Update ROADMAP.md

Check if this was the last plan in the phase. If so, mark the phase as complete in ROADMAP.md.
Check if this completes a milestone. If so, note it but do not auto-mark — let the user run `/sb:milestone complete`.

### 7. Auto-commit (if configured)

Read `.slopbuster/config.md`. If `preferences.auto_commit: true`:
- Run `git add -A && git commit -m "UNIFY: [NN]-[PP]-PLAN.md — [plan objective one line]"`
- Show: `✓ Auto-committed (preferences.auto_commit: true)`

If `preferences.auto_commit: false` (default): skip this step silently.

### 8. Update STATE.md

- Update Loop Position: UNIFY ✓
- Add any deferred items to the Deferred table
- Add key decisions to the Decisions table
- Update Last: timestamp + "Unify complete: [NN]-[PP]-PLAN.md"

If there is a next plan queued in this phase:
  Next = `/sb:plan [phase-name]`
If the phase is done:
  Next = `/sb:milestone complete [milestone-name]` or `/sb:plan [next-phase-name]`

### 9. Confirm

```
[UNIFY ✓] Loop closed.

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ✓ ──▶ UNIFY ✓    [Complete]

Acceptance criteria: [N]/[N] met
Scope drift:         [none | N files outside plan scope]
Summary:             .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-SUMMARY.md
```

If deferred items exist:
```
⚠ [N] items deferred — added to STATE.md Deferred table
```

```
Next: [exact next command]
```
