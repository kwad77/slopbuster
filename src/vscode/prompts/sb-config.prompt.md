---
mode: agent
description: View or modify SlopBuster settings
---

View or modify SlopBuster configuration.

## Config file location

`.slopbuster/config.md` in the current project.

## With no argument — show current config

Read and display the config file contents.

## With argument — update a setting

Parse the argument as `key value` (e.g., `gate.enabled false` or `gate.file_count_threshold 10`).

Supported settings:

| Key | Values | Effect |
|-----|--------|--------|
| `gate.enabled` | `true` / `false` | Disable to auto-clear all gates (logged) |
| `gate.file_count_threshold` | integer | Files threshold that triggers the Gate (default: 5) |
| `enterprise_audit.enabled` | `true` / `false` | Enable the enterprise audit workflow |

Update the relevant line in `config.md`. Show before/after.

**If disabling the gate:** warn prominently.
```
⚠ Gate disabled. Plans will auto-clear without interrogation.
  This bypasses the constraint-first enforcement mechanism.
  Re-enable with: /sb-config gate.enabled true
```

## Config file format

```markdown
# SlopBuster Config

gate:
  enabled: true
  file_count_threshold: 5

enterprise_audit:
  enabled: false
```
