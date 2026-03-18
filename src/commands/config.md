---
allowed-tools: Read, Write
description: View or modify SlopBuster settings
---

View or modify SlopBuster configuration.

Arguments: $ARGUMENTS

1. Read `.slopbuster/config.md`
2. If no arguments: display the current config with a plain-language explanation of each setting
3. If arguments specify a change (e.g. `gate.enabled false`, `enterprise_audit.enabled true`): apply the change and confirm

Settings reference:

| Setting | Default | Description |
|---------|---------|-------------|
| `gate.enabled` | true | Enable/disable the Gate entirely (not recommended to disable) |
| `gate.thresholds.file_count` | 5 | Files modified threshold that triggers the Gate |
| `gate.thresholds.new_dependencies` | true | Fire on new external packages or services |
| `gate.thresholds.database_schema` | true | Fire on schema, migration, or ORM model changes |
| `gate.thresholds.api_contract` | true | Fire on endpoint or shared utility contract changes |
| `gate.thresholds.auth_session` | true | Fire on auth, session, or permission changes |
| `enterprise_audit.enabled` | false | Enable /sb:audit command |
| `preferences.auto_commit` | false | Auto-commit after UNIFY completes |
| `preferences.wave_execution` | true | Show wave grouping hints during APPLY |

4. After applying a change: show the updated setting and its new value. No restart required — changes take effect on the next command run.
