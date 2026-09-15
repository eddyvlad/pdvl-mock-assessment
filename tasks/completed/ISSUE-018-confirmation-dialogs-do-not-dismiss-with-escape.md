---
id: ISSUE-018
title: Styled confirmation dialogs do not dismiss when Escape is pressed
type: bug
depends_on: []
---

# Styled confirmation dialogs do not dismiss when Escape is pressed

Area: Review submission and landing-page session management dialogs

## Problem

The styled confirmation dialogs opened by `Submit attempt` on the review page and `New paper` on the landing page remain open when the user presses Escape. Escape is a standard way to cancel a modal, and the current behaviour leaves keyboard users dependent on the visible cancel button or backdrop click.

## Reproduction

1. Open `http://localhost:3000/practice/c/4b/9xh2NK` and move through the set to the review page, or open the landing page while an unfinished session is present.
2. On the review page with unanswered questions, select `Submit attempt`. On the landing page, select `New paper`.
3. Confirm that the `Submit this attempt?` or `Discard this session?` dialog is open.
4. Press Escape once using the browser keyboard.

## Expected behaviour

Pressing Escape should close the open confirmation dialog, preserve the unfinished session, and return focus to the button that opened the dialog. The visible cancel button and backdrop dismissal should continue to work.

## Actual behaviour

The dialog remains open after Escape. This was reproduced in a fresh browser tab for both `Submit this attempt?` and `Discard this session?`. The explicit `Keep reviewing` and `Keep session` buttons, and clicking outside the panel, close the dialogs successfully.

## Root cause

`SubmitAttemptDialog` in `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx` and `DiscardSessionDialog` in `src/components/active-session-panel.tsx` render native `<dialog>` elements and rely on React `onCancel` handlers to respond to Escape. Both handlers call `preventDefault()` and `onClose()`, but the browser interaction does not produce a closed dialog. There are currently no automated tests covering the dialog cancel event or Escape path.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, `src/components/active-session-panel.tsx`, and the relevant test location if a dialog interaction test is added.
- Component/module: `SubmitAttemptDialog` and `DiscardSessionDialog`.
- Behaviour that should change: pressing Escape while either modal is open must invoke the existing close path and restore focus to its trigger.
- Behaviour that should remain unchanged: confirmation is still required before submitting unanswered questions or discarding a saved session; the explicit cancel and confirm buttons, backdrop click, modal copy, and focus-on-open behaviour must remain intact.

## Acceptance criteria

- Escape closes the submit-warning dialog without submitting the attempt.
- Escape closes the discard-session dialog without deleting the saved session.
- Focus returns to `Submit attempt` or `New paper` after Escape, matching the existing explicit-cancel behaviour.
- Explicit cancel, backdrop click, and confirm actions retain their current behaviour.
- The dialog remains keyboard accessible and does not emit console errors.

## Verification

1. In the browser, open each dialog, press Escape, and verify that it closes and focus is restored to the triggering control.
2. Verify that pressing Escape does not submit an attempt or remove an active session.
3. Repeat the explicit cancel, backdrop, and confirm paths for both dialogs.
4. Add and run focused automated coverage for the Escape/cancel path if the project test setup supports rendering these client components, then run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, and `npm run build`.

## Severity

Medium

## Completion notes

Implemented on 2026-09-14:

- Added explicit Escape handling to the submit and discard native dialogs while retaining backdrop dismissal, cancel actions, and focus restoration.
- Browser-verified both dialogs close without submitting or discarding the active session.
