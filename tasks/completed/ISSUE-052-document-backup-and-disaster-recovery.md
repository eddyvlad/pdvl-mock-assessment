---
id: ISSUE-052
title: Document backup and disaster recovery
type: docs
depends_on:
  - ISSUE-048
---

# Document backup and disaster recovery

Area: Deployment continuity and recovery

## Goal

Define what must be preserved and how to rebuild the application if the hosting project or deployment history is
unavailable.

## Scope

- Identify Git history, `package-lock.json`, versioned datasets, and retained Vercel deployments as recovery sources.
- Document secure ownership and recovery of the GitHub repository, Vercel project, domain, DNS, and production
  environment values.
- Document a rebuild sequence: restore repository access, recreate or relink the Vercel project, configure the
  environment contract, build from a known commit, and run production smoke checks.
- Preserve older dataset versions so seeded links remain reproducible after recovery.
- State that in-progress and submitted browser `localStorage` attempts are client-local and cannot be backed up or
  restored by the application.
- Define a non-production recovery rehearsal without performing a production deployment in this task.

## Acceptance criteria

- Recovery responsibilities and sources are explicit, including the minimum external access required.
- The procedure does not claim server-side backup of browser attempts or invent a database restore process.
- The recovery sequence ends with route, dataset, metadata, header, and analytics-off verification.

## Verification

Perform a local clean-checkout rebuild rehearsal and review the procedure against the current repository and hosting
link. Record any provider or credential dependency that requires an operator.

## Completion notes

- Added `docs/backup-and-recovery.md` with recovery sources, clean rebuild steps, hosting restoration, and recovery
  rehearsal guidance.
- Documented versioned dataset preservation and the limitation that browser-local attempts cannot be server-backed up.
- Linked the environment, hosting, release, and rollback procedures without recording secrets or provider IDs.
- Local production build and smoke checks passed for the current repository. Live provider recovery remains an
  operator-only exercise and was not performed.
- `npx prettier --check docs/backup-and-recovery.md` and `git diff --check` passed.
