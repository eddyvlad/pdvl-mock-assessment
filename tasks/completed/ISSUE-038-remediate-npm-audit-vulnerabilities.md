---
id: ISSUE-038
title: Remediate npm audit vulnerabilities
type: chore
depends_on: []
---

# Remediate npm audit vulnerabilities

Area: Dependency security

## Problem

The dependency tree still contains transitive npm audit findings after the framework and lint-tool refresh. These
findings should be removed through compatible dependency updates while preserving the application runtime and build
configuration.

## Expected behaviour

The project should have no known vulnerabilities in development or production dependency audits, and a clean install
should reproduce the committed lockfile.

## Implementation scope

- Inspect `npm audit`, `npm audit --omit=dev`, and `npm outdated` against the post-Biome dependency graph.
- Update TypeScript and other direct dependencies only when a compatible stable release is required to resolve the
  findings or keep the supported toolchain current.
- Refresh transitive packages through compatible lockfile updates or `npm audit fix`; do not use `--force` or accept
  unrelated major-version changes without a documented compatibility reason.
- Remove unnecessary dependency overrides or workarounds if the refreshed graph no longer needs them.
- Preserve Next.js webpack builds, SWC Jest transforms, Biome and Prettier scripts, routes, persistence, datasets,
  scoring, Paper A chaining, themes, and analytics.
- Update README dependency or security-maintenance notes only where the final commands or supported versions change.
- Add concise completion notes and keep this task separate from application feature changes.

## Acceptance criteria

- `npm audit --omit=dev` reports zero vulnerabilities.
- `npm audit` reports zero vulnerabilities, or any remaining advisory has a documented upstream blocker and mitigation.
- `npm outdated` is reviewed and direct dependency choices are recorded in the completion notes.
- `npm ci` succeeds from the committed lockfile.
- Lint, formatting, typecheck, tests, build, and `git diff --check` pass.
- No runtime, dataset, scoring, persistence, routing, theme, or analytics behaviour changes are introduced.

## Verification

1. Record the pre-change audit and outdated reports and inspect each advisory's dependency path.
2. Apply compatible updates without forced major upgrades, then run a clean install.
3. Re-run both audit modes and confirm the resolved package paths.
4. Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --runInBand`, and `npm run build`.
5. Run `git diff --check` and confirm only dependency metadata, documentation, and this task's lifecycle state changed.

## Severity

High

## Completion notes

- Updated the direct TypeScript dependency from 6.0.3 to 7.0.2.
- Refreshed the compatible transitive dependency graph with `npm audit fix` without using forced upgrades.
- `npm outdated --json` returned no remaining outdated direct dependencies after the refresh.
- `npm ci` completed successfully from the committed lockfile.
- Both `npm audit --omit=dev` and `npm audit` report zero vulnerabilities.
- Verified with `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.
- No application, dataset, route, persistence, scoring, theme, or analytics changes were made.
