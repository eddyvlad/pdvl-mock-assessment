---
id: ISSUE-017
---

# Result links render an attempt against a mismatched seed

Area: Result-route integrity and shareable attempts

## Problem

The result route accepts an `attempt` query parameter without verifying that the stored attempt belongs to the paper, module, and seed in the current path. A learner can combine a valid completed attempt ID with another valid seed and receive a result page that uses the wrong question set.

## Steps to reproduce

1. Complete any Paper C attempt at `http://localhost:3000/practice/c/4b/QjgayF` and note its `attempt` query value on the result URL. The tested attempt was `c-4b-QjgayF-mtzva27o-wnvgto`.
2. Open a result URL with the same attempt ID but a different valid seed, for example `http://localhost:3000/practice/c/4b/ABC123/result?attempt=c-4b-QjgayF-mtzva27o-wnvgto`.
3. Compare the question content with the original result page.

## Expected behaviour

The route should verify that the stored attempt's paper, module, and seed match the route. A mismatch should show a clear unavailable or invalid-link state, or redirect to the matching canonical result URL.

## Actual behaviour

The result page loads successfully under the new seed, keeps the submitted score and answers from the original attempt, and renders the question set for `ABC123`. In the browser, the original first question was `Name the nearest primary road to Japanese Cemetery`, while the mismatched result showed `What is the nearest taxi stand to Paragon Medical Center? (I point)` with the original answer data applied to it.

## UX and visual observations

The page looks like a normal completed result, including score, topic signals, and detailed review. There is no indication that the attempt and route disagree, so a shared or manually edited link can present a credible but incorrect review.

## Impact and severity

High severity. The defect undermines the correctness of shareable results and can misrepresent which questions the learner answered.

## Technical findings

`src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx` reads the attempt by ID and uses the route's `questions` without checking the stored record's `paper`, `module`, or `seed`. The same consistency check should also be considered for the practice and review routes that accept an attempt ID.
