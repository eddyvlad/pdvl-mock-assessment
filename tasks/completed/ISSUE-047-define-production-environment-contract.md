---
id: ISSUE-047
title: Define the production environment contract
type: docs
depends_on: []
---

# Define the production environment contract

Area: Production configuration and privacy safeguards

## Goal

Document the exact environment values and handling rules required for the first production release.

## Context

The application uses `HOST` for canonical URLs and metadata, `DATASET_VERSION` for static question assets, and an
optional `GOOGLE_ANALYTICS_ID`. Analytics must remain disabled until consent and privacy requirements are deliberately
addressed.

## Scope

- Add a deployment environment reference that distinguishes production, preview, and local values.
- Require production `HOST` to be the chosen public HTTPS origin and `DATASET_VERSION` to be `v2025-09`.
- Require `GOOGLE_ANALYTICS_ID` to be empty or absent in production and preview environments.
- Document Node.js 24, `npm ci`, lockfile use, secret handling, redaction, and environment-change verification.
- Preserve `.env`, `.env.local`, and provider credentials outside version control.

## Acceptance criteria

- A release operator can configure the required values without guessing or copying a placeholder domain.
- The documented configuration cannot enable Google Analytics accidentally.
- The environment contract agrees with `.env.example`, `package.json`, README setup notes, and current application code.
- No application behavior, dataset contents, or persisted attempt schema changes.

## Verification

Review the reference against all `process.env` consumers, inspect the tracked example file, and confirm no real
credentials or production values are committed.

## Completion notes

- Added `docs/deployment-environment.md` with production, preview, and local environment guidance.
- Confirmed the documented variables match `HOST`, `DATASET_VERSION`, and `GOOGLE_ANALYTICS_ID` consumers.
- Kept analytics disabled by default and documented provider-side secret handling.
- `npx prettier --check docs/deployment-environment.md` passed after formatting.
