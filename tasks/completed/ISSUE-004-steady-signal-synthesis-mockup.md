---
id: ISSUE-004
title: Create the Steady Signal synthesis brand mockup
type: task
depends_on: []
---

# Steady Signal

## Goal

Create a fourth standalone static mockup that combines the strongest decisions from the Roadcraft, Steady Study, and Night Signal explorations. Use Steady Study as the primary light-mode direction, add Night Signal as a CSS-only dark theme, and carry Roadcraft's card anatomy and assessment information architecture into both themes.

## Brand direction and rationale

Steady Signal should feel calm and considered at the start of practice, while becoming precise and easy to scan during a timed paper. The light theme uses Steady Study's warm editorial foundation. The dark theme uses Night Signal's darker surfaces and signal colours as an alternate viewing mode. Both themes share the same content structure, type system, and interaction hierarchy.

Roadcraft's paper cards already make counts, duration, subject, and pass marks easy to compare. Its assessment layout also gives time, progress, question content, answer choices, warnings, and tools clear positions. Preserve those information decisions while removing the transport-manual styling. This directly addresses Steady Study's weaker information clarity and keeps the exploration focused on a useful product experience rather than a surface-level colour blend.

The working name is "Steady Signal", paired with "PDVL practice assessments". It is an exploration label, not an approved product rename. The concept tests whether a quiet learning tone can coexist with decisive timed-test status. It must not imply that dark mode improves performance, that the product is an official regulator tool, or that practice results guarantee a pass.

## Brand personality

Calm, capable, clear, and attentive. Use short, direct labels for actions and status: "Choose a paper", "Time remaining", "12 of 25 answered", and "Review answers". Explanations should be patient and candid. Avoid motivational slogans, streaks, leaderboards, racing language, military language, and learner-facing technical terms such as seeds.

## Visual language

Use a warm editorial page with Roadcraft's strong alignment and card contents. Headings can be large and serif-led, but the page should always expose the information needed to choose, complete, and review a paper. Use section labels, thin rules, generous spacing, and a restrained route or signal motif. The dark theme should retain the same composition and switch surface, text, and status tokens rather than introducing a second layout.

Use the following shared structure in both themes:

- A clear masthead with the wordmark, PDVL descriptor, and local section links.
- A landing introduction followed by a paper card grid. Each card has a large paper letter, short subject description, metadata rows, and a consistent action position.
- An assessment section with paper and module context, a visible timer, answered count, progress, question identifier, sample-content label, answer rows, warning state, and assessment tools.
- A results section with score, pass/fail status, threshold, answer review, explanation, and next actions.
- A foundation strip showing the current theme's palette, type hierarchy, and focus treatment.

## Colour direction

Use Steady Study's light palette by default:

- Warm ivory `#FAF6EF` for the page surface.
- Deep olive `#283C32` for primary text and filled actions.
- Pale sage `#E2EBDD` for selected-answer and explanation surfaces.
- Clay `#A24632` for errors and time warnings with explicit labels.
- Plum `#604866` for secondary emphasis and timer accents.
- White `#FFFDF9` and line `#D6D0C7` for contained surfaces and dividers.

When the dark theme radio is selected, use Night Signal's palette:

- Near black `#101719` for the page surface.
- Slate `#1D292D` for panels and answer surfaces.
- Mist `#F1F5F2` for primary text.
- Cool grey `#B5C3C5` for secondary text.
- Signal lime `#D6F45B` for primary actions, selected borders, and completion markers.
- Coral `#FF9B85` for errors and time warnings with explicit labels.
- Line `#506268` for panel boundaries and dividers.

Map semantic states deliberately. Selection must not imply correctness. Pair every colour-coded state with text, native control state, or a visible marker. Verify the actual pairings in both themes instead of assuming the palettes are accessible.

## Typography

Use `Georgia, "Times New Roman", serif` for the wordmark and main headings, and `"Trebuchet MS", Arial, sans-serif` for descriptions, questions, explanations, labels, and controls. Use `ui-monospace, "SFMono-Regular", Consolas, monospace` for the timer, question identifiers, score values, and compact metadata. Keep question text at a comfortable reading size with approximately 1.5-1.6 line height. Typography remains the same when the theme changes.

## UI aesthetic and design characteristics

Use Roadcraft's card content layout with Steady Study's softer material treatment. Cards should show the paper letter and status tag first, followed by title and description, a compact metadata grid, and an action anchored at the bottom. Keep card boundaries visible enough for comparison. Use modest 10-12px rounding and minimal shadows in light mode. Dark mode uses 2-4px corners, flat slate panels, and restrained borders while retaining the same internal ordering.

During the test, prioritize information clarity over editorial atmosphere. Keep the timer, answered count, paper/module context, and progress near the question list. Use full-width answer rows with A-D markers, native radio inputs, selected and unselected examples, an explicit unanswered warning, and a compact tools panel. Preserve the all-questions-on-one-page model; the mockup shows an excerpt.

## Imagery, illustration, iconography, and motion

Use one small CSS-built motif that combines a paper shape with a signal marker. It should read as preparation and orientation rather than a real map, vehicle illustration, or dashboard. Use CSS borders, circles, lines, and simple markers only. Do not use external images, icon libraries, stock photography, or official-looking road signs.

The theme switch must use native radio inputs and labels with CSS sibling selectors. No JavaScript is required. The mockup should remain useful as a static page if no theme is selected or the controls are unavailable. Do not use animated countdowns, pulsing signals, or simulated live data. If transitions are included, keep them brief and disable them under `prefers-reduced-motion: reduce`.

## Translation into the product experience

- Landing: use the card grid to make Paper A, B, and C easy to compare. Show Paper A's Module 1 then Module 2 sequence. Show Paper B with 25 questions, 30 minutes, and 22 correct to pass. Do not add a resume-session entry point, account flow, dashboard, or invented progress metrics.
- Assessment: use Roadcraft's status-first information architecture. Keep paper/module context, `18:42`, `12 of 25 answered`, and the question list visible in a predictable order. Preserve keyboard shortcuts, large tap targets, and the all-questions-on-one-page model.
- Results: show `23/25`, `Pass`, and `22 required` before the review. Explain one incorrect answer clearly and show actions for retaking the same questions, starting a new question set, and sharing the assessment.
- Theme behaviour: the CSS-only switch changes the visual tokens across the full page while preserving labels, layout, states, and information order. The dark theme is an option for the existing experience, not a separate product identity.
- Accessibility: use native form controls, fieldsets and legends, visible focus, text labels for outcomes and warnings, a readable type scale, and a layout that remains usable at 200% zoom.

## Static mockup requirements

Deliver exactly one file at `docs/brand/mockups/steady-signal.html`, containing semantic HTML and all CSS in a single `<style>` element. It must open directly from disk without JavaScript, frameworks, build tooling, network access, external fonts, images, icon libraries, or application imports. Use HTML and CSS for decorative graphics. Do not modify or integrate with the application, its routes, datasets, dependencies, or shared styles.

The page must include:

- A Steady Signal wordmark, PDVL descriptor, concise introduction, section navigation, and a CSS-only light/dark theme switch. The light theme is selected by default.
- A light-theme paper selector using Roadcraft's card content layout. Show Paper A's two modules, Paper B's 25 questions, 30 minutes, and 22 correct to pass, and Paper C's route-planning topic.
- An assessment excerpt that remains information-first in both themes. Include Paper B / Module 3B context, fixed time `18:42`, `12 of 25 answered`, progress, two neutral questions explicitly labelled as illustrative sample content, A-D radio options, unselected and selected states, a static unanswered warning, and large-text/high-contrast specimens.
- A results excerpt with `23/25`, `Pass`, `22 required`, one incorrect-answer review, learner answer, correct answer, explanation, and actions for retaking the same questions, starting a new question set, and sharing the assessment.
- A foundation strip that updates its visible palette and type/control examples when the dark theme is selected.

## Acceptance criteria and verification

- The new task is created with the next allocator-issued ID and starts in `tasks/backlog` before implementation. The allocator must be run immediately before creating the task file.
- The mockup is one standalone HTML file with one embedded style block, no JavaScript, external URLs, images, frameworks, build references, or application imports.
- The default light theme clearly uses Steady Study's typography and palette. The CSS-only dark selection clearly uses Night Signal's palette while retaining the same type and layout.
- Paper cards expose letter, title, topic, metadata, and action in the same order and alignment. The assessment hierarchy exposes context, timer, progress, questions, choices, warning, and tools without relying on colour alone.
- All required excerpts and states are visible without application integration or hidden JavaScript state. The sample questions are explicitly identified as illustrative content.
- At 375px and 1280px widths, both theme states remain readable without horizontal scrolling. At 200% zoom, controls and text do not overlap or become clipped.
- Text pairings meet 4.5:1, and meaningful control boundaries and focus indicators meet 3:1 against adjacent colours in both themes. Record the checked pairings in completion notes.
- Theme controls use a fieldset and legend, radio groups use fieldsets and legends, labels are present, focus is visible, decorative shapes are hidden from assistive technology, and primary targets are at least 44px high.
- Verify the source with static checks, inspect both radio states in a browser where local file access is permitted, review the two viewport sizes and keyboard focus, and check for unexpected network or script activity. Record any environment limitation in completion notes.
- Move the task through `tasks/in-progress` during implementation and `tasks/completed` after verification. Produce one focused Conventional Commit for the task and mockup.

## Completion notes

- Implemented the standalone mockup at `docs/brand/mockups/steady-signal.html`.
- The default light theme uses Steady Study's Georgia, Trebuchet MS, and warm ivory, olive, sage, clay, and plum tokens. The CSS-only dark radio state switches the page to Night Signal's near-black, slate, mist, cool grey, lime, and coral tokens while preserving the same layout and content order.
- Roadcraft's card metadata order and status-first assessment structure are present, including the paper selector, `18:42`, `12 of 25 answered`, sample questions, selected and unselected answers, unanswered warning, tools, `23/25`, pass threshold, and answer explanation.
- Source checks confirm one HTML file with one embedded style block, no JavaScript, external URLs, images, frameworks, build references, or application imports. Checked light and dark text pairings meet the 4.5:1 target; the minimum checked ratio is 5.64:1.
- Direct browser rendering was not available because the connected browser rejects `file://` navigation under its URL policy. Source-level and contrast validation passed; viewport and live radio-state rendering remain unverified.
- No application source, route, dataset, dependency, or shared style was changed.
