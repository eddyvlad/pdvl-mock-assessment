---
id: ISSUE-042
title: Harden browser attempt storage and expiry recovery
type: bug
depends_on: []
---

# Harden browser attempt storage and expiry recovery

Area: v2 browser persistence and timer recovery

## Findings

The v2 storage parser performs only shallow checks. It accepts non-finite timestamps, negative or out-of-range question
positions, arbitrary integer answer indexes, inconsistent answer-array lengths, and submitted records without valid
submission metadata. A malformed browser record can therefore reach practice, review, or results rendering.

The bare practice route also calls `getLatestResumableAttempt()`, which deliberately filters out expired attempts. When
the active pointer refers to an expired in-progress record, the bare route cannot see it and creates a new attempt instead
of auto-submitting the expired record as required by the timer contract.

Finally, `getBrowserStorage()`, `writeAttempt()`, and theme persistence access browser storage without handling
`SecurityError` or `QuotaExceededError`. A blocked or full localStorage can break attempt creation or answer selection
without a recovery state.

## Expected behaviour

- Valid in-progress attempts resume on a matching bare route.
- An expired active in-progress attempt auto-submits exactly once and routes to its result, including after reload.
- Invalid or inconsistent records fail closed and do not render unrelated question data.
- Storage access failures leave the learner with a clear recovery path and do not produce an uncaught application error.
- Existing v2 keys, attempt identity, deterministic questions, timer/grace rules, Paper A chaining, and analytics remain
  unchanged.

## Scope

- Harden `src/lib/attempt-storage.ts` validation and safe browser-storage access.
- Update the practice initialization path and, where needed, theme persistence to handle the helper's safe failure
  result.
- Add unit coverage for malformed fields, expired active attempts, storage exceptions, and valid legacy-compatible v2
  records.
- Keep the persisted schema version at v2 unless a change is strictly necessary; document any compatibility decision.

## Severity

Should fix before production. Browser-local state is the only persistence mechanism, so corruption, expiry, or storage
availability failures directly affect assessment continuity and scoring trust.

## Verification

Use fake storage implementations to exercise valid, mismatched, malformed, expired, quota, and security-error cases.
Browser-test reload/resume and auto-expiry recovery where practical. Run lint, typecheck, all tests, build, and
`git diff --check`.

## Completion notes

- Added fail-closed v2 record validation for timestamps, question positions, answer ranges, array lengths, and
  submission metadata while keeping the v2 keys and score compatibility intact.
- Preserved expired active attempts so the practice route can auto-submit them once after reload or navigation.
- Added safe browser-storage handling across practice, review, results, and theme persistence with clear recovery
  states for blocked or full storage.
- Verified Paper A chaining, deterministic question handling, scoring, and analytics call sites remain unchanged.
- Verification: `npm test -- --runInBand src/lib/__tests__/attempt-storage.test.ts` (13 tests), `npm run lint`,
  `npm run typecheck`, and `npm run build` all pass. The test run reports only the existing Watchman recrawl warning.
