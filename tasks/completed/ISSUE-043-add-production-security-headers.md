---
id: ISSUE-043
title: Add baseline production security headers
type: chore
depends_on: []
---

# Add baseline production security headers

Area: Production HTTP hardening

## Finding

The local production and development responses expose `X-Powered-By: Next.js` and do not set application-owned
security headers such as `X-Content-Type-Options`, `Referrer-Policy`, or a frame-embedding policy. There is no tracked
Next configuration defining a deliberate header baseline. The application has no authenticated or server-data flow, but
these defaults leave avoidable browser hardening to the hosting platform.

## Expected behaviour

Production responses should carry a documented, compatible baseline for this static/client-side assessment application,
including protection against MIME sniffing, unnecessary referrer leakage, and unwanted framing. The configuration must
not block required Next.js assets or the optional Google Analytics integration. Framework disclosure should be disabled
where supported.

## Scope

- Add or update the tracked Next.js configuration with the selected headers and concise comments or README notes.
- Preserve `next build --webpack`, route behaviour, static dataset delivery, analytics guards, and existing metadata.
- Do not introduce a broad Content Security Policy without verifying all required scripts and documenting its policy.
- Add a focused response-header verification or configuration test where practical.

## Severity

Should fix before production. No exploit was reproduced in this unauthenticated app, but the missing baseline is a
preventable deployment hardening gap.

## Verification

Run lint, typecheck, tests, build, and a production-server header smoke check for `/`, `/practice`, and a dataset asset.
Confirm the optional analytics path still renders when configured and that no required asset is blocked.

## Completion notes

- Added `next.config.ts` with `poweredByHeader: false` and a catch-all response baseline for MIME sniffing,
  referrer leakage, and unwanted framing.
- Added config-level coverage for the homepage, practice route, and static dataset asset.
- Verified optional analytics remains application-controlled and no Content Security Policy was introduced without
  a complete script inventory.
- Verification: focused config test passed, full suite (10 suites, 46 tests), lint, typecheck, webpack build, and
  `git diff --check` passed. A fresh production server returned 200 with all three headers for `/`, the practice
  route, and the dataset asset, with no `X-Powered-By` header. Upstream hosting overrides remain unvalidated.
