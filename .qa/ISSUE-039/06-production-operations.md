# Production operations

## Coverage target

Review production scripts and configuration, Node and package-manager assumptions, dataset caching and error handling,
observability and diagnostics, analytics configuration guards, logging, static asset behaviour, health or smoke checks,
and operational documentation for a small static/client-side assessment application.

## Investigation state

- Status: initial pass complete, remediation required
- Tested or inspected: npm scripts and engine baseline, environment examples, static asset delivery, runtime error state,
  analytics guard, production and development server startup, and operational documentation.
- Evidence: Node v26.6.0 and npm 11.18.0 satisfy the Node >=24 engine; clean install, lint, typecheck, test, build, audit,
  development startup, and root production startup passed. Practice load errors have Retry and Back to landing actions.
- Confirmed findings: production dataset fetch protocol fails for direct HTTP production start and can fail behind a TLS
  terminator without a forwarded-protocol strategy. See [ISSUE-040](../../tasks/backlog/ISSUE-040-production-dataset-fetch-protocol.md).
  There is no tracked CI/release gate or application-owned error monitoring; the former is tracked as acceptable follow-up
  in ISSUE-045 and the latter is an accepted small-app operational risk for this run.
- Unresolved questions: hosting platform, deployment environment variables, alerting destination, and public traffic
  volume are not specified.
- Remediation and verification: protocol fix pending; deployment smoke checks will be repeated after it lands.
