# Production branch release gate

The `main` branch is the production release source. The GitHub repository must require the `quality` job from
`.github/workflows/quality-gates.yml` before a change is accepted.

## Required repository rule

- Required status check: `quality`
- Require the branch to be up to date before merging: enabled
- Enforce the rule for administrators: enabled
- Allow force pushes: disabled
- Allow branch deletion: disabled

The rule does not store credentials or application environment values. The workflow itself uses only read access to the
repository and has no secrets.

## Verification

Inspect the `main` branch rule in GitHub repository settings or with an authenticated read-only API request. Confirm that
the required check is still named `quality` after workflow changes. If the rule is temporarily changed for an incident,
restore it before the next production release.
