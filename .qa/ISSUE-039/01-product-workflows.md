# Product workflows

## Coverage target

Landing and module selection, generated and canonical practice routes, grace countdown and timer, answer selection and
navigation, reload/resume, review submission including incomplete attempts, results, retakes and new seeds, Paper A
Module 1 to Module 2 chaining and combined score, error and recovery states, and analytics guards.

## Investigation state

- Status: initial pass complete, remediation required
- Tested or inspected: landing and all three paper cards; missing-seed redirects for Papers A, B and C; canonical
  practice, review and result routes; keyboard answer selection; incomplete review submission; completed review direct
  submission; result sharing feedback; Paper A Module 1 to Module 2 chaining; matching seed and grace countdown;
  combined subtotals; mismatched attempt IDs across practice, review and result; missing Module 2 prerequisite; bare-route
  answer persistence and reload.
- Evidence: direct route smoke returned 200 for `/`, canonical practice, review and result pages, 307 for all three
  missing-seed routes, and 404 for invalid paper/module routes. Browser checks confirmed the modal, result navigation,
  Paper A combined `30/30 + 5/5 = 35/35`, and prerequisite redirect.
- Confirmed findings: a 24/30 Paper A Module 1 result renders `Paper A in progress` even though the maximum combined score
  is 29/35. See [ISSUE-041](../../tasks/backlog/ISSUE-041-accurate-paper-a-module-one-status.md). Production dataset
  loading failure is recorded in [ISSUE-040](../../tasks/backlog/ISSUE-040-production-dataset-fetch-protocol.md).
- Unresolved questions: automatic expiry was not waited out interactively; the source and storage tests expose the bare
  expired-record path and it is covered by ISSUE-042.
- Remediation and verification: pending delegation and regression pass.
