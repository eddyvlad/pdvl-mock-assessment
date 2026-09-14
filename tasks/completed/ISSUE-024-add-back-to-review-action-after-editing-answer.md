---
id: ISSUE-024
title: Add a visible Back to review action after editing an answer
type: task
depends_on: []
---

# Add a visible Back to review action after editing an answer

Area: Review-to-practice answer editing flow

## Problem

When a learner selects `Edit answer` from the review page, the app opens the practice question with the saved attempt and question index. The practice page does not provide a visible way to return to the review page, so the learner must rely on browser history, manually edit the URL, or navigate through the question flow again.

## Reproduction

1. Open a valid in-progress assessment such as a Paper C practice set.
2. Advance to the final question and select `Review answers`.
3. Select `Edit answer` for the first, a middle, or the last question.
4. Observe the practice question page and its navigation controls.

## Expected behaviour

After entering a practice question from the review page, the learner should see a clear `Back to review` action and be able to return to the same review page immediately. The edited answer should already be persisted and should appear in the corresponding review-card summary after returning.

## Actual behaviour

`Edit answer` navigates to a URL containing `attempt` and `question`, but the practice page only shows `Previous`, `Next question`, or `Review answers`. There is no visible review-return action. The current route does not identify that the learner arrived from the review page, so the UI cannot offer context-specific navigation.

## Root cause

`src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx` pushes `${basePath}?attempt=...&question=${index}` from the per-question `Edit answer` button. `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` receives the attempt and question parameters but has no return-context parameter or `Back to review` control in its navigation area. The practice page therefore treats review edits like ordinary resumed practice.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`, and `src/app/practice/[paper]/[module]/[seed]/page.tsx` if the return marker must be parsed and passed explicitly.
- Component/module: review edit navigation and guided practice navigation controls.
- Behaviour that should change: append an internal return marker such as `return=review` to review edit URLs, detect it on the practice route, and render a visible `Back to review` button that routes to `${basePath}/review?attempt=...`.
- Behaviour that should remain unchanged: answer selection and persistence, question navigation, timer state, browser history, submission, and ordinary practice or landing-page continuation URLs without the review marker.

## Acceptance criteria

- Editing any question from a valid review page shows a visible `Back to review` action on the practice page.
- Selecting `Back to review` returns immediately to the matching review page with the same attempt ID.
- An answer changed before returning is persisted and appears as the updated selected-answer summary in review.
- The action remains available after refreshing the edited-question URL while its return marker is present.
- Ordinary practice starts and continuation URLs without the review marker do not show `Back to review`.
- The action works for Papers A, B, and C and does not bypass attempt-context validation or Paper A module gating.
- The existing `Edit answer` accessible naming work remains compatible and its visible label is unchanged.

## Verification

1. In the browser, open valid Paper A, B, and C in-progress review pages.
2. Edit the first, a middle, and the last question in each flow, change an answer, and select `Back to review`.
3. Confirm the review page opens immediately and shows the updated answer and answered count.
4. Refresh an edited-question URL and verify the return action remains available.
5. Open a fresh practice URL and a landing-page Continue URL without the marker and verify the action is absent.
6. Check malformed or mismatched attempt IDs still use the existing recovery state.
7. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

Implemented on 2026-09-14:

- Added an internal review return marker and a visible Back to review action on edited practice questions.
- Browser-verified answer persistence, return navigation, reload behavior, and the absence of the action on ordinary practice starts.
