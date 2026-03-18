# Verify Work Workflow

Guide manual user acceptance testing for a completed plan.

## Steps

### 1. Load context

Read the PLAN.md for the scope being verified ($ARGUMENTS or STATE.md current plan).
Read SUMMARY.md if it exists (for prior UNIFY context).

### 2. Present ACs as a test script

For each `<acceptance_criteria>` block in PLAN.md, produce a structured test card:

```
──────────────────────────────────────────
Test [N]: [AC name]
──────────────────────────────────────────
Setup:   [What needs to be true before testing]
         → [Specific setup instructions]

Action:  [What to do]
         → [Exact steps to perform]

Expect:  [What should happen]
         → [What to look for / how to verify]

Result:  [ ] Pass   [ ] Fail   [ ] Blocked
──────────────────────────────────────────
```

Present tests one at a time if there are more than 3. Let the user complete each test before showing the next.

### 3. Record results

After all tests:

| Test | AC | Result | Notes |
|------|----|:------:|-------|
| 1 | [AC name] | ✓ Pass | |
| 2 | [AC name] | ✗ Fail | [what happened] |

For each Fail or Blocked: capture:
- What actually happened
- What was expected
- Any error messages or observable symptoms

### 4. Write UAT-ISSUES.md (if any failures)

If any tests failed or were blocked:

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-UAT-ISSUES.md`
Use the template at @src/templates/UAT-ISSUES.md

### 5. Update STATE.md

Update:
- Last: timestamp + "Verify complete: [NN]-[PP]-PLAN.md — [N] pass, [N] fail"
- Next: `/sb:unify [plan-path]` if all pass, or `/sb:fix [PP]` if failures exist

### 6. Report

```
UAT Complete
  Pass:    [N]
  Fail:    [N]
  Blocked: [N]
```

If all pass:
```
✓ All acceptance criteria met.
Next: /sb:unify .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```

If failures:
```
⚠ [N] issue(s) found — see UAT-ISSUES.md
Next: /sb:fix [PP] — create a fix plan for the failures
```
