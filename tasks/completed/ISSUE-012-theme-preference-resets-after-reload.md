---
id: ISSUE-012
title: Selected theme resets to system after a full reload
type: bug
depends_on: []
---

# Selected theme resets to system after a full reload

Area: Theme selection and preference persistence

## Problem

The theme control lets the learner choose system, dark, or light mode and the application contract says the preference is persisted. A full browser reload resets the selected theme to system mode instead of restoring the chosen preference.

## Steps to reproduce

1. Open the landing page at `http://localhost:3000/`.
2. Click the `Dark mode` theme button.
3. Confirm that the page changes to dark mode and the button has `aria-pressed="true"`.
4. Reload the page.
5. Inspect the theme controls and page appearance.

## Expected behaviour

Dark mode should remain applied after reload, with `Dark mode` still selected. The same should apply to a selected light theme.

## Actual behaviour

After reload, the page returns to the system appearance and `System theme` is selected. During the same client-side navigation session the selection can appear to persist, which makes the failure less obvious until the page is refreshed or reopened.

## UX and visual observations

The control gives immediate feedback when clicked, then silently contradicts that choice after a normal browser action. Learners who prefer a stable contrast setting may see the entire assessment switch appearance unexpectedly.

## Impact and severity

Medium severity. The preference control does not provide the promised persistent behaviour and can affect readability during a timed assessment.

## Technical findings

`src/app/theme-toggle.tsx` writes the selection to `localStorage` under `theme`, but the mounted `useSyncExternalStore` state returns to its system snapshot after a full reload in the running app. The browser check reproduced `data-theme="dark"` before reload and no `data-theme` attribute with `System theme` selected after reload.

## Completion notes

The theme synchronization effect now applies the selected theme to the document without writing the server fallback back into local storage during hydration. Explicit theme changes continue to persist through the existing theme-change event.

Browser verification confirmed that both dark and light selections remain selected after a full reload. Validation passed with lint, typecheck, tests, build, and `git diff --check`.
