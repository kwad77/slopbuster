---
mode: agent
description: Plan and execute fixes for UAT issues
---

Plan and execute targeted fixes for issues found during UAT or verification.

## Step 1 — Identify the issues

Read `.slopbuster/phases/{NN}-{slug}/UAT-ISSUES.md` if it exists, or ask the user to describe what failed.

For each issue:
- What is the failure? (expected vs. actual)
- Which acceptance criterion does it violate?
- Which files are likely responsible?

## Step 2 — Assess fix scope

For each fix:
- How many files does it touch?
- Does it require any new dependencies?
- Does it change any API contracts or auth logic?

If the combined fix scope would trigger Gate thresholds: recommend creating a new plan instead of patching.

## Step 3 — Plan the fixes

Create a fix list:

```
Fix 1: [description]
  Files: [list]
  Root cause: [diagnosis]
  Approach: [what to change]

Fix 2: [description]
  ...
```

Ask the user to confirm the fix approach before executing.

## Step 4 — Execute fixes

For each fix:
1. Make the change
2. Verify the specific criterion that was failing now passes
3. Verify no regressions in other passing criteria

## Step 5 — Update UAT-ISSUES.md

Mark fixed issues as resolved. Note any issues deferred to a future plan.

## Step 6 — Confirm

```
[FIX ✓] [N] issues resolved.

Fixed:    [list]
Deferred: [list, if any]

Next: /sb-verify — re-run UAT to confirm all criteria pass
```
