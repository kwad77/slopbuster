---
allowed-tools: Read
description: Show loop position and one next action
---

Show the current loop position and exactly one next action.

Arguments: $ARGUMENTS

Read `.slopbuster/STATE.md` and report:

1. Current phase and plan number
2. Loop position (PLAN / GATE / APPLY / UNIFY status)
3. ONE specific next command to run — no options, no list

Do not summarize history. Do not list alternatives. One next action only.

If STATE.md does not exist, tell the user to run `/sb:init` first.

If `# gate_pending:` is set, next action is `/sb:gate [plan-path]`.
If `# checkpoint_at:` is set, next action is `/sb:apply [plan-path]`.
