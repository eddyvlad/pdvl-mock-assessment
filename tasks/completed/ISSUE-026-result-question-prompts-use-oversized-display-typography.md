---
id: ISSUE-026
---

# Result question prompts use oversized display typography

Area: Results page detailed question review

## Problem

Question prompts in the result page's `Question by question` cards are rendered as large serif display headings even though the component requests compact sans-serif text. This makes long result cards unnecessarily tall and weakens the hierarchy between the detailed-review section heading and each answer card.

## Reproduction

1. Open `http://localhost:3000/practice/c/4b/GHI789` at a 1280 by 720 viewport.
2. Move through the set with `Next question` until question 15, then open `Review answers`.
3. Submit the unanswered attempt and confirm the submission dialog.
4. Scroll to the `Detailed review` and `Question by question` section.
5. Inspect the question prompt headings in the result cards. Repeat at a 390 by 844 viewport and in the other theme.

## Expected behaviour

Each result-card question prompt should use the compact sans-serif body-heading treatment requested by the component, remain clearly subordinate to `Question by question`, and wrap long prompts within the card without excessive vertical growth.

## Actual behaviour

The result-card prompts render with the Georgia display font at approximately 28px and a display-style line height on both desktop and mobile. Long prompts wrap across large lines and visually compete with the `Question by question` heading. The answer status, learner answer, correct answer, and explanation remain present, but they are pushed farther down each card.

## Root cause

`src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx:242` renders each prompt as an `h3` with `font-sans text-base font-bold leading-7 tracking-normal`. The unlayered global `h3` rules in `src/app/globals.css:147-166` set all headings to `var(--font-serif)` and apply `font-size: clamp(1.25rem, 3vw, 1.75rem)` with `line-height: 1.15`. Those global rules override the intended utility classes, producing the same class-vs-global-style conflict previously observed in the review page.

## Implementation scope

- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx` and `src/app/globals.css` if a scoped result-heading selector is used.
- Component or module: the `h3` prompt inside the detailed result-card list.
- Behaviour that should change: result-card prompts should use the intended compact sans-serif size, weight, spacing, and line height in light and dark themes at desktop and mobile widths.
- Behaviour that should remain unchanged: the result page's main heading, `Topic signals` and `Question by question` headings, answer status, score, learner and correct answers, explanations, question content, scoring, and result actions.

## Acceptance criteria

- The detailed result-card prompt at desktop uses a compact sans-serif treatment consistent with the component's `text-base` and `leading-7` intent, rather than the global Georgia display style.
- The same compact treatment applies at 390 by 844 and other narrow supported widths.
- Long prompts wrap inside their cards without clipping, horizontal overflow, or overlap with the question number, status, answer columns, or explanations.
- The prompt remains visually subordinate to the `Question by question` section heading while retaining heading semantics and readable contrast in both themes.
- No unrelated global heading styles or the already-corrected review-card prompt styling regress.

## Verification

1. Complete a Paper C attempt with unanswered and answered questions, open its result page, and inspect several short and long prompts at 1280 by 720 and 390 by 844.
2. Repeat in light and dark themes and confirm the prompt font, size, line height, wrapping, and hierarchy.
3. Verify answer status, learner answer, correct answer, explanations, score, and result actions are unchanged.
4. Check console output and horizontal overflow while scrolling the detailed cards.
5. Add or update focused rendering coverage if supported, then run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Low

## Completion notes

- Added a scoped result question heading rule with the intended sans-serif, 16px, 700 weight, and 28px line height treatment.
- Applied the rule to detailed-review question prompts without changing heading semantics or result content.
- Browser-tested the result prompt at 390px wide. Computed styles were Trebuchet MS, 16px, and 28px line height.
- Added scoped anywhere-wrapping so long underscore-only prompts remain inside result cards at 320px.
- No browser console errors were reported.
- Commits: `9037f7a fix(results): compact question prompt headings`, `0d6d370 fix(results): wrap long question prompts`
