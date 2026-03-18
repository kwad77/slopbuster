# SlopBuster Config

project:
  name: [project-name]
  version: 0.1.0

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

preferences:
  auto_commit: false
  wave_execution: true      # Show wave grouping hints during APPLY
