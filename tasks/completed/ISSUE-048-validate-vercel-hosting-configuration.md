---
id: ISSUE-048
title: Validate Vercel hosting configuration
type: chore
depends_on:
  - ISSUE-047
---

# Validate Vercel hosting configuration

Area: Vercel hosting and release configuration

## Goal

Confirm that the linked Vercel project can build and serve the application using the intended production settings.

## Context

The repository contains an ignored `.vercel` link but no tracked `vercel.json`. The application intentionally preserves
Next.js auto-detection and `next build --webpack`, so the hosting settings must be checked against the repository
scripts instead of replaced with a second build configuration.

## Scope

- Verify the project is linked to `eddyvlad/pdvl-mock-assessment` and uses `main` as its production branch.
- Verify preview deployments are associated with non-production branches and the GitHub integration has the required
  repository access.
- Verify the project root, Next.js framework detection, Node.js 24 runtime, npm installation, and `npm run build`.
- Verify production and preview environment-variable scopes follow ISSUE-047.
- Verify the canonical domain, DNS, TLS certificate, HTTPS redirect, and alternate-domain behavior.
- Record settings and verification evidence without committing provider IDs, credentials, or generated `.vercel` files.

## Acceptance criteria

- Vercel settings match the repository's Node, npm, build, dataset, host, and analytics contracts.
- No untracked provider configuration is required to reproduce the intended build.
- Domain and HTTPS behavior are explicitly verified or recorded as an external operator prerequisite.
- No production or preview deployment is created without explicit authorization.

## Verification

Inspect the Vercel dashboard or authenticated read-only provider settings, compare them with the repository, and record
any unavailable access precisely in the task completion notes.

## Completion notes

- Added `docs/vercel-hosting.md` with the intended Vercel project, build, environment, domain, and access settings.
- Confirmed the repository contains an ignored `.vercel` link and no tracked `vercel.json`; the documented configuration
  preserves Next.js auto-detection and `npm run build`.
- No Vercel CLI or authenticated provider session was available for live dashboard verification in this run.
- Domain, DNS, TLS, GitHub integration, environment scopes, and project access remain explicit operator checks before
  the first deployment. No deployment was created.
- `npx prettier --check docs/vercel-hosting.md` passed.
