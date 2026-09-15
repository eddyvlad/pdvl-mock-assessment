# Backup and disaster recovery

The application is stateless from the server's perspective. Recovery protects the code, static datasets, deployment
configuration, and public domain. It does not provide server-side recovery for browser-local assessment attempts.

## Recovery sources

- GitHub repository history, including the release commit and `package-lock.json`.
- Versioned files under `public/datasets/`, including `v2025-09` and any future versions. Existing versions must not be
  overwritten or deleted while seeded links may still reference them.
- Retained Vercel deployments and their commit SHAs.
- The hosting environment contract and the approved secret manager record for production values.
- Ownership and recovery access for GitHub, Vercel, the domain registrar, and DNS.

Keep provider credentials, environment values, and recovery codes in the provider or approved secret manager. Do not
copy them into this repository or into an incident ticket.

## Rebuild procedure

1. Restore access to the GitHub repository and identify the last known-good commit.
2. Clone or relink the repository and confirm the required dataset version is present.
3. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, the audits, and
   `git diff --check` from that commit.
4. Recreate or relink the Vercel project using the settings in [the hosting checklist](./vercel-hosting.md).
5. Configure `HOST`, `DATASET_VERSION`, and analytics-off values from [the environment contract](./deployment-environment.md).
6. Restore the public domain, DNS, TLS, and HTTPS behavior.
7. Run `PRODUCTION_URL=https://www.example.com npm run smoke:production` against the authorized environment.
8. Complete the browser checks in [the first-release runbook](./first-production-release.md) before restoring normal
   releases.

Do not use a recovery rebuild to bypass the protected `main` branch or the `quality` check.

## Browser-local attempt data

In-progress and submitted attempts are stored in each learner's browser `localStorage`. They are not present in the
GitHub repository, Vercel deployment, or an application database. A hosting recovery cannot restore those records. A
learner whose browser data is lost must begin a new attempt, while a preserved seed and dataset version continue to
reproduce the same question set.

## Recovery rehearsal

At a suitable interval, rehearse the source rebuild from a clean checkout and verify the complete local check sequence.
When deployment access is explicitly authorized, use a non-production preview or separate recovery project to verify
provider relinking, environment setup, domain configuration, and the production smoke command. Never use the rehearsal
to alter the live production domain.

For a live incident, use [the Vercel rollback procedure](./vercel-rollback.md) first when a known-good deployment is
available.
