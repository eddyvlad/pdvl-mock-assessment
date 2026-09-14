---
id: ISSUE-032
---

# Review-card answer status does not stay at the top right

Area: Review page question-card status alignment

## Problem

The `Answered` status badge is not consistently anchored to the top-right corner of review cards. Its position changes depending on the prompt length: some cards show the badge at the top right, while longer prompts cause it to wrap below the prompt and align to the left. This makes the review list visually inconsistent and makes the status harder to scan.

## Reproduction

1. Open a valid Paper A Module 1 practice URL such as `http://localhost:3000/practice/a/m1/QA1234`.
2. Navigate to questions 25 through 27, select an answer for each, continue to the end of the set, and open `Review answers`.
3. Inspect the answered cards at a desktop viewport such as 1280 by 720.
4. Repeat at a mobile viewport such as 390 by 844 and with other Papers where the review list contains different prompt lengths.

## Expected behaviour

Every review-card status badge, including `Answered` and `Needs answer`, should remain in a consistent top-right position within its card regardless of prompt length, question number, viewport width, paper, module, theme, or answer-summary length. The question number, prompt, selected-answer summary, and edit action should retain usable width and wrap below or beside the badge without clipping or overlap.

## Actual behaviour

In the supplied visual example, question 25 places `Answered` at the top right, while questions 26 and 27 place it below the prompt on the left. The current browser reproduction shows answered questions 25 to 27 with the status badge below the prompt and left-aligned at both desktop and mobile widths. The badge therefore changes position from card to card and can be mistaken for part of the answer content rather than a consistent card status.

## Root cause

`src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx:262-277` renders the question content and status as siblings inside a single `flex flex-wrap items-start justify-between gap-3` container. The question content is the first flex item and can consume most of the available row width. When the prompt and status no longer fit, `flex-wrap` moves the status to a new flex line. `justify-between` does not right-align a lone item on that wrapped line, so the status starts at the left edge. There is no dedicated status column or other top-right anchoring rule.

The existing Jest tests cover data, scoring, storage, and seed behavior but do not render this review-card layout, so the defect requires browser-level responsive verification or focused component coverage.

## Implementation scope

- Component/module: the per-question card header and status badge in `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx` and, only if needed for a scoped layout rule, `src/app/globals.css`; add focused rendering coverage if the existing test setup supports it.
- Behaviour that should change: keep the `Answered` and `Needs answer` badges in a dedicated top-right layout position while allowing the question content and answer summary to wrap within the remaining space. A two-column grid with a flexible question column and an auto-sized status column is the preferred bounded approach.
- Behaviour that should remain unchanged: status text and icons, question order and content, selected-answer summaries, edit-answer URLs, answer persistence, submission flow, heading typography, themes, and review-card semantics.

## Acceptance criteria

- Every `Answered` badge appears at the top right of its review card at desktop and mobile widths.
- Every `Needs answer` badge follows the same top-right placement pattern.
- Long prompts, long selected-answer summaries, and question numbers wrap within the question-content area without overlapping the badge, clipping, or causing horizontal overflow.
- The placement is consistent across Papers A, B, and C, including different question counts and Paper C's variable choice counts.
- The badge remains readable and correctly colored in light and dark themes.
- Edit-answer controls remain below the card content, retain their existing accessible names and destinations, and do not move because of status wrapping.
- No unrelated page headings, result cards, scoring, persistence, or submission behavior changes.

## Verification

1. In the browser, create answered and unanswered review cards in Papers A, B, and C, including short prompts, long prompts, long selected-answer summaries, and questions near the start and end of each list.
2. Inspect the cards at 1280 by 720, 768 by 900, 390 by 844, and 320 by 640 in light and dark themes.
3. Confirm `Answered` and `Needs answer` are always top right, while prompt and summary text wrap without overlap or horizontal overflow.
4. Resize or reload each review page and confirm the layout remains stable.
5. Click representative `Edit answer` controls and confirm navigation, attempt IDs, question indices, and existing answer persistence are unchanged.
6. Check the browser console for errors and run focused rendering coverage if available, followed by `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium
