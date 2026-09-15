# Deployment environment contract

This application has no server database or account system. Production configuration controls the public origin,
static dataset selection, and whether the optional analytics integration is rendered.

## Required values

| Variable              | Production value                                              | Preview and local guidance                                                                                        |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `HOST`                | The single public HTTPS origin used as the canonical site URL | Use the actual preview origin when metadata is being reviewed. Local development may use `http://localhost:3000`. |
| `DATASET_VERSION`     | `v2025-09`                                                    | Use a checked-in dataset version. Do not replace or delete older versions that support shared seeded links.       |
| `GOOGLE_ANALYTICS_ID` | Empty or absent                                               | Keep empty or absent until consent and privacy requirements are deliberately addressed.                           |

`HOST` is consumed by canonical metadata, Open Graph metadata, the sitemap, robots output, and production dataset
protocol handling. It must be set before a production build so generated absolute URLs use the public origin. Do not
leave `https://www.example.com` or a localhost value in a production environment.

## Runtime baseline

- Use Node.js 24 or newer, matching `package.json`.
- Install from `package-lock.json` with `npm ci`.
- Use the repository build command, `npm run build`, which preserves `next build --webpack`.
- Keep `DATASET_VERSION` aligned with the versioned files under `public/datasets/`.

## Handling and verification

- Store provider environment values in the hosting provider or an approved secret manager. Never commit `.env`,
  `.env.local`, provider credentials, or real production values.
- Review production and preview scopes separately. A successful preview does not prove that production has the same
  variables.
- Leave `GOOGLE_ANALYTICS_ID` empty in every environment for the first release. Confirm that the rendered HTML does
  not contain Google Analytics scripts before opening the site to users.
- After changing `HOST` or `DATASET_VERSION`, build again and run the deployment smoke checks against the affected
  environment.
