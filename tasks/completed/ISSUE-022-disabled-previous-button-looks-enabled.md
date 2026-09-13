---
id: ISSUE-022
---

# Disabled Previous button has the same affordance as an enabled secondary button

Area: Guided assessment navigation controls

## Problem

On the first question of every assessment, `Previous` is semantically disabled but is styled like the normal enabled secondary button. It keeps the pointer cursor and the same background, border, and text treatment used when Previous is available. The only indication that it cannot be activated is the non-visual disabled attribute, which can make the control feel broken when clicked.

## Reproduction

1. Open a fresh assessment such as `http://localhost:3000/practice/c/4b/HgfD32`.
2. Wait for the three-second grace state to finish if it is shown.
3. Inspect the `Previous` button on question 1, then compare it with the `Previous` button after moving to question 2.
4. Move the pointer over the disabled button or attempt to activate it.

## Expected behaviour

The first-question Previous control should remain disabled and should have a clearly muted disabled appearance, a non-pointer cursor, and an appropriate focus/interaction treatment. The enabled Previous control on later questions should retain its normal secondary-button styling.

## Actual behaviour

The question 1 button is marked `[disabled]` in the accessibility tree, but it looks like the enabled Previous button on question 2. The shared button rule applies `cursor: pointer` and does not define a disabled visual state, so a sighted user receives little feedback that the control is unavailable.

## Root cause

`src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` sets `disabled={currentQuestion === 0}` on the Previous button at lines 338-340. The shared `@utility btn` rule in `src/app/globals.css` always sets `cursor: pointer` and has no `:disabled` styling. `btn-secondary` therefore supplies the same colors for both enabled and disabled instances.

## Implementation scope

- Files likely to modify: `src/app/globals.css`, with `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` only if a more specific class or state hook is needed.
- Component/module: shared button disabled state, currently observed on guided assessment Previous.
- Behaviour that should change: make disabled buttons visibly unavailable and remove the pointer affordance while preserving native disabled semantics.
- Behaviour that should remain unchanged: Previous stays disabled on question 1, enabled Previous continues to navigate backward, and all primary, secondary, danger, ghost, hover, active, and focus-visible states remain unchanged for enabled controls.

## Acceptance criteria

- On question 1, Previous has a visibly muted disabled state distinct from enabled Previous.
- The disabled button does not present a pointer cursor or hover lift.
- The control remains keyboard and accessibility semantically disabled and cannot navigate backward.
- On question 2 and later, Previous retains its current enabled styling and navigation behaviour.
- The change does not reduce the readability of the disabled label in either theme.

## Verification

1. Test Paper A, B, and C question 1 in both light and dark themes and compare the disabled button with enabled Previous on question 2.
2. Confirm pointer hover does not imply an active action and that keyboard activation remains unavailable.
3. Check that the existing primary button hover contrast fix is unaffected.
4. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Low

## Completion notes

Implemented on 2026-09-14:

- Added muted disabled styling, a not-allowed cursor, and no hover lift to shared button states, with dedicated secondary-button colors.
- Browser-verified the first-question Previous control remains semantically disabled and visually distinct.
