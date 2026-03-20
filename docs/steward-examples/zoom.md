---
owner: "Zoom Admin / IT Operations <it-ops@company.com>"
triggers: [zoom, conferencing, meetings, webinar]
file_paths:
  - "**/zoom/**"
  - "**/webhooks/zoom*"
  - "**/integrations/zoom*"
  - "**/oauth/zoom*"
  - "**/meetings/**"
  - "**/recording*"
---

# Zoom — IT Admin Stewardship

Questions and checklist items required by IT Operations before any plan touching
Zoom configuration, integration, or API access proceeds.

---

## Additional Gate Questions

### Q-Zoom-1: OAuth Scopes and Credential Storage

What Zoom OAuth scopes does this change require? Are credentials (OAuth tokens,
API keys, webhook secrets) stored in a secrets manager — not in environment
variables, config files, or version control? If a new OAuth app is being registered,
who is the app owner in the Zoom Marketplace and who holds the approval chain?

### Q-Zoom-2: Admin Role Surface

Does this change require Zoom admin-level privileges to execute or operate?
If so, which admin roles are needed (Account Admin, Role Management, User Management)?
Will admin actions be taken programmatically via API — and if so, is there an
audit log entry strategy for those actions?

### Q-Zoom-3: Recording and Compliance Obligations

Does this change affect meeting recording — creation, access, retention, deletion,
or storage location? If recordings contain PII or are subject to compliance
requirements (HIPAA, legal hold, financial services), what controls govern access?
Who can download or share recordings produced by this integration?

### Q-Zoom-4: Webhook Validation and Security

If this change handles Zoom webhooks, are webhook signatures validated on every
inbound request using the Zoom webhook secret token? What happens if validation
fails — silent drop, 401, alert? Is the endpoint authenticated and rate-limited
to prevent abuse from non-Zoom sources?

### Q-Zoom-5: Data Residency and Retention

Will this integration store any Zoom data (participant metadata, meeting IDs,
join/leave events, recordings) outside of Zoom's infrastructure? If yes, in
what region? What is the retention period and deletion policy? Does storage
location comply with our data residency commitments?

---

## Required Checklist Items

- [ ] Zoom API credentials are stored in the approved secrets manager (not in .env, code, or config files)
- [ ] OAuth scopes are the minimum required — no wildcard or overly broad scopes
- [ ] Webhook endpoints validate Zoom signature headers before processing any payload
- [ ] Admin role usage is logged — API calls using admin credentials produce an audit trail
- [ ] Recording access controls reviewed — recordings are not publicly accessible by default
- [ ] Data residency confirmed — any stored Zoom data is in an approved region
- [ ] Rate limit strategy documented — Zoom API rate limits accounted for at expected call volume
- [ ] IT Ops notified of new Zoom OAuth app registrations before they go live

---

## Approved Patterns

- Using the shared `zoom-client` internal SDK module — pre-approved, handles auth and rate limiting
- Webhook handlers that use the `verifyZoomWebhook(secret, headers, body)` utility
- Recording access via pre-signed URLs with time-bounded expiry (max 24h)
- Zoom user provisioning via SCIM (not manual API calls)

---

## Anti-Patterns

- Storing Zoom OAuth tokens in application config files or environment variables — use secrets manager
- Granting `account:master` scope when a narrower scope suffices
- Trusting inbound webhook payloads without signature validation
- Directly embedding meeting join URLs in emails or logs (exposes auth tokens)
- Using a personal Zoom account's API credentials for production integrations
- Downloading and re-hosting recordings without reviewing retention and access policies first
