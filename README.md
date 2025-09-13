# PDVL Mock Assessments

A lightweight Next.js app for practicing PDVL modules. 

See [AGENT.MD](./AGENT.md) for full product and behavior specifications.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATASET_VERSION` (defaults to `v2025-09`).
3. Ensure question datasets exist at `public/datasets/${DATASET_VERSION}/`.

## Development

- `npm run dev` – start the development server.
- `npm run lint` – run ESLint.
- `npm test` – run Jest tests.
- `npm run build` – create a production build.

## Notes

- Question choices use native radio inputs with proper labels for accessibility.
- A theme toggle in the bottom-right lets you switch between system, dark, and light modes; your selection persists in local storage.
