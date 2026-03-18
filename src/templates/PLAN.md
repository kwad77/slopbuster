---
phase: XX-name
plan: NN
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
gate_cleared: false
gate_date: null
gate_triggered_by: ""
---

<constraints>
<!-- Filled by /sb:gate — developer's verbatim answers to 5 questions -->
<!-- DO NOT edit manually — this is the execution contract -->
<!-- Empty means Gate has not run yet -->
</constraints>

<objective>
## Goal
[What this plan accomplishes — specific and measurable. Which files change, what behavior changes.]

## Purpose
[Why this matters for the project's core value.]

## Output
[Artifacts created or modified when this plan is complete.]
</objective>

<context>
@.slopbuster/PROJECT.md
@.slopbuster/STATE.md
</context>

<acceptance_criteria>
## AC-1: [Name]
Given [precondition]
When [action]
Then [expected outcome]
</acceptance_criteria>

<tasks>

<task type="auto" wave="1">
  <name>Action-oriented task name (verb first)</name>
  <files>path/to/file.ext</files>
  <action>
    Specific implementation steps.
    What to avoid and WHY.
  </action>
  <verify>Command or observable check that proves the task is complete</verify>
  <done>AC-1 satisfied: [specific criterion met]</done>
</task>

</tasks>

<boundaries>
## DO NOT CHANGE
- [protected file or pattern — things that must not be touched]

## SCOPE LIMITS
- [explicit out-of-scope items — things this plan must not do]
</boundaries>

<verification>
Before declaring plan complete:
- [ ] [specific check with exact command or observable]
- [ ] [specific check]
</verification>

<success_criteria>
- [measurable final-state assertion]
- [measurable final-state assertion]
</success_criteria>

<output>
After completion, create .slopbuster/phases/XX-name/NN-PP-SUMMARY.md
</output>
