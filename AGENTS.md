# AGENT.md

## Project overview

**PDVL Mock Assessments** is an ongoing web project providing **timed, shareable practice exams** for Singapore’s *
*Private Hire Car Driver’s Vocational Licence (PDVL)** course. The app generates deterministic, seed-based quizzes so
that the same URL always reproduces the same question set and option order. Learners can practice modules individually,
and Paper A computes a combined score across Modules 1 and 2 using a shared seed.

This document is the living contract for how the app behaves, how data is organized, and what constraints other agents
must respect during development.

## Current scope (what this app does)

* Serves **MCQ** assessments for:
    * **Paper A** (pass ≥ **30** correct total)
        * Module 1: 30 Qs, 35 min
        * Module 2: 5 Qs, 10 min
    * **Paper B** (pass ≥ **22**): Module 3B — 25 Qs, 30 min
    * **Paper C** (pass ≥ **30**): Module 4B — 15 Qs, 15 min (2–4 choices per question)
* **All questions** have exactly one correct answer.
* **Deterministic seeding** (Mulberry32 + base62 seed in URL) for reproducible selection and choice order.
* **All questions on one page** per module, with a **3-second grace** countdown, persistent timer, and auto-submit on
  expiry.
* **Paper A chaining:** M1 must be completed before M2; M2 reuses M1’s seed to compute the paper’s combined pass/fail.

## Data layout & versioning

* **Runtime question pools** (served as static assets):

  ```
  public/datasets/v2025-09/
    paper-a-module-1.json   # pool 150 → draw 30
    paper-a-module-2.json   # pool 25  → draw 5
    paper-b-module-3b.json  # pool 150 → draw 25
    paper-c-module-4b.json  # pool 42  → draw 15
  ```
* **Schema** (authoritative, build-time only): `schema/pdvl-question-pool.schema.json`
* **Versioning:** Keep older versions under `public/datasets/<VERSION>/...` so old seeded links remain valid.

## Data contracts (must not break)

* Question object:

    * `prompt: string`
    * `choices: string[]` (length **2–4** for Module 4B; 4 for others)
    * `correctIndex: number` (0-based)
    * `explanation?: string`
    * `tags?: string[]` (optional; used for topic balancing)
* Pools per module:
    * A-M1: 150 (draw 30)
    * A-M2: 25  (draw 5)
    * B-3B: 150 (draw 25)
    * C-4B: 42  (draw 15)

### Data format

- Question schema: `schema/pdvl-question.schema.json`
    - `choices`: 2–4 strings
    - `correctIndex`: 0-based
    - `explanation`: optional but preferred
    - `tags`: string[] used for topic balancing (see `docs/taxonomy.md`)

### Datasets

- Resolved by `DATASET_VERSION` (see `.env`). Example:
    - `public/datasets/v2025-09/paper-a-module-1.json`
    - ...
- When sampling, honor `tags` weights if provided by the page route or default config.

## Routing & seeding

* Route shape: `/assess/:paper/:module/:seed`
    * `:paper` ∈ `{a,b,c}`
    * `:module` ∈ `{m1,m2,3b,4b}`
    * `:seed` = **base62**, fixed length **6**
* If `:seed` is missing, generate a valid seed and **redirect** to the canonical URL.
* **Randomization rules:**
    * PRNG: **Mulberry32** with the 6-char seed.
    * Derive a **module-scoped** RNG (mix in the module key) to avoid cross-module correlation.
    * **Sample without replacement** to the module’s count.
    * **Keep sampled order** (do not reshuffle question order).
    * **Shuffle choices** deterministically (works for 2–4 choices); remap `correctIndex`.

## Paper A chaining & pass logic

* Users must complete **A-M1** before **A-M2**.
* A-M1 result view includes **Proceed to Module 2** that links to `/assess/a/m2/:seed` with the **same seed**.
* A-M2 checks that A-M1 (same seed) exists in `localStorage`; otherwise, redirect to A-M1.
* **Paper A score = M1\_correct + M2\_correct**; pass if **≥ 30**. Show module subtotals and combined total.

## Timer, submission, and persistence

* 3-second **grace** when page loads, then countdown starts.
* **Auto-submit** on expiry; unanswered = incorrect.
* Manual submit allowed; **warn** if unanswered remain.
* Persist in `localStorage` under `pdvl:{paper}-{module}:{seed}` with `start`, `end`, `answers[]`.
* On reload, restore state; if time expired while closed, treat as expired and route to results.

## Results & review

* Show: score, pass/fail (paper-level where applicable), elapsed time, per-question correctness, correct answer, user’s
  answer, and **explanations** (when present).
* Actions: **Retake same seed**, **New seed**.
* No PDF export required.

## Landing page

* Title/description: maintained in `docs/copy.md` (final copy TBD).
* Module picker grouped by Paper (A/B/C) with “#Qs • time • paper pass mark”.
* No “continue last session” entry point on landing.

## Topic balancing

* If `tags` are present in a pool, prefer **even coverage** across tags (simple stratified sampling).
* If `tags` are absent, use **uniform** random sampling.

## Accessibility & UX

* Adaptive choice labels (A–B, A–C, A–D).
* Keyboard shortcuts: `1–4` / `A–D` to select; `Enter` to submit.
* Progress bar (answered / total).
* High-contrast toggle and large-text mode.
* Mobile-first layout with large tap targets.

## Analytics

* Google Analytics (`gtag`) with events:
    * `assessment_start` ({paper,module,seed,count,minutes,version})
    * `answer_select` ({i,choice,changed})
    * `assessment_submit` ({paper,module,seed,score,total,elapsed,auto})
    * `view_result` ({paper,module,seed,score,total,pass})
    * `copy_link` ({paper,module,seed})
* Guard all GA calls if no Measurement ID is configured.

## Error handling

* JSON fetch fail/offline: friendly error with **Retry** + **Back to landing**.
* Invalid seed (non-base62/length ≠6): auto-redirect to a new valid seed.

## Non-functional notes

* Client-only; fetches static JSON; GA is the only third-party.
* Keep bundles small; cache static datasets if desired.

great callouts. here’s a clean repo layout plan + an AGENT.md that opens with “what this project is,” not “go build X.”

# AGENT.md

## Project overview

**PDVL Mock Assessments** is an ongoing web project providing **timed, shareable practice exams** for Singapore’s *
*Private Hire Car Driver’s Vocational Licence (PDVL)** course. The app generates deterministic, seed-based quizzes so
that the same URL always reproduces the same question set and option order. Learners can practice modules individually,
and Paper A computes a combined score across Modules 1 and 2 using a shared seed.

This document is the living contract for how the app behaves, how data is organized, and what constraints other agents
must respect during development.

## Current scope (what this app does)

* Serves **MCQ** assessments for:
    * **Paper A** (pass ≥ **30** correct total)
        * Module 1: 30 Qs, 35 min
        * Module 2: 5 Qs, 10 min
    * **Paper B** (pass ≥ **22**): Module 3B — 25 Qs, 30 min
    * **Paper C** (pass ≥ **30**): Module 4B — 15 Qs, 15 min (2–4 choices per question)
* **All questions** have exactly one correct answer.
* **Deterministic seeding** (Mulberry32 + base62 seed in URL) for reproducible selection and choice order.
* **All questions on one page** per module, with a **3-second grace** countdown, persistent timer, and auto-submit on
  expiry.
* **Paper A chaining:** M1 must be completed before M2; M2 reuses M1’s seed to compute the paper’s combined pass/fail.

## Data layout & versioning

* **Runtime question pools** (served as static assets):

  ```
  public/datasets/v2025-09/
    paper-a-module-1.json   # pool 150 → draw 30
    paper-a-module-2.json   # pool 25  → draw 5
    paper-b-module-3b.json  # pool 150 → draw 25
    paper-c-module-4b.json  # pool 42  → draw 15
  ```
* **Schema** (authoritative, build-time only): `schema/pdvl-question-pool.schema.json`
* **Versioning:** Keep older versions under `public/datasets/<VERSION>/...` so old seeded links remain valid.

## Data contracts (must not break)

* Question object:

    * `prompt: string`
    * `choices: string[]` (length **2–4** for Module 4B; 4 for others)
    * `correctIndex: number` (0-based)
    * `explanation?: string`
    * `tags?: string[]` (optional; used for topic balancing)
* Pools per module:
    * A-M1: 150 (draw 30)
    * A-M2: 25  (draw 5)
    * B-3B: 150 (draw 25)
    * C-4B: 42  (draw 15)

### Data format

- Question schema: `schema/pdvl-question.schema.json`
    - `choices`: 2–4 strings
    - `correctIndex`: 0-based
    - `explanation`: optional but preferred
    - `tags`: string[] used for topic balancing (see `docs/taxonomy.md`)

### Datasets

- Resolved by `DATASET_VERSION` (see `.env`). Example:
    - `public/datasets/v2025-09/paper-a-module-1.json`
    - ...
- When sampling, honor `tags` weights if provided by the page route or default config.

## Routing & seeding

* Route shape: `/assess/:paper/:module/:seed`
    * `:paper` ∈ `{a,b,c}`
    * `:module` ∈ `{m1,m2,3b,4b}`
    * `:seed` = **base62**, fixed length **6**
* If `:seed` is missing, generate a valid seed and **redirect** to the canonical URL.
* **Randomization rules:**
    * PRNG: **Mulberry32** with the 6-char seed.
    * Derive a **module-scoped** RNG (mix in the module key) to avoid cross-module correlation.
    * **Sample without replacement** to the module’s count.
    * **Keep sampled order** (do not reshuffle question order).
    * **Shuffle choices** deterministically (works for 2–4 choices); remap `correctIndex`.

## Paper A chaining & pass logic

* Users must complete **A-M1** before **A-M2**.
* A-M1 result view includes **Proceed to Module 2** that links to `/assess/a/m2/:seed` with the **same seed**.
* A-M2 checks that A-M1 (same seed) exists in `localStorage`; otherwise, redirect to A-M1.
* **Paper A score = M1\_correct + M2\_correct**; pass if **≥ 30**. Show module subtotals and combined total.

## Timer, submission, and persistence

* 3-second **grace** when page loads, then countdown starts.
* **Auto-submit** on expiry; unanswered = incorrect.
* Manual submit allowed; **warn** if unanswered remain.
* Persist in `localStorage` under `pdvl:{paper}-{module}:{seed}` with `start`, `end`, `answers[]`.
* On reload, restore state; if time expired while closed, treat as expired and route to results.

## Results & review

* Show: score, pass/fail (paper-level where applicable), elapsed time, per-question correctness, correct answer, user’s
  answer, and **explanations** (when present).
* Actions: **Retake same seed**, **New seed**.
* No PDF export required.

## Landing page

* Title/description: maintained in `docs/copy.md` (final copy TBD).
* Module picker grouped by Paper (A/B/C) with “#Qs • time • paper pass mark”.
* No “continue last session” entry point on landing.

## Topic balancing

* If `tags` are present in a pool, prefer **even coverage** across tags (simple stratified sampling).
* If `tags` are absent, use **uniform** random sampling.

## Accessibility & UX

* Adaptive choice labels (A–B, A–C, A–D).
* Keyboard shortcuts: `1–4` / `A–D` to select; `Enter` to submit.
* Progress bar (answered / total).
* High-contrast toggle and large-text mode.
* Mobile-first layout with large tap targets.

## Analytics

* Google Analytics (`gtag`) with events:
    * `assessment_start` ({paper,module,seed,count,minutes,version})
    * `answer_select` ({i,choice,changed})
    * `assessment_submit` ({paper,module,seed,score,total,elapsed,auto})
    * `view_result` ({paper,module,seed,score,total,pass})
    * `copy_link` ({paper,module,seed})
* Guard all GA calls if no Measurement ID is configured.

## Error handling

* JSON fetch fail/offline: friendly error with **Retry** + **Back to landing**.
* Invalid seed (non-base62/length ≠6): auto-redirect to a new valid seed.

## Non-functional notes

* Client-only; fetches static JSON; GA is the only third-party.
* Keep bundles small; cache static datasets if desired.

## Definition of Done (for changes in this repo)

* Deterministic reproducibility: same seeded URL ⇒ same questions & choice order.
* Paper A chaining & combined scoring work exactly as described.
* Timer, grace, auto-submit, persistence, and restore behave as specified.
* Explanations render on results; keyboard shortcuts & adaptive labels work.
* Error states are friendly; GA events fire when configured.
* Topic balancing honored when `tags` exist; otherwise uniform.
* Versioned dataset paths supported, with old links still valid where files remain hosted.

## Dev Environment Tips

- **Package Manager**: We use `npm` as our package manager.
- **Running the Dev Server**: To start the development server, run `npm dev`.
- **Installing Dependencies**: Install project dependencies with `npm i`.
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
