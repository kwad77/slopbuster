# Gate — Questions and Checklist Reference

## The 5 Gate Questions

### Q1 — Connectivity

What systems does this plan connect to or affect? List all downstream dependencies, webhooks, and clients. What is the blast radius if this rolls back?

**What to listen for:** External APIs, message queues, downstream services, shared databases, webhooks, CDNs, caches. If any of these exist and the plan touches them, rollback isn't just "revert the code."

---

### Q2 — Performance

What are the latency targets? Where are the DB queries and do they use indexes? What is the memory profile under load?

**What to listen for:** N+1 queries, missing indexes, unbounded result sets, synchronous operations that block on I/O, memory growth that doesn't release, cache misses under load.

---

### Q3 — Concurrency

Are write operations idempotent? What are the race conditions? What is the locking and tie-break strategy?

**What to listen for:** Concurrent writes to shared state, optimistic vs pessimistic locking choices, retry behavior, eventual consistency assumptions that haven't been tested.

---

### Q4 — Security

Which endpoints are protected vs. public? What inputs are validated? What must never be logged? How are secrets managed?

**What to listen for:** Missing auth checks, unvalidated user inputs, PII in logs, hardcoded credentials, missing rate limiting, CORS misconfiguration, missing HTTPS enforcement.

---

### Q5 — Rollback

If this plan fails mid-execution, how do you recover? Is the migration reversible? Can services restart safely? What is the manual recovery path?

**What to listen for:** Irreversible migrations, tight coupling that makes partial rollback impossible, missing feature flags, no documented manual recovery path.

This question forces the developer to think through all four previous answers and ask: "If everything I just described goes wrong at step 3, what do I actually do?"

---

## The 8-Point Pitfall Checklist

| # | Item | The Real Question |
|---|------|------------------|
| 1 | Business Context Alignment | Does this plan serve the stated core value, or did we drift? |
| 2 | Database Schema Backward Compatibility | Will this break existing data or queries in production? |
| 3 | Idempotency Guarantee | Can we retry any task safely without side effects? |
| 4 | Explicit Error Handling | Are error paths defined, or are we hoping for happy path? |
| 5 | YAGNI | Is anything in this plan that the plan doesn't actually need right now? |
| 6 | State Encapsulation | Is state leaking across module boundaries or services? |
| 7 | Automated Testing Strategy | How will we know if this regresses in three months? |
| 8 | Alternative Solutions Matrix | Did we consider a simpler approach and consciously reject it? |

---

## Gate Thresholds

| Threshold | Default | Signal |
|-----------|---------|--------|
| Files modified | > 5 | `file-count` |
| New external dependencies | any | `new-dependencies` |
| Database schema changes | any | `database-schema` |
| API contract changes | any | `api-contract` |
| Auth/session changes | any | `auth-session` |

Thresholds configurable in `.slopbuster/config.md`. All default to their most conservative settings.

---

## Override Behavior

If a developer types `override` when APPLY is blocked by the Gate:

1. APPLY proceeds without Gate clearance
2. `<constraints>` will be empty — Claude executes without the developer's constraint contract
3. The override is logged to STATE.md Decisions table with timestamp
4. This is permanent record — it is not hidden

Override exists for: rapid prototyping branches, throwaway experiments, situations where the developer has full external context not captured in the plan. It is not a shortcut for skipping the Gate when the Gate is inconvenient.
