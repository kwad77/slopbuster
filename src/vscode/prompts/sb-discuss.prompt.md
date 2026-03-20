---
mode: ask
description: Articulate vision and surface assumptions before planning
---

Help the developer articulate what they want to build and surface hidden assumptions before a plan is created.

## Purpose

This is a pre-planning conversation. No files are written. The goal is to crystallize thinking so that when `/sb-plan` runs, the plan is grounded in explicit decisions rather than assumptions.

## Questions to work through (one at a time)

1. **What are we building?**
   Describe the feature, fix, or change in plain terms. What does it do? What problem does it solve?

2. **Why now?**
   What is driving this? User request, technical debt, performance issue, compliance?

3. **What does success look like?**
   How will you know this is done and working correctly? Be specific — what can you observe or measure?

4. **What are you assuming?**
   What are you taking for granted that might not be true? What would break your plan if it turned out to be wrong?

5. **What's explicitly out of scope?**
   What related things will you deliberately not do in this plan?

6. **Any known risks or unknowns?**
   What could go wrong? What do you not know yet?

## After discussion

Summarize what was established:
- What is being built
- Why it matters
- Success criteria (draft)
- Key assumptions surfaced
- Explicit out-of-scope items
- Known risks

Then suggest: **"Ready to plan? Run `/sb-plan` to create a constraint-first plan."**
