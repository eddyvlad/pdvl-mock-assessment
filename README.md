# PDVL Mock Assessments

A lightweight Next.js app for practicing PDVL modules.

See [AGENTS.md](./AGENTS.md) for full product and behavior specifications.

## Passing Criteria

Paper A combines Module 1 (30 questions) and Module 2 (5 questions). A minimum of 30 correct answers is required to pass the paper. For example, scoring 24 in Module 1 makes passing impossible, while scoring 25 means Module 2 must be answered perfectly. Module 1 results display "Pending" if your score still allows a pass after Module 2.

## Setup

1. Use Node.js 22.5 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `DATASET_VERSION` (defaults to `v2025-09`).
4. Ensure question datasets exist at `public/datasets/${DATASET_VERSION}/`.

## Development

- `npm run dev` – start the development server.
- `npm run lint` – run ESLint.
- `npm test` – run Jest tests.
- `npm run typecheck` – run TypeScript type checks.
- `npm run build` – create a production build.

The repository-local agent-state allocator is validated separately with
`node scripts/agent-state.test.mjs`. Reserve a task number immediately before
creating a numbered task file with `scripts/agent-state issue reserve`.

## Search metadata and indexing

Set `HOST` to the public HTTPS origin before deploying. The default value is
intended for local development, and the example value must be replaced with
the site's actual domain. The homepage uses this origin for its canonical URL,
Open Graph URL, sitemap, and robots file.

The homepage is indexable. Assessment, review, and result routes under
`/practice` return `noindex, follow` so seeded attempts remain shareable without
becoming search landing pages. The sitemap contains the homepage only.

After deployment, check the homepage, `/sitemap.xml`, and `/robots.txt` on the
public origin. Use Google Search Console URL Inspection to check homepage
indexability and Google's selected canonical, then request a recrawl. After
recrawling, confirm representative `/practice` URLs are excluded because of
`noindex`. Record homepage impressions, clicks, and relevant PDVL queries over
comparable periods when reviewing the result.

When configured on the development machine, Codebase Memory MCP uses ignored
project-local configuration and a shared cache outside this repository. It is
scoped to this repository and is not a committed application dependency.

## Notes

- Question choices use native radio inputs with proper labels for accessibility.
- A theme toggle in the bottom-right lets you switch between system, dark, and light modes; your selection persists in local storage.
