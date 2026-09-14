---
id: ISSUE-033
title: Add development assessment scenario controls
type: task
depends_on: []
---

# Add development assessment scenario controls

Area: Practice-page development tooling

## Problem

Completing an assessment manually is slow when validating review, submission, result, and Paper A chaining behaviour. There is no local development control for quickly filling an attempt with known answer patterns, which makes it harder to check all-correct, passing, and failing result states consistently.

## Reproduction

1. Start the application in development mode.
2. Open a valid practice route for Paper A, B, or C.
3. Answer questions manually until a desired score pattern is reached.
4. Repeat the process for the other score states or for another paper.

## Expected behaviour

Practice pages in development mode should expose a clearly labelled scenario panel with controls for filling all answers correctly, filling a passing attempt with some incorrect answers, and filling a failing attempt. The controls should save the answers and leave the user on the practice page so the existing navigation, review, and submission flow can be tested normally.

The helper must produce deterministic, valid answer arrays without changing the question data. Any intentionally incorrect answer must differ from the question's correct answer.

## Implementation scope

- Add a pure scenario-planning helper with explicit types for the scenario name, paper/module context, optional previous Paper A Module 1 score, generated answers, and an unavailable reason.
- Add a development-only practice panel with buttons labelled `Fill all correct`, `Fill pass with some incorrect`, and `Fill fail`.
- Pass a development flag from the practice route so the panel is not rendered in production builds.
- Apply a scenario through one bulk attempt update. Preserve the current question, timer, grace period, attempt identity, route, submission state, and all non-answer fields.
- Keep Google Analytics behaviour unchanged and do not emit synthetic `answer_select` events for the bulk fill operation.
- For standalone Paper B and Paper C, target exactly the configured pass mark for the pass scenario and one below the pass mark for the fail scenario.
- For Paper A Module 1, keep all-correct available, disable pass-with-some-incorrect because the combined score cannot yet be established, and make the fail scenario mathematically unable to reach the paper pass mark even with a perfect Module 2.
- For Paper A Module 2, use the matching submitted Module 1 result for the same seed. Disable scenarios that cannot produce the requested outcome or cannot include an incorrect answer, and explain the reason visibly and accessibly.
- Keep current Paper A prerequisite and combined-scoring behaviour unchanged when no matching Module 1 result exists.

## Acceptance criteria

- The panel is visible on development practice pages for Papers A, B, and C and is absent from production UI.
- `Fill all correct` selects every correct answer and produces an answered count equal to the question count.
- Standalone Paper B pass and fail scenarios produce 22/25 and 21/25 correct respectively.
- Standalone Paper C pass and fail scenarios produce 12/15 and 11/15 correct respectively.
- Paper A Module 1 pass-with-some-incorrect is disabled with an explanation. Its fail scenario remains a fail even if Module 2 is later answered perfectly.
- Paper A Module 2 uses the matching Module 1 score. For example, a Module 1 score of 29 allows a 1/5 Module 2 pass scenario with four incorrect answers, while a score of 24 disables that pass scenario.
- Disabled controls have an accessible explanation and do not alter the attempt.
- Filling answers does not navigate, submit, alter the timer, move the current question, change the attempt schema, or add development-only analytics events.
- Existing review, result, retake, Paper A chaining, theme, keyboard, and persistence behaviour remains unchanged.

## Tests

Add pure unit coverage for:

- all-correct mapping across two to four choices;
- deterministic guaranteed-wrong answers and valid answer indexes;
- Paper B and Paper C pass/fail target counts;
- Paper A Module 1 and Module 2 availability rules;
- immutability of the supplied question data.

## Verification

1. Run the development server and confirm the panel is available on each paper's practice page.
2. Fill each scenario and complete the existing review and submission flow.
3. Verify exact scores and pass/fail labels for Papers A, B, and C.
4. Verify Paper A Module 2 scenarios with matching Module 1 scores of 24, 29, and 30.
5. Confirm the panel is absent from a production build and start process.
6. Check keyboard access, focus visibility, light and dark themes, 1280 by 720, 390 by 844, and 320 by 640 viewports.
7. Check for console errors and horizontal overflow.
8. Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.

## Severity

Medium
