---
id: ISSUE-019
---

# Fixed desktop theme toolbar covers the Paper C start action

Area: Landing page responsive layout and theme selector

## Problem

On wider screens, the fixed theme selector can sit on top of page content. At the Papers anchor position, it overlaps the lower-right portion of the Paper C card and its `Start Paper C` button, making part of that action unavailable to pointer clicks.

## Reproduction

1. Open `http://localhost:3000/` at a 1280 by 720 viewport.
2. Click the `Papers` link in the header, or open `http://localhost:3000/#papers` directly.
3. Scroll if needed until the three paper cards and their start buttons are visible at the bottom of the viewport.
4. Inspect the lower-right corner of the Paper C card and try to click the right side of `Start Paper C`.

## Expected behaviour

The theme selector should remain available without covering text or interactive controls. The complete Paper C card and start button should remain visible or should scroll clear of the selector before the user needs to interact with them.

## Actual behaviour

At 1280 by 720, the toolbar is positioned at approximately x=1130, y=658, width=126, height=46. The Paper C start button is approximately x=873, y=691, width=310, height=44, producing a 13-pixel vertical overlap and an approximately 53-pixel horizontal overlap. The toolbar is painted above the button and can intercept clicks in the overlapping area. At a 768 by 900 tablet viewport, the same fixed toolbar also overlaps the Paper B card while the user is scrolling through the cards.

## Root cause

`src/app/globals.css` sets `.theme-toggle` to `position: fixed` with `right: 1rem`, `bottom: 1rem`, and `z-index: 50`. The `@media (max-width: 640px)` rule moves it into normal flow, which resolves the narrow-screen case, but there is no reserved bottom space or collision avoidance for desktop and tablet layouts. The landing page renders the `#papers` card grid in `src/app/page.tsx`, so the fixed toolbar can cover the last card's content at common viewport heights.

## Implementation scope

- Files likely to modify: `src/app/globals.css`, and possibly `src/app/page.tsx` or the shared shell if content spacing is the chosen fix.
- Component/module: global `.theme-toggle` placement and the landing page's paper-card content flow.
- Behaviour that should change: desktop and tablet scrolling must keep the theme selector out of the way of card text and controls, including `Start Paper C`.
- Behaviour that should remain unchanged: the selector remains available, its three theme choices and pressed states continue to work, and the existing non-overlapping mobile placement is preserved.

## Acceptance criteria

- At 1280 by 720, clicking `Papers` leaves the Paper C card and its complete start button unobscured.
- At representative tablet widths, scrolling through the card grid does not put the toolbar over card text or controls.
- Theme buttons remain reachable, visually consistent, and keyboard accessible in system, light, and dark themes.
- The mobile flow at 390 by 844 and 320 by 640 still avoids overlap and keeps the selector usable.
- No horizontal overflow or layout shift is introduced.

## Verification

1. Use the browser at 1280 by 720 and 768 by 900, open `/#papers`, and visually inspect all card content while scrolling.
2. Click the exposed edges and full area of `Start Paper C` to confirm the toolbar does not intercept the action.
3. Repeat at 390 by 844 and 320 by 640, and verify the selector remains in normal flow.
4. Check system, light, and dark theme states, then run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

Implemented on 2026-09-14:

- Added desktop and tablet bottom clearance below the landing page paper cards so the fixed theme toolbar does not cover actions.
- Browser-verified Paper CTA visibility at desktop and tablet sizes, with mobile theme controls remaining in normal flow.
