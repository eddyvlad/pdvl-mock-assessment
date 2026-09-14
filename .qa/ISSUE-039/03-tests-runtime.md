# Tests and runtime

## Coverage target

Run lint, typecheck, unit/integration tests, production build, clean-install checks, development server smoke checks,
request failures, browser console and network errors where available, and inspect automated coverage gaps against the
critical workflows.

## Investigation state

- Status: verified after remediation
- Tested or inspected: clean install, outdated dependency scan, production and development builds, lint, typecheck,
  Jest tests, coverage, development-server startup, production-server startup, route requests, browser console logs, and
  production bundle inspection.
- Evidence: `npm ci` passed; `npm outdated --json` returned `{}`; `npm audit --omit=dev` and `npm audit` found 0
  vulnerabilities; lint, typecheck, 46 tests, and `npm run build` passed. The webpack production build generated the
  expected static and dynamic routes, and development scenario labels were absent from `.next/server` and `.next/static`.
  Jest coverage was 80.09% statements, 74.19% branches, and 83.63% functions.
- Confirmed findings: pages and client components have no automated Jest coverage, and no tracked CI quality gate exists.
  This is recorded as acceptable post-production follow-up in [ISSUE-045](../../tasks/backlog/ISSUE-045-add-ci-quality-gates.md).
- Unresolved questions: a dedicated browser test harness is not installed; the current manual browser evidence is not a
  substitute for repeatable end-to-end CI coverage.
- Remediation and verification: automated baseline is green after ISSUE-042 through ISSUE-044. The final config test
  covers response headers for pages, practice routes, and datasets. CI follow-up is not release-blocking.
