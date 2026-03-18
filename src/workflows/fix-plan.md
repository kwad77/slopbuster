# Fix Plan Workflow

Create and execute a fix plan for UAT issues.

## Steps

### 1. Load issues

Read the UAT-ISSUES.md for the plan being fixed.

Reference: $ARGUMENTS (plan number or issue file path).

If not provided, look in the current phase directory for a UAT-ISSUES.md.

### 2. Triage

For each issue, assess:

| Issue | AC | Severity | Root cause hypothesis | Fix approach |
|-------|-----|----------|----------------------|--------------|
| [issue 1] | AC-N | Critical/High/Medium/Low | [what went wrong] | [what to change] |

Group related issues that can be fixed in the same task.

### 3. Create fix plan

Create a new PLAN.md in the same phase directory:
`.slopbuster/phases/{NN}-{slug}/{NN}-{PP+1}-PLAN.md` (next plan number in this phase)

The fix plan uses the same PLAN.md template. In `<context>`, reference the original plan and the UAT-ISSUES.md.

The fix plan's `<acceptance_criteria>` should directly mirror the failing ACs from the original plan.

Apply the same Gate threshold check as regular planning. Fixes that touch many files or introduce new dependencies still need a Gate run.

### 4. Execute

If Gate auto-clears: proceed directly to apply-phase workflow.
If Gate fires: run gate-workflow first, then apply-phase.

### 5. Re-verify

After fix execution, run verify-work workflow against the acceptance criteria that previously failed.

Use the same test cards as the original verify run.

### 6. Update STATE.md

Update:
- Last: timestamp + "Fix complete: [N] issues resolved / [N] still open"
- Next: `/sb:unify [original-plan-path]` if all resolved, or `/sb:fix [PP]` if issues remain

### 7. Close

If all previously-failing tests now pass:
```
✓ All issues resolved.

Next: /sb:unify .slopbuster/phases/{NN}-{slug}/{NN-original}-{PP}-PLAN.md
```

If issues remain:
```
⚠ [N] issue(s) still open — update UAT-ISSUES.md and run /sb:fix again
```
