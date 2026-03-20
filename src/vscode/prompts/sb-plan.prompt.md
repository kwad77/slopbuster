---
mode: agent
description: Create a constraint-first plan for a phase
---

Create a constraint-first SlopBuster plan.

## Steps

### 1. Check current state

Read `.slopbuster/STATE.md`. If not found, tell the user to run `/sb-init` first.
If `# checkpoint_at:` is set, warn that APPLY is in progress — creating a new plan is fine but won't advance the current one.

Read `.slopbuster/PROJECT.md` for the project's core value.

### 2. Gather plan details (ask one at a time)

**a. What does this plan accomplish?**
"What are we building? Specific — which files change, what behavior changes?"

**b. Why does it matter?**
"How does this serve the core value from PROJECT.md?"

**c. Acceptance criteria?**
"How will we know this is complete? Give 2–5 specific, testable criteria."

**d. Which files will this touch?**
"List the files this plan modifies or creates." Count them — feeds the Gate check.

**e. New external dependencies?**
"Does this plan add new packages, services, or external APIs?"

### 3. Check Gate thresholds

Fire Gate if any of:
- > 5 distinct files
- New packages/services mentioned
- Schema/migration/ORM changes
- API contract or shared utility changes
- Auth, session, permissions changes

### 4. Create the plan file

Determine the next plan number: list `.slopbuster/phases/` for existing `*-PLAN.md` files. New PP = highest + 1, or 01.

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md` with this structure:

```markdown
---
phase: {NN}
plan: {PP}
gate_cleared: false
files_modified: {count}
---

<constraints>
</constraints>

<objective>
## Goal
[what]

## Purpose
[why — tied to core value]

## Output
[what exists when done]
</objective>

<context>
[relevant background, linked files]
</context>

<acceptance_criteria>
Given [state]
When [action]
Then [observable result]
</acceptance_criteria>

<tasks>
## Wave 1

### Task: [name]
**Wave:** 1
**Files:** [list]

#### Steps
1. [step]

#### Verify
- [ ] [check]
</tasks>

<boundaries>
## Must Not Change
[files off-limits]

## Out of Scope
[explicit exclusions]
</boundaries>

<verification>
- [ ] All acceptance criteria pass
- [ ] All task verify steps complete
- [ ] No regressions
</verification>

<success_criteria>
[measurable final-state assertions]
</success_criteria>
```

### 5. Gate determination

**No thresholds fired:**
- Set `gate_cleared: true` in frontmatter
- Write `<!-- Gate auto-cleared: no thresholds met on [ISO date] -->` into `<constraints>`
- Update STATE.md loop to `GATE ✓ auto`
- Show: `[GATE ✓ auto] Plan is below all thresholds. Next: /sb-apply`

**Thresholds fired:**
- Leave `gate_cleared: false` and `<constraints>` empty
- Append `# gate_pending: .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md` to STATE.md
- Show: `[GATE ⚠] Triggers: [list]. Next: /sb-gate`

### 6. Update STATE.md

Update loop position, Last timestamp, and Next command.
