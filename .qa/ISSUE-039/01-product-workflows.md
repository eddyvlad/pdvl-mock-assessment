# Product workflows

## Coverage target

Landing and module selection, generated and canonical practice routes, grace countdown and timer, answer selection and
navigation, reload/resume, review submission including incomplete attempts, results, retakes and new seeds, Paper A
Module 1 to Module 2 chaining and combined score, error and recovery states, and analytics guards.

## Investigation state

- Status: verified after remediation
- Tested or inspected: landing and all three paper cards; missing-seed redirects for Papers A, B and C; canonical
  practice, review and result routes; keyboard answer selection; incomplete review submission; completed review direct
  submission; result sharing feedback; Paper A Module 1 to Module 2 chaining; matching seed and grace countdown;
  combined subtotals; mismatched attempt IDs across practice, review and result; missing Module 2 prerequisite; bare-route
  answer persistence and reload.
- Evidence: direct route smoke returned 200 for `/`, canonical practice, review and result pages, 307 for all three
  missing-seed routes, and 404 for invalid paper/module routes. Browser checks confirmed the modal, result navigation,
  Paper A combined `30/30 + 5/5 = 35/35`, and prerequisite redirect.
- Confirmed findings from the initial pass were resolved by [ISSUE-040](../../tasks/completed/ISSUE-040-production-dataset-fetch-protocol.md),
  [ISSUE-041](../../tasks/completed/ISSUE-041-accurate-paper-a-module-one-status.md), and
  [ISSUE-042](../../tasks/completed/ISSUE-042-harden-attempt-storage-recovery.md).
- Regression evidence: Paper B answer and question position survived navigation and reload; a completed Paper B review
  submitted directly and rendered 25/25. Paper A Module 1 and Module 2 completed with the same seed and rendered
  30/30 + 5/5 = 35/35. Mismatched practice, review, and result links showed recovery states, and the active-session
  confirmation remained dismissible with Escape without removing the saved session.
- Unresolved questions: interactive automatic expiry was not waited out; fake-storage tests and the one-time expiry
  path provide automated coverage. Hosting-level failure recovery remains outside the local application.
- Remediation and verification: complete. No application-origin browser errors were observed during the regression pass.
