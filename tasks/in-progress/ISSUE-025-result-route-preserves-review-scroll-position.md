---
id: ISSUE-025
---

# Result page opens at the previous review scroll position

Area: Practice submission, review submission, and result navigation

## Problem

Submitting an assessment from the bottom of the review page navigates to the result route without restoring the viewport to the result summary. The result page therefore opens around the final answer cards, while the score, pass or fail state, and result actions are above the viewport.

## Reproduction

1. Open `http://localhost:3000/practice/c/4b/GHI789` at a 1280 by 720 viewport.
2. Wait for the practice page to load, then click `Next question` 14 times to reach question 15.
3. Click `Review answers`.
4. On the review page, activate `Submit attempt` and confirm with the dialog's second `Submit attempt` button.
5. Inspect the viewport immediately after the result page loads.

## Expected behaviour

The result route should open at the top of the result page, with the score summary, pass or fail state, completion information, and primary result actions visible without requiring manual scrolling.

## Actual behaviour

The result route opens at approximately the review page's previous scroll position. In the tested flow, the viewport showed the final question cards and `Back to top` control, while the result heading and score summary were above the viewport. The learner must manually scroll to the top before they can see the outcome.

## Root cause

The `finishAttempt` callbacks in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:64-86` and `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx:127-146` call `router.replace()` for the result URL without explicit scroll restoration. The same result transition is also used for expired attempts and stored submitted attempts in the practice and review effects. `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx:89-92` only provides a user-triggered `Back to top` action after rendering and does not correct the initial route position.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`, `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, and, if needed, `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx`.
- Components or modules: the practice and review result-navigation paths, with the existing result-page scroll helper as a possible shared implementation point.
- Behaviour that should change: entering a result route after manual submission, automatic expiry submission, or redirecting a stored submitted attempt should present the result summary at the top of the page.
- Behaviour that should remain unchanged: attempt persistence, scoring, result content, browser history semantics, the existing `Back to top` control, and the ability to inspect all detailed answer cards.

## Acceptance criteria

- Confirming an unanswered submission from the bottom of the review page opens the result page at its top summary at desktop and mobile widths.
- Completing an answered submission from the final practice question also opens the result summary at the top.
- Automatic expiry and redirects from an already submitted attempt do not leave the result page at an inherited lower scroll position.
- The score, pass or fail state, completion details, and result actions are visible immediately after navigation.
- The result page's existing `Back to top` action still works after the change, and browser back and forward navigation remains usable.
- No console errors or unexpected layout shifts are introduced.

## Verification

1. Reproduce manual submission from the bottom of the review page at 1280 by 720 and 390 by 844, and verify the result heading and score summary are visible immediately.
2. Repeat with an answered attempt that submits from the final practice question.
3. Exercise the automatic-expiry or submitted-attempt redirect path where practical, and verify the same top-of-page behaviour.
4. Scroll through the detailed result cards and verify `Back to top` still returns to the summary.
5. Check browser back and forward behaviour, console output, and responsive layout.
6. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium
