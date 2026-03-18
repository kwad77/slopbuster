# Discuss Phase Workflow

Articulate vision and surface hidden assumptions before planning.

The purpose of `/sb:discuss` is to think out loud before committing to a plan. Surface assumptions, identify risks, align on approach — before a single task is written into a PLAN.md.

## Steps

### 1. Establish context

Read `.slopbuster/PROJECT.md` for project name and core value.
Read `.slopbuster/ROADMAP.md` for phase context.

Phase or topic: $ARGUMENTS (or ask if not provided)

### 2. Three opening questions

Ask conversationally, one at a time. Let the user think.

**a. "What does success look like for this phase?"**
Let them describe freely. Do not lead. Listen for: what they value most, what "done" means to them.

**b. "What are you least certain about?"**
This surfaces hidden assumptions. Listen for: technology choices, third-party unknowns, integration points, performance guesses.

**c. "What could make this harder than expected?"**
This surfaces risk. Listen for: external dependencies, legacy code, unclear requirements, team knowledge gaps, time constraints.

### 3. Reflect back

Summarize what you heard:
- The goal (in the user's words, not yours)
- Assumptions made (stated and implied)
- Risks identified

Ask: "Is this what you meant? Anything I missed?"

### 4. Surface hidden assumptions

Based on the discussion, explicitly name assumptions that weren't stated:

- "You mentioned [X] — that assumes [Y] is already in place. Is it?"
- "The goal implies [Z] works a certain way. Worth confirming before planning?"
- "This approach assumes [constraint] — does that match what you know?"

### 5. Identify Gate triggers in advance

Based on what was discussed, flag likely Gate triggers before planning starts:
- Will this touch more than 5 files?
- Any new packages or external services?
- Database schema involved?
- API or auth changes?

This is a heads-up, not a block. The Gate runs during `/sb:plan`.

### 6. Summarize planning inputs

List what `/sb:plan` will need to know:
- Key decisions to make
- Constraints already known (will become Gate answers)
- Files likely in scope

### 7. Write discussion summary

Write `.slopbuster/phases/{NN}-{slug}/DISCUSS-[YYYY-MM-DD].md` with:
- Phase name
- Goal summary (user's words)
- Assumptions surfaced
- Risks identified
- Known constraints
- Likely Gate triggers
- Planning inputs

### 8. Update STATE.md

Read `.slopbuster/STATE.md`. Update:
- Last: timestamp + "Discuss complete: [phase]"
- Next: `/sb:plan [phase]`

If STATE.md does not exist (user ran discuss before init), skip this step.

### 9. Close

```
Discussion summary: .slopbuster/phases/{NN}-{slug}/DISCUSS-[date].md

Key inputs for planning:
  - [decision 1]
  - [assumption to resolve]
  [If Gate triggers identified:]
  - ⚠ Likely Gate trigger: [reason]

Next: /sb:plan [phase]
```
