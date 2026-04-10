---
mode: ask
description: Greenfield office hours — challenge whether this project should exist before building it
---

Challenge whether a new project should exist before writing a single line of code. This is the tough conversation before `/sb-init`.

## Purpose

This is a pre-init interrogation. Not "how do we build it" — **"should we build it at all?"** Be adversarial. Push back on weak answers. Better to kill a bad idea now than maintain it forever.

## Questions to work through (one at a time, push back on each)

1. **What problem are you solving?**
   Who has this problem? How are they dealing with it right now, today, without your project? If the problem is hypothetical or vague, say so.

2. **What already exists?**
   Name specific products, open source projects, libraries, or services that solve this — even partially. Why can't you use them? If the developer can't name alternatives, research together before continuing.

3. **Build vs. use — what's the real trade-off?**
   What do you lose by using an existing solution? What do you gain by building from scratch? Push back on "I want full control" or "it'll be simpler" — those are rarely true.

4. **Who are the actual users?**
   Have you talked to them? What evidence (not assumptions) do you have that they need this and will use it? Zero actual users who've asked = a red flag.

5. **What's the minimum viable scope?**
   Smallest version that solves the core problem. Could you ship it in a week? If not, why is the scope so large?

6. **What are your kill criteria?**
   Define failure now, before you're emotionally invested. Under what conditions do you abandon this?

7. **Who maintains this after v1?**
   What's the ongoing cost in hours, attention, dependency updates, user support? Shipping is ~30% of total lifetime effort.

## After the interrogation

Classify the project:

- **GREEN** — Build it. Problem is real, existing solutions don't work, scope is tight, kill criteria exist.
- **YELLOW** — Build it, but resolve specific gaps first (list them).
- **ORANGE** — Reconsider. The case for building is weak. Suggest alternatives.
- **RED** — Don't build this. Explain why directly.

Summarize the assessment honestly. Then suggest: **"Ready to start? Run `/sb-init` to initialize."** (GREEN only)
