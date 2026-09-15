---
id: ISSUE-016
title: One Paper C choice contains an embedded answer letter that conflicts with the UI label
type: content
depends_on: []
---

# One Paper C choice contains an embedded answer letter that conflicts with the UI label

Area: Paper C Module 4B answer choices and result review

## Problem

The practice UI adds an A to D label to every choice. One dataset choice already contains an answer letter and dash in its text, which produces a confusing double label in the learner's view and in the result review.

## Steps to reproduce

1. Open the Paper C set `http://localhost:3000/practice/c/4b/QjgayF`.
2. Move to question 10, titled `OneMap proposes three routes...`.
3. Inspect the answer choices, or submit the set and inspect the question 10 result details.

## Expected behaviour

Choice text should contain only the answer content. The interface should render one consistent option label before it.

## Actual behaviour

The third choice is stored with a leading `C` and dash before `shortest by distance though not fastest`, while the UI labels that choice according to its shuffled position. In the tested set the result displays a rendered `B` followed by the dataset's `C` and dash, which looks like two conflicting answer labels and can make the correct answer ambiguous.

## UX and visual observations

The duplicated letters are especially misleading on the result page, where the app separately prefixes `Your answer` and `Correct answer` with the rendered option label. The content itself is understandable, but the final display looks like a data or scoring inconsistency.

## Impact and severity

Medium severity. The question can still be scored, but the answer presentation is confusing and undermines confidence in the review.

## Technical findings

The affected choice is in `public/datasets/v2025-09/paper-c-module-4b.json`. The UI label is generated from the shuffled choice index in `PracticeClient.tsx` and `ResultsClient.tsx`, so the embedded `C` in the dataset should be removed or normalized.

## Completion notes

Removed the embedded answer letters from all three labelled options in the affected OneMap question, leaving the UI-generated labels and `correctIndex` unchanged. Added a dataset regression assertion that Paper C choices do not contain embedded option labels.

Validation passed with lint, typecheck, tests, build, and `git diff --check`.
