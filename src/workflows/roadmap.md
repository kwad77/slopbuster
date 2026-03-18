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

```
Phase removed from roadmap: {NN}-{slug}
Note: .slopbuster/phases/{NN}-{slug}/ was preserved.
```
