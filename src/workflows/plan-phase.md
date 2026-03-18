# Plan Phase Workflow

Create a constraint-first plan for a phase.

## Steps

### 1. Determine phase

If $ARGUMENTS provided: use as the phase reference (name or number).
If not: read `.slopbuster/STATE.md` for the current phase. If STATE.md is missing, tell the user to run `/sb:init` first.

**State conflict check:** If STATE.md shows `# checkpoint_at:` is set, a plan is mid-execution. Show:
```
⚠ APPLY is in progress (checkpoint: [task-name]).
  Current plan: [plan-path]
  Continue with: /sb:apply [plan-path]

  Creating a new plan is fine but will not advance the current one.
  Proceeding with new plan creation.
```
Then continue — do not block. The developer may be planning the next plan while APPLY is paused.

Read `.slopbuster/PROJECT.md` for the project's core value — you'll need it for step 3b.

### 2. Determine plan number

List existing files in `.slopbuster/phases/{NN}-{phase-slug}/` matching `*-PLAN.md`.
New plan number = highest existing PP + 1, or 01 if none exist.

### 3. Gather plan details

Ask the user, one question at a time:

**a. What does this plan accomplish?**
"What are we building in this plan? Specific — which files change, what behavior changes?"

**b. Why does it matter?**
"How does this serve the core value: '[core value from PROJECT.md]'?"

**c. What are the acceptance criteria?**
"How will we know this is complete? Give me 2–5 specific, testable criteria."

**d. What files will this touch?**
"Which files does this plan modify or create?" Count the distinct files — this feeds the Gate check.

**e. Any new external dependencies?**
"Does this plan add new packages, services, or external APIs?"

### 4. Gate threshold check

Read thresholds from `.slopbuster/config.md`.

Evaluate each trigger:

| Trigger | Check |
|---------|-------|
| `file-count` | Files in user's answer > threshold (default: 5) |
| `new-dependencies` | User mentioned new packages, npm, pip, external service |
| `database-schema` | User mentioned schema, migration, ORM, model, table |
| `api-contract` | User mentioned endpoint, API, contract, shared utility |
| `auth-session` | User mentioned auth, JWT, session, login, permissions, roles |

Record which signals fired.

### 5. Write PLAN.md

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`

Use the template at @src/templates/PLAN.md

Fill in:
- Frontmatter: phase, plan number, files_modified (from user's answer), gate_cleared (false unless auto-clearing)
- `<constraints>`: leave empty — Gate will fill this
- `<objective>`: goal, purpose, output from user's answers
- `<context>`: reference PROJECT.md, STATE.md, and any source files the plan will touch
- `<acceptance_criteria>`: Given/When/Then format, one block per criterion
- `<tasks>`: break work into specific tasks. Assign wave numbers (wave 1 = independent, wave 2+ = depends on prior wave). Each task must have a `<verify>` step.
- `<boundaries>`: list files that must not change; list explicit out-of-scope items
- `<verification>`: final checklist before declaring complete
- `<success_criteria>`: measurable final-state assertions

### 6. Gate determination

**If no thresholds fired (simple plan):**
- Set `gate_cleared: true` in PLAN.md frontmatter
- Replace `<constraints>` content with: `<!-- Gate auto-cleared: no thresholds met on [ISO date] -->`
- Show: `[GATE ✓ auto] Plan is below all thresholds — cleared automatically`
- Continue to step 7

**If any threshold fired:**
- Set `gate_cleared: false` in PLAN.md frontmatter
- Leave `<constraints>` empty
- Append to STATE.md: `# gate_pending: .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`
- List which thresholds fired and why
- Show: `[GATE ⚠] Circuit breaker triggered (triggers: [list]). Run /sb:gate to clear.`

### 7. Update STATE.md

- Update Current Position: phase, plan number, status
- Update Loop Position display: PLAN ✓, GATE status
- Update Last: timestamp + "Plan created: {NN}-{PP}-PLAN.md"
- Update Next: exact command to run

### 8. Confirm

If Gate pending:
```
Plan created: .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
Gate triggers: [list]

PLAN ✓ ──▶ GATE ⚠ ──▶ APPLY ○ ──▶ UNIFY ○

Next: /sb:gate .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```

If auto-cleared:
```
Plan created: .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md

PLAN ✓ ──▶ GATE ✓ auto ──▶ APPLY ○ ──▶ UNIFY ○

Next: /sb:apply .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```

---

## References

- Loop phases and state machine: @src/references/loop-phases.md
- PLAN.md format guide: @src/references/plan-format.md
