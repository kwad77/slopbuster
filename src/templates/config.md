# SlopBuster Config

gate:
  enabled: true
  thresholds:
    file_count: 5           # Fire if plan modifies > N distinct files
    new_dependencies: true  # Fire on new external packages or services
    database_schema: true   # Fire on schema, migration, or ORM model changes
    api_contract: true      # Fire on API contract or shared utility changes
    auth_session: true      # Fire on auth, session, or permission changes

enterprise_audit:
  enabled: false

routing:
  enabled: false            # Set true to activate risk-tier routing
  # When enabled, plans are routed based on risk_tier before APPLY can proceed.
  # Fill in team names, Slack handles, or email aliases — these are display values.
  # Enforcement is advisory until Goal 2 (SSO/identity) is implemented.
  low:      auto            # LOW tier — proceeds automatically
  medium:   auto            # MEDIUM tier — developer self-approves
  high:     ""              # HIGH tier — team or individual who must approve (e.g. "arch-review@company.com")
  critical: ""              # CRITICAL tier — senior sign-off required (e.g. "cto@company.com")
  # Future: SSO integration will bind these to authenticated identities.
  # Today: populates approved_by in PLAN.md as a documented record.

stewards:
  enabled: false            # Set true to activate domain stewardship import at Gate time
  directory: .slopbuster/stewards/
  auto_import: true         # Auto-detect domain matches from trigger signals and file paths

preferences:
  auto_commit: false
  wave_execution: true      # Show wave grouping hints during APPLY
