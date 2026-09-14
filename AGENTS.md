# AGENT.md

## Project overview

**PDVL Mock Assessments** is an ongoing web project providing **timed, shareable practice exams** for Singapore's
**Private Hire Car Driver's Vocational Licence (PDVL)** course. The app generates deterministic, seed-based quizzes so
that the same URL always reproduces the same question set and option order. Learners can practice modules individually,
and Paper A computes a combined score across Modules 1 and 2 using a shared seed.

This document is the living contract for how the app behaves, how data is organized, and what constraints other agents
must respect during development.

## Current scope (what this app does)

- Serves **MCQ** assessments for:
  - **Paper A** (pass ≥ **30** correct total)
    - Module 1: 30 Qs, 35 min
    - Module 2: 5 Qs, 10 min
  - **Paper B** (pass ≥ **22**): Module 3B — 25 Qs, 30 min
  - **Paper C** (pass ≥ **12**): Module 4B, 15 Qs, 15 min (2–4 choices per question)
- **All questions** have exactly one correct answer.
- **Deterministic seeding** (Mulberry32 + base62 seed in URL) for reproducible selection and choice order.
- **Guided questions** show one question at a time, followed by a review step and results page. Each attempt has a
  **3-second grace** countdown, persistent timer, and auto-submit on expiry.
- **Paper A chaining:** M1 must be completed before M2; M2 reuses M1’s seed to compute the paper’s combined pass/fail.

## Data layout & versioning

- **Runtime question pools** (served as static assets):

  ```
  public/datasets/v2025-09/
    paper-a-module-1.json   # pool 152 → draw 30
    paper-a-module-2.json   # pool 27  → draw 5
    paper-b-module-3b.json  # pool 153 → draw 25
    paper-c-module-4b.json  # pool 44  → draw 15
  ```

- **Schema** (authoritative, build-time only): `schema/pdvl-question-pool.schema.json`
- **Versioning:** Keep older versions under `public/datasets/<VERSION>/...` so old seeded links remain valid.

## Data contracts (must not break)

- Question object:

  - `prompt: string`
  - `choices: string[]` (length **2–4** for Module 4B; 4 for others)
  - `correctIndex: number` (0-based)
  - `explanation?: string`
  - `tags?: string[]` (optional; lowercase snake_case topic metadata for result signals)
  - `difficulty: "easy" | "medium" | "hard"` (required by the pool schema)

- Pools per module:
  - A-M1: 152 (draw 30)
  - A-M2: 27 (draw 5)
  - B-3B: 153 (draw 25)
  - C-4B: 44 (draw 15)

### Data format

- Question schema: `schema/pdvl-question-pool.schema.json`
  - `choices`: 2–4 strings
  - `correctIndex`: 0-based
  - `explanation`: optional but preferred
  - `tags`: optional lowercase snake_case strings used for result topic signals (see `docs/taxonomy.md`)
  - `difficulty`: one of `easy`, `medium`, or `hard`

### Datasets

- Resolved by `DATASET_VERSION` (see `.env`). Example:
  - `public/datasets/v2025-09/paper-a-module-1.json`
  - ...
- Sampling is currently uniform and does not use tag weights. Tags are retained for result topic signals and future
  balancing work.

## Routing & seeding

- Practice route shape: `/practice/:paper/:module/:seed`
  - `:paper` ∈ `{a,b,c}`
  - `:module` ∈ `{m1,m2,3b,4b}`
  - `:seed` = **base62**, fixed length **6**
- Review and result routes append `/review` and `/result` to the practice route.
- If `:seed` is missing, generate a valid seed and **redirect** to the canonical URL.
- **Randomization rules:**
  - PRNG: **Mulberry32** with the 6-char seed.
  - Derive a **module-scoped** RNG (mix in the module key) to avoid cross-module correlation.
  - **Sample without replacement** to the module’s count.
  - **Keep sampled order** (do not reshuffle question order).
  - **Shuffle choices** deterministically (works for 2–4 choices); remap `correctIndex`.

## Paper A chaining & pass logic

- Users must complete **A-M1** before **A-M2**.
- A-M1 result view includes **Proceed to Module 2** that links to `/practice/a/m2/:seed` with the **same seed**.
- A-M2 checks that a submitted A-M1 v2 attempt with the same seed exists in `localStorage`; otherwise, redirect to A-M1.
- **Paper A score = M1\_correct + M2\_correct**; pass if **≥ 30**. Show module subtotals and combined total.

## Timer, submission, and persistence

- 3-second **grace** when page loads, then countdown starts.
- **Auto-submit** on expiry; unanswered = incorrect.
- Manual submit allowed; **warn** if unanswered remain.
- Persist v2 attempts in `localStorage` under `pdvl:v2:attempt:{attemptId}`. Store the latest active attempt ID under
  `pdvl:v2:active-session`.
- Each attempt stores `startedAt`, `expiresAt`, `updatedAt`, `currentQuestion`, `answers[]`, and its submission state.
- On reload, restore a resumable in-progress attempt. If its expiry has passed, auto-submit it and route to results.

## Results & review

- Show: score, pass/fail (paper-level where applicable), threshold, completion information, per-question correctness,
  correct answer, learner's answer, and **explanations** (when present).
- Show a review step before submission with answered status, selected-answer summaries, and jump-to-question actions.
- Actions: **Retake same seed**, **New seed**, and **Proceed to Module 2** for Paper A where applicable.
- No PDF export required.

## Landing page

- Homepage title and description: maintained in `src/lib/site-metadata.ts` and used by the homepage metadata.
- Module picker grouped by Paper (A/B/C) with question count, time, paper pass mark, and module descriptions.
- A continue-session panel appears when a valid unfinished v2 attempt exists in the browser.

## Topic metadata

- `tags` are optional lowercase snake_case metadata used to aggregate topic signals on results pages.
- Current question sampling is uniform. Do not describe the application as tag-balanced unless a separate sampling
  implementation is added.

## Accessibility & UX

- Adaptive choice labels from A through D based on the number of choices.
- Keyboard shortcuts: `1–4` / `A–D` to select an answer.
- Progress bar (answered / total).
- System, light, and dark theme selection with a persisted preference.
- Mobile-first layout with large tap targets.

## Analytics

- Google Analytics (`gtag`) with events:
  - `assessment_start` ({paper,module,seed,count,minutes,version})
  - `answer_select` ({i,choice,changed})
  - `assessment_submit` ({paper,module,seed,score,total,elapsed,auto})
  - `view_result` ({paper,module,seed,score,total,pass})
  - `copy_link` ({paper,module,seed})
- Guard all GA calls if no Measurement ID is configured.

## Error handling

- JSON fetch fail/offline: friendly error with **Retry** + **Back to landing**.
- Invalid seed (non-base62/length ≠6): auto-redirect to a new valid seed.

## Non-functional notes

- No application database or account system; question pools are static JSON assets and GA is the only third-party.
- Keep bundles small; cache static datasets if desired.

## Definition of Done (for changes in this repo)

- Deterministic reproducibility: same seeded URL ⇒ same questions & choice order.
- Paper A chaining & combined scoring work exactly as described.
- Timer, grace, auto-submit, persistence, and restore behave as specified.
- Explanations render on results; keyboard shortcuts & adaptive labels work.
- Error states are friendly; GA events fire when configured.
- Topic signals render when `tags` exist; sampling remains uniform unless balancing is implemented explicitly.
- Versioned dataset paths supported, with old links still valid where files remain hosted.

## Dev Environment Tips

- **Package Manager**: We use `npm` as our package manager.
- **Running the Dev Server**: To start the development server, run `npm run dev`.
- **Installing Dependencies**: Install project dependencies with `npm install`.
- **Styling**: Apply styles using Tailwind CSS classes.
- **Icons**: Use `lucide` for icons.
- **Environment Variables**: If environment variable needs to be modified or added, add to `.env.example`.

## Testing Instructions

Run the following commands in the project root directory in order to test the project:

- **Linting**: `npm run lint`
- **Run Typecheck**: `npm run typecheck`
- **Run All Tests**: `npm test`
- **Run Specific Tests**: `npm run test -- --verbose [--testNamePattern <pattern> | --runTestsByPath <path/to/test>]`
- **Build Project**: `npm run build` (checks for build errors)

## Code Conventions

- **File Naming**: Use `kebab-case` for file names and `PascalCase` for component names.
- **Imports**: Organize imports alphabetically and group them by type (e.g., third-party, local components, local
  utilities).
- **Error Handling**: Implement robust error handling for API calls and user interactions.
- **Accessibility**: Prioritize accessibility in all UI components.

## AI Agent Specific Instructions

- **Listing Files**: When listing files, use the `ls -al` command so that hidden files are also listed.
- **Human-in-the-Loop**: If implementing agentic features with human-in-the-loop, ensure clear prompts and approval
  mechanisms for user interaction.
- **Documentation**: When implementing new features or making significant changes, update relevant documentation (e.g.,
  `README.md`, component-level comments).

## Repository and agent workflow

- Treat the repository as the durable source of truth. A new agent should be able to continue from `AGENTS.md`, tracked
  documentation, tasks, tests, and source code without relying on prior conversation history.
- Keep the repository structure incremental. Create directories only when a real artifact needs them; do not add empty
  task, documentation, skills, or scratchpad directories.
- Keep this root `AGENTS.md` as the single global agent briefing. Reusable procedures belong in
  `.agents/skills/<skill-name>/SKILL.md`; do not create a competing global instruction file under `.agents/`.
- Use `docs/product/`, `docs/architecture/`, and `docs/adr/` only when meaningful artifacts exist. Do not invent product
  requirements, architecture, ADRs, or graph infrastructure to satisfy a template.
- Do not add a committed `MEMORY.md`. Use `.agents/scratchpad/` only for temporary notes, and ensure it is ignored if
  created. Promote durable findings into the appropriate documentation, tests, or source comments.

## Task workflow and issue allocation

- During planning, use unnumbered task descriptions. Do not predict or manually derive the next issue number.
- Immediately before creating a task file, run `scripts/agent-state issue reserve` and use the returned number in the
  filename and frontmatter.
- Use `{ISSUE_TYPE}-{###}-{slug}.md` filenames. Keep lifecycle directories such as `tasks/backlog`,
  `tasks/in-progress`, `tasks/in-review`, and `tasks/completed` only when they contain real tasks.
- Every task file must have frontmatter containing `id`, `title`, `type`, and `depends_on`. Use the following shape, with
  `depends_on` as a list of stable task IDs and an empty list when the task has no prerequisites:

  ```yaml
  ---
  id: ISSUE-###
  title: Short task title
  type: task
  depends_on: []
  ---
  ```

  `type` must be one of `bug`, `feature`, `enhancement`, `chore`, `refactor`, `test`, `docs`, `content`, `design`, or
  `research`. Use one primary type per task:

  - `bug`: existing behaviour violates the expected behaviour;
  - `feature`: adds a new user or developer capability;
  - `enhancement`: improves an existing capability or user experience;
  - `chore`: covers maintenance, dependencies, configuration, or tooling;
  - `refactor`: restructures internals without intended behaviour changes;
  - `test`: adds or improves test coverage, fixtures, QA tooling, or validation infrastructure;
  - `docs`: changes documentation only;
  - `content`: changes copy, question wording, datasets, or educational material;
  - `design`: covers visual design exploration or UI-system work;
  - `research`: investigates a question or technical spike without an immediate implementation.

  Use the task's area and body for cross-cutting concerns such as accessibility, mobile, performance, or analytics.
  Keep the frontmatter minimal beyond these required fields. The parent lifecycle directory is authoritative for status;
  do not duplicate it in frontmatter without a real consumer.

- Make each task self-contained enough for handoff. Do not silently expand its scope. Every task must produce at least one
  focused Git commit, with completion notes and durable findings promoted out of the task where appropriate.

## Metadata, relationships, and code structure

- Use frontmatter only when structured metadata or relationships provide a practical benefit. Stable IDs should survive
  file moves and title changes.
- Record semantic relationships such as `depends_on`, `implements`, `related_adrs`, and `supersedes` only when they matter.
  Do not maintain reverse links merely for symmetry.
- Derive imports, calls, symbol references, package dependencies, and test relationships from source analysis rather than
  manually maintaining them in Markdown. Any search index or knowledge graph is derived and rebuildable, never the sole
  source of project knowledge.

## Version control and validation

- Use Conventional Commits with imperative, lowercase subjects and a type that reflects the SemVer impact. Keep commits
  cohesive and stage only relevant files.
- Run the applicable lint, typecheck, test, build, allocator, and integration checks before handoff. Validate frontmatter,
  configuration, ignored machine-local state, and `git diff --check` when those concerns are part of the change.

## Local Codebase Memory MCP

- When the project-local configuration is available, prefer Codebase Memory MCP for structural code discovery with
  `search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, `get_architecture`, and `search_code`.
- Run `index_repository` before relying on graph results for a new or stale project. Use direct `rg` searches for exact
  literals, configuration, shell scripts, and other content the graph does not represent well.
- The local activation lives in ignored `.codex/config.toml` and `.agents/mcp_config.json`. Both must use this repository
  as `cwd` and set `CBM_ALLOWED_ROOT` to this repository root.
- Keep the shared Codebase Memory cache outside the repository. Do not run `codebase-memory-mcp install`, change global
  client configuration, or commit binaries, indexes, or persistence artifacts.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
