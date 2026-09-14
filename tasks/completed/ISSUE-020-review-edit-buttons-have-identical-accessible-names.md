---
id: ISSUE-020
title: Review page Edit answer buttons are indistinguishable to assistive technology
type: task
depends_on: []
---

# Review page Edit answer buttons are indistinguishable to assistive technology

Area: Review answer navigation and accessibility

## Problem

Every question on the review page exposes a button named only `Edit answer`. The visual button sits inside each question card, but its accessible name does not identify the question number or prompt. Screen-reader users navigating the button list therefore hear the same label 15 to 35 times and cannot determine which question each button will open without moving through surrounding content.

## Reproduction

1. Open a Paper B attempt such as `http://localhost:3000/practice/b/3b/ABC123`.
2. Move to the final question and select `Review answers`, or open a review URL with a valid in-progress attempt.
3. Inspect the accessibility tree or navigate through the buttons with a screen reader.
4. Observe that every question card exposes the same accessible button name, `Edit answer`, even though the buttons navigate to different question indexes.

## Expected behaviour

Each edit control should have a unique, concise accessible name that identifies its target, such as `Edit answer for question 03`, while remaining visibly associated with the question card.

## Actual behaviour

The review snapshot exposes 25 separate buttons all named `Edit answer`. The UI does navigate to the correct question when a sighted user clicks a button, but the target is ambiguous when the buttons are encountered through assistive-technology controls navigation.

## Root cause

In `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, the question loop renders the same button text at lines 272-274 for every item. The button has no `aria-label`, `aria-labelledby`, or `aria-describedby` relationship to the numbered question heading, so the question context is not part of its accessible name. There is no automated accessibility assertion covering unique edit-control names.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, and the relevant test location if an accessibility regression test is added.
- Component/module: the per-question edit button in the review list.
- Behaviour that should change: expose a unique accessible name containing the target question number, and optionally the prompt if needed for clarity.
- Behaviour that should remain unchanged: keep the visible `Edit answer` label, arrow icon, question order, route query, and answer persistence unchanged.

## Acceptance criteria

- Each review-card edit button has a unique accessible name that identifies its question number.
- The accessible name remains understandable for Paper A, B, and C review lists with their different question counts.
- Clicking each button still navigates to the corresponding question and preserves the current attempt.
- The visible UI does not gain redundant or awkward text for sighted users.
- Add focused automated coverage where the existing test setup permits, and do not introduce console errors.

## Verification

1. Open valid Paper A, B, and C review pages in the browser and inspect the accessibility snapshot for the edit controls.
2. Navigate the review controls with a screen reader or accessibility tree and confirm each target is identifiable before activation.
3. Click the first, a middle, and the last edit control and verify the matching question opens.
4. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

Implemented on 2026-09-14:

- Added question-numbered accessible names to each review-card Edit answer control without changing its visible label or target behavior.
- Browser-verified the review accessibility tree exposes distinct names for the edit controls.
