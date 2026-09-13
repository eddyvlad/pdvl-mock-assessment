---
id: ISSUE-021
---

# Papers navigation anchor hides the section heading behind the sticky header

Area: Landing page navigation and anchor scrolling

## Problem

The header `Papers` link navigates to `/#papers`, but the sticky header covers the top of the destination section. The learner arrives partway into the section with the `Practice papers` label and `Choose your PDVL mock exam` heading hidden behind the header, which removes the context that explains the three cards.

## Reproduction

1. Open `http://localhost:3000/` at a desktop viewport such as 1280 by 720, or use a tablet viewport such as 768 by 900.
2. Click the `Papers` link in the sticky header, or open `http://localhost:3000/#papers` directly.
3. Observe the top of the viewport after the anchor scroll completes.

## Expected behaviour

The anchor destination should position the Papers section below the sticky header so that its eyebrow and `Choose your PDVL mock exam` heading are visible. The section heading should remain visible when users arrive from the header link or a shared hash URL.

## Actual behaviour

The browser scrolls the `#papers` section to the top of the viewport without accounting for the sticky navigation height. The header overlays the section heading area. In the tested 1280 by 720 view, the cards begin near the top while the section heading is hidden. At 768 by 900, the supporting section copy is visible immediately below the header while the section label and heading remain above it.

## Root cause

`src/components/nav-bar.tsx` renders the header with the `site-nav` class, and `src/app/globals.css` sets `.site-nav` to `position: sticky` with a 4.5rem navigation height. The `section` with `id="papers"` is rendered in `src/app/page.tsx`, but neither the section nor a shared anchor target defines a scroll margin or equivalent offset for the sticky header.

## Implementation scope

- Files likely to modify: `src/app/globals.css` and/or `src/app/page.tsx`.
- Component/module: the landing page `#papers` anchor target and the shared sticky navigation offset.
- Behaviour that should change: hash navigation to `#papers` must leave the section heading visible below the sticky header.
- Behaviour that should remain unchanged: the header remains sticky, the existing Papers link and URL hash remain valid, and card layout and scroll behaviour outside the anchor offset are unchanged.

## Acceptance criteria

- Clicking `Papers` at 1280 by 720 leaves `Practice papers` and `Choose your PDVL mock exam` visible below the header.
- Opening `/#papers` directly produces the same correctly offset position.
- The offset works at representative tablet and mobile widths without creating excessive blank space.
- The header still remains sticky during normal scrolling and the hash URL is preserved.

## Verification

1. Test the header link and direct hash URL at 1280 by 720, 768 by 900, 390 by 844, and 320 by 640.
2. Confirm the section label and heading are readable and not covered by the header after navigation.
3. Scroll through the cards to verify the change does not cause clipping or horizontal overflow.
4. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Low
