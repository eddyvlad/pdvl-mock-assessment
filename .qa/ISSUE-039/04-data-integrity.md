# Data integrity

## Coverage target

Validate active dataset version, pool sizes, schema and correct indexes; deterministic seeded selection and choice
shuffling; Paper A seed identity and combined scoring; v2 attempt serialization, restoration, expiry and malformed or
mismatched records; and topic metadata presentation.

## Investigation state

- Status: verified after remediation
- Tested or inspected: all v2025-09 pools, schema contract assertions, Paper C copy checks, deterministic sampling unit
  tests, correct answer indexes, scenario helper targets, attempt parsing and matching tests, browser persistence and
  Paper A score chaining.
- Evidence: pools are 152, 27, 153, and 44; every question has valid non-empty choices, difficulty, and an in-range
  `correctIndex`; 46 unit tests pass; browser checks preserved selected answers, current question, seed, grace, and
  Paper A `35/35` combined scoring.
- Confirmed findings from the initial pass were resolved by [ISSUE-042](../../tasks/completed/ISSUE-042-harden-attempt-storage-recovery.md),
  which validates v2 record shape and keeps expired active records available for auto-submit recovery.
- Unresolved questions: malformed records were not injected into browser storage because browser instructions prohibit
  direct storage inspection or mutation; fake-storage unit coverage is the planned verification.
- Remediation and verification: complete. Storage tests cover malformed fields, context validation, expiry, quota, and
  security-error paths. Paper A same-seed chaining and combined scoring were rechecked in the browser.
