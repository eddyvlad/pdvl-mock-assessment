---
id: ISSUE-023
title: Review page question headings are oversized and use the display heading style
type: task
depends_on: []
---

# Review page question headings are oversized and use the display heading style

Area: Review page question list typography

## Problem

Question prompts in the review list are much larger than the surrounding answer summaries and status information. They use the page display-heading treatment instead of a compact question-list treatment, which makes the review page difficult to scan and causes long prompts to dominate each card.

## Reproduction

1. Open the landing page at `http://localhost:3000/`.
2. Start any Paper A, B, or C assessment and advance to the final question.
3. Select `Review answers`.
4. Inspect the question prompt headings in the review cards at a desktop viewport such as 1280 by 720, then repeat at a mobile viewport such as 390 by 844.

## Expected behaviour

Review-card question prompts should use a readable, compact sans-serif size that is clearly subordinate to the main `Review before you submit.` heading. Long prompts should wrap naturally without clipping, while question numbers, selected-answer summaries, statuses, and edit controls remain easy to scan.

## Actual behaviour

The question prompts render at approximately 44px with the Georgia display font on desktop, and remain oversized on mobile. A single question card can consume most of the viewport before its answer status and edit action are reached. The main review heading and the question headings are visually too similar in hierarchy.

## Root cause

`src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx` renders each review prompt as an `h2` with `font-sans text-base` at the question-card heading. The global `h1` through `h6` rules in `src/app/globals.css` are unlayered and set all `h2` elements to the Georgia font with a responsive size of `clamp(1.75rem, 4vw, 2.75rem)`. These global rules override the intended utility classes, producing the oversized display styling.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx` and/or `src/app/globals.css`.
- Component/module: the per-question headings in the review list.
- Behaviour that should change: apply the intended compact review-card typography across Papers A, B, and C, including both light and dark themes and narrow viewports.
- Behaviour that should remain unchanged: preserve the main review page heading, question content, heading semantics, answer summaries, status labels, edit navigation, practice-page typography, and result-page typography unless a narrowly scoped shared-style correction is required.

## Acceptance criteria

- Review-card question prompts are visibly smaller than the main review heading and no longer use the oversized display treatment.
- The prompt typeface and size are readable and consistent across Papers A, B, and C.
- Long prompts wrap within their cards without horizontal overflow, clipping, or overlap at desktop and mobile widths.
- Question numbers, selected-answer or unanswered text, status labels, and edit controls remain visible and well aligned.
- The main review heading and unrelated practice and result headings retain their intended hierarchy.
- Both light and dark themes remain readable with no new contrast or layout regressions.

## Verification

1. Use the browser to inspect Paper A, B, and C review pages at 1280 by 720 and 390 by 844 in both light and dark themes.
2. Confirm that short and long question prompts are compact, readable, and fully contained in their cards.
3. Verify the main review heading, answer summaries, statuses, and edit controls still render correctly.
4. Check for horizontal overflow and console errors.
5. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

Implemented on 2026-09-14:

- Added compact sans-serif typography for review question prompts while preserving heading semantics and the main review heading hierarchy.
- Browser-verified the prompt size, wrapping, and review-card presentation on the current build.
