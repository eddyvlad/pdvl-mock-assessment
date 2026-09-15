# Vercel hosting configuration

The repository is linked locally to a Vercel project, but the link is intentionally ignored and provider identifiers
must not be committed. The intended deployment model is Vercel's Git integration with `main` as the production branch
and other branches as previews.

## Expected project settings

| Setting            | Expected value                                          |
| ------------------ | ------------------------------------------------------- |
| Repository         | `eddyvlad/pdvl-mock-assessment`                         |
| Production branch  | `main`                                                  |
| Root directory     | Repository root                                         |
| Framework          | Next.js auto-detection                                  |
| Node.js            | 24 or newer, matching `package.json`                    |
| Install command    | `npm ci` using `package-lock.json`                      |
| Build command      | `npm run build`                                         |
| Output directory   | Vercel default for Next.js                              |
| Configuration file | No `vercel.json` is required by the current application |

The build command must continue to invoke `next build --webpack`. Do not add a second build configuration unless a
concrete provider requirement is identified and verified.

## Environment and domain checks

Configure the values described in [the deployment environment contract](./deployment-environment.md) separately for
Production and Preview. Confirm that the production `HOST` is the single public HTTPS origin, that the active dataset
version is `v2025-09`, and that `GOOGLE_ANALYTICS_ID` is empty or absent in both environments.

Confirm the following in the Vercel project settings:

- The GitHub integration can read the repository and receives updates from `main`.
- Preview deployments do not use production-only values or claim the production canonical origin unintentionally.
- The public domain has valid DNS, TLS, HTTPS redirection, and one agreed canonical hostname.
- The domain is assigned to the Production environment rather than a preview branch.
- Project access is limited to the people who maintain the repository and release process.

## Non-deploying verification

Before an authorized deployment, compare the dashboard settings with this document, `package.json`, `next.config.ts`,
`.env.example`, and the environment contract. Do not run `vercel --prod`, merge to `main`, or create a preview merely
as part of this repository change.

Record the provider settings that were actually observed in the task completion notes. Never record environment values,
tokens, provider project IDs, or credentials.

## References

- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build)
- [Vercel environment variables](https://vercel.com/docs/environment-variables/manage-across-environments)
