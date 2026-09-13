---
id: ISSUE-007
title: Build the Steady Signal guided assessment and results flow
type: task
depends_on:
  - ISSUE-006
---

# Build the Steady Signal guided assessment and results flow

## Goal

Replace the current all-questions assessment page with a guided one-question-at-a-time flow, a final review step, and a clearer results experience. Preserve deterministic question selection and scoring while making time, progress, answers, warnings, and explanations easier to understand.

## Context

The current assessment is rendered by `src/app/assess/[paper]/[module]/[seed]/AssessmentClient.tsx` and displays every question in one long form. It handles the three-second grace period, countdown, keyboard shortcuts, localStorage persistence, manual and automatic submission, and Paper A Module 2 gating. Results are rendered by the adjacent `result/ResultsClient.tsx`.

The replacement should use the shared Steady Signal foundation from ISSUE-005 and the landing/session entry contract from ISSUE-006. The completed reference is `docs/brand/mockups/steady-signal.html`. The redesign is allowed to change the interaction flow, but assessment correctness remains the source of truth.

## Route and storage policy

Use the new practice route family:

- `/practice/:paper/:module/:seed`
- `/practice/:paper/:module/:seed/review`
- `/practice/:paper/:module/:seed/result`

The existing `/assess` route family is removed without redirects under the agreed clean-break policy. Existing seeded assessment links and old saved attempts are not migrated.

Use the v2 attempt records:

```ts
type AttemptStatus = 'in-progress' | 'submitted';

interface AttemptRecordV2 {
  version: 2;
  attemptId: string;
  paper: string;
  module: string;
  seed: string;
  startedAt: number;
  expiresAt: number;
  updatedAt: number;
  currentQuestion: number;
  answers: Array<number | null>;
  status: AttemptStatus;
  submittedAt?: number;
  submissionMode?: 'manual' | 'auto';
  score?: number;
}
```

Store attempts under `pdvl:v2:attempt:{attemptId}` and the latest resumable attempt ID under `pdvl:v2:active-session`. A retake of the same seed creates a new attempt record. Only an `in-progress` record whose `expiresAt` is in the future can resume.

## Guided assessment flow

- Keep the three-second grace period before the timer starts.
- Start one attempt record at the beginning of the paper and update it after every answer or navigation change.
- Show one question at a time with paper and module context, question number, timer, answered count, and progress.
- Provide previous and next controls with disabled states at the ends of the question set.
- Preserve 1-4 and A-D keyboard selection, native radio semantics, large answer targets, and visible focus.
- Keep the timer running through question navigation, review, reload, and tab closure. Calculate remaining time from `expiresAt`, rather than trusting a client-only countdown.
- When time expires, submit the saved answers automatically, count unanswered questions as incorrect, and record `submissionMode: "auto"`.
- Offer a final review screen with a question list, answered or unanswered status, selected-answer summary, jump-to-question actions, and a clear submit action.
- Manual submission warns when unanswered questions remain and requires explicit confirmation before submission.
- Preserve Paper A gating. Completing Module 1 makes Module 2 available with the same seed. The combined Paper A result uses both module scores.

## Results experience

- Show score, pass/fail status, threshold, paper and module context, elapsed or completion information, and the next available action before the detailed review.
- Keep `23/25`, `Pass`, and `22 required` as representative states in tests and fixtures.
- Show each question's learner answer, correct answer, unanswered state where applicable, explanation, and a clear correct or incorrect label.
- Aggregate `Question.tags` into compact topic cues with correct and total counts. Show every tag present in the question set. When tags are absent, show the module summary only.
- Keep actions for retaking the same question set, starting a new question set, continuing Paper A where applicable, and sharing the new practice URL.
- Do not add leaderboards, streaks, invented performance scores, or claims that practice results guarantee a pass.

## Analytics and errors

- Keep the existing guarded analytics events: `assessment_start`, `answer_select`, `assessment_submit`, `view_result`, and `copy_link`.
- Preserve existing event fields and their meanings. Update event locations to reflect the guided flow and retain the `auto` distinction for automatic submission.
- Keep the friendly fetch failure, Retry, Back to landing, invalid-seed, and expiry behaviours. Update links to the new practice route family.

## Accessibility and responsive behaviour

- Use semantic landmarks, headings, fieldsets, legends, labels, native radio controls, and a visible focus indicator.
- Announce material timer or submission changes politely without causing a continuous announcement every second.
- Keep warnings, selected answers, correct answers, and incorrect answers distinguishable through text, markers, and structure as well as colour.
- Support the existing high-contrast and large-text options.
- At 375px, keep the timer, progress, question, choices, and navigation usable without horizontal scrolling. At 1280px, use the available space for the question and review summary without creating competing status panels.
- Respect `prefers-reduced-motion` and keep the guided transitions understandable when motion is disabled.

## Scope boundaries

This task owns the new practice routes, guided assessment state, v2 attempt persistence, review step, results review, topic cues, and related tests. It does not redesign the shared shell or landing page, change datasets or deterministic sampling, change score thresholds, add server storage, or preserve the old route and storage model.

## Acceptance criteria

- The new practice flow works at the three routes above and the old `/assess` route family is no longer used by the application.
- A learner can start, answer, navigate, review, submit, reload, resume, retake, and start a new seeded practice attempt.
- Timer restoration and auto-submit use persisted expiry data and behave correctly after reload or expiry.
- Unanswered submission warnings, Paper A gating, combined scoring, invalid seeds, and error recovery remain correct.
- Results expose score, outcome, threshold, answers, explanations, and tag-based topic cues without relying on colour alone.
- Existing analytics events remain guarded and semantically correct.
- Keyboard, focus, native form, high-contrast, large-text, reduced-motion, mobile, and desktop checks pass.
- Add unit and integration tests for the state transitions, v2 storage, continuation, timer expiry, review submission, Paper A chaining, score results, tagged and untagged topics, and clean-break handling of old records.
- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before completion. Produce one focused Conventional Commit for this task.

## Completion notes

- Replaced the old all-questions `/assess` route family with `/practice/:paper/:module/:seed`, its `/review` step, and its `/result` view. The old route files were removed without redirects, and the production route manifest exposes only the new family.
- Added guided one-question navigation with native radio controls, 1-4 and A-D shortcuts, persisted current question state, a three-second grace period, and expiry-based timing that continues through the review screen.
- Added v2 attempt creation, answer and navigation persistence, manual review confirmation, automatic expiry submission, Paper A Module 2 gating, combined Paper A scoring, retake and new-seed actions, guarded analytics calls, and a friendly question-load error state.
- Added result summaries with score, threshold, completion mode, learner and correct answers, explanations, and tag-based topic signals. Untagged question sets show a plain module review cue instead.
- Browser smoke checks passed for the landing page, guided Paper B flow, answer selection, next-question navigation, continue-session panel, `/assess` returning 404, and the 375px viewport with no horizontal overflow. The responsive viewport was restored after testing.
- Validation passed: `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.
