# Export Workflow — Compliance Evidence Pack

Export Gate clearance records as structured compliance evidence for SOC 2, HIPAA, or FedRAMP.

## Steps

### 1. Parse arguments

From $ARGUMENTS, determine the target framework:
- `soc2` → SOC 2 Type II Trust Services Criteria
- `hipaa` → HIPAA Security Rule
- `fedramp` → FedRAMP / NIST 800-53
- `all` or no argument → export all three frameworks

Output directory: `.slopbuster/exports/{YYYY-MM-DD}-{framework}/`

For `all`, create one directory per framework.

### 2. Discover Change Records

First, glob all `*-CHANGE-RECORD.md` files in `.slopbuster/records/`. These are the primary, self-contained change artifacts.

If records/ is empty, fall back to globbing all `*-GATE.md` files in `.slopbuster/phases/**` — older plans created before /sb:export was available.

Sort chronologically. If no records found at all:
```
No Gate clearance records found. Run /sb:gate to clear a plan first.
```
Stop.

### 3. Parse each GATE.md

For each GATE.md, extract:

| Field | Source |
|-------|--------|
| `plan_ref` | Line starting with `**Plan:**` |
| `cleared_at` | Line starting with `**Cleared:**` |
| `risk_tier` | Line starting with `**Tier:**` in Risk Classification |
| `domains` | Line starting with `**Domains detected:**` |
| `triggers_fired` | Line starting with `**Triggers fired:**` |
| `model` | Line starting with `**Model:**` |
| `cleared_by` | Line starting with `**Cleared by:**` |
| `plan_hash` | Line starting with `**Plan hash:**` |
| `steward_files` | Line starting with `**Steward files active:**` |
| `q1_connectivity` | Content under `## Q1 — Connectivity` |
| `q2_performance` | Content under `## Q2 — Performance` |
| `q3_concurrency` | Content under `## Q3 — Concurrency` |
| `q4_security` | Content under `## Q4 — Security` |
| `q5_rollback` | Content under `## Q5 — Rollback` |
| `checklist_confirmed` | Count of ✓ in the 8-Point Pitfall Checklist table |
| `checklist_open` | Count of ⚠ in the 8-Point Pitfall Checklist table |
| `domain_context` | Content under `## Domain Context` (steward answers) |

### 4. Write MANIFEST.md

Create `MANIFEST.md` in the export directory:

```markdown
# Compliance Evidence Export

**Framework:** [SOC 2 Type II | HIPAA Security Rule | FedRAMP NIST 800-53]
**Generated:** [ISO timestamp]
**Generator:** SlopBuster vX.X.X
**Project:** [PROJECT.md name]

## Coverage Summary

| Metric | Value |
|--------|-------|
| Gate records exported | N |
| Date range | [earliest cleared_at] → [latest cleared_at] |
| Risk tiers | LOW: N  MEDIUM: N  HIGH: N  CRITICAL: N |
| Domains covered | [list] |
| Plans with steward sign-off | N of N |
| Total checklist items confirmed | N |
| Total checklist open risks | N |

## Evidence Files

| File | Controls covered | Records |
|------|-----------------|---------|
| [filename.md] | [control IDs] | N |

## Attestation

This export was generated automatically from Gate clearance records created during
the SlopBuster PLAN → GATE → APPLY → UNIFY development loop.

Each record contains:
- Developer-authored verbatim answers to 5 architectural questions
- AI model identity and plan content hash (non-repudiation)
- Risk classification and trigger evidence
- 8-point pitfall checklist results
- Domain expert sign-off (where stewardship files were active)

Records have not been modified from their original form.
```

### 5. Write framework evidence files

#### SOC 2 Type II

**CC8.1 — Change Management** → `change-log.md`

All gate clearances in chronological order. For each:
```
### [plan_ref] — [cleared_at]

**Risk tier:** [risk_tier]  |  **Authorized by:** [cleared_by]  |  **Model:** [model]
**Integrity hash:** [plan_hash]
**Triggers:** [triggers_fired]

**Connectivity impact:** [q1_connectivity]

**Rollback plan:** [q5_rollback]

**Pitfall checklist:** [checklist_confirmed]/8 confirmed, [checklist_open] open risks
```

Header maps to control:
```
## CC8.1 — Change Management
> Requirement: The entity authorizes, designs, develops or acquires, configures,
> documents, tests, approves, and implements changes to infrastructure, data,
> software, and procedures.
```

---

**CC6.1 — Logical and Physical Access Controls** → `access-controls.md`

Filter to plans where `triggers_fired` includes `auth-session` OR `domains` includes `auth`.

For each matching record:
```
### [plan_ref] — [cleared_at]

**Security assessment (Q4):**
[q4_security]

**Connectivity scope (Q1):**
[q1_connectivity]
```

If no auth/session plans: note `No auth or session changes were made in this period.`

Maps to:
```
## CC6.1 — Logical and Physical Access Controls
> Requirement: The entity implements logical access security measures to
> protect against threats from sources outside its system boundaries.
```

---

**CC9.2 — Risk Mitigation** → `risk-assessment.md`

Risk tier distribution table. For each HIGH or CRITICAL plan, include full trigger evidence and constraint summary.

Maps to:
```
## CC9.2 — Risk Mitigation
> Requirement: The entity selects and develops risk mitigation activities
> for risks arising from potential business disruptions.
```

---

**CC7.1 — System Operations** → `monitoring.md`

Filter to plans where `triggers_fired` includes `database-schema` or `api-contract`. Include Q2 (Performance) and Q3 (Concurrency) answers.

Maps to:
```
## CC7.1 — System Operations
> Requirement: The entity detects and monitors for new vulnerabilities
> and evaluates their potential impact.
```

---

#### HIPAA Security Rule

**§164.312(b) — Audit Controls** → `audit-controls.md`

All gate records in chronological order. Full record per plan:
- Plan reference and hash (integrity evidence)
- Risk tier and triggers (threat identification)
- All 5 Q&A verbatim (decision documentation)
- Checklist results

Header:
```
## §164.312(b) — Audit Controls
> Standard: Implement hardware, software, and/or procedural mechanisms
> that record and examine activity in information systems that contain
> or use electronic protected health information.
```

---

**§164.308(a)(1) — Risk Analysis** → `risk-analysis.md`

Risk classification table for all plans. HIGH and CRITICAL plans get full trigger evidence.

Header:
```
## §164.308(a)(1)(ii)(A) — Risk Analysis
> Standard: Conduct an accurate and thorough assessment of the potential
> risks and vulnerabilities to the confidentiality, integrity, and
> availability of electronic protected health information.
```

---

**§164.308(a)(3) — Workforce Authorization** → `workforce-auth.md`

All attribution records: who cleared, which model, timestamp, plan hash.

Header:
```
## §164.308(a)(3) — Workforce Authorization and Supervision
> Standard: Implement procedures for the authorization and/or supervision
> of workforce members who work with electronic protected health information.
```

---

**§164.312(c) — Integrity** → `integrity.md`

Plan hash table for all records. Hash verifies plan content was not modified between gate clearance and execution.

Header:
```
## §164.312(c)(1) — Integrity
> Standard: Implement policies and procedures to protect electronic
> protected health information from improper alteration or destruction.
```

---

#### FedRAMP / NIST 800-53

**CM-3 — Configuration Change Control** → `CM-3-change-control.md`

All gate clearances as change control records. Format matches NIST CM-3 evidence requirements: change identifier (plan hash), change description (plan_ref + objective), authorization (cleared_by + model), testing evidence (checklist), rollback procedure (Q5).

Header:
```
## CM-3 — Configuration Change Control
> Control: The organization authorizes, documents, and controls changes
> to the information system.
```

---

**CM-4 — Security Impact Analysis** → `CM-4-impact-analysis.md`

All plans with Q4 (Security) answers and trigger evidence. Focus on auth-session and api-contract triggers.

Header:
```
## CM-4 — Security Impact Analysis
> Control: The organization analyzes changes to the information system
> to determine potential security impacts prior to change implementation.
```

---

**SA-10 — Developer Configuration Management** → `SA-10-dev-config.md`

Attribution chain for all records: model identity, human identity, plan hash, timestamp. Demonstrates developer accountability for AI-assisted changes.

Header:
```
## SA-10 — Developer Configuration Management and Tracking
> Control: The organization requires the developer of the information
> system to track security flaws and flaw resolution.
```

---

**SI-2 — Flaw Remediation** → `SI-2-flaw-remediation.md`

8-point pitfall checklist results across all plans. Aggregate confirmed/open counts. Flag any patterns of recurring open risks.

Header:
```
## SI-2 — Flaw Remediation
> Control: The organization identifies, reports, and corrects information
> system flaws.
```

### 6. Handle steward evidence

If any records have `domain_context` populated (steward answers present):

Append to the relevant framework file a section:

```markdown
## Domain Expert Sign-Off

The following records include answers from domain stewards — subject-matter experts
who own governance questions for specific technical domains.

| Record | Domain | Steward |
|--------|--------|---------|
| [plan_ref] | [domain] | [steward file owner] |
```

Append the full domain context verbatim as supplementary evidence.

### 7. Confirm

```
[EXPORT ✓] Compliance evidence pack written.

Framework:   [SOC 2 | HIPAA | FedRAMP | all three]
Records:     N Gate clearances exported
Output:      .slopbuster/exports/{date}-{framework}/
Files:       N evidence files + MANIFEST.md

Risk summary:  LOW: N  MEDIUM: N  HIGH: N  CRITICAL: N
Steward records: N plans with domain expert sign-off

Evidence is ready for submission. Share the export/ directory with your
compliance team or upload to your GRC tool.
```

---

## References

- SOC 2 Trust Services Criteria: AICPA TSC 2017
- HIPAA Security Rule: 45 CFR Parts 160 and 164
- FedRAMP/NIST: NIST SP 800-53 Rev 5
- Gate record format: @src/templates/GATE.md
