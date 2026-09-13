---
id: ISSUE-014
---

# Paper A combined results omit the Module 1 and Module 2 subtotals

Area: Paper A scoring and result presentation

## Problem

After completing both Paper A modules, the result page shows only the combined score. The application contract requires the Paper A result to show the module subtotals together with the combined total.

## Steps to reproduce

1. Start Paper A with a valid seed, for example `ABC123`.
2. Complete Module 1 and submit it.
3. Use `Proceed to Module 2` with the same seed.
4. Complete Module 2 and submit the attempt.
5. Inspect the score summary on the Module 2 result page.

## Expected behaviour

The Paper A result should show the Module 1 subtotal, the Module 2 subtotal, and the combined total out of 35, along with the Paper A threshold and pass/fail state.

## Actual behaviour

The result summary contains a single `Combined score` value such as `11/35` or `35/35`. It does not show either module subtotal, so the learner cannot see how each part contributed to the paper result without navigating back to the separate Module 1 result.

## UX and visual observations

The combined score and pass state are clear, but the missing breakdown makes the two-part paper harder to review and gives no direct confirmation that both modules were included in the total.

## Impact and severity

Medium severity. Scoring is calculated correctly, but an explicit result requirement and an important explanation of the Paper A outcome are missing.

## Technical findings

`src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx` computes `combinedScore` from the submitted Module 1 and Module 2 records and renders it as one summary value. The rendered Paper A result did not include separate Module 1 or Module 2 subtotal fields.

## Completion notes

Completed Paper A Module 2 results now show the Module 1 subtotal, Module 2 subtotal, and combined total out of 35, alongside the configured required score and completion details. The existing Paper A pass calculation remains unchanged.

Browser verification completed both modules with the same seed and confirmed the result displayed separate 8/30, 2/5, and 10/35 values. Validation passed with lint, typecheck, tests, build, and `git diff --check`.
