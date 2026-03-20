---
mode: agent
description: Create or manage project milestones
---

Create or manage SlopBuster milestones.

A milestone groups multiple phases into a meaningful deliverable (e.g., "v1.0 launch", "beta ready", "auth complete").

## With no argument — list milestones

Read `.slopbuster/ROADMAP.md` and show all milestones with completion status.

## With `create` — create a new milestone

Ask:
1. **Milestone name** — what is this milestone called? (e.g., "v1.0 launch")
2. **Description** — what is complete when this milestone is reached?
3. **Phases included** — which phases must be complete for this milestone?
4. **Target date** — optional, for tracking purposes

Write to `.slopbuster/ROADMAP.md` under a `## Milestones` section:

```markdown
## Milestones

### [Milestone name]
**Description:** [what done looks like]
**Phases:** [list of phase numbers]
**Status:** ○ Pending / ◉ In progress / ✓ Complete
**Target:** [date if provided]
```

## With `complete [milestone-name]` — mark a milestone complete

Verify all included phases have complete SUMMARY.md files. If any are incomplete, show what's missing.

If all complete: update status to `✓ Complete` with completion date.

## Confirm output

```
[MILESTONE ✓] [name] — [status]
Phases: [N]/[total] complete
```
