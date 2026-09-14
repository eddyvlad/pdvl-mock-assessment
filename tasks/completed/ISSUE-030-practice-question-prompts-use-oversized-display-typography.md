---
id: ISSUE-030
title: Question prompts use inconsistent and oversized typography
type: design
depends_on: []
---

# Question prompts use inconsistent and oversized typography

Area: Practice, review, and result question prompt typography

## Problem

Question prompts across the practice, review, and result screens do not share one typography treatment. The active practice prompt is capped by the large global display heading size, while the review and result prompts use a separate sans-serif style. This makes question hierarchy inconsistent and can consume more vertical space than necessary before answer details and controls.

## Reproduction

1. Open a valid seeded practice URL such as `http://localhost:3000/practice/c/4b/QE0001` at a 1280 by 720 viewport.
2. Inspect the active question prompt inside the question card.
3. Complete or submit the attempt, then inspect the same question content on the review and result pages.
4. Repeat at 390 by 844 and 320 by 640 viewports in both themes.
5. Compare all question prompts with the surrounding page and section headings.

## Expected behaviour

All practice, review, and result question prompts should use the existing Georgia font token and the configured prompt color. Their responsive font size should not exceed `2.4rem`; existing smaller mobile floors should be retained so narrow layouts remain readable. Prompts should remain visually subordinate to the relevant page or section heading while wrapping cleanly.

## Actual behaviour

The practice prompt is displayed in Georgia at approximately 28px on the 390px viewport and approximately 44px on the 1280px viewport. Review and result prompts use Trebuchet MS at approximately 16px, so the three question contexts do not share a font family or responsive scale. Long practice prompts become large multi-line display blocks and visually compete with the page heading.

## Root cause

`PracticeClient.tsx` in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:306` renders the active prompt as an `h2` without a prompt-specific scoped selector, so the unlayered global `h2` rule in `src/app/globals.css` supplies the 2.75rem maximum. The review and result cards use `.review-question-heading` and `.result-question-heading`, but both selectors explicitly set `font-family: var(--font-sans)` and a fixed 1rem size. The three contexts therefore need coordinated scoped rules while the global heading rules remain unchanged for unrelated headings.

## Implementation scope

- Components/modules: question prompts in the practice card, review list, and detailed result cards.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`, `src/app/practice/[paper]/[module]/[seed]/review/ReviewClient.tsx`, `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx`, and `src/app/globals.css`; add or update focused rendering coverage if the project test setup supports it.
- Behaviour that should change: all three prompt contexts should use `var(--font-serif)` and responsive sizing capped at `2.4rem`. Preserve each context's current smaller mobile floor and use sufficient responsive line height for multi-line prompts.
- Behaviour that should remain unchanged: prompt color, content, heading semantics, the main page and section headings, answer selection, navigation, timer, persistence, submission, themes, and route behavior.

## Acceptance criteria

- Practice, review, and result question prompts all compute to the existing Georgia font family and configured prompt color.
- At larger widths, all three prompt styles are capped at `2.4rem`; practice retains its current 1.75rem mobile floor and review/result retain their current 1rem mobile floor.
- Long prompts wrap inside their cards without clipping, horizontal overflow, or overlap with answer summaries, statuses, explanations, or navigation controls.
- The page heading retains its existing display typography and remains visually stronger than the question prompt.
- The correction works for Papers A, B, and C, including Paper C's variable choice counts, in both light and dark themes.
- Unrelated `h1`, `h2`, and `h3` headings, including dialog and section headings, retain their existing typography.
- Answer selection, keyboard shortcuts, question navigation, autosave, timer/grace behavior, review flow, scoring, and result content remain unchanged.

## Verification

1. Open fresh Paper A, B, and C seeded practice attempts at 1280 by 720, 768 by 900, 390 by 844, and 320 by 640 viewports.
2. Inspect short and long prompts on practice, review, and result pages in both light and dark themes, confirming the shared Georgia family, configured color, computed size, line height, hierarchy, and card wrapping.
3. Select answers, use keyboard shortcuts, navigate forward and backward, submit, and confirm typography changes do not affect persistence, scoring, navigation, or result content.
4. Check that answer choices, statuses, explanations, and navigation controls remain visible and usable after long prompts wrap.
5. Confirm page, section, and dialog headings retain their existing display typography.
6. Run focused tests or add them if no suitable coverage exists, then run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

- The implementation is present in `6146c4d` (`fix(typography): unify question prompt styling`).
- Browser verification confirmed the practice, review, and result prompts use Georgia, remain capped at the intended responsive size, retain the configured colors, and avoid horizontal overflow at mobile and desktop widths.
- Light and dark practice states, the review state, and the submitted result state were checked with Paper C content, including long prompts.
- Answer navigation, review submission, scoring, and the existing submit dialog remained functional during verification.
