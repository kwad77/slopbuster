# Init Project Workflow

Initialize SlopBuster in the current project.

## Steps

### 1. Check for existing installation

Check if `.slopbuster/` already exists in the current directory.

If it does:
- Read `.slopbuster/PROJECT.md` and show the project name and core value
- Ask: "SlopBuster is already initialized here. Reinitialize? This resets STATE.md but preserves all existing plans."
- If no: stop
- If yes: proceed but do not overwrite existing PLAN.md or GATE.md files in phase directories

### 2. Gather project context

Ask the user conversationally, one question at a time. Do not present all questions at once.

**a. Project name and description**
"What is this project? Give me a name and one-sentence description."

**b. Core value**
"What is the one thing this project must do above all else? The core value — if everything else fails but this works, you shipped."

Push back gently if the answer is vague. The core value must be specific enough to use as a decision filter.

**c. Initial phases**
"What are the major phases of work? List them in order. You can always add more later with /sb:roadmap."

Example answer: "Auth API, Data model, Dashboard UI, Notifications"

**d. Gate configuration**
"I'll use the default Gate thresholds — all enabled, fires on more than 5 files or any dependency/schema/API/auth change. Want to change anything?"

Show the defaults briefly. Most users will say no.

### 3. Create directory structure

Create:
- `.slopbuster/`
- `.slopbuster/phases/`

### 4. Write PROJECT.md

Use the template at @src/templates/PROJECT.md

Fill in: project name, description, core value, today's date.

### 5. Write ROADMAP.md

Use the template at @src/templates/ROADMAP.md

Create one milestone entry for each phase the user named. Number phases starting from 01. Use kebab-case slugs for phase names.

### 6. Write STATE.md

Use the template at @src/templates/STATE.md

Set initial state:
- Phase: 1 of N — [first phase name]
- Plan: none yet
- Status: Planning
- Loop position: PLAN ○ GATE ── APPLY ○ UNIFY ○

### 7. Write config.md

Use the template at @src/templates/config.md

Apply any threshold changes the user requested. Leave defaults for everything else.

### 8. Create phase directories

For each phase named in step 2c, create:
`.slopbuster/phases/{NN}-{phase-slug}/`

Phase slug: lowercase, kebab-case, max 30 characters.

### 9. Confirm

```
✓ SlopBuster initialized

Project:    [name]
Core value: [core value]
Phases:     [N phases created]

Next:
  /sb:discuss [phase]   — surface assumptions before planning (recommended)
  /sb:plan [phase]      — create your first plan directly
```
