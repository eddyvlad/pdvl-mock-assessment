# Security and privacy

## Coverage target

Inspect environment and secret handling, client storage trust boundaries, route and input validation, XSS and unsafe
rendering risks, dependency audit state, external requests and analytics data minimization, headers and deployment
defaults, and repository exposure of credentials or machine-local artifacts.

## Investigation state

- Status: initial pass complete, hardening required
- Tested or inspected: tracked-file secret patterns, environment ignore rules, analytics integration and guards, React
  rendering boundaries, route validation, dependency audits, response headers, storage trust boundaries, and third-party
  links.
- Evidence: no credential-like patterns or tracked local environment files were found; React renders dataset strings as
  text; route segments validate against `CONFIG` and seed format; Google Analytics is optional and guarded by a configured
  measurement ID; both npm audits found 0 vulnerabilities.
- Confirmed findings: no application-owned security response headers are configured, and `X-Powered-By: Next.js` is
  exposed. See [ISSUE-043](../../tasks/backlog/ISSUE-043-add-production-security-headers.md). A privacy notice or consent
  policy is not defined, which requires an owner or legal decision before enabling analytics for public use. The safe
  example-value aspect is tracked in [ISSUE-044](../../tasks/backlog/ISSUE-044-make-optional-analytics-configuration-safe.md).
- Unresolved questions: hosting-level headers, analytics consent requirements, and the final public origin cannot be
  validated locally.
- Remediation and verification: security header and analytics configuration tasks pending.
