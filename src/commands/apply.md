---
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
description: Execute a gate-cleared plan
---

Execute a gate-cleared plan.

Arguments: $ARGUMENTS

If no plan path is provided, check `.slopbuster/STATE.md` for current plan context or `# checkpoint_at:` for a paused plan.

If the user types `override`, log the bypass to STATE.md Decisions and proceed without Gate clearance.

Follow the workflow at @src/workflows/apply-phase.md
