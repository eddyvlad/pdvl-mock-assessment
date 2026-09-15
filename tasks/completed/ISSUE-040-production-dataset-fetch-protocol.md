---
id: ISSUE-040
title: Make production dataset fetches work with the served protocol
type: bug
depends_on: []
---

# Make production dataset fetches work with the served protocol

Area: Production runtime and dataset loading

## Finding

The production server can serve the homepage, but practice pages fail to load their question set when the server is
started with the documented local HTTP origin. `src/lib/practice-data.ts` derives the host from request headers and
hard-codes `https` whenever `NODE_ENV` is not `development`.

## Reproduction

1. Build the application with `npm run build`.
2. Start it with `HOST=http://localhost:3001 npm run start -- -p 3001`.
3. Open `http://localhost:3001/practice/b/3b/000000`.

Observed: the homepage returns 200, while the practice page renders `The question set could not be loaded`. The server
attempts to fetch the local dataset over HTTPS even though the server is serving HTTP.

## Expected behaviour

Dataset requests should use the effective served protocol in local production, staging, reverse-proxy, and HTTPS
production deployments. The implementation must not regress the existing friendly load-error state or dataset version
selection.

## Scope

- Update the server-side dataset URL construction in `src/lib/practice-data.ts` or a small adjacent helper.
- Prefer an explicit forwarded protocol when a trusted reverse proxy provides one, with a safe local fallback.
- Preserve the existing route validation, deterministic sampling, dataset paths, and development behaviour.
- Add focused unit coverage for protocol selection and keep the current load-failure handling.

## Acceptance criteria

- `HOST=http://localhost:3001 npm run start -- -p 3001` loads a representative practice page and its questions.
- A request served behind an HTTPS proxy continues to load the dataset over HTTPS.
- Invalid or unavailable datasets still produce the friendly Retry and Back to landing state.
- No user-controlled input becomes an arbitrary external fetch target beyond the existing deployment host contract.

## Severity

Should fix before production. The current protocol assumption makes the documented production start smoke test fail and
can break deployments that terminate TLS outside the Node process.

## Verification

Run focused tests, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and the HTTP
production-server reproduction above. Check `git diff --check`.

## Completion notes

- Added a validated dataset protocol helper that preserves development HTTP behaviour, accepts the first trusted
  `X-Forwarded-Proto` value outside development, and falls back to the protocol in `HOST` before defaulting to HTTPS.
- Added coverage for forwarded protocols, local HTTP production configuration, invalid configuration fallback, and
  friendly fetch failure handling.
- Verified with 39 passing tests, lint, typecheck, production build, `git diff --check`, and
  `HOST=http://localhost:3001 npm run start -- -p 3001`. The representative Paper B practice route returned 200 and
  rendered question content.
