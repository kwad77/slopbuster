---
mode: agent
description: Initialize SlopBuster in this project
---

Initialize SlopBuster in this project by creating the `.slopbuster/` directory structure.

## Steps

1. Create `.slopbuster/` if it does not exist.

2. Ask the user:
   - **Project name** — what is this project called?
   - **Core value** — in one sentence, what is the single most important thing this project does?
   - **Stack** — language, framework, database, deployment target?
   - **Team size** — solo, small team, or larger?

3. Create these files (do not overwrite if they already exist):

   **`.slopbuster/PROJECT.md`**
   ```markdown
   # [Project Name]

   ## Core Value
   [One sentence — the single most important thing this project does]

   ## Stack
   [Language, framework, DB, deployment]

   ## Team
   [Size and any relevant context]
   ```

   **`.slopbuster/STATE.md`**
   ```markdown
   # SlopBuster — Project State

   ## Loop Position
   PLAN ○ ──▶ GATE ○ ──▶ APPLY ○ ──▶ UNIFY ○

   ## Current Phase
   None — no phases started yet

   ## Last
   [timestamp] — Initialized

   ## Next
   /sb-plan — create your first constraint-first plan

   ## Decisions
   | Date | Decision | Phase | Notes |
   |------|----------|-------|-------|
   ```

   **`.slopbuster/config.md`**
   ```markdown
   # SlopBuster Config

   gate:
     enabled: true
     file_count_threshold: 5

   enterprise_audit:
     enabled: false
   ```

4. Confirm:
   ```
   ✓ SlopBuster initialized

   .slopbuster/
   ├── PROJECT.md   — project context
   ├── STATE.md     — loop position
   └── config.md    — settings

   Next: /sb-plan — write your first constraint-first plan
   ```
