# PDVL Mock Assessments

Steady Signal is a lightweight Next.js app for timed PDVL mock tests and practice exams in Singapore. It covers Papers A, B, and C with deterministic, shareable question sets, guided question navigation, answer review, and explanations after submission.

See [AGENTS.md](./AGENTS.md) for full product and behavior specifications.

## How it works

The homepage lets learners choose a paper and start a seeded practice attempt. A six-character base62 seed determines the selected questions and choice order, so the same practice URL reproduces the same set. Attempts are saved in the browser while in progress, and a bare seeded practice URL resumes the active matching attempt when one exists. Move through these routes:

- `/practice/:paper/:module` to generate a new seed and redirect to the canonical practice route.
- `/practice/:paper/:module/:seed` for the guided assessment.
- `/practice/:paper/:module/:seed/review` for checking answers before submission.
- `/practice/:paper/:module/:seed/result` for the score and detailed review.

Attempt IDs are checked against the paper, module, and seed in the URL. A mismatched or unavailable attempt link shows a recovery state instead of applying answers to a different question set.

There is no account or application database. The question pools are versioned static assets, and Google Analytics is optional.

## Passing Criteria

Paper A combines Module 1 (30 questions, 35 minutes) and Module 2 (5 questions, 10 minutes). A minimum of 30 correct answers is required to pass the paper. For example, scoring 24 in Module 1 makes passing impossible, while scoring 25 means Module 2 must be answered perfectly. Module 1 results display "Pending" if your score still allows a pass after Module 2.

Paper B contains 25 questions in 30 minutes and requires 22 correct answers. Paper C contains 15 questions in 15 minutes and requires 12 correct answers.

## Setup

1. Use Node.js 24 or newer.
2. Install dependencies with `npm ci` (or `npm install` when changing dependencies).
3. Copy `.env.example` to `.env` and set `DATASET_VERSION` (defaults to `v2025-09`).
4. Ensure question datasets exist at `public/datasets/${DATASET_VERSION}/`.
5. Optionally set `GOOGLE_ANALYTICS_ID` to a real Google Analytics Measurement ID. Leave it empty to keep analytics disabled.

## Development

- `npm run dev`: start the development server.
- `npm run lint`: run Biome lint checks and verify Markdown/YAML formatting with Prettier.
- `npm run format`: format authored code and configuration files with Biome, then Markdown/YAML files with Prettier.
- `npm run format:check`: check both formatter scopes without changing files.
- `npm test`: run Jest tests.
- `npm run typecheck`: run TypeScript type checks.
- `npm run build`: create a production build.
- `PRODUCTION_URL=https://example.com npm run smoke:production`: check an authorized deployment's public routes,
  metadata, datasets, headers, redirects, and analytics-off configuration.

The repository targets Node.js 24 or newer. Biome owns authored JavaScript,
TypeScript, TSX, CSS, and JSON formatting. Prettier owns tracked Markdown and
YAML files; the formatters do not overlap. Jest uses the SWC transform and
TypeScript type checking runs separately through `npm run typecheck`.

The repository-local agent-state allocator is validated separately with
`node scripts/agent-state.test.mjs`. Reserve a task number immediately before
creating a numbered task file with `scripts/agent-state issue reserve`.

## Production release

The first-release sequence, Vercel settings, environment contract, smoke checks,
rollback, and recovery procedures are documented in
[docs/first-production-release.md](./docs/first-production-release.md). Production
deployment is an explicitly authorized operator action; do not merge to `main`
or run a provider production command as part of local validation.

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
- Homepage title and description are defined in `src/lib/site-metadata.ts` and reused for the canonical and Open Graph metadata.
