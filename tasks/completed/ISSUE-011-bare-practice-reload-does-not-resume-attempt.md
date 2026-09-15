---
id: ISSUE-011
title: Reloading a bare practice URL starts a new attempt instead of resuming
type: bug
depends_on: []
---

# Reloading a bare practice URL starts a new attempt instead of resuming

Area: Active attempt persistence and reload recovery

## Problem

The application advertises that an in-progress attempt is saved and restored on reload. A reload of the canonical practice URL without its `attempt` query parameter does not restore the active attempt. It creates a new attempt at question 1 and loses the visible progress from the attempt the learner was working on.

## Steps to reproduce

1. Open a normal seeded practice URL such as `http://localhost:3000/practice/a/m1/AnJOxb`.
2. Select an answer for question 1.
3. Move to question 2 and select an answer.
4. Reload the same URL, without adding an `attempt` query parameter.
5. Observe the question, selected answer, and answered count.

## Expected behaviour

The active in-progress attempt should be restored. The learner should return to the saved current question with the same answers and remaining time.

## Actual behaviour

The reload returns to question 1 with no selected answer and `0 answered`. The URL remains the bare seeded route, and a new attempt is initialized. The previously visible answers are not available through that route.

## UX and visual observations

The reset is silent. There is no warning that a new attempt has replaced the current one, and the landing page can then present the newly initialized attempt as the last session. This makes a normal browser reload look as if saved work has been lost.

## Impact and severity

High severity. Learners can lose progress through a routine reload, refresh, or reopening of a shared seeded practice link.

## Technical findings

`src/app/practice/[paper]/[module]/[seed]/PracticeClient.tsx` only calls `readAttempt` when an `attemptId` prop is present. The bare route creates a fresh record instead of resolving the active resumable attempt for the same paper, module, and seed. The query-based Continue link does restore correctly, so the defect is specific to reloads or direct opens of the canonical route without the query parameter.

## Completion notes

Bare seeded practice routes now resolve the active v2 resumable attempt and restore it only when its paper, module, and seed match the route. A different active assessment is ignored and produces a fresh attempt, preserving the existing active-session contract.

Added route-context matching coverage in attempt storage. Browser verification answered and navigated in Module 1, reloaded the bare URL, and confirmed the saved question and answered count were restored. Validation passed with lint, typecheck, tests, build, and `git diff --check`.
