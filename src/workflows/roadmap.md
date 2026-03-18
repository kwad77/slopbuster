# Roadmap Workflow

View and manage the project roadmap.

## Subcommand: view (no arguments or "view")

Read `.slopbuster/ROADMAP.md` and display a formatted view:

```
[Project name] — Roadmap
━━━━━━━━━━━━━━━━━━━━━━━━

Milestone 1: [name]  [Pending | In Progress | ✓ Complete]
  Phase 01: [name]   [○ | ◉ | ✓]
  Phase 02: [name]   [○ | ◉ | ✓]

Milestone 2: [name]  [Pending]
  Phase 03: [name]   [○]

━━━━━━━━━━━━━━━━━━━━━━━━
Overall: [N]/[N] phases complete
```

## Subcommand: add [phase-name]

1. Ask which milestone this phase belongs to
2. Assign the next available phase number (highest existing NN + 1)
3. Confirm the phase slug (kebab-case of the name)
4. Create `.slopbuster/phases/{NN}-{slug}/` directory
5. Append the phase to the correct milestone in ROADMAP.md
6. Update STATE.md phase count

```
✓ Phase added: {NN}-{slug}
  Directory: .slopbuster/phases/{NN}-{slug}/
Next: /sb:discuss {slug} or /sb:plan {slug}
```

## Subcommand: remove [phase-name]

1. Find the phase in ROADMAP.md
2. Check if the phase directory contains any PLAN.md files
3. If plans exist: show — "This phase has [N] plans. Removing from roadmap — files preserved."
4. Remove the phase entry from ROADMAP.md
5. Do NOT delete the phase directory or any plan files — they are historical record
6. Update STATE.md: Last = timestamp + "Phase removed from roadmap: {NN}-{slug}"

```
Phase removed from roadmap: {NN}-{slug}
Note: .slopbuster/phases/{NN}-{slug}/ was preserved.
```

## Subcommand: reorder

1. Read ROADMAP.md and display current phase sequence
2. User provides new ordering (e.g., "move phase 03 before 01")
3. Renumber phases in ROADMAP.md to reflect new order
4. Update STATE.md phase sequence if current phase number changes
5. Show updated roadmap view
