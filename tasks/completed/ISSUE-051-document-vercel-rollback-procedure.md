---
id: ISSUE-051
title: Document the Vercel rollback procedure
type: docs
depends_on:
  - ISSUE-048
---

# Document the Vercel rollback procedure

Area: Release rollback and incident recovery

## Goal

Provide a safe, time-bounded procedure for returning the public domain to a known-good Vercel deployment.

## Scope

- Document how to identify the last known-good production deployment and its commit SHA.
- Document Vercel instant rollback, post-rollback smoke verification, and the procedure for restoring normal automatic
  production promotion.
- Explain that an instant rollback reuses the previous deployment and does not rebuild changed environment variables.
- Document the follow-up path for fixing the cause on `main` and promoting the verified correction.
- Avoid adding rollback automation or provider credentials to the repository.

## Acceptance criteria

- An operator can roll back the public domain without rebuilding the application.
- The procedure includes metadata, route, dataset, header, analytics, and user-flow checks after rollback.
- Configuration changes are explicitly checked instead of assumed to be reverted with application code.

## Verification

Compare the runbook with the linked Vercel project's available rollback controls and record any plan, access, or
retention limitation.

## Completion notes

- Added `docs/vercel-rollback.md` with immediate rollback, public smoke verification, configuration recovery, and
  restoration of normal releases.
- Documented that instant rollback does not rebuild changed environment variables.
- Linked the recovery procedure without recording provider credentials or IDs.
- `npx prettier --check docs/vercel-rollback.md` and `git diff --check` passed.
- Live rollback controls remain an operator-only validation and were not invoked.
