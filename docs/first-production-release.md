# First production release

This runbook describes the first production release for the Vercel-hosted application. It is intentionally separate from
the application QA record. Do not deploy or merge to `main` as part of repository maintenance without explicit release
authorization.

## 1. Prepare the release commit

Start from the exact commit intended for release and confirm the working tree is clean.

```text
git status --porcelain=v1
npm ci
npm outdated
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
npm audit --omit=dev
npm audit
git diff --check
```

Record the commit SHA and the command results. The `glob` deprecation warning emitted by npm is currently accepted; an
audit failure is not.

## 2. Check repository gates

- Open a pull request targeting `main`.
- Confirm the `quality` GitHub check passes.
- Confirm the `main` branch rule still requires `quality`, enforces administrator checks, and blocks force-pushes and
  branch deletion.
- Do not merge while the required check is missing or failing.

## 3. Check Vercel settings

Before creating or promoting a deployment, compare the project with [the Vercel hosting checklist](./vercel-hosting.md)
and [the environment contract](./deployment-environment.md). In particular, confirm:

- `main` is the Production branch and the repository is the intended GitHub repository.
- The project builds from the repository root with Node.js 24, `npm ci`, and `npm run build`.
- Production `HOST` is the public HTTPS canonical origin.
- `DATASET_VERSION` is `v2025-09`.
- `GOOGLE_ANALYTICS_ID` is empty or absent in Production and Preview.
- The canonical domain, DNS, TLS certificate, HTTPS redirect, and alternate-host behavior are correct.

## 4. Review a preview deployment

After explicit authorization to create a preview, run the public smoke checks against its URL:

```text
PRODUCTION_URL=https://preview.example.com npm run smoke:production
```

Review the homepage, seeded practice routes, review and result routes, dataset assets, redirects, metadata, robots,
sitemap, security headers, and analytics-off result. Manually complete one short standalone attempt and one Paper A
Module 1 to Module 2 chain to confirm answer persistence, review, results, and combined scoring in the deployed runtime.

## 5. Release to Production

After the preview evidence and `quality` check pass, merge the approved release commit into `main`. Vercel's Git
integration creates the Production deployment for the configured branch. Capture the resulting deployment URL and commit
SHA. Do not enable Google Analytics as part of this release.

## 6. Verify the public release

Run the smoke command against the canonical public origin and retain the output with the release record:

```text
PRODUCTION_URL=https://www.example.com npm run smoke:production
```

Also verify the public domain in a browser: landing-page navigation, a standalone assessment, reload and resume, review
submission, results, and Paper A chaining. Check that `/sitemap.xml` contains only the homepage, `/robots.txt` points to
the public sitemap, practice pages remain `noindex, follow`, and no analytics script is rendered.

If any check fails, stop the release and follow [the rollback procedure](./vercel-rollback.md). For loss of the hosting
project or deployment history, follow [the recovery procedure](./backup-and-recovery.md).

## Related tasks

- [ISSUE-045: CI quality gates](../tasks/completed/ISSUE-045-add-ci-quality-gates.md)
- [ISSUE-046: Main branch release gate](../tasks/completed/ISSUE-046-enforce-main-branch-release-gate.md)
- [ISSUE-047: Environment contract](../tasks/completed/ISSUE-047-define-production-environment-contract.md)
- [ISSUE-048: Vercel hosting configuration](../tasks/completed/ISSUE-048-validate-vercel-hosting-configuration.md)
- [ISSUE-049: Production smoke checks](../tasks/completed/ISSUE-049-add-production-route-smoke-checks.md)
- [ISSUE-051: Rollback](../tasks/completed/ISSUE-051-document-vercel-rollback-procedure.md)
- [ISSUE-052: Backup and recovery](../tasks/completed/ISSUE-052-document-backup-and-disaster-recovery.md)
