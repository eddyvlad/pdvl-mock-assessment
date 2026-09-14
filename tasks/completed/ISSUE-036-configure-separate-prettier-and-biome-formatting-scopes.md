---
id: ISSUE-036
title: Configure separate Prettier and Biome formatting scopes
type: chore
depends_on: [ISSUE-035]
---

# Configure separate Prettier and Biome formatting scopes

Area: Development tooling

## Problem

The Biome migration establishes Biome as the formatter for authored application and configuration code, but Markdown and YAML files need an explicit formatter policy. The repository also needs one line-width policy and clear script ownership so Prettier and Biome do not format the same files unnecessarily.

## Expected behaviour

- Prettier formats Markdown, `.yml`, and `.yaml` files.
- Biome formats the existing authored code and configuration scope.
- Both formatters use a line width of `120`.
- Each supported file is owned by one formatter, with no unnecessary overlap.
- Existing formatting conventions remain unchanged unless the new line width or formatter ownership requires an adjustment.

## Implementation scope

- Add the current stable Prettier release compatible with the repository's Node.js baseline as a development dependency, and update the lockfile.
- Add Prettier configuration with `printWidth: 120` and no unrelated style changes.
- Add Biome's equivalent `formatter.lineWidth: 120` while preserving its existing indentation, parser, and lint settings.
- Keep Biome's file includes explicit for authored code and configuration files, excluding Markdown and YAML from its formatter scope.
- Define explicit Prettier globs for tracked Markdown, `.yml`, and `.yaml` files. Keep generated and ignored output outside the formatting scope without excluding tracked documentation or task files.
- Update `npm run lint`, `npm run format`, and `npm run format:check` so Biome and Prettier each run against their assigned file types.
- Update the README development instructions to document the formatter ownership and commands.
- Apply the selected formatter to in-scope Markdown and YAML files, preserving content, task frontmatter, and existing repository conventions.
- Do not change application routes, persistence, datasets, scoring, Paper A chaining, themes, analytics, or test behaviour.

## Acceptance criteria

- Prettier is declared as a development dependency and the lockfile is synchronized.
- Prettier configuration sets `printWidth` to `120`.
- Biome configuration sets `formatter.lineWidth` to `120`.
- Biome formats only its explicit code and configuration scope; Prettier formats Markdown and YAML files without unnecessary overlap.
- `npm run format` formats both assigned scopes.
- `npm run format:check` detects drift in both assigned scopes without modifying files.
- `npm run lint` retains Biome lint checks and verifies Prettier formatting for Markdown and YAML files.
- Existing documentation, task frontmatter, source behaviour, datasets, and runtime output remain semantically unchanged.

## Verification

1. Confirm `ISSUE-035` has established the Biome baseline before implementing this task.
2. Record the existing formatter settings and file scopes before changing them.
3. Add Prettier configuration and scripts, set both formatters to the required line width, and inspect the formatting diff for semantic changes.
4. Verify representative TypeScript, TSX, CSS, JSON, Markdown, and YAML paths are handled by the intended formatter only. Use a temporary YAML fixture if the repository has no tracked YAML file at implementation time.
5. Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, and `npm run build`.
6. Run `git diff --check` and confirm no runtime code, question dataset, or task frontmatter changes were introduced beyond the intended formatter configuration and Markdown/YAML formatting.

## Severity

Low

## Completion notes

- Added Prettier 3.9.6 with a 120-column Markdown/YAML configuration and ignore rules for generated output.
- Set Biome's formatter width to 120 and kept its explicit authored-code/configuration scope.
- Updated lint, format, and format-check scripts so Biome and Prettier own separate file types without overlap.
- Formatted the tracked Markdown files that required changes, including the task documents and repository guidance.
- Updated README setup and formatter ownership notes without changing application behaviour or dataset content.
- Verified with `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.
