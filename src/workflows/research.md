# Research Workflow

Gather external information relevant to this project.

## Steps

### 1. Clarify scope

Topic: $ARGUMENTS

If the topic is vague, ask: "What specific question are you trying to answer? What decision will this research inform?"

Narrow the scope before searching. Broad searches produce broad answers.

### 2. Research

Search for information on the topic using available tools. Focus on:
- Current state of the technology, API, or service
- Known limitations, gotchas, and failure modes
- Best practices from authoritative sources
- Relevant alternatives and trade-offs
- Version compatibility concerns

### 3. Synthesize

Produce a research brief with these sections:

**Question:** What were we trying to learn?

**Answer:** What did we find? Be direct — lead with the conclusion.

**Key findings:**
- [Finding 1 — specific, actionable]
- [Finding 2]
- ...

**Recommendation:** How does this inform the plan? What should the developer do?

**Alternatives considered:** What else was evaluated?

**Sources:** URLs or references used.

### 4. Write research brief

Create the research directory if it doesn't exist: `.slopbuster/research/`

Write: `.slopbuster/research/[topic-slug]-[YYYY-MM-DD].md`

### 5. Confirm

Show the brief summary and ask:
"Research saved. Ready to incorporate into `/sb:plan [phase]`?"
