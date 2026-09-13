---
id: ISSUE-030
---

# Practice question prompts use oversized display typography

Area: Guided practice question card typography

## Problem

The active question prompt in the guided practice screen is rendered with the large serif display heading style even though the component requests a compact sans-serif question style. The prompt therefore competes with the page title and consumes more vertical space than necessary before the answer choices.

## Reproduction

1. Open a valid seeded practice URL such as `http://localhost:3000/practice/c/4b/QE0001` at a 1280 by 720 viewport.
2. Wait for the practice page to load and inspect the question prompt inside the question card.
3. Repeat at a 390 by 844 viewport and with the other theme selected.
4. Compare the prompt with the `Practice, one signal at a time.` page heading and with the compact question prompts on the review and result pages.

## Expected behaviour

The active question prompt should use the intended compact sans-serif `text-2xl` style on mobile and `text-3xl` style at the larger breakpoint, with the configured line height and normal tracking. It should remain visually subordinate to the page title while wrapping long prompts cleanly and leaving the answer choices and navigation controls comfortably usable.

## Actual behaviour

The prompt is displayed in Georgia at approximately 28px on the 390px viewport and approximately 44px on the 1280px viewport. The active element has the class `mb-0 max-w-3xl font-sans text-2xl font-bold leading-8 tracking-normal sm:text-3xl`, but its computed style is `font-family: Georgia`, `font-size: 28px` on mobile, and `font-size: 44px` on desktop. Long prompts become large multi-line display blocks and visually compete with the page heading.

## Root cause

`PracticeClient.tsx` in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:316` renders the active question prompt as an `h2` with `font-sans text-2xl ... sm:text-3xl`. The unlayered global heading rules in `src/app/globals.css:147-166` apply `font-family: var(--font-serif)` and `font-size: clamp(1.75rem, 4vw, 2.75rem)` to all `h2` elements. Those global rules override the intended utility styling, leaving the practice-card prompt with the display heading font and size. The review and result cards now have explicit scoped heading classes, but the practice card does not.

## Implementation scope

- Component/module: active question heading in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` and, only if needed for the scoped override, `src/app/globals.css`; add or update focused tests for the practice question-heading styles if the project test setup covers rendered components.
- Behaviour that should change: active practice-card question prompts should honor the compact sans-serif size, weight, line height, and tracking requested by the component across Papers A, B, and C.
- Behaviour that should remain unchanged: the main `Practice, one signal at a time.` page heading, question content and wrapping semantics, answer selection, navigation, timer, review and result typography, themes, and responsive layout.

## Acceptance criteria

- At desktop widths, active practice question prompts render with the intended compact sans-serif size rather than the global 44px Georgia display style.
- At mobile widths, active practice question prompts render with the intended compact sans-serif size rather than the oversized global h2 style.
- Long prompts wrap inside the question card without clipping, horizontal overflow, or overlapping answer choices and navigation controls.
- The page heading retains its existing display typography and remains visually stronger than the question prompt.
- The scoped practice-heading correction works for Papers A, B, and C, including Paper C's variable choice counts, in both light and dark themes.
- Answer selection, keyboard shortcuts, question navigation, autosave, timer/grace behaviour, review flow, and result pages remain unchanged.

## Verification

1. Open fresh Paper A, B, and C seeded practice attempts at 1280 by 720, 768 by 900, 390 by 844, and 320 by 640 viewports.
2. Inspect short and long prompts in both light and dark themes, confirming the prompt font family, computed size, line height, hierarchy, and card wrapping.
3. Select answers, use keyboard shortcuts, navigate forward and backward, and confirm the corrected heading does not change persistence or navigation behaviour.
4. Check that answer choices and both navigation buttons remain visible and usable after long prompts wrap.
5. Compare review and result pages to ensure their existing compact question styles and the main page heading are unaffected.
6. Run focused tests or add them if no suitable coverage exists, then run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium
