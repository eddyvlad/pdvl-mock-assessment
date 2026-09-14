# Data integrity

## Coverage target

Validate active dataset version, pool sizes, schema and correct indexes; deterministic seeded selection and choice
shuffling; Paper A seed identity and combined scoring; v2 attempt serialization, restoration, expiry and malformed or
mismatched records; and topic metadata presentation.

## Investigation state

- Status: initial pass complete, remediation required
- Tested or inspected: all v2025-09 pools, schema contract assertions, Paper C copy checks, deterministic sampling unit
  tests, correct answer indexes, scenario helper targets, attempt parsing and matching tests, browser persistence and
  Paper A score chaining.
- Evidence: pools are 152, 27, 153, and 44; every question has valid non-empty choices, difficulty, and an in-range
  `correctIndex`; 31 unit tests pass; browser checks preserved selected answers, current question, seed, grace, and
  Paper A `35/35` combined scoring.
- Confirmed findings: `parseAttemptRecord` accepts inconsistent or non-finite fields and does not validate answer-array
  shape; bare practice ignores expired active records; browser storage exceptions are uncaught. See
  [ISSUE-042](../../tasks/backlog/ISSUE-042-harden-attempt-storage-recovery.md).
- Unresolved questions: malformed records were not injected into browser storage because browser instructions prohibit
  direct storage inspection or mutation; fake-storage unit coverage is the planned verification.
- Remediation and verification: pending delegation and focused storage tests.
