---
id: ISSUE-034
title: Refresh framework and library dependencies
type: chore
depends_on: []
---

# Refresh framework and library dependencies

Area: Dependency maintenance and development tooling

## Problem

The repository's framework and library versions have not been reviewed against the current stable releases. Several direct dependencies have newer releases, `ts-jest` is not compatible with the planned TypeScript 7 target, and the project does not explicitly document the Node.js baseline required by the refreshed toolchain.

## Expected behaviour

The application should use current stable, mutually compatible framework, runtime, styling, linting, testing, and type-checking packages. A clean install should reproduce the committed lockfile, and all existing application behaviour should remain intact.

## Implementation scope

- Review every direct dependency in `package.json` against the stable npm registry at implementation time and update the manifest and lockfile together.
- The implementation should use these stable releases, subject to confirming they remain available when the task is picked up:
  - Next.js and `@next/third-parties` 16.3.x;
  - React and React DOM 19.3.x;
  - Tailwind CSS and `@tailwindcss/postcss` 4.3.x;
  - `@tailwindcss/typography` 0.5.x;
  - ESLint 9.39.5 and `eslint-config-next` 16.3.x, because the plugin versions bundled by the current Next config do not support ESLint 10;
  - Jest 30.5.x;
  - TypeScript 6.0.3, because the current `typescript-eslint` integration does not support TypeScript 7;
  - Lucide React 1.x;
  - current `@types/node`, `@types/react`, and `@types/react-dom` releases.
- Remove unused `date-fns`.
- Replace `ts-jest` with `@swc/jest`, adding compatible `@swc/core` and `@swc/helpers` packages if TypeScript 7 remains the selected stable target. Keep `tsc --noEmit` as the authoritative type-check command.
- Preserve the existing `next build --webpack` script unless a dependency compatibility check requires a narrowly scoped change.
- If the refreshed Lucide release requires it, keep server-component imports behind a client-only icon boundary without changing visible icon usage.
- Add a Node.js engine requirement of `>=24.0.0` to match the documented baseline.
- Update README setup and development notes to describe the supported Node.js version, clean-install workflow, and any relevant tooling migration.
- Do not change routing, persistence, datasets, scoring, Paper A chaining, themes, or Google Analytics behaviour.

## Acceptance criteria

- Direct dependencies are updated to the latest stable compatible versions confirmed at implementation time, or any intentionally retained package is documented with a reason.
- `package.json` and `package-lock.json` are synchronized and a clean `npm ci` succeeds.
- No unused `date-fns` or incompatible `ts-jest` dependency remains when TypeScript 7 is selected.
- Jest runs the existing suite through the replacement transform, including TypeScript source and any `@/*` aliases.
- ESLint flat configuration continues to lint the repository successfully.
- The existing webpack production build succeeds without experimental framework flags.
- Existing analytics calls, routes, attempt storage, deterministic seeding, datasets, scoring, and Paper A chaining remain behaviourally unchanged.
- README and Node.js engine documentation match the implemented compatibility baseline.
- Production and development builds do not introduce new console errors or client/server component failures.

## Verification

1. Record the stable package versions and compatibility constraints before editing the manifest.
2. Update dependencies and regenerate the lockfile with the repository's npm workflow.
3. Run `npm ci` from a clean dependency state.
4. Run `npm outdated` and review any remaining direct dependency updates.
5. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, and `npm run build`.
6. Run `npm audit --omit=dev` and `npm audit`; document any residual advisories that cannot be resolved without unrelated upgrades.
7. Smoke-test `npm run dev`, representative practice, review, and result routes, Google Analytics guards, and the production start path.
8. Run `git diff --check` and confirm the existing ISSUE-027 through ISSUE-033 backlog files and unrelated working-tree changes remain untouched.

## Severity

Medium

## Completion notes

- Updated Next.js, React, Tailwind CSS, Lucide React, Jest, type packages, and SWC tooling. Removed unused `date-fns` and `ts-jest`.
- Selected ESLint 9.39.5 and TypeScript 6.0.3 as the newest compatible combination. ESLint 10 currently fails with the plugin versions bundled by `eslint-config-next`, and TypeScript 7 is rejected by the current `typescript-eslint` integration.
- Added the Node.js `>=24.0.0` engine requirement, explicit Jest type inclusion, SWC Jest transforms, and README tooling notes.
- `npm ci`, lint, typecheck, 24 Jest tests, webpack build, and the local development-server smoke check passed.
- `npm outdated` reports only the intentionally retained incompatible ESLint 10 and TypeScript 7 majors.
- Audit results contain one moderate production transitive advisory and six total transitive advisories, with no critical findings. No forced audit remediation was applied.
