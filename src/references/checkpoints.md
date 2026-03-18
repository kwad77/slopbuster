# Checkpoints Reference

Checkpoints allow APPLY to be paused mid-execution and resumed without losing progress.

## How Checkpoints Work

During APPLY, a checkpoint is written to STATE.md **before starting** a task that meets any of:

- First task of wave 2 or higher (dependency boundary)
- Task with `checkpoint="true"` on the task element
- Task modifying a file in proximity to DO NOT CHANGE entries

When written: `# checkpoint_at: [next-task-name]` appears in STATE.md Session Continuity.

When the task completes and `<verify>` passes: the checkpoint is cleared from STATE.md automatically.

## What STATE.md Looks Like at a Checkpoint

```markdown
## Session Continuity

Stopped: Mid-APPLY — wave 1 complete, wave 2 task not started
Next: /sb:apply .slopbuster/phases/01-auth-api/01-01-PLAN.md
# checkpoint_at: Write session middleware
```

## Resuming from a Checkpoint

Run `/sb:apply [plan-path]` as normal.

The apply-phase workflow checks STATE.md for `# checkpoint_at:` and skips completed tasks. The checkpoint task is re-presented with its full `<action>` context before proceeding.

## Manual Checkpoints in PLAN.md

Add `checkpoint="true"` to any task to force a pause before it runs:

```xml
<task type="auto" wave="2" checkpoint="true">
  <name>Run database migration</name>
  ...
</task>
```

Use this for risky operations where you want a human confirmation point before proceeding.

## Checkpoint vs. Pause

| | Checkpoint | Pause |
|---|-----------|-------|
| When | At task boundaries (automatic) | User-initiated |
| Command | Automatic during APPLY | `/sb:pause` |
| Resume | `/sb:apply [same plan]` | `/sb:resume` |
| STATE.md signal | `# checkpoint_at: [task]` | `Status: Paused` |
| Scope | Current plan only | Any point in any workflow |
