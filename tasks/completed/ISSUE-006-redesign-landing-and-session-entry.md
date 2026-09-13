---
id: ISSUE-006
title: Redesign the Steady Signal landing page and session entry
type: task
depends_on:
  - ISSUE-005
---

# Redesign the Steady Signal landing page and session entry

## Goal

Replace the current landing page with a Steady Signal entry experience that makes the three papers easy to compare, explains Paper A's sequence clearly, and gives learners a safe way to continue the most recent unfinished attempt.

## Context

The current landing page is implemented in `src/app/page.tsx` as a prose column with three generic cards. It contains the right paper and module facts, but the hierarchy does not yet use the Roadcraft card layout or the Steady Signal typography and tokens. The shared shell and theme foundation come from ISSUE-005. The completed reference is `docs/brand/mockups/steady-signal.html`.

## Experience requirements

### Hero and navigation

- Use the Steady Signal wordmark and the shared shell from ISSUE-005.
- Introduce the product with short, calm copy that explains timed PDVL practice for private-hire drivers.
- Keep the first action focused on choosing a paper.
- Use clear section links or equivalent navigation without adding a dashboard or account flow.

### Paper cards

Use Roadcraft's information order and card anatomy in both light and dark themes:

1. Large paper letter and paper identifier.
2. Paper or module title.
3. Short subject description.
4. Compact metadata for question count, duration, pass mark, and format.
5. Action aligned consistently at the bottom of the card.

Show the existing facts:

- Paper A: Module 1 has 30 questions and 35 minutes. Module 2 has 5 questions and 10 minutes. The combined pass mark is 30 correct.
- Paper B: Module 3B has 25 questions, 30 minutes, and a pass mark of 22 correct.
- Paper C: Module 4B covers route planning using digital navigational tools, with its existing configured question count, duration, and pass mark.

Paper A must visibly communicate that Module 1 comes before Module 2 and that the final result combines both modules. The card action starts Module 1.

### Continue last session

Add a clearly separated continuation panel only when a new versioned active session record exists. It must show:

- Paper and module name.
- Answered count and total.
- A plain-language status such as "In progress".
- A "Continue" action that returns to the saved question.
- A separate action to discard the active pointer and choose a new paper, with confirmation before the pointer is cleared.

Use the most recently updated unfinished attempt. If Paper A Module 1 is complete and Module 2 is pending, continue at Module 2. Completed attempts do not appear in this panel. Multiple old attempts remain available to the results route but do not create multiple continuation panels.

Use this versioned storage contract for active-session discovery:

- Attempt records use `pdvl:v2:attempt:{attemptId}`.
- The latest resumable attempt ID is stored at `pdvl:v2:active-session`.
- The active record includes `version: 2`, `attemptId`, `paper`, `module`, `seed`, `updatedAt`, `currentQuestion`, `answers`, and `status`.
- Only records with `status: "in-progress"` and a future `expiresAt` are resumable.
- Existing `pdvl:{paper}-{module}:{seed}` records are ignored under the agreed clean-break policy.

## Scope boundaries

This task changes the landing page and session-entry UI plus the small read-only helper needed to identify the active v2 attempt. It does not implement the guided question flow, timer changes, result review, question sampling, scoring, route migration, or the shared visual foundation. The assessment and results task owns the full attempt lifecycle.

## Acceptance criteria

- The landing page uses Steady Signal type, colour, surface, control, and responsive conventions from ISSUE-005.
- Paper A, Paper B, and Paper C are visually distinct entries with readable metadata and correctly placed actions.
- Paper A's module order and combined pass condition are clear before starting.
- The continuation panel appears only for a valid unfinished v2 attempt and selects the most recently updated record.
- A Paper A Module 1 completion with Module 2 pending continues to Module 2.
- Starting a new paper and continuing an existing paper remain separate actions. Clearing the active pointer requires confirmation.
- The page remains usable at 375px, 1280px, keyboard focus, and 200% zoom without horizontal overflow.
- All meaningful states use text and control semantics alongside colour. The continuation panel is understandable when colour is unavailable.
- Existing paper configuration values remain the source of truth. No question, scoring, analytics, or error-handling contract changes.
- Add tests for paper-card content, Paper A sequencing, no-active-session state, expired or completed active-session state, and selection of the most recently updated unfinished record.
- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before completion. Produce one focused Conventional Commit for this task.

## Completion notes

- Rebuilt the landing page around distinct Paper A, B, and C cards with large letter markers, paper subjects, module detail, question and duration metadata, pass marks, and bottom-aligned actions.
- Added the Steady Signal introduction and a direct "How it works" explanation so the guided flow is clear before a learner starts.
- Added `src/lib/attempt-storage.ts` for the version 2 attempt contract and active-session pointer. The landing page only considers the active v2 record when it is unfinished and has future expiry.
- Legacy `pdvl:{paper}-{module}:{seed}` records are not read by the new helper. Submitted and expired v2 records are also excluded from the continue panel.
- Added a separate "New paper" action that clears the active pointer only after confirmation. Existing attempt records remain available for the future results route.
- Validation passed: `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, and `git diff --check`.
