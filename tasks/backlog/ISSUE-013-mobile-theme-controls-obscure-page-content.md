---
id: ISSUE-013
---

# Fixed theme controls obscure content on narrow screens

Area: Responsive layout and floating theme selector

## Problem

The fixed theme selector sits over page content at the bottom-right of small viewports. On the landing page it covers the Continue last session and How it works content. On the practice page it can cover the active answer choice and its text while the learner is trying to read or select it.

## Steps to reproduce

1. Open the landing page at `http://localhost:3000/`.
2. Set the browser viewport to approximately 390 by 844 pixels, or use a narrow mobile device.
3. Observe the bottom-right corner while the Continue last session panel is entering the viewport.
4. Open a practice set and keep the viewport at the same size.
5. Scroll or observe the first question where the answer choices extend below the viewport.

## Expected behaviour

The theme selector should remain available without covering text or interactive controls. Page content should have enough bottom spacing, or the selector should move to a non-overlapping position at mobile breakpoints.

## Actual behaviour

The fixed control group is rendered over the lower-right content. At 390 by 844 it overlays the Continue last session card and a practice answer choice. At 320 by 640 it overlays the How it works text as well.

## UX and visual observations

The overlap is especially disruptive on the practice screen because the learner sees answer text behind the control group. The control has a high-contrast filled button, so the obscured content is not merely close to the edge and is difficult to read or tap.

## Impact and severity

Medium severity. The defect affects common mobile widths and can hide assessment content or interfere with answer selection.

## Technical findings

`src/app/theme-toggle.tsx` renders the selector as a fixed `bottom-4 right-4` group. The page layouts do not reserve corresponding bottom space at narrow breakpoints. Browser checks at 390 by 844 and 320 by 640 showed no horizontal overflow, but the visible overlap remained.
