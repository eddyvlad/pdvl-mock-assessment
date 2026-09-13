---
id: ISSUE-010
---

# Missing-seed practice URLs return a 404

Area: Practice route entry and seed handling

## Problem

The documented route contract says that a practice URL without a seed should generate a valid six-character base62 seed and redirect to the canonical practice URL. The route is not reachable without the `[seed]` segment, so a learner who follows a paper and module URL without a seed receives a 404 instead of being given a new practice set.

## Steps to reproduce

1. Open `http://localhost:3000/practice/a/m1` in the running application.
2. Observe the response.

The same check can be repeated with another valid module path such as `/practice/b/3b`.

## Expected behaviour

The app should generate a six-character base62 seed, redirect to `/practice/a/m1/<seed>`, and load the first question.

## Actual behaviour

The app stays at `/practice/a/m1` and renders the generic 404 page with "This page could not be found."

## UX and visual observations

The 404 page provides no route-specific recovery action, so the learner must use the navigation or landing page to find a paper again. This is inconsistent with the application's seed-generation behaviour from the paper cards and with the documented route contract.

## Impact and severity

Medium severity. Direct or externally shared module links without a seed cannot start an assessment, although the normal landing-page links include a seed.

## Technical findings

The repository contains the dynamic route at `src/app/practice/[paper]/[module]/[seed]/page.tsx`, which validates and redirects malformed seeds. There is no route page at `src/app/practice/[paper]/[module]/page.tsx` to handle a missing seed.
