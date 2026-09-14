# Remediation and verification

## Findings register

| ID        | Classification                       | Status                                    |
| --------- | ------------------------------------ | ----------------------------------------- |
| ISSUE-040 | Deployment blocker                   | Backlog task created, delegation pending  |
| ISSUE-041 | Should fix before production         | Backlog task created, delegation pending  |
| ISSUE-042 | Should fix before production         | Backlog task created, delegation pending  |
| ISSUE-043 | Should fix before production         | Backlog task created, delegation pending  |
| ISSUE-044 | Should fix before production         | Backlog task created, delegation pending  |
| ISSUE-045 | Acceptable post-production follow-up | Backlog task created, not in release gate |

## Delegation register

No remediation has been delegated yet. The parent will delegate ISSUE-040 through ISSUE-044 only after the task files are
committed and moved to `tasks/in-progress`.

## Verification register

No remediation has been verified yet.

## Regression pass

The initial assessment is complete. Regression QA is pending remediation and will cover production start dataset loading,
Paper A Module 1 statuses, malformed/expired/browser-storage paths, response headers, analytics opt-in defaults, and the
critical user workflows previously exercised in Chrome.
