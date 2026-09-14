---
id: ISSUE-035
title: Migrate linting and formatting to Biome
type: chore
depends_on: []
---

# Migrate linting and formatting to Biome

Area: Development tooling

## Problem

The project currently uses ESLint with `eslint-config-next`. Biome is supported by the installed Next.js generation and can provide both linting and formatting with a smaller, faster toolchain, but the migration must preserve the existing type-checking and build safeguards.

## Expected behaviour

Biome should be the repository's authoritative linter and formatter. Authored application and configuration code should follow the committed Biome configuration, while generated output, assessment datasets, task documents, and dependency lockfiles remain outside the formatting scope.

## Implementation scope

- Add the latest stable compatible `@biomejs/biome` release as a development dependency.
- Replace the `npm run lint` command with `biome check` and add explicit formatting and format-check commands.
- Add a `biome.json` configuration with recommended lint rules, formatter settings, Git ignore support, and exclusions for generated output, datasets, task documents, and `package-lock.json`.
- Format authored TypeScript, TSX, JavaScript, module configuration, and CSS files without changing runtime or dataset content.
- Review the current `eslint-config-next/core-web-vitals` and TypeScript rule coverage before removing it. Preserve applicable correctness and accessibility checks through Biome, TypeScript, the Next.js build, or focused tests.
- Remove `eslint`, `eslint-config-next`, and the obsolete `eslint.config.mjs` configuration.
- Update README development instructions to describe Biome commands.
- Do not change routes, persistence, seeded question selection, scoring, themes, analytics, or the SWC Jest transform.

## Acceptance criteria

- `npm run lint` runs Biome successfully and checks both lint rules and formatting.
- `npm run format` formats the intended authored code and configuration files.
- `npm run format:check` detects formatting drift without modifying files.
- No ESLint package, configuration, or script remains unless a documented compatibility reason requires it.
- Existing Next.js, TypeScript, Jest, and accessibility safeguards remain covered by the replacement tooling and validation commands.
- The application build and test suite remain behaviourally unchanged.

## Verification

1. Record the current ESLint configuration and its enabled diagnostics before removal.
2. Add Biome configuration and scripts, run the formatter on the defined authored-file scope, and inspect the diff for semantic changes.
3. Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --runInBand`, and `npm run build`.
4. Smoke-test the homepage, practice, review, result, Paper A chaining, persistence, and Google Analytics guards.
5. Run `git diff --check` and confirm datasets and task files are unchanged by formatting.

## Severity

Low

## Completion notes

- Replaced ESLint and `eslint-config-next` with Biome 2.5.13.
- Added scoped lint, format, and format-check scripts plus a committed `biome.json`.
- Formatted authored application, test, script, and configuration files while leaving datasets, schema, task documents, and the lockfile outside the formatter scope.
- Preserved the SWC Jest transform, Next.js webpack build, routes, persistence, scoring, themes, analytics, and datasets.
- Verified with `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.
- Interactive browser smoke testing was unavailable because no in-app browser connection was present; direct HTTP checks for the homepage, practice, review, and result routes returned 200 responses.
