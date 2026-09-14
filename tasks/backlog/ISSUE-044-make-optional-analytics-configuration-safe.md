---
id: ISSUE-044
title: Make optional analytics configuration safe by default
type: chore
depends_on: []
---

# Make optional analytics configuration safe by default

Area: Environment configuration and analytics privacy

## Finding

Google Analytics is correctly guarded in the application when `GOOGLE_ANALYTICS_ID` is absent, and no local measurement
ID is currently configured. However, `.env.example` sets `GOOGLE_ANALYTICS_ID=OPTIONAL`. A direct copy of the example
therefore enables the third-party script with the literal non-ID value instead of leaving analytics disabled until an
owner explicitly configures a measurement ID.

## Expected behaviour

Copying `.env.example` should produce a safe local configuration with analytics disabled. The README and example should
explain how to opt in with a real measurement ID, while preserving the current no-ID guard and event payloads.

## Scope

- Change `.env.example` to use an empty optional value or an equivalent non-enabling convention.
- Clarify the README configuration note without exposing or changing local `.env` values.
- Add a small configuration-level test or static assertion if it fits the existing test approach.
- Do not change analytics event names, parameters, consent/product policy, or the `@next/third-parties` integration.

## Severity

Should fix before production. The current example can accidentally load a third-party analytics script with an invalid
configuration when followed literally, which conflicts with the documented optional analytics behaviour.

## Verification

Verify the no-ID and valid-ID render paths, run lint, typecheck, tests, build, and `git diff --check`. Confirm no
measurement ID or local secret is committed.
