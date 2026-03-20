---
mode: agent
description: Create a handoff and pause work cleanly
---

Create a session handoff document and pause work cleanly.

## Steps

### 1. Capture current state

Read `.slopbuster/STATE.md` for the current loop position and checkpoint.

Identify:
- What phase and plan is active
- What was completed this session (from checkpoint and loop position)
- What is in progress (current task if checkpoint_at is set)
- What is next

### 2. Ask the user (optional)

"Anything specific you want included in the handoff? Any decisions made, risks discovered, or context the next session needs?"

### 3. Write HANDOFF.md

Create or overwrite `.slopbuster/HANDOFF.md`:

```markdown
# SlopBuster — Session Handoff

**Date:** [ISO date]
**Loop position:** [PLAN/GATE/APPLY/UNIFY status]

## What Was Done This Session
[Summary of completed work]

## Current State
[Where in the loop — what file, what task, what checkpoint]

## Immediate Next Action
[Exact command to run to resume — e.g., /sb-apply .slopbuster/phases/01-auth/01-02-PLAN.md]

## Context for Next Session
[Any decisions made, risks discovered, open questions]

## Open Risks
[Anything that could affect the next session]
```

### 4. Confirm

```
[PAUSE ✓] Handoff written to .slopbuster/HANDOFF.md

To resume: /sb-resume
```
