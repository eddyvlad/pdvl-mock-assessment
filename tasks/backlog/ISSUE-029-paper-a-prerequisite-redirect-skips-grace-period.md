---
id: ISSUE-029
title: Paper A prerequisite redirect skips the practice grace period
type: bug
depends_on: []
---

# Paper A prerequisite redirect skips the practice grace period

Area: Paper A Module 2 prerequisite routing and practice timer

## Problem

Opening Paper A Module 2 before completing Module 1 redirects the learner to the matching Module 1 route, but the redirected practice attempt starts counting down immediately. The normal three-second "Get ready" grace state is not shown, so the learner is not clearly told when the assessment timer begins.

## Reproduction

1. Use a fresh six-character seed with no submitted Paper A Module 1 attempt, such as `QX0005`.
2. Open `http://localhost:3000/practice/a/m2/QX0005` at a 1280 by 720 viewport.
3. Observe the redirect to `http://localhost:3000/practice/a/m1/QX0005`.
4. Inspect the timer immediately after the redirect and again over the next three seconds.
5. Compare with opening a fresh Module 1 URL directly, for example `http://localhost:3000/practice/a/m1/QX0003`.

## Expected behaviour

The redirected Module 1 attempt should behave like a fresh practice start: show `Get ready` and `Starts in 3`, count down the three-second grace period, then show `Time remaining` and begin the assessment timer. The redirect should not change the configured duration or silently skip the visible grace state.

## Actual behaviour

After the Module 2 prerequisite redirect, the Module 1 page immediately shows `Time remaining` with about `35:03` and then decreases to `35:02` and `35:01` over the next seconds. The `Get ready` label and `Starts in N` announcement are skipped, so the learner is given no clear indication that the assessment clock is already running. Opening the same Module 1 route directly shows the expected `Get ready` and `Starts in 3` state.

## Root cause

The Paper A guard in the `useEffect` in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:119-132` calls `router.replace(`/practice/a/m1/${seed}`)` and returns when the matching Module 1 result is absent. The client component can remain mounted while the dynamic route changes from `m2` to `m1`, and the redirected render does not reliably enter the fresh-attempt initialization path with `setGrace(3)`. The normal fresh-attempt branch at `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:167-181` sets the grace state, while the resumable-attempt branch at `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx:150-162` explicitly sets `setGrace(0)`; the observed redirected route presents the running timer before the visible grace state is established.

## Implementation scope

- Component/module: Paper A prerequisite guard and fresh-attempt initialization in `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx`; add or update focused tests for a Module 2 prerequisite redirect and fresh timer initialization.
- Behaviour that should change: a prerequisite redirect must initialize or mount Module 1 as a fresh attempt with the same three-second grace presentation and timer semantics as a direct Module 1 start.
- Behaviour that should remain unchanged: Module 2 remains blocked until the matching submitted Module 1 result exists, the redirected seed remains unchanged, persisted resumable attempts still resume without a second grace period, and timer expiry, answer persistence, and result navigation continue to work.

## Acceptance criteria

- Opening an unqualified Paper A Module 2 URL redirects to the matching Module 1 URL with the same seed.
- The redirected Module 1 page visibly shows `Get ready` and `Starts in 3`, then `Starts in 2`, `Starts in 1`, and only after that begins the configured countdown.
- The configured Module 1 timer is not presented as running before the grace countdown completes, and the three-second grace is not silently skipped.
- Opening a fresh Module 1 URL directly and opening it through the prerequisite redirect produce equivalent grace and timer behaviour.
- A valid in-progress attempt opened with its `attempt` query parameter still resumes immediately without a new grace period.
- A submitted Module 1 attempt still permits Module 2 to start normally, with its own intended initialization and timer state.
- The flow remains correct at desktop and mobile viewport sizes and in both light and dark themes.

## Verification

1. Clear or avoid existing Paper A records by using new valid seeds, then open Module 2 directly for at least two seeds.
2. Capture the redirected URL and inspect the timer at approximately 0.2, 1.2, 2.2, and 3.2 seconds.
3. Repeat with a direct fresh Module 1 URL and compare the visible labels, accessible timer announcement, and elapsed countdown.
4. Resume a saved in-progress Module 1 attempt and confirm it does not receive an extra grace period.
5. Complete or submit Module 1 for a matching seed, open Module 2, and confirm the prerequisite path still works.
6. Test at 390 by 844 and 1280 by 720 in both themes, check console errors, then run focused tests or add them if no suitable coverage exists, followed by `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Medium
