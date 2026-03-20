---
owner: "[Team name and contact — e.g., Network Team <network@company.com>]"
triggers: []
file_paths: []
---

# [Domain] Stewardship

<!-- triggers: list of domain names that activate this file automatically
     e.g., triggers: [network, infrastructure]
     Matches the domain: field set in PLAN.md frontmatter.

     file_paths: glob patterns — activates when the plan touches matching files
     e.g., file_paths: ["**/vpc/**", "**/firewall/**", "**/dns/**"]

     Either triggers or file_paths (or both) can activate a steward file. -->

## Additional Gate Questions

<!-- Questions your team needs answered before any plan in your domain executes.
     These are asked after the 5 core Gate questions.
     Format: ### Q-[Domain]-[N]: [Title] followed by the full question. -->

### Q-[Domain]-1: [Question title]

[Full question text. Be specific — this is what the developer will answer verbatim
before their plan can proceed. Ask the thing your team always wishes had been answered
before an incident.]

### Q-[Domain]-2: [Question title]

[Full question text.]

## Required Checklist Items

<!-- Items your team requires to be confirmed before Gate clears.
     These are evaluated after the 8-point core checklist. -->

- [ ] [Specific item your team needs confirmed — e.g., "Change reviewed against the Network Change Management runbook"]
- [ ] [Another item]

## Approved Patterns

<!-- Patterns your team has pre-cleared. Plans matching these skip the domain
     checklist items above. List specific approaches, modules, or tools that
     are known-good in your environment. -->

- [Pre-cleared pattern — e.g., "Using the standard VPC terraform module from terraform-modules/vpc"]

## Anti-Patterns

<!-- Known bad approaches your team has seen. Presented as warnings during Gate.
     These do not block — they inform. -->

- [Known anti-pattern — e.g., "Firewall rules that allow 0.0.0.0/0 ingress on ports other than 80/443"]
