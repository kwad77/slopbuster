# Greenfield Office Hours Workflow

Challenge whether a new project should exist before writing a single line of code.

The purpose of `/sb:greenfield` is to be the tough conversation you need to have before `/sb:init`. This is not about how to build — it's about whether to build. Most failed projects fail because nobody asked the hard questions at the start.

This workflow is adversarial by design. Push back. Be skeptical. The developer's job is to convince you — and themselves — that this project deserves to exist.

## Steps

### 1. Set the tone

```
┌──────────────────────────────────────────────────────────────┐
│  GREENFIELD OFFICE HOURS                                     │
│                                                              │
│  Before you write a line of code, let's make sure this       │
│  project should exist at all.                                │
│                                                              │
│  I'm going to ask hard questions. That's the point.          │
│  Better to kill a bad idea now than to ship it and maintain   │
│  it forever.                                                 │
└──────────────────────────────────────────────────────────────┘
```

Project idea: $ARGUMENTS (or ask: "What do you want to build?" if not provided)

### 2. The interrogation

Ask these questions **one at a time**. Wait for a full answer before moving on. Do not combine questions. Do not rush.

For each answer: listen carefully, then **push back** if the answer is vague, optimistic, or hand-wavy. This is office hours, not a pitch meeting.

---

**Q1 — The Problem**

"What specific problem are you solving? Who has this problem, and how are they dealing with it right now — today, without your project?"

**What to listen for:** Vague problems ("it would be nice to have..."), solutions masquerading as problems ("we need a microservice for X" — that's a solution, not a problem), problems nobody actually has.

**Push back if:** The problem is hypothetical, the affected users are unnamed, or the current workaround is "nothing" (people always have a workaround — find it).

---

**Q2 — Existing Solutions**

"What existing products, open source projects, libraries, or services already solve this problem — even partially? Name specific ones. Why can't you use them?"

**What to listen for:** "Nothing exists" (almost never true), "I looked but didn't find anything" (how hard did they look?), "existing solutions are too heavy/complex" (is that actually true or just a feeling?).

**Push back if:** The developer hasn't actually tried the existing solutions, or the reasons for rejection are vague ("it doesn't do exactly what I need" — what specifically is missing?). If the developer can't name at least one existing alternative, pause and research together before continuing.

**Action:** If the developer is unsure about existing solutions, use web search to find alternatives. Present what you find and ask them to evaluate honestly.

---

**Q3 — Build vs. Use**

"What specifically do you lose by using an existing solution? What do you gain by building from scratch that justifies the cost?"

**What to listen for:** Legitimate reasons (compliance requirements, performance needs that existing solutions can't meet, integration constraints). Red flags: "I want full control" (over what, specifically?), "it'll be simpler" (it won't), "I can build it in a weekend" (you can't maintain it in a weekend).

**Push back if:** The gains are emotional (pride of ownership, resume padding, "not invented here") rather than practical. Building from scratch has a massive hidden cost: you now maintain it forever.

---

**Q4 — The User**

"Who will actually use this? Have you talked to them? What evidence — not assumptions, evidence — do you have that they need this and will use it?"

**What to listen for:** Specific users or user segments, actual conversations or data, request tickets, support complaints, user research. Red flags: "developers will love it," "everyone needs this," "I'm building it for myself" (fine, but then the scope conversation changes).

**Push back if:** There are zero actual users who have asked for this. Building for an imagined audience is the #1 cause of projects that ship and get zero adoption.

---

**Q5 — Minimum Viable Scope**

"What is the absolute smallest version of this that would be useful to someone? Not the full vision — the smallest thing that solves the core problem. Could you ship it in a week?"

**What to listen for:** A crisp, small scope that still delivers value. Red flags: "well, you really need X and Y and Z before it's useful" (scope creep from day zero), inability to cut features, "MVP" that's actually a full product.

**Push back if:** The minimum scope is still large. If you can't ship something useful in a week, the project may be too ambitious or insufficiently understood.

---

**Q6 — Kill Criteria**

"What would tell you this project should be abandoned? Define the failure conditions now — before you're emotionally invested."

**What to listen for:** Specific, measurable conditions: "if nobody uses it after 30 days," "if it can't beat existing tool X on metric Y," "if it takes longer than N weeks to reach MVP." Red flags: "I won't abandon it" (everything should have kill criteria), inability to define failure.

**Push back if:** There are no kill criteria. A project with no failure conditions is a project that drains resources indefinitely.

---

**Q7 — Maintenance Reality**

"After v1 ships, who maintains this? What's the ongoing cost — in hours per week, in attention, in keeping dependencies updated, in responding to users?"

**What to listen for:** Realistic acknowledgment of ongoing cost. Understanding that shipping is maybe 30% of total lifetime effort. Red flags: "it'll be done," "it won't need much maintenance" (everything needs maintenance), "I'll handle it" (for how long?).

**Push back if:** The developer hasn't thought about maintenance at all. Every line of code you write is a line of code you maintain.

---

### 3. The verdict

After all seven questions, synthesize what you heard. Be direct.

Classify the project into one of four categories:

**GREEN — Build it.**
The problem is real, existing solutions genuinely don't work, the scope is tight, kill criteria exist, maintenance is accounted for. Proceed to `/sb:init`.

**YELLOW — Build it, but...**
The idea has merit but there are gaps: unclear users, too-large scope, missing kill criteria, no maintenance plan. List exactly what needs to be resolved before proceeding. Do not proceed to `/sb:init` until the yellow items are addressed.

**ORANGE — Reconsider.**
The case for building is weak. An existing solution probably works. The problem is vague. The scope is huge. Recommend: use an existing tool, prototype with off-the-shelf components first, or do more user research before committing to a custom build.

**RED — Don't build this.**
The problem doesn't exist, or existing solutions already solve it, or there are no users, or the maintenance burden is unsustainable. Say so directly and explain why. Suggest what to do instead.

### 4. Reflect back the honest assessment

Summarize:
- **The problem** (in the developer's words)
- **Existing alternatives** considered and why rejected
- **What building from scratch costs** that the developer acknowledged
- **The scope** — minimum viable version
- **Kill criteria** — when to stop
- **Maintenance commitment** — ongoing cost accepted

Be blunt. If the answers were weak, say so. If the developer convinced you, say that too.

### 5. Write the greenfield brief

Create the directory if it doesn't exist: `.slopbuster/`

Write `.slopbuster/GREENFIELD-[YYYY-MM-DD].md`:

```markdown
# Greenfield Assessment: [Project Name/Idea]

**Date:** [YYYY-MM-DD]
**Verdict:** [GREEN | YELLOW | ORANGE | RED]

## The Problem
[Developer's description — verbatim, not summarized]

## Current Workarounds
[How people solve this today without this project]

## Existing Solutions Evaluated

| Solution | Why rejected | Rejection valid? |
|----------|-------------|-----------------|
| [name] | [reason] | [yes/no/partially — be honest] |

## Build vs. Use Decision
**What building costs:** [honest assessment]
**What building gains:** [legitimate advantages only]

## Target Users
[Who, and what evidence exists that they need this]

## Minimum Viable Scope
[Smallest useful version]
**Ship target:** [timeframe]

## Kill Criteria
[Specific conditions under which this project gets abandoned]

## Maintenance Commitment
[Who maintains, estimated ongoing cost]

## Open Questions
[Anything unresolved that should be answered before /sb:init]

---

**Next step:** [/sb:init if GREEN | resolve items if YELLOW | reconsider if ORANGE | don't build if RED]
```

### 6. Update STATE.md (if it exists)

If `.slopbuster/STATE.md` exists:
- Update Last: timestamp + "Greenfield assessment complete: [verdict]"
- Update Next: based on verdict

If STATE.md does not exist (likely — this runs before init), skip this step.

### 7. Close

If GREEN:
```
Verdict: GREEN — Build it.

Assessment saved: .slopbuster/GREENFIELD-[date].md

The case holds up. Proceed to initialize:
  /sb:init
```

If YELLOW:
```
Verdict: YELLOW — Build it, but resolve these first:
  - [item 1]
  - [item 2]

Assessment saved: .slopbuster/GREENFIELD-[date].md

Address the open items, then:
  /sb:init
```

If ORANGE:
```
Verdict: ORANGE — Reconsider.

[One-sentence explanation of why]

Assessment saved: .slopbuster/GREENFIELD-[date].md

Recommendation: [what to do instead]
```

If RED:
```
Verdict: RED — Don't build this.

[One-sentence explanation of why]

Assessment saved: .slopbuster/GREENFIELD-[date].md

Recommendation: [what to do instead]
```
