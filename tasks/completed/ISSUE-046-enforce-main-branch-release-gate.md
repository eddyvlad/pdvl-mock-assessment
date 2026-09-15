---
id: ISSUE-046
title: Enforce the main branch release gate
type: chore
depends_on:
  - ISSUE-045
---

# Enforce the main branch release gate

Area: Repository release controls

## Goal

Ensure production changes can reach `main` only after the repository quality workflow has passed.

## Context

ISSUE-045 adds the required CI workflow, but GitHub repository rules are not represented in the codebase. The first
production release uses `main` as the release source, so the workflow's `quality` check must be required there.

## Scope

- Configure or verify a GitHub ruleset or branch protection rule for `main`.
- Require the stable `quality` status check from the CI workflow before merging.
- Prevent force-push and branch deletion for `main`.
- Record the configured rule and verification date without storing credentials or repository secrets.
- Add a concise repository note if the setting cannot be represented as tracked configuration.

## Acceptance criteria

- A pull request targeting `main` cannot merge while `quality` is failing or missing.
- Direct pushes and destructive branch operations follow the configured repository policy.
- The rule is independently verified through GitHub settings or an authenticated read-only API check.
- No application, deployment, analytics, or dataset behavior changes.

## Verification

Inspect the effective GitHub rule, confirm `quality` is the required check, and document any access limitation as an
explicit operator prerequisite rather than marking it verified.

## Completion notes

- Added `docs/release-gates.md` with the required `main` branch protections.
- Applied and verified the GitHub branch rule: required `quality` check, strict up-to-date requirement, administrator
  enforcement, and disabled force-pushes and branch deletion.
- No application, deployment, analytics, or dataset behavior changed.
- `npx prettier --check docs/release-gates.md` and `git diff --check` passed.
