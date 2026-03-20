# Domain Steward Intake Form
### Zoom / Conferencing — IT Admin

*Fill this out and hand it to a developer or SlopBuster admin. They'll convert it
into a steward file that automatically injects your questions into every AI-assisted
code review that touches your domain. You do not need to know how to code to complete
this form.*

---

## Section 1 — Who owns this domain?

**Your name and team:**
> Zoom Admin / IT Operations

**Contact email (for escalations):**
> it-ops@company.com

**Backup contact if you're unavailable:**
> *(e.g., helpdesk@company.com)*

---

## Section 2 — When should your questions appear?

Your questions will fire automatically when a code change touches your domain.
Tell us what words or file locations should trigger them.

**Keywords that signal your domain is involved**
*(What words in a plan description would make you want to be consulted?)*

> zoom, conferencing, meetings, webinar, recording, video call

**File or folder patterns that signal your domain**
*(If you know specific folders — e.g., anything in /integrations/zoom/ — list them.
If you're not sure, leave blank and a developer will fill this in.)*

> - Anything in a folder called "zoom"
> - Files with "webhook" and "zoom" in the name
> - Files with "recording" in the name
> - Anything in a "meetings" folder

---

## Section 3 — Your Gate Questions

These are the questions developers must answer before their AI assistant executes
any plan in your domain. Think: *"What do I always wish someone had asked before
they broke something in my area?"*

Write up to 5 questions. Plain English is fine — a developer will format them.

**Question 1** *(most important first)*

> What Zoom API credentials or OAuth tokens are being used, and where are they stored?
> Are they in a proper secrets manager, or could they end up in a config file or
> code by accident?

**Question 2**

> Does this change need Zoom admin access to run? If so, which admin permissions
> specifically? And will there be a log of what the admin account did?

**Question 3**

> Does this touch recordings in any way — creating them, accessing them, storing
> them, or deleting them? If so, who will be able to access those recordings,
> and are there any legal or compliance requirements we need to follow?

**Question 4**

> If this code receives messages from Zoom (webhooks), is it checking that the
> messages actually came from Zoom and haven't been tampered with?

**Question 5**

> Will this integration store any Zoom data — like participant names, meeting IDs,
> or recordings — outside of Zoom itself? If yes, where, for how long, and who
> can access it?

---

## Section 4 — Your Checklist

These are items that must be confirmed before any work in your domain is considered
complete. Think of these as your sign-off requirements.

*List them as plain statements — e.g., "Zoom API keys are stored in our secrets manager, not in code."*

> - Zoom API credentials are in the secrets manager, not in code or config files
> - The API only requests the minimum permissions needed — no broad or admin-level access unless specifically required
> - Any webhook endpoint checks Zoom's signature before trusting the message
> - Any admin-level API actions are logged so we can audit what happened
> - Recordings can't be accessed by the public by default
> - Any Zoom data we store is in an approved region and we know when it gets deleted
> - We've thought through what happens if Zoom's API rate limits us at peak usage
> - IT Ops has been told about any new Zoom app registrations before they go live

---

## Section 5 — Pre-approved Approaches

Are there specific tools, libraries, or methods your team has already vetted that
developers should use? Listing these means the checklist is lighter for those
approaches.

> - Use the company's shared `zoom-client` library — it handles auth and rate limiting correctly
> - Webhook handlers that use our `verifyZoomWebhook()` function
> - Time-limited pre-signed URLs for recording access (expire within 24 hours)
> - Zoom user provisioning via SCIM, not manual API calls

*(Leave blank if you're not sure — this section is optional)*

---

## Section 6 — Red Flags

What approaches have caused problems in the past, or that you'd want developers
warned about even if they're not strictly blocked?

> - Storing Zoom tokens in environment variable files or application config — they can end up in version control
> - Requesting "account:master" API scope when a narrower permission would work
> - Trusting webhook payloads without checking the Zoom signature
> - Embedding meeting join URLs directly in emails or log files — they contain auth tokens
> - Using someone's personal Zoom account credentials for a production integration
> - Downloading recordings without first checking who's allowed to access them

---

## Section 7 — Anything else?

*Is there anything about your domain that trips people up, or that you always end
up explaining after the fact? Write it here in plain language.*

> *(Optional — free text)*

---

*Once complete, return this form to your SlopBuster admin or the developer leading
the integration. They will create `.slopbuster/stewards/zoom.md` from your answers
and enable it in the project config.*
