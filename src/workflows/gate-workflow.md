# Gate Workflow — Circuit Breaker

Run the Gate circuit breaker on a plan.

## Steps

### 1. Load the plan

Read the PLAN.md at the path from $ARGUMENTS.
If no path provided, read STATE.md and look for `# gate_pending: [plan-path]`.
If neither: ask the user which plan to gate.

Check `gate_cleared` in the PLAN.md frontmatter. If already `true`:
- Show: "Gate already cleared for this plan on [gate_date]. Run /sb:apply to execute."
- Stop.

Read `.slopbuster/config.md` for threshold settings.

If `gate.enabled: false` in config:
- Set `gate_cleared: true` and `gate_date: [ISO timestamp]` in PLAN.md frontmatter
- Write `<!-- Gate disabled in config.md — auto-cleared on [ISO date] -->` into `<constraints>`
- Remove `# gate_pending:` from STATE.md
- Update STATE.md loop position to GATE ✓ (disabled)
- Show: `[GATE ✓ disabled] Gate is disabled in config.md. Cleared without interrogation.`
- Show: `⚠ Re-enable with: /sb:config gate.enabled true`
- Show next: `/sb:apply [plan-path]`
- Stop.

### 1b. Stewardship import

Check `stewards.enabled` in `.slopbuster/config.md`.

**If `stewards.enabled: false` (default):**
- Note `stewards: disabled` in the Domain Context section of GATE.md
- Continue to step 2

**If `stewards.enabled: true`:**
- Read the detected `domain:` list from PLAN.md frontmatter
- For each domain, check if a matching file exists in `.slopbuster/stewards/`
  (e.g., domain: database → look for `database.md`)
- Also check file paths in the plan against `file paths:` globs in each stewardship file
- For each matching steward file:
  - Read its Additional Gate Questions and Required Checklist Items
  - Record it in `steward_files` in PLAN.md frontmatter
  - Record it in the Attribution section of GATE.md
  - Queue its questions to be asked after Q5 in step 4
  - Queue its checklist items to be evaluated in step 5
- If no matches: note `stewards: enabled, no domain matches` in GATE.md Domain Context

### 2. Trigger analysis

Evaluate the actual PLAN.md content against all thresholds:

| Threshold | Evidence to look for |
|-----------|---------------------|
| `file-count` | Count unique file paths in all `<files>` tags in `<tasks>`. Fire if > config threshold. |
| `new-dependencies` | Plan mentions install, npm, pip, cargo, go get, import of a new package, external service |
| `database-schema` | Plan mentions migration, schema, ORM, model class, table create/alter/drop |
| `api-contract` | Plan mentions endpoint change, API version, route, shared utility used by other services |
| `auth-session` | Plan mentions auth, login, JWT, token, session, permissions, roles, access control |

Show a table: which fired (with evidence) and which did not (with why not).

### 3. Auto-clear path (no thresholds fired)

This should be rare if plan-phase workflow already ran, but handle it:

- Set `gate_cleared: true`, `gate_date: [ISO timestamp]`, `risk_tier: LOW`, `domain: []`, `steward_files: []` in PLAN.md frontmatter
- Write `<!-- Gate auto-cleared on [ISO date]: no thresholds met -->` into `<constraints>`
- Write GATE.md with auto-clear status (see step 7 format), including Risk Classification (tier: LOW) and Attribution sections
- Remove `# gate_pending:` from STATE.md
- Update STATE.md loop position to GATE ✓
- Show: `[GATE ✓ auto] No thresholds met. Risk tier: LOW. Cleared.`
- Show next: `/sb:apply [plan-path]`
- Stop.

### 4. Interrogation — 5 questions

Present each question on its own. Wait for the user's complete answer before the next.
Do not combine questions. Do not summarize mid-interrogation.

Reference: @src/references/gate-questions.md — contains "What to listen for" guidance for each question and the full 8-point checklist context. Use this to probe thin answers with follow-up questions.

---

**Q1 — Connectivity**

What systems does this plan connect to or affect? List all downstream dependencies, webhooks, and clients. What is the blast radius if this rolls back?

*(Wait for full answer before continuing)*

---

**Q2 — Performance**

What are the latency targets? Where are the DB queries and do they use indexes? What is the memory profile under load?

*(Wait for full answer before continuing)*

---

**Q3 — Concurrency**

Are write operations idempotent? What are the race conditions? What is the locking and tie-break strategy?

*(Wait for full answer before continuing)*

---

**Q4 — Security**

Which endpoints are protected vs. public? What inputs are validated? What must never be logged? How are secrets managed?

*(Wait for full answer before continuing)*

---

**Q5 — Rollback**

If this plan fails mid-execution, how do you recover? Is the migration reversible? Can services restart safely? What is the manual recovery path?

*(Wait for full answer before continuing)*

---

### 5. 8-Point Pitfall Checklist

Assess each item against the plan and the answers just given. Note status and any open risks.

| # | Item | Status | Notes |
|---|------|:------:|-------|
| 1 | Business Context Alignment | ✓ / ⚠ | Does the plan serve the core value? |
| 2 | Database Schema Backward Compatibility | ✓ / ⚠ | Schema changes backward compatible? |
| 3 | Idempotency Guarantee | ✓ / ⚠ | Can tasks be retried safely? |
| 4 | Explicit Error Handling | ✓ / ⚠ | Error paths defined? |
| 5 | YAGNI | ✓ / ⚠ | Anything being built that isn't needed? |
| 6 | State Encapsulation | ✓ / ⚠ | State isolated and not leaking? |
| 7 | Automated Testing Strategy | ✓ / ⚠ | Test plan exists? |
| 8 | Alternative Solutions Matrix | ✓ / ⚠ | Simpler approach considered? |

List any items marked ⚠ as open risks.

### 6. Inject constraints verbatim

Open PLAN.md. Replace the `<constraints>` section content with the developer's exact answers.

**DO NOT summarize. DO NOT rephrase. Copy verbatim.**

```xml
<constraints>
## Q1 — Connectivity
[Developer's exact words — copy paste, no changes]

## Q2 — Performance
[Developer's exact words]

## Q3 — Concurrency
[Developer's exact words]

## Q4 — Security
[Developer's exact words]

## Q5 — Rollback
[Developer's exact words]
</constraints>
```

### 7. Write GATE.md

Create `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-GATE.md`

Use the template at @src/templates/GATE.md

Fill in:
- Plan path reference
- ISO timestamp
- Triggers that fired / did not fire (with evidence)
- All 5 answers verbatim
- Pitfall checklist results
- Open risks

### 8. Update PLAN.md frontmatter

Set:
- `gate_cleared: true`
- `gate_date: [ISO timestamp]`
- `gate_triggered_by: "[comma-separated list of triggers that fired]"`
- `risk_tier: [LOW | MEDIUM | HIGH | CRITICAL]` — based on trigger count and domain:
  - No triggers → LOW
  - 1–2 triggers → MEDIUM
  - 3+ triggers → HIGH
  - auth-session + (database-schema or api-contract) → CRITICAL
- `domain: [list of detected domains]`
- `steward_files: [list of steward files that were active, or []]`

Also write the Risk Classification and Attribution sections of GATE.md:

**Risk Classification:**
```
## Risk Classification

**Tier:** [LOW | MEDIUM | HIGH | CRITICAL]
**Domains detected:** [list or none]
**Triggers fired:** [list]
```

**Attribution:**
```
## Attribution

**Cleared by:** local
**Model:** [current AI model identifier]
**Plan hash:** [first 12 chars of sha256 of plan file content]
**Timestamp:** [ISO timestamp]
**Steward files active:** [list or none]
```

### 9. Update STATE.md

- Remove `# gate_pending:` line
- Update Loop Position to GATE ✓
- Update Last: timestamp + "Gate cleared: [NN]-[PP]-PLAN.md"
- Update Next: `/sb:apply .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md`

### 10. Confirm

```
[GATE ✓] Circuit breaker cleared.

Triggers:   [list that fired]
Constraints injected: 5 answers (verbatim)
Checklist:  [N]/8 confirmed  |  [N] open risks
GATE.md:    .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-GATE.md

PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ○ ──▶ UNIFY ○

Next: /sb:apply .slopbuster/phases/{NN}-{slug}/{NN}-{PP}-PLAN.md
```
