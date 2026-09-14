---
id: ISSUE-045
title: Add CI quality gates for production checks
type: test
depends_on: []
---

# Add CI quality gates for production checks

Area: Repository validation and release confidence

## Finding

The repository has unit tests and documented local commands, but no tracked CI workflow or automated release gate. Jest
coverage is about 80% statements and 74% branches, while pages and client components are not covered by the Jest suite.
The critical workflows were verified manually in this QA run, but future changes can bypass the checks.

## Expected behaviour

Changes to the application should automatically run the deterministic checks that the README and task workflow require,
and the workflow should fail on lint, type, test, build, dependency audit, or formatting regressions.

## Scope

- Add a tracked GitHub Actions workflow for pushes and pull requests using the documented Node.js baseline and npm cache.
- Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, `npm audit --omit=dev`,
  and `git diff --check` or an equivalent clean-tree check.
- Keep secrets out of the workflow and avoid requiring `HOST` or a Google Analytics ID for validation.
- Document the gate briefly in README if needed.
- Do not add a heavyweight browser binary dependency unless it is separately justified and runnable in CI.

## Severity

Acceptable post-production follow-up. The current branch can be validated manually and no CI failure was reproduced, but
the gap increases regression risk for subsequent releases.

## Verification

Validate the workflow YAML, run every command locally, and confirm the workflow uses the lockfile and the repository's
Node.js engine baseline. Check `git diff --check`.
