# Enterprise Audit Workflow

Run an enterprise architectural audit on a plan.

## Steps

### 1. Check if enabled

Read `.slopbuster/config.md`.

If `enterprise_audit.enabled: false`:
- Show: `⛔ Enterprise audit is disabled. Enable with: /sb:config enterprise_audit.enabled true`
- Stop.

### 2. Load plan

Read PLAN.md at the path from $ARGUMENTS or STATE.md current plan.
Read GATE.md if it exists in the same phase directory.

## Audit Dimensions

### 1. Architectural Fit

Does the plan align with the existing system architecture?

- Follows established patterns in the codebase (naming, layering, abstraction levels)
- Does not introduce conflicting abstractions
- Consistent with technology choices already made
- New files placed in appropriate locations

**Status:** PASS / NEEDS ATTENTION / FAIL

---

### 2. Security Posture

Does the plan meet enterprise security requirements?

- Input validation at all external entry points
- No sensitive data in logs, errors, or debug output
- Secrets management follows established policy (no hardcoded credentials)
- Auth/authz matches existing patterns and does not weaken them
- Principle of least privilege applied to any new permissions

**Status:** PASS / NEEDS ATTENTION / FAIL

---

### 3. Operational Readiness

Is the plan production-ready?

- Monitoring/observability hooks in place (metrics, traces, logs at appropriate levels)
- Graceful degradation for external dependencies
- Health checks updated if new services or routes added
- Operational runbook impact documented

**Status:** PASS / NEEDS ATTENTION / FAIL

---

### 4. Compliance

Does the plan meet regulatory and compliance requirements relevant to this project?

- Data residency requirements respected
- Audit logging requirements met
- PII handling follows policy
- Retention and deletion policies applied

**Status:** PASS / NEEDS ATTENTION / FAIL

---

### 5. Change Management

Is the change manageable and reversible?

- Feature flags in place for gradual rollout (if warranted by plan scope)
- Backward compatibility maintained
- Migration plan documented and tested
- Rollback procedure exists and is practical

**Status:** PASS / NEEDS ATTENTION / FAIL

---

## Output

Write `.slopbuster/phases/{NN}-{slug}/{NN}-{PP}-AUDIT.md` with:
- Audit date and context
- Results table (PASS / NEEDS ATTENTION / FAIL per dimension)
- Specific findings for each dimension
- Required remediations

## Clearance Rules

- All PASS or NEEDS ATTENTION: advisory only. APPLY can proceed. Findings are informational.
- Any FAIL: blocks APPLY until the finding is remediated and the audit re-run.

Show the clearance status clearly:
```
[AUDIT ✓] Plan cleared for execution — [N] advisory findings
  or
[AUDIT ⛔] Plan blocked — [N] finding(s) require remediation before APPLY
```

Update STATE.md:
- Last: timestamp + "Audit complete: [NN]-[PP]-PLAN.md — [CLEARED | BLOCKED]"
- Next: `/sb:apply [plan-path]` if cleared, or `/sb:plan` (fix findings) if blocked
