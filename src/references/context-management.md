# Context Management Reference

How SlopBuster manages context across sessions and within long APPLY runs.

## The Context Problem

Claude Code sessions have a context window. Long APPLY runs on large plans can approach this limit. STATE.md and the checkpoint system exist to ensure no work is lost when context fills or a session ends.

## Context Hierarchy

When any SlopBuster command runs, the minimum context loaded is:

1. The command file itself
2. The referenced workflow
3. `.slopbuster/STATE.md` — current position and signals
4. `.slopbuster/PROJECT.md` — project identity and core value
5. The current PLAN.md (if one is active)

Reference files and templates are loaded only when the workflow explicitly calls for them.

## STATE.md is the Session Bridge

STATE.md is written after every significant action. It must be:

- **Under 80 lines** — keep it scannable. Prune completed phases.
- **Updated before any interruption** — checkpoint, pause, or session end
- **Specific about Next** — the exact command with path, not "continue work"

STATE.md captures what the model cannot reconstruct from disk alone:
- Current loop position
- Decisions made during execution
- Deferred items
- Active signals (`# gate_pending:`, `# checkpoint_at:`)

## Disk is Ground Truth

STATE.md can get stale. When STATE.md says APPLY ✓ but no SUMMARY.md exists, the plan is not complete — trust the disk.

The resume workflow always cross-checks STATE.md against disk and surfaces discrepancies before asking the developer to continue.

## Staying Under Context Limits During Long APPLY Runs

For plans with many tasks across many files:

1. Execute wave 1 tasks → checkpoint written → confirm with user
2. Execute wave 2 tasks → checkpoint written → confirm with user
3. If context grows large: use `/sb:pause`, resume in a new session via `/sb:resume`

The checkpoint system makes this lossless.

## Keeping PLAN.md Lean

Reference files rather than inlining content:

```
<context>
@.slopbuster/PROJECT.md
@src/relevant/source.ext
</context>
```

Heavy context (long source files, schema dumps, full API specs) belongs as `@` references in `<context>`, not copy-pasted into the plan body. The model loads referenced files when needed rather than holding them in context throughout.

## Reference Files Are Loaded on Demand

`@src/workflows/`, `@src/templates/`, and `@src/references/` are rewritten to absolute paths at install time by `bin/install.js`. They are included in context only when the command or workflow references them — they do not all load on every command invocation.
