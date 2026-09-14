---
id: ISSUE-028
title: Starting another paper silently replaces the active unfinished session
type: bug
depends_on: []
---

# Starting another paper silently replaces the active unfinished session

Area: Landing page session entry and continue-session panel

## Problem

When an unfinished attempt is shown in the `Continue last session` panel, activating a different paper's `Start Paper` link starts a new attempt immediately and removes the previous attempt from the active continuation path. The user receives no warning that the saved session will no longer be offered by the landing page.

## Reproduction

1. Open `http://localhost:3000/` in a fresh browser state.
2. Start Paper C and wait for the practice page to load, or use any other paper, then return to the landing page without submitting.
3. Confirm the landing page shows the unfinished attempt in `Continue last session`, with `Continue` and `New paper` actions.
4. Without selecting `New paper`, activate a different card action such as `Start Paper A`.
5. Return to `http://localhost:3000/`.
6. Observe which attempt appears in `Continue last session` and whether the original Paper C `Continue` link is still available.

## Expected behaviour

Starting a different paper while an unfinished session exists should make the consequence clear and require the same confirmation used by the existing `New paper` action before the active continuation session is replaced. Cancelling should leave the original session active and available through its existing `Continue` link. Confirming should replace the active session and start the requested paper.

## Actual behaviour

The `Start Paper A`, `Start Paper B`, or `Start Paper C` link navigates directly to a new practice route without showing a confirmation. Loading that route creates and writes a new attempt, which updates `pdvl:v2:active-session`. After returning home, the `Continue last session` panel shows only the new paper, and the earlier unfinished session is no longer reachable from the landing-page continuation UI. In the tested flow, an unfinished Paper C attempt was replaced by Paper A without any warning.

## Root cause

`PaperCard` in `src/app/page.tsx:49-101` renders each `Start Paper` action as a direct `Link` to the first module. There is no check for an active unfinished attempt or a handoff to the existing discard confirmation. In `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:146-163`, a new route with no matching resumable attempt creates a fresh record and calls `writeAttempt`, and `src/lib/attempt-storage.ts:44-48` writes that record's ID to `pdvl:v2:active-session`. The existing confirmation in `src/components/active-session-panel.tsx:13-85` is only reachable through the separate `New paper` button, so the other paper-entry links bypass the required confirmation path.

## Implementation scope

- Components/modules: landing-page paper entry in `src/app/page.tsx`, the active-session confirmation flow in `src/components/active-session-panel.tsx`, and any small shared session-entry helper needed to coordinate them.
- Files likely to modify: `src/app/page.tsx`; `src/components/active-session-panel.tsx`; add or update focused tests around active-session-aware paper entry. Only modify `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` if the chosen confirmation handoff requires a route-level guard.
- Behaviour that should change: each `Start Paper` action must detect an active resumable attempt and require confirmation before replacing its active-session pointer. Keep the requested paper and generated seed available after confirmation.
- Behaviour that should remain unchanged: starting any paper when no unfinished attempt exists, continuing the current attempt, the explicit `New paper` confirmation and deletion semantics, completed-attempt storage, deterministic seed URLs, and practice question behaviour.

## Acceptance criteria

- With an unfinished active attempt, activating any different `Start Paper` action opens a clear confirmation before the current active session is replaced.
- The confirmation identifies that the current saved session will no longer be the active continuation session and provides an unambiguous cancel action.
- Cancelling the confirmation leaves the original attempt and its `Continue` link unchanged.
- Confirming starts the requested paper and updates the landing page to show the new attempt as the active session.
- When no unfinished active attempt exists, each `Start Paper` action still opens its requested first module directly without an unnecessary confirmation.
- Existing `Continue` and explicit `New paper` behaviour remains intact, including deletion only after confirmation and no accidental submission.
- The flow works across Papers A, B, and C and at representative desktop and mobile widths without layout or focus regressions.

## Verification

1. Create an unfinished attempt for each of Papers A, B, and C in turn and return home.
2. From the landing page, choose each other paper's `Start Paper` action and verify the confirmation appears before navigation or active-session replacement.
3. Cancel and confirm that the original paper, answer count, and `Continue` URL remain available.
4. Repeat and confirm the action, then verify the requested paper starts and becomes the only active continuation session.
5. Test the same actions with no active attempt, after a completed attempt, and after reloading the landing page.
6. Check keyboard focus, Escape, both themes, representative mobile and desktop viewports, console errors, and local-storage state. Run focused tests or add them if no suitable coverage exists, then run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium
