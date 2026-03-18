# PLAN.md Format Reference

## File Naming

`.slopbuster/phases/{NN}-{phase-slug}/{NN}-{PP}-PLAN.md`

| Segment | Meaning | Example |
|---------|---------|---------|
| `NN` | Phase number, zero-padded | `01`, `03`, `12` |
| `phase-slug` | Kebab-case phase name, max 30 chars | `auth-api`, `data-model` |
| `PP` | Plan number within phase, zero-padded | `01`, `02` |

## Sections (in order)

### Frontmatter

```yaml
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
```

**wave:** Plans in the same phase with wave 1 are independent. Wave 2 depends on wave 1 completing first. Wave is a planning hint — it tells you which plans can run in parallel sessions, not an automatic scheduler.

**autonomous:** When `true` (default), APPLY executes all waves without pausing. When `false`, APPLY pauses before each wave boundary and waits for re-run — useful for risky plans where human confirmation between waves is required. Set to `false` only when actively watching execution.

### `<constraints>` — FIRST SECTION, ALWAYS

This is the execution contract. Claude reads this before any task.

- Empty = Gate has not run. Visibly empty. This is a warning.
- Filled = Gate cleared. Developer's verbatim answers to 5 questions.
- Auto-cleared = comment noting no thresholds met.

**Never edit manually. Always filled by /sb:gate.**

### `<objective>`

- **Goal:** Specific and measurable. What changes? Which files? What behavior?
- **Purpose:** Why this serves the project's core value.
- **Output:** Artifacts created or modified.

### `<context>`

File references the model needs. Use `@path/to/file` — these are loaded at apply time.

```
@.slopbuster/PROJECT.md
@.slopbuster/STATE.md
@src/relevant/file.ext
```

Keep context lean. Reference files, don't inline their full contents.

### `<acceptance_criteria>`

One block per meaningful behavior change:

```
## AC-1: [Name]
Given [precondition]
When [action]
Then [expected outcome]
```

Acceptance criteria must be testable. "It works" is not an AC. "Given a valid JWT, when GET /user is called, then HTTP 200 with user object is returned" is an AC.

### `<tasks>`

```xml
<task type="auto" wave="1">
  <name>Action-oriented name (verb first)</name>
  <files>path/to/file.ext, another/file.ext</files>
  <action>
    Specific steps. What to do and what NOT to do and WHY.
  </action>
  <verify>Observable check that proves completion — command output, file state, endpoint response</verify>
  <done>AC-N satisfied: [specific criterion met]</done>
</task>
```

**type:** `auto` (Claude executes) | `manual` (user executes — APPLY pauses and waits)

**The `<verify>` step is mandatory.** A task without a verify step has no definition of done.

### `<boundaries>`

```
## DO NOT CHANGE
- List files/patterns that must not be touched

## SCOPE LIMITS
- Explicit out-of-scope items
```

APPLY enforces boundaries. If a task would require touching a DO NOT CHANGE file, it stops and reports.

### `<verification>`

Checklist Claude runs after all tasks, before declaring complete:

```
- [ ] [specific check with exact command]
- [ ] [specific check]
```

Different from `<verify>` per task — this is the final gate before APPLY ✓.

### `<success_criteria>`

Measurable final-state assertions. These are what UNIFY reconciles against.

### `<output>`

Instruction to write SUMMARY.md — always the same:
```
After completion, create .slopbuster/phases/XX-name/NN-PP-SUMMARY.md
```

## Key Rule

`<constraints>` is the first section. Always. The model reads the developer's words before it reads the tasks.
