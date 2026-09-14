---
id: ISSUE-037
title: Document Codebase Memory project and Git worktree cleanup guidance
type: docs
depends_on: []
---

# Document Codebase Memory project and Git worktree cleanup guidance

Area: Agent workflow documentation

## Problem

`AGENTS.md` explains how to use Codebase Memory MCP, but it does not identify the canonical project for the main repository or define cleanup ownership when agents use separately indexed Git worktrees. This can lead to unnecessary project discovery calls and unclear cleanup responsibilities.

## Expected behaviour

- Main-repository project-scoped Codebase Memory MCP operations use `pdvl-mock-assessment` directly.
- Agents do not call `list_projects` merely to discover or verify the known main-repository project.
- Agents call `list_projects` only when project identity is genuinely unknown or ambiguous, or when project discovery is specifically required by the task.
- Worktree-scoped operations use the Codebase Memory project associated with that worktree when a separate index exists.
- The agent that creates or uses a worktree-specific Codebase Memory project deletes that project when its task is complete.
- A child agent deletes only the Codebase Memory project associated with its worktree and does not remove the Git worktree.
- The parent agent that created the Git worktree removes it only after the child's work has been reviewed and validated.

## Implementation scope

- Update the existing `Local Codebase Memory MCP` section in `AGENTS.md` with the main-repository project identity and the rules for project discovery.
- Add the worktree-specific indexing and cleanup ownership rules to the same section.
- Avoid duplicating these rules in `Repository and agent workflow`, nodeterm canvas guidance, or other sections.
- Preserve the existing Codebase Memory instructions for indexing, coverage checks, direct searches, local configuration, and external cache storage.
- Do not change application code, MCP configuration files, Git worktrees, or task lifecycle state.

## Acceptance criteria

- `AGENTS.md` names `pdvl-mock-assessment` as the direct project identifier for the main repository.
- The guidance explicitly limits `list_projects` to unknown, ambiguous, or task-required project discovery cases.
- The guidance explains how to select and delete worktree-specific Codebase Memory projects.
- The guidance clearly separates child-agent Codebase Memory cleanup from parent-agent Git worktree removal.
- All related guidance appears in one appropriate existing section without duplicate policy text elsewhere.
- The change preserves existing Codebase Memory setup and coverage requirements.

## Verification

1. Read the existing `Local Codebase Memory MCP` and repository workflow sections before editing.
2. Update only the Codebase Memory section and inspect the resulting diff for duplicated or contradictory instructions.
3. Confirm the main project name, `list_projects` exception cases, worktree project cleanup rule, child-agent boundary, and parent-agent removal responsibility are all present.
4. Run `git diff --check` and confirm no application code, MCP configuration, Git worktree, or unrelated task files changed.

## Severity

Low
