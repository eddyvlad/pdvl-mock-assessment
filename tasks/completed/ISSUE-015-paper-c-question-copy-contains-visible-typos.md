---
id: ISSUE-015
title: Paper C question copy contains visible spelling and grammar errors
type: content
depends_on: []
---

# Paper C question copy contains visible spelling and grammar errors

Area: Paper C Module 4B question content

## Problem

Several Paper C prompts contain proofreading errors that are shown directly to learners during practice and review. Examples include `Fine the Shortest Route` instead of `Find`, `(I point)` instead of `(1 point)`, `web- based`, and a trailing colon in `Which of the below is not a web based or digital based navigation app:`.

## Steps to reproduce

1. Open a Paper C practice set, for example `http://localhost:3000/practice/c/4b/QjgayF`.
2. Move through the questions or open the related result/review page.
3. Observe the prompts for the route and navigation questions.

The wording is also present in the static pool and may appear under other valid seeds.

## Expected behaviour

Learners should see proofread, grammatically consistent question prompts and point labels.

## Actual behaviour

The prompts display the errors as part of the assessment copy. In the tested seeded set, the review and result pages repeated the same wording.

## UX and visual observations

The errors reduce polish and can make learners question whether the wording is intentional, especially in an assessment intended to model formal vocational exam preparation.

## Impact and severity

Low severity. The errors do not prevent answering or scoring, but they are visible in multiple user-facing states.

## Technical findings

The affected strings are in `public/datasets/v2025-09/paper-c-module-4b.json`. The browser reproduced them in the sampled Paper C questions and in the detailed review output.

## Completion notes

Proofread the Paper C prompts in the active dataset, including the `Find` correction, consistent `(1 point)` labels, corrected `web-based` and `digital` compound wording, and the navigation-app question punctuation. Also corrected the paper-based navigation wording and a related grammar error in its answer choice without changing question order or scoring.

Added dataset regression assertions for the removed typo patterns. Validation passed with lint, typecheck, tests, build, and `git diff --check`.
