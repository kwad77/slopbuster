# Apply Phase Workflow

Execute a gate-cleared plan.

## Steps

### 1. Load the plan

Read PLAN.md at the path from $ARGUMENTS or STATE.md current plan context.

### 2. Dependency check

Read `depends_on` from PLAN.md frontmatter.

If `depends_on` is non-empty:
- For each plan path listed: check whether a corresponding SUMMARY.md exists in the same phase directory
- If any dependency lacks a SUMMARY.md (UNIFY not complete):
  ```
  ⛔ Dependency not satisfied: [plan-path] has not been unified.
  Complete that plan first: /sb:unify [plan-path]
  ```
  Stop.
- If all dependencies satisfied: continue.

### 3. Gate clearance check

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

### 4. Load constraints

Read the `<constraints>` section of PLAN.md.

If `<constraints>` is empty (no Gate ran, no override):
- Show a warning: "⚠ No constraints were injected into this plan. Proceeding without constraint contract."
- Continue. Do not block — the user already chose to proceed by running APPLY.

**Internalize the constraints before executing any task.**
The `<constraints>` section contains the developer's exact words. Execute against them — not your own interpretation of the plan.

### 5. Check for checkpoint resume

Read STATE.md for `# checkpoint_at: [task-name]`.

If found:
- Show: "Resuming from checkpoint: [task-name]"
- During task execution, skip tasks prior to the checkpointed task
- Start execution from the checkpointed task

### 6. Read and display the execution plan

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

### 7. Execute tasks by wave

Read `autonomous` from PLAN.md frontmatter (default: `true`).

**If `autonomous: false`:** Before executing each wave (except wave 1), pause and show:
```
⏸ Wave [N] ready — [N] tasks
  [task name]  [files]
  ...
Run /sb:apply [plan-path] to execute this wave.
```
Write `# checkpoint_at: [first-task-of-wave]` to STATE.md and stop.
Re-running APPLY will resume from that wave. Set `autonomous: true` in PLAN.md to disable this behavior.

**If `autonomous: true` (default):** Execute all waves without pausing.

For each wave, execute tasks in the listed order. Within a wave, tasks are logically independent.

**For each task:**

1. Show: `▶ [task name]`
2. Read `type` attribute — `auto` (Claude executes) or `manual` (user executes)
3. **If `type="manual"`:**
   - Show the `<action>` content as instructions for the user
   - Show: `⏸ Manual task — complete the steps above, then run /sb:apply [plan-path] to continue`
   - Write `# checkpoint_at: [this-task-name]` to STATE.md
   - Stop execution here. APPLY resumes from this task when re-run.
4. **If `type="auto"`:**
   - Read `<files>` — these are the only files this task should touch
   - Read `<action>` carefully — pay attention to "what NOT to do" clauses
   - Check `<boundaries>` — never touch DO NOT CHANGE files, stay within SCOPE LIMITS
   - Execute the action
   - Run the `<verify>` check exactly as written
   - If verify passes: show `✓ [task name]` — note which AC this satisfies per `<done>`
   - If verify fails: stop immediately, show the failure output and the exact verify command that failed. Write `# checkpoint_at: [this-task-name]` to STATE.md so APPLY can be re-run after the fix.

**Respect `<boundaries>` at all times.** If a task would require touching a file in DO NOT CHANGE, stop immediately and show:
```
⛔ Boundary violation: [task name] requires touching [file], which is in DO NOT CHANGE.

The plan must be updated before proceeding.
Options:
  1. Remove the file from <boundaries> DO NOT CHANGE if the restriction is no longer valid
  2. Rewrite the task to avoid touching the protected file
  3. Run /sb:plan to create a separate plan for changes to that file

Write # checkpoint_at: [this-task-name] to STATE.md.
```

### 8. Checkpoints

Write `# checkpoint_at: [next-task-name]` to STATE.md before starting:
- The first task of wave 2 or higher
- Any task where `checkpoint="true"` is set on the task element
- Any task that modifies a file adjacent to a DO NOT CHANGE entry

After the task completes and verify passes: remove the `# checkpoint_at:` line from STATE.md.

### 9. Completion check

After all tasks complete, run every item in `<verification>`:

```
Final verification:
  ✓ [check 1]
  ✓ [check 2]
  ✗ [check 3] — [failure detail]
```

If any verification item fails: do not declare complete. Report the failure with the exact output. Do not update STATE.md to APPLY ✓ — leave the loop position as APPLY ◉ so the issue is visible on next `/sb:progress`.

### 10. Update STATE.md

- Clear any remaining `# checkpoint_at:` line
- Update Loop Position to APPLY ✓
- Update Last: timestamp + "Apply complete: [NN]-[PP]-PLAN.md"
- Update Next: `/sb:unify .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`

### 11. Confirm

```
[APPLY ✓] Plan executed.

Tasks:        [N]/[N] complete
Verification: [N]/[N] passed

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ✓ ──▶ UNIFY ○

Next: /sb:unify .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```
