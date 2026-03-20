---
mode: ask
description: Guide manual user acceptance testing
---

Guide the user through manual acceptance testing for the current plan.

## Step 1 — Load acceptance criteria

Read the PLAN.md for the current phase (from STATE.md). Extract `<acceptance_criteria>` and `<verification>` sections.

## Step 2 — Present test cases

For each acceptance criterion, present it as a test case the user should manually verify:

```
Test [N]: [criterion summary]

Given: [precondition]
When:  [action to take]
Then:  [what to observe]

→ Did this pass? (yes / no / partial)
```

Wait for user response before moving to the next test case.

## Step 3 — Log results

Track pass/fail/partial for each criterion.

## Step 4 — Handle failures

For any failing criterion:
1. Describe what was expected vs. what happened
2. Ask: "Is this a bug to fix now, or a known limitation to carry forward?"
3. If fix now: create an entry for `/sb-fix`
4. If carry forward: note it as a carry-forward item

## Step 5 — Summary

```
UAT Results: [N]/[Total] passed

✓ [passing criteria]
✗ [failing criteria]

[If all pass]: Ready to unify — run /sb-unify
[If failures]: Fix issues with /sb-fix, then re-run /sb-verify
```
