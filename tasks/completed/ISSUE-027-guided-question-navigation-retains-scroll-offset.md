---
id: ISSUE-027
title: Guided question navigation retains the previous scroll offset
type: bug
depends_on: []
---

# Guided question navigation retains the previous scroll offset

Area: Guided practice question navigation

## Problem

Selecting Next question or Previous after scrolling through a question card leaves the browser at the prior document scroll position. The newly selected question is therefore rendered partway down the viewport, and its heading can be hidden behind the sticky navigation bar. This is especially disruptive for long Paper C prompts and on mobile, where the learner can lose the context of the question they just opened.

## Reproduction

1. Open `http://localhost:3000/practice/c/4b/QA0001` at a 390 by 844 viewport and wait for the practice page to load.
2. Select any answer for question 1.
3. Scroll down until the question-card navigation buttons are visible.
4. Activate `Next question`.
5. Observe the new question at the top of the viewport, then repeat by activating `Previous` from a later question.
6. Repeat at a 1280 by 720 viewport to observe the same behaviour with a long question prompt.

## Expected behaviour

After Next question or Previous changes the current question, the practice view should place the newly selected question card at a predictable readable position below the sticky navigation bar. The question number, prompt, answer choices, and navigation controls should remain usable without requiring the learner to manually scroll back to the question heading.

## Actual behaviour

The page retains the scroll offset from the previous question. In the tested Paper C flow, after moving from question 1 to question 2, `window.scrollY` remained around 474 pixels at a 1280 by 720 viewport and the new question heading began around 21 pixels from the viewport top, underneath the approximately 73-pixel sticky navigation bar. At 390 by 844, the new question also opened with its heading partly covered by the sticky header. Moving back with Previous retains the same offset and can leave the first question heading hidden as well.

## Root cause

`goToQuestion` in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:214-218` only calls `patchAttempt({ currentQuestion: index })`. The Next question and Previous button handlers call this function, but no scroll restoration or focus management runs after the question index changes. React updates the question content in place, so the browser preserves the existing document scroll position while the sticky `.site-nav` in `src/app/globals.css` remains over the top of the content. There is no existing practice-question heading anchor or effect that repositions the viewport after navigation.

## Implementation scope

- Component/module: guided navigation in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`; add or update a focused practice-navigation test if the project test setup supports the behaviour.
- Behaviour that should change: Next question and Previous should restore the new question card or heading to a readable position below the sticky navigation, and should work for short and long prompts at desktop and mobile widths.
- Consider using a stable question-card or heading ref with a scroll margin that accounts for `.site-nav`, and preserve keyboard focus in a sensible location when navigation is triggered by keyboard.
- Behaviour that should remain unchanged: answer persistence, current-question persistence, timer/grace-period behaviour, keyboard answer shortcuts, review navigation from the final question, browser history, and the existing disabled state of Previous on question 1.

## Acceptance criteria

- After Next question from any question, the newly selected question prompt is visible below the sticky navigation without manual scrolling.
- After Previous from any enabled question, the newly selected question prompt is visible below the sticky navigation without manual scrolling.
- The behaviour works for Papers A, B, and C, including long prompts and variable choice counts.
- The behaviour works at representative desktop, tablet, and mobile viewport sizes in both light and dark themes.
- Navigation does not introduce horizontal overflow, layout clipping, or a visible jump that hides the question context.
- Answer selection, autosave, timer state, review navigation, and browser back/forward behaviour remain unchanged.
- The first-question Previous button remains disabled and does not trigger a scroll or focus change when activated.

## Verification

1. Open fresh seeded attempts for Papers A, B, and C at 1280 by 720, 768 by 900, and 390 by 844 viewports.
2. Select answers, scroll to the navigation controls, and use Next question through several questions, including a long prompt.
3. Use Previous to return through the same questions and verify each prompt begins below the sticky header.
4. Repeat the navigation with keyboard focus and confirm the focused control remains visible and useful.
5. Check both light and dark themes, reload the attempt, and confirm persisted answers and current-question state are unaffected.
6. Run the focused test or add one if no suitable automated coverage exists, then run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium

## Completion notes

- Added a stable question heading ref with `tabIndex={-1}` and a navigation-change effect that scrolls the new prompt below the sticky navigation before moving focus without a second scroll.
- Added `scroll-margin-top` to the practice question heading so keyboard and pointer navigation retain the question context at mobile widths.
- Verified at 390 by 844 that the new heading receives focus, begins at 88px below the viewport top, and remains clear of the 73px navigation bar without horizontal overflow.
- `npm run lint`, `npm run typecheck`, and `npm test -- --runInBand` pass.
