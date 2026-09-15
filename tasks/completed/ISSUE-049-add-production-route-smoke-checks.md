---
id: ISSUE-049
title: Add production route smoke checks
type: test
depends_on: []
---

# Add production route smoke checks

Area: Deployment verification

## Goal

Provide a repeatable, dependency-free check for the public deployment before and after the first release.

## Scope

- Add `npm run smoke:production`, backed by a Node.js script using the native `fetch` API and a required
  `PRODUCTION_URL` environment variable.
- Check the homepage, canonical metadata, `/robots.txt`, `/sitemap.xml`, representative seeded practice, review, and
  result routes, dataset assets, missing-seed redirects, and invalid-seed recovery.
- Check the expected security headers, absence of `X-Powered-By`, and absence of Google Analytics markup when analytics
  is disabled.
- Return a non-zero exit status with a useful failure message for any failed check.
- Document the command and keep it separate from CI because it requires a deployed URL.

## Acceptance criteria

- The command passes against an authorized deployment URL and catches incorrect status codes, redirect targets,
  metadata origins, missing datasets, missing headers, and accidental analytics enablement.
- It does not mutate browser attempts, provider settings, or deployment state.
- It uses no new runtime dependency and does not alter application routing or scoring.

## Verification

Unit-test URL and response assertions where practical, run the command against a local production server, and record
the public-host result separately when deployment access is authorized.

## Completion notes

- Added `scripts/production-smoke.cjs` and the `npm run smoke:production` command using Node.js native `fetch`.
- Added unit coverage for URL normalization, canonical URL generation, sitemap parsing, and analytics detection.
- The smoke command validates all configured practice modules, dataset assets, redirects, metadata, sitemap and robots
  output, security headers, and analytics-off markup.
- Local `next build --webpack`, `next start` on port 3101 with `HOST` configured before build, the focused smoke tests,
  and `PRODUCTION_URL=http://localhost:3101 npm run smoke:production` passed.
- Documented the command in README. A public Vercel URL remains an operator-only verification because no deployment was
  authorized.
