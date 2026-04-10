# Init Project Workflow

Initialize SlopBuster in the current project.

## Steps

### 0. Greenfield check

Before initializing, check whether this is a brand-new project (empty or near-empty directory — fewer than 5 source files, no existing application code). Also check if `.slopbuster/GREENFIELD-*.md` exists.

**If the directory is near-empty AND no GREENFIELD assessment exists:**

```
This looks like a greenfield project — no existing codebase to work with.

Before initializing, consider running office hours to challenge whether
this project should exist at all:

  /sb:greenfield

This asks the tough questions: Does this problem need a custom solution?
What already exists? Who are the actual users? What's the kill criteria?

Skip this if you've already done your homework:  type "skip" to proceed to init.
```

Wait for the developer to respond. If they say "skip" or want to proceed, continue to step 1. If they want to run greenfield first, stop here — they'll come back to `/sb:init` after.

**If a GREENFIELD assessment exists:** Read it. Show the verdict. If RED or ORANGE, warn:

```
⚠ Your greenfield assessment gave a [verdict] verdict.
  Reason: [one-line summary]

  Proceeding anyway? The assessment recommended: [recommendation]
```

Continue only if the developer confirms.

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
- `.slopbuster/stewards/`
- `.slopbuster/records/`

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

### 7b. Write stewards README

Create `.slopbuster/stewards/README.md`:

```markdown
# Domain Stewardship

Domain teams place stewardship files here. Each file injects additional Gate
questions and checklist items when a plan touches that team's domain.

## How it works

1. Create a stewardship file for your domain (e.g., `network.md`, `database.md`)
2. Set `stewards.enabled: true` in `.slopbuster/config.md`
3. When a plan triggers your domain, the Gate automatically includes your
   questions after the five core questions

## Stewardship file format

```markdown
# [Domain] Stewardship

**Owner:** [Team name and contact]
**Triggers:** [Which Gate signals activate this file — e.g., database-schema, auth-session]
**File paths:** [Glob patterns that activate this file — e.g., src/payments/**)

## Additional Gate Questions

### Q-[Domain]-1: [Question title]
[Full question text]

### Q-[Domain]-2: [Question title]
[Full question text]

## Required Checklist Items

- [ ] [Item specific to this domain]
- [ ] [Item specific to this domain]

## Approved Patterns

[Patterns pre-cleared by this team — plans matching these patterns skip the
domain checklist items above]

## Anti-Patterns

[Known bad approaches this team has seen — presented as warnings during Gate]
```

## Domains to consider

| Domain | Typical owner | Triggers on |
|--------|--------------|-------------|
| `network.md` | Network/Infra team | Plans touching network config, VPCs, DNS, firewall |
| `database.md` | DBA team | database-schema trigger |
| `payments.md` | Payments team | Plans touching payment processing, billing |
| `auth.md` | Security team | auth-session trigger |
| `infrastructure.md` | Platform/SRE | Plans touching deployment, CI/CD, infrastructure |
| `data-privacy.md` | Compliance team | Plans touching PII, data retention, consent |
```

### 8. Create phase directories

For each phase named in step 2c, create:
`.slopbuster/phases/{NN}-{phase-slug}/`

Phase slug: lowercase, kebab-case, max 30 characters.

### 9. Git integration

Ask: "Should I commit `.slopbuster/` to this repo? Team projects benefit from tracking it — everyone sees the current phase and plan history. Solo projects can keep it local."

**If yes (commit):**
- Check if `.gitignore` has a `.slopbuster` entry and remove it if so
- Show: "`.slopbuster/` will be tracked. Run `git add .slopbuster/` when ready."

**If no (ignore):**
- Check if `.gitignore` exists. If so, append `.slopbuster/`. If not, create it with `.slopbuster/`.
- Show: "`.slopbuster/` added to `.gitignore` — stays local to this machine."

If the project is not a git repo, skip this step silently.

### 10. Confirm

```
✓ SlopBuster initialized

Project:    [name]
Core value: [core value]
Phases:     [N phases created]
Git:        [tracked | ignored]

Next:
  /sb:greenfield        — challenge whether this project should exist (new projects)
  /sb:discuss [phase]   — surface assumptions before planning (recommended)
  /sb:plan [phase]      — create your first plan directly
```
