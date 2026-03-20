---
mode: agent
description: Deploy a research agent for external information gathering
---

Deploy a focused research agent to gather external information relevant to the current plan or question.

## Step 1 — Define the research question

If the user provided a specific question: use it.
If not: read the current PLAN.md and identify the highest-uncertainty area (unknown dependencies, unfamiliar technology, etc.).

Clarify: what specific information is needed, and how will it be used in the plan?

## Step 2 — Research scope

State explicitly what will and will not be researched:
- **In scope:** [specific questions]
- **Out of scope:** [related but excluded topics]
- **Depth:** [quick overview / detailed analysis / full comparison]

## Step 3 — Conduct research

Use web search and fetch to answer the research questions. Prioritize:
1. Official documentation
2. Known working examples
3. Known pitfalls or incompatibilities

## Step 4 — Synthesize findings

Produce a research summary:

```markdown
## Research: [topic]
**Date:** [ISO date]
**Question:** [what was researched]

### Findings
[Key facts, with sources]

### Recommendation
[What the plan should do based on this research]

### Risks / Caveats
[Anything uncertain or that needs further verification]

### Sources
- [URL or reference]
```

## Step 5 — Suggest plan update

If research reveals something that should change the current plan: describe the specific change and ask if the user wants to update the plan now.
