# Apply Phase Workflow

Execute a gate-cleared plan.

## Steps

### 1. Load the plan

Read PLAN.md at the path from $ARGUMENTS or STATE.md current plan context.

### 2. Gate clearance check

Read `gate_cleared` from PLAN.md frontmatter.

**If `gate_cleared: false`:**

Check whether $ARGUMENTS or the invoking message contains the word `override`.

If override:
- Append to STATE.md Decisions table:
  ```
  | [ISO date] | Gate bypass (override) | [phase]-[PP] | Skipped Gate interrogation — no constraints injected |
  ```
- Show: "⚠ Gate bypassed by override. No constraints injected. Proceeding."
- Continue.

If no override:
- Show:
  ```
  ⛔ Gate not cleared.

  This plan has not been through the circuit breaker.
  Run: /sb:gate .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md

  Or type 'override' to bypass (logged to STATE.md Decisions).
  ```
- Stop.

**If `gate_cleared: true`:**
Verify GATE.md exists at the expected path. If missing, warn but continue.

### 3. Load constraints

Read the `<constraints>` section of PLAN.md.

If `<constraints>` is empty (no Gate ran, no override):
- Show a warning: "⚠ No constraints were injected into this plan. Proceeding without constraint contract."
- Continue. Do not block — the user already chose to proceed by running APPLY.

**Internalize the constraints before executing any task.**
The `<constraints>` section contains the developer's exact words. Execute against them — not your own interpretation of the plan.

### 4. Check for checkpoint resume

Read STATE.md for `# checkpoint_at: [task-name]`.

If found:
- Show: "Resuming from checkpoint: [task-name]"
- During task execution, skip tasks prior to the checkpointed task
- Start execution from the checkpointed task

### 5. Read and display the execution plan

Parse all `<task>` elements from `<tasks>`. Group by wave attribute.

Read `.slopbuster/config.md`. If `preferences.wave_execution: true` (default), display the wave breakdown:

```
Executing: [plan objective, one line]

Wave 1 — independent:
  ○ [task 1 name]    [files]
  ○ [task 2 name]    [files]

Wave 2 — depends on wave 1:
  ○ [task 3 name]    [files]
```

If `preferences.wave_execution: false`, show a flat task list without wave grouping.

### 6. Execute tasks by wave

For each wave, execute tasks in the listed order. Within a wave, tasks are logically independent.

**For each task:**

1. Show: `▶ [task name]`
2. Read `<files>` — these are the only files this task should touch
3. Read `<action>` carefully — pay attention to "what NOT to do" clauses
4. Check `<boundaries>` — never touch DO NOT CHANGE files, stay within SCOPE LIMITS
5. Execute the action
6. Run the `<verify>` check exactly as written
7. If verify passes: show `✓ [task name]` — note which AC this satisfies per `<done>`
8. If verify fails: stop immediately, show the failure output and the exact verify command that failed. Write `# checkpoint_at: [this-task-name]` to STATE.md so APPLY can be re-run after the fix.

**Respect `<boundaries>` at all times.** If a task would require touching a file in DO NOT CHANGE, stop and report it rather than proceeding.

### 7. Checkpoints

Write `# checkpoint_at: [next-task-name]` to STATE.md before starting:
- The first task of wave 2 or higher
- Any task where `checkpoint="true"` is set on the task element
- Any task that modifies a file adjacent to a DO NOT CHANGE entry

After the task completes and verify passes: remove the `# checkpoint_at:` line from STATE.md.

### 8. Completion check

After all tasks complete, run every item in `<verification>`:

```
Final verification:
  ✓ [check 1]
  ✓ [check 2]
  ✗ [check 3] — [failure detail]
```

If any verification item fails: do not declare complete. Report the failure with the exact output. Do not update STATE.md to APPLY ✓ — leave the loop position as APPLY ◉ so the issue is visible on next `/sb:progress`.

### 9. Update STATE.md

- Clear any remaining `# checkpoint_at:` line
- Update Loop Position to APPLY ✓
- Update Last: timestamp + "Apply complete: [NN]-[PP]-PLAN.md"
- Update Next: `/sb:unify .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`

### 10. Confirm

```
[APPLY ✓] Plan executed.

Tasks:        [N]/[N] complete
Verification: [N]/[N] passed

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ✓ ──▶ UNIFY ○

Next: /sb:unify .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```
