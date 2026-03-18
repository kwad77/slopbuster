# Loop Phases Reference

## The Loop

```
PLAN ──▶ GATE ──▶ APPLY ──▶ UNIFY
```

Every unit of work completes this loop. The Gate is phase two of four — not optional, not a variant. It is always present. Simple plans clear it automatically. Complex plans block until the developer clears it.

---

## Phase 1: PLAN

**Command:** `/sb:plan [phase]`

**What happens:**
- Developer articulates what to build and why
- Claude creates a constraint-first PLAN.md
- Gate thresholds are evaluated against plan scope
- `<constraints>` is left empty — visibly empty, as a signal

**Output:** `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`

**Done when:** PLAN.md exists with acceptance criteria and tasks defined.

**Symbols:**
- `◉` currently planning
- `✓` plan created

---

## Phase 2: GATE

**Command:** `/sb:gate [plan-path]`

**What happens:**
- Thresholds re-evaluated against actual plan content
- Simple plan: auto-clears, brief announcement
- Complex plan: 5 questions asked, 8-point checklist run
- Developer answers injected verbatim into `<constraints>`
- GATE.md written as permanent clearance artifact

**Output:** `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-GATE.md`

**Done when:** `gate_cleared: true` in PLAN.md frontmatter.

**Symbols:**
- `──` no plan exists to gate
- `⚠` triggered, not yet cleared
- `✓` cleared (developer answered all 5 questions)
- `✓ auto` auto-cleared (all thresholds below trigger)

---

## Phase 3: APPLY

**Command:** `/sb:apply [plan-path]`

**What happens:**
- Gate clearance verified (or override logged)
- `<constraints>` loaded — this is the execution contract
- Tasks executed wave by wave
- Checkpoints written to STATE.md before risky tasks
- `<verification>` checklist run before declaring complete

**Blocked by:** `gate_cleared: false` and no `override` in input

**Done when:** All tasks complete, verification passes.

**Symbols:**
- `○` not started
- `◉` executing
- `✓` complete

---

## Phase 4: UNIFY

**Command:** `/sb:unify [plan-path]`

**What happens:**
- Acceptance criteria reconciled against what was actually built
- Scope drift documented
- SUMMARY.md written
- STATE.md updated with decisions and deferred items
- Loop closed

**Output:** `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-SUMMARY.md`

**Done when:** SUMMARY.md written, STATE.md shows UNIFY ✓.

**Symbols:**
- `○` not started
- `◉` reconciling
- `✓` loop closed

---

## State Machine

```
/sb:init
  → STATE.md, PROJECT.md, ROADMAP.md, config.md created

/sb:plan
  → PLAN ◉ → [evaluate thresholds]
    → below all: GATE ✓ auto, PLAN ✓
    → any fire: GATE ⚠, PLAN ✓, gate_pending set in STATE.md

/sb:gate (if GATE ⚠)
  → 5 questions asked
  → answers injected verbatim into <constraints>
  → GATE.md written
  → GATE ✓, gate_pending cleared from STATE.md

/sb:apply (requires GATE ✓ or override)
  → APPLY ◉
  → execute tasks by wave
  → checkpoints written/cleared
  → APPLY ✓

/sb:unify
  → UNIFY ◉
  → reconcile ACs against disk
  → SUMMARY.md written
  → UNIFY ✓ — loop closed
```

---

## What "Complete" Means

A loop iteration is complete when:

1. PLAN.md exists with a plan number and defined ACs
2. GATE.md exists or gate was auto-cleared with a note in `<constraints>`
3. All tasks executed and `<verification>` passed
4. SUMMARY.md written with AC reconciliation
5. STATE.md shows UNIFY ✓

The loop resets for the next plan. STATE.md carries forward decisions and deferred items.
