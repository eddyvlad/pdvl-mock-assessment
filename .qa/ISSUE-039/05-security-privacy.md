# Security and privacy

## Coverage target

Inspect environment and secret handling, client storage trust boundaries, route and input validation, XSS and unsafe
rendering risks, dependency audit state, external requests and analytics data minimization, headers and deployment
defaults, and repository exposure of credentials or machine-local artifacts.

## Investigation state

- Status: verified after remediation, with privacy and hosting limits
- Tested or inspected: tracked-file secret patterns, environment ignore rules, analytics integration and guards, React
  rendering boundaries, route validation, dependency audits, response headers, storage trust boundaries, and third-party
  links.
- Evidence: no credential-like patterns or tracked local environment files were found; React renders dataset strings as
  text; route segments validate against `CONFIG` and seed format; Google Analytics is optional and guarded by a configured
  measurement ID; both npm audits found 0 vulnerabilities.
- Confirmed findings from the initial pass were resolved by [ISSUE-043](../../tasks/completed/ISSUE-043-add-production-security-headers.md)
  and [ISSUE-044](../../tasks/completed/ISSUE-044-make-optional-analytics-configuration-safe.md). The production
  response now includes `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and
  `X-Frame-Options: DENY`, while `X-Powered-By` is absent. `.env.example` leaves analytics disabled until a real ID is
  supplied, and the existing runtime guards and event payloads are unchanged.
- Accepted product risk: a privacy notice or consent policy is not defined. This is an owner or legal decision before
  enabling analytics for public traffic, not an application defect discovered in this run.
- Unresolved questions: hosting-level headers, analytics consent requirements, and the final public origin cannot be
  validated locally.
- Remediation and verification: complete locally. Upstream hosting policy and analytics consent requirements remain
  unvalidated.
