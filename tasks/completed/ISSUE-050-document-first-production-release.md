---
id: ISSUE-050
title: Document the first production release
type: docs
depends_on:
  - ISSUE-045
  - ISSUE-047
  - ISSUE-048
  - ISSUE-049
---

# Document the first production release

Area: Production deployment procedure

## Goal

Create a single release runbook that takes the repository from a verified commit to a controlled first production
release without relying on conversation history.

## Scope

- Document the preflight sequence: clean checkout, `npm ci`, dependency audit, lint, typecheck, tests, build, and
  `git diff --check`.
- Document pull request CI, preview review, production branch merge, Vercel promotion, and post-release smoke checks.
- Link the environment contract, Vercel configuration, smoke command, rollback procedure, and recovery procedure.
- Include checks for canonical metadata, robots and sitemap output, dataset loading, security headers, disabled
  analytics, and representative user flows.
- State clearly that production deployment remains an explicitly authorized operator action.

## Acceptance criteria

- A release operator can follow the runbook from a commit SHA and identify the evidence required at each gate.
- The documented sequence does not bypass the required `quality` check or enable analytics.
- The runbook has no credentials, provider IDs, or environment values that should remain secret.

## Verification

Walk through the runbook against the current repository and confirm every command, route, environment name, and task
link is accurate. Record any provider-only step that cannot be executed locally.

## Completion notes

- Added `docs/first-production-release.md` covering clean-commit preflight, CI gates, Vercel configuration, authorized
  preview review, production release, post-release smoke checks, rollback, and recovery.
- Linked the runbook from README and preserved the no-deploy boundary.
- Included the explicit analytics-off requirement and the accepted npm `glob` warning.
- `npx prettier --check docs/first-production-release.md README.md` and `git diff --check` passed.
- Provider-only preview and production checks remain pending until deployment is explicitly authorized.
- Rollback and recovery links now resolve to the completed ISSUE-051 and ISSUE-052 documents.
