# Milestone Workflow

Manage project milestones.

## Subcommand: view (no arguments)

Read `.slopbuster/ROADMAP.md` and display:

```
[Project name] — Milestones

Milestone 1: [name]  [status]
  Phase 01: [name]   [✓ Complete | ◉ In Progress | ○ Pending]
  Phase 02: [name]   [...]

Milestone 2: [name]  [status]
  Phase 03: [name]   [...]

Progress: [N] / [N] phases complete
```

## Subcommand: create [name]

1. Ask for milestone name (or use from $ARGUMENTS)
2. Ask which phases belong to this milestone
3. Ask how it relates to the existing sequence
4. Append to ROADMAP.md with status: Pending
5. Create phase directories for any new phases
6. Update STATE.md phase count

```
✓ Milestone created: [name]
  Phases: [list]
Next: /sb:discuss [first-phase] or /sb:plan [first-phase]
```

## Subcommand: complete [name]

1. Read ROADMAP.md to find the milestone's phases
2. For each phase: check whether all plans in `.slopbuster/phases/{NN}-{slug}/` have a SUMMARY.md
3. If any phase has plans without a SUMMARY.md (UNIFY not complete): list what's incomplete. Do not mark complete.
4. If all plans are unified: mark the milestone as Complete in ROADMAP.md
5. Update STATE.md

```
✓ Milestone complete: [name]
  [N] phases, [N] plans

Next: /sb:milestone create [next-milestone] or /sb:plan [next-phase]
```

## Subcommand: discuss [name]

Open a discussion about the milestone's scope and approach.
Delegates to discuss-phase workflow with the milestone as the topic context.
