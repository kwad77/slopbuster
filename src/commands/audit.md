---
allowed-tools: Read, Write
description: Enterprise architectural audit (requires enterprise_audit: enabled in config)
---

Run an enterprise architectural audit on a plan.

Arguments: $ARGUMENTS

First, read `.slopbuster/config.md` and check `enterprise_audit.enabled`.

If false or missing: tell the user this feature is disabled and show how to enable it:
```
/sb:config enterprise_audit.enabled true
```
Then stop — do not run the audit.

If true: follow the workflow at @src/workflows/audit.md
