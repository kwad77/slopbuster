---
mode: agent
description: View roadmap and manage phases
---

View and manage the SlopBuster project roadmap.

## Step 1 — Read current state

Read `.slopbuster/STATE.md` and `.slopbuster/ROADMAP.md` (if it exists).

If ROADMAP.md does not exist, offer to create it.

## Step 2 — Show roadmap status

List all phases with status:

```
Phase 01 — [name]    ✓ Complete     ([N] plans unified)
Phase 02 — [name]    ◉ In progress  (Plan 02 applying)
Phase 03 — [name]    ○ Planned
Phase 04 — [name]    ○ Planned
```

Show overall progress as a fraction (e.g., "1/4 phases complete").

## Step 3 — Handle arguments

**No argument:** Display the roadmap as above.

**`add [phase-name]`:** Add a new phase to ROADMAP.md. Ask for:
- Phase name/slug
- Phase goal (one sentence)
- Dependencies on other phases

**`complete [phase-number]`:** Mark a phase as complete. Verify all plans in that phase have SUMMARY.md files.

**`next`:** Show the next recommended action based on current loop position.

## Step 4 — Update ROADMAP.md if changed

Write changes back to `.slopbuster/ROADMAP.md`.

## ROADMAP.md format

```markdown
# Roadmap — [Project Name]

## Phase 01 — [slug]
**Goal:** [one sentence]
**Status:** ✓ Complete / ◉ In progress / ○ Planned
**Plans:** [N] completed

## Phase 02 — [slug]
...
```
