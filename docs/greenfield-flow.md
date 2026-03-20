# Greenfield Workflow

Starting a new project with SlopBuster governance from day one.

```mermaid
flowchart TD
    classDef cmd     fill:#2563EB,stroke:#1D4ED8,color:#fff
    classDef gate    fill:#EA580C,stroke:#C2410C,color:#fff
    classDef decide  fill:#7C3AED,stroke:#6D28D9,color:#fff
    classDef art     fill:#059669,stroke:#047857,color:#fff
    classDef steward fill:#DC2626,stroke:#B91C1C,color:#fff
    classDef cap     fill:#1E293B,stroke:#0F172A,color:#fff
    classDef auto    fill:#16A34A,stroke:#15803D,color:#fff

    START(["🌱  New Project"]):::cap

    subgraph SETUP ["  Setup — runs once  "]
        INSTALL["npx slopbuster\nauto-detects Claude Code · VS Code · Cursor"]:::cmd
        INIT["/sb:init\nProject name · core value · phases\nSteward files for domain teams"]:::cmd
        INSTALL --> INIT
    end

    subgraph PLAN_LOOP ["  Plan → Gate → Apply → Unify  "]
        DISCUSS["/sb:discuss\nSurface assumptions\nbefore writing anything"]:::cmd

        PLAN["/sb:plan\nConstraint-first plan\nGate thresholds evaluated"]:::cmd

        THRESH{"Gate triggers\nfire?"}:::decide

        AUTOCLEAR(["✅  Auto-cleared  ·  LOW risk\nNo questions needed"]):::auto

        GATE["/sb:gate  ·  Circuit Breaker\n5 architectural questions\nConnectivity · Performance · Concurrency\nSecurity · Rollback"]:::gate

        STEWARD{"Domain stewards\nconfigured?"}:::decide

        STEWARD_Q["Steward questions injected\nDBA · Security · Payments · Network\nDomain experts own these questions"]:::steward

        RISK{"Risk tier"}:::decide

        RISK_LOW["🟢  LOW / MEDIUM\nProceed"]:::auto
        RISK_HIGH["🟠  HIGH\nTeam lead review\napproved_by required"]:::gate
        RISK_CRIT["🔴  CRITICAL\nARB escalation\napproved_by required"]:::steward

        RECORD[("records/ · Change Record written\nStandalone · downloadable\nQ1–Q5 verbatim · auth chain · hash")]:::art

        APPLY["/sb:apply\nExecute wave by wave\nConstrained by your answers"]:::cmd

        CHECKPOINT{"Checkpoint\nhit?"}:::decide
        PAUSE["/sb:pause  →  /sb:resume\nFull context restored\nanytime · any session"]:::cmd

        UAT{"UAT\npasses?"}:::decide
        FIX["/sb:fix\nIssues get their own\nplan + gate clearance"]:::cmd

        UNIFY["/sb:unify\nReconcile plan vs actual\nSUMMARY.md written · loop closed"]:::cmd

        MORE{"More plans\nthis phase?"}:::decide
    end

    MILESTONE["/sb:export  ·  /sb:milestone complete\nCompliance evidence pack written\nSOC 2 · HIPAA · FedRAMP"]:::art

    DONE(["🏁  Phase complete"]):::cap

    START --> SETUP
    INIT --> DISCUSS
    DISCUSS --> PLAN
    PLAN --> THRESH

    THRESH -- "No triggers" --> AUTOCLEAR
    THRESH -- "Triggers fire" --> GATE

    AUTOCLEAR --> RECORD

    GATE --> STEWARD
    STEWARD -- "Yes" --> STEWARD_Q --> RISK
    STEWARD -- "No" --> RISK

    RISK -- "LOW · MED" --> RISK_LOW --> RECORD
    RISK -- "HIGH" --> RISK_HIGH --> RECORD
    RISK -- "CRITICAL" --> RISK_CRIT --> RECORD

    RECORD --> APPLY

    APPLY --> CHECKPOINT
    CHECKPOINT -- "Yes" --> PAUSE --> APPLY
    CHECKPOINT -- "No" --> UAT

    UAT -- "Fails" --> FIX --> PLAN
    UAT -- "Passes" --> UNIFY

    UNIFY --> MORE
    MORE -- "Yes" --> PLAN
    MORE -- "Phase done" --> MILESTONE --> DONE
```

## What this shows

| Stage | What happens |
|-------|-------------|
| **Setup** | One-time install + init. Steward files for domain teams set up here — not retrofitted later. |
| **Discuss** | Surface assumptions before the plan is written. Cheaper to catch gaps here than mid-apply. |
| **Plan** | Gate thresholds evaluated against what you said you'd build. Simple plans auto-clear. |
| **Gate** | 5 architectural questions + active steward questions. Answers are verbatim — never summarized. |
| **Risk tier** | LOW/MEDIUM proceed. HIGH routes to team lead. CRITICAL goes to ARB before apply. |
| **Change Record** | Written at gate clearance. Standalone document — shareable, downloadable, future ServiceNow/Jira target. |
| **Apply** | Executes against your answers, not the AI's assumptions. Checkpointed — safe to pause and resume. |
| **Unify** | Closes the loop. Documents what changed vs what was planned. Compliance evidence exportable. |
