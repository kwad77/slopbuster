# Pause Work Workflow

Pause work cleanly and create a session handoff.

## Steps

### 1. Load current state

Read `.slopbuster/STATE.md`.
If a plan is active, read the current PLAN.md.

### 2. Capture reason

Reason for pausing: $ARGUMENTS

If no reason provided, use "User paused session" as default.

### 3. Record checkpoint (if mid-APPLY)

If the loop position shows APPLY ◉ (currently executing):
- Identify the last completed task
- The next task to run is the checkpoint target
- Write `# checkpoint_at: [next-task-name]` to STATE.md
- This is where `/sb:apply` will resume

If not mid-APPLY, no checkpoint is needed.

### 4. Update STATE.md

Update:
- Status: Paused
- Stopped: [brief description of where work stopped]
- Next: [exact command to resume, e.g. `/sb:apply [plan-path]` or `/sb:gate [plan-path]`]
- Last: [current ISO timestamp] — "Paused: [reason]"

### 5. Confirm

```
Work paused.

Stopped:  [what was in progress]
Reason:   [reason]
Checkpoint: [task-name, if set]

To resume: /sb:resume
```
