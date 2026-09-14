---
id: ISSUE-041
title: Show the accurate Paper A Module 1 outcome
type: bug
depends_on: []
---

# Show the accurate Paper A Module 1 outcome

Area: Paper A scoring and results presentation

## Finding

Paper A Module 1 results do not use the existing `paperAStatusAfterModule1` helper. Every Module 1 result is labelled
`Paper A in progress`, including a score of 24/30. Since Module 2 has only five questions, a 24/30 Module 1 score can
never reach the 30-point Paper A threshold.

## Reproduction

1. Run the application in development mode.
2. Open `/practice/a/m1/000005` or another valid seeded Module 1 route.
3. Use the development `Fill fail` control, proceed through review, and submit.
4. Inspect the result summary.

Observed: the result shows `24/30`, `Required 30 correct`, and `Paper A in progress`, while the maximum possible
combined score is 29/35.

The README also documents a `Pending` Module 1 result when the score can still pass after Module 2. The current result
component does not expose either the pending or impossible outcome, despite the pure helper and unit tests already
existing in `src/lib/score.ts`.

## Expected behaviour

Show an accurate Paper A Module 1 status:

- pending when Module 2 can still bring the combined paper score to the threshold;
- not passed or otherwise clearly impossible when even a perfect Module 2 cannot reach the threshold;
- a clear completion message that Module 2 remains available where appropriate.

Keep the Module 1 score, Paper A threshold, Module 2 action, Paper A combined calculation, and standalone Paper B and C
outcomes unchanged.

## Scope

- Update the Paper A Module 1 result presentation in `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx`.
- Reuse `paperAStatusAfterModule1` rather than duplicating threshold arithmetic.
- Add or extend pure tests for the displayed status mapping and verify all three boundary states.
- Update README copy only if the final learner-facing labels differ from the documented terms.

## Severity

Should fix before production. This is a false learner-facing outcome for a score that cannot pass the paper.

## Verification

Verify Paper A Module 1 scores 24, 25, and 30, the Module 2 transition, Paper A Module 2 combined results, and standalone
Paper B and C results. Run lint, typecheck, tests, build, and `git diff --check`.
