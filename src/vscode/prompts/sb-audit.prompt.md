---
mode: agent
description: Enterprise architectural audit
---

Run an enterprise-grade architectural audit of this project's SlopBuster implementation.

## Step 1 — Check enterprise audit is enabled

Read `.slopbuster/config.md`. If `enterprise_audit.enabled: false`:
```
Enterprise audit is disabled.
Enable with: /sb-config enterprise_audit.enabled true
```
Stop.

## Step 2 — Collect audit evidence

Read all of the following:
- `.slopbuster/STATE.md`
- `.slopbuster/PROJECT.md`
- `.slopbuster/config.md`
- All PLAN.md files in `.slopbuster/phases/`
- All GATE.md files
- All SUMMARY.md files

## Step 3 — Audit dimensions

### Constraint Integrity (30 pts)
- All complex plans have non-empty `<constraints>` (Gate ran, answers present)
- No `<constraints>` contains only auto-clear boilerplate without answers
- `gate_triggered_by` frontmatter matches actual plan content
- Gate questions answered substantively (not one-word answers)

### Loop Compliance (25 pts)
- Every PLAN.md with `gate_cleared: true` has a corresponding GATE.md
- Every completed APPLY has a SUMMARY.md
- STATE.md loop positions match actual file state on disk
- No plans in APPLY state without gate clearance (unless override logged)

### Plan Quality (25 pts)
- All tasks have `<verify>` steps
- `<boundaries>` section is present and non-empty
- `<acceptance_criteria>` is in Given/When/Then format
- Wave numbering is consistent (Wave 1 tasks have no `depends_on`)

### Override Accountability (20 pts)
- All overrides are logged to STATE.md Decisions table
- No unlogged gate bypasses (gate_cleared: true but no GATE.md and no auto-clear marker)

## Step 4 — Score and report

```
## Audit Report — [project name]
**Date:** [ISO date]

| Dimension | Score | Max |
|-----------|------:|----:|
| Constraint Integrity | [N] | 30 |
| Loop Compliance | [N] | 25 |
| Plan Quality | [N] | 25 |
| Override Accountability | [N] | 20 |
| **Total** | **[N]** | **100** |

## Issues Found
[List any findings with file references]

## Recommendations
[Top 3 improvements]
```
