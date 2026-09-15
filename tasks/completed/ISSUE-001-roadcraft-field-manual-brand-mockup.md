---
id: ISSUE-001
title: Create the Roadcraft Field Manual brand mockup
type: design
depends_on: []
---

# Roadcraft Field Manual

## Goal

Create one standalone static mockup that explores PDVL practice as a practical driver's reference manual. This task contains the proposed brand direction and the implementation brief. It is an independent alternative, not a step towards combining the three brand concepts.

## Brand direction and rationale

Use the visual order of transport signage, printed training manuals, and inspection sheets to make the product feel useful and dependable. The current blue/cyan gradient and rounded-card vocabulary offers limited connection to the subject. Roadcraft gives the interface a recognisable relationship to driving through clear numbering, strong labels, and practical information hierarchy.

The working name is "Roadcraft", always accompanied by "PDVL practice assessments". It is an exploration label, not an approved product rename. The hypothesis is that a familiar, functional presentation will make paper selection and exam instructions easier to scan. The trade-off is that it could feel bureaucratic; plain language and generous reading space should keep it approachable. Avoid official seals, regulator branding, or claims of endorsement.

## Brand personality

Capable, direct, steady, and respectful of the learner's time. Write like a helpful instructor giving clear instructions: "Choose a paper", "12 of 25 answered", and "Review the questions you missed". Avoid jokes during assessment, pass guarantees, or disciplinary language after an unsuccessful attempt.

## Visual language

Build a flat, ordered composition with numbered sections, strong horizontal rules, rectangular labels, and a narrow margin for paper or question identifiers. Use lane-like dividers and simple route connectors sparingly. Large paper letters and section numbers provide the main graphic identity. Do not rely on gradients, floating cards, or ornamental textures.

## Colour direction

- Paper `#F4F0E6`: dominant background.
- Ink `#202621`: text, rules, and primary buttons with paper-coloured labels.
- Road amber `#F2B544`: section markers and selected-option backgrounds with ink text.
- Forest `#285943`: success text and labelled completion indicators.
- Brick `#A33328`: errors and time warnings, always paired with explicit text.

Keep amber as a structural accent rather than a warning everywhere. Use ink text on pale surfaces; do not use amber for small text on paper. Verify contrast for the actual pairings used in the mockup.

## Typography

Use `"Arial Narrow", "Helvetica Neue", Arial, sans-serif` for bold display labels, with `Arial, Helvetica, sans-serif` for body text and controls. Allow fallback fonts to change widths naturally. Use `ui-monospace, monospace` only for the timer and compact numeric references. Uppercase is limited to short labels. Question text starts at 18px with approximately 1.5 line height; long instructions remain in sentence case.

## UI aesthetic and design characteristics

Prefer squared corners, visible 1-2px borders, flat fills, and aligned rows. Paper selection resembles a clear contents page, with questions and duration aligned for comparison. Answer options are full-width bordered rows with prominent A-D markers. A selected answer has an amber fill, a stronger border, and its native radio state. Buttons have substantial solid fills and visible keyboard focus. Keep information density moderate, particularly on phones.

## Imagery, illustration, iconography, and motion

Use a small abstract route motif made from HTML elements and CSS borders, plus simple CSS arrows or labelled markers. Decorative marks must be hidden from assistive technology. Avoid stock car photography and copying real road signs that could be mistaken for instructional content. Icons always have text labels. Future product motion would be limited to short state transitions; the mockup uses static states and no looping or countdown animation.

## Translation into the product experience

- Landing: organise Paper A, B, and C like manual sections. Make Paper A's Module 1 then Module 2 sequence explicit. Do not add a resume-session entry point.
- Assessment: use a compact status strip for remaining time and answered count, followed by a readable list of questions. Preserve the all-questions-on-one-page model; the mockup shows an excerpt.
- Results: present score and outcome as a plain summary sheet with a labelled correction panel. Keep "Retake same questions", "New question set", and "Share this assessment" understandable without exposing seed terminology.
- Accessibility: maintain the same hierarchy in high contrast and large text. Use words and native form states alongside colour; warning styling must not resemble a selected answer.

## Static mockup requirements

Deliver exactly one file at `docs/brand/mockups/roadcraft-field-manual.html`, containing semantic HTML and all CSS in a `<style>` element. It must open directly from disk without JavaScript, frameworks, build tooling, network access, external fonts, images, icon libraries, or application imports. Use HTML/CSS for any decorative graphics. Do not modify or integrate with the application, its routes, datasets, dependencies, or shared styles.

Compose one vertically scrolling page with clearly labelled landing, assessment, and results excerpts, rather than pretending these are a single live workflow. Include:

- A Roadcraft wordmark, the PDVL descriptor, a short introduction, and a contents-style paper selector. Show Paper A's two modules and a detailed Paper B entry: 25 questions, 30 minutes, 22 correct to pass. Paper C can show its name and route-planning topic without disputed numeric details.
- A Paper B assessment excerpt with fixed time `18:42`, progress `12 of 25 answered`, two sample questions, A-D radio options, and unselected and selected states. Use neutral illustrative questions explicitly labelled as sample content, not authoritative test material.
- Primary and secondary actions, a static unanswered-question warning, and labelled large-text/high-contrast control specimens. No submission, timer, sharing, or settings logic is required.
- A separate completed Paper B example: `23 of 25 correct`, `Pass`, `22 required`, and one incorrect-answer review showing the learner's answer, correct answer, and explanation. Give outcome and error states text labels as well as colour.
- A small foundation strip showing the palette, type hierarchy, and button/focus treatment. Use local anchor navigation or native HTML form behaviour only where useful; illustrative actions must not navigate into the app.

## Acceptance criteria and verification

- The artifact is a single HTML file with embedded CSS, no scripts or external dependencies, and no application changes.
- The manual/signage identity is apparent through layout, typography, language, and states, not merely a different accent colour.
- All required excerpts and specimens are visible without running an application or selecting a hidden state.
- At 375px and 1280px widths, content stays readable without horizontal scrolling. At 200% zoom, controls and text do not overlap or become clipped.
- Body text and control labels meet a 4.5:1 contrast target; meaningful control boundaries and focus indicators meet 3:1 against adjacent colours. Record the checked pairings when completing the task.
- Radio groups use fieldsets and legends, controls have labels, focus is visible, and primary targets are at least 44px high. Keyboard navigation works for native controls and local links.
- Open the file directly from disk, inspect both viewport sizes and keyboard focus, and check source/network activity for scripts and remote dependencies. Record the outcome and any limitations in completion notes.
- Produce a focused Conventional Commit for this mockup when this backlog task is implemented. Completion of the mockup does not approve a product rebrand.

## Completion notes

- Implemented the standalone mockup at `docs/brand/mockups/roadcraft-field-manual.html`.
- Source checks confirm one HTML file with one embedded style block, no JavaScript, external URLs, images, frameworks, build references, or application imports. Required landing, assessment, warning, results, accessibility, and foundation states are present.
- Checked text pairings meet the 4.5:1 target. The minimum checked ratio is 5.26:1 for brick on the warning surface.
- Direct browser rendering was attempted, but the connected browser rejected `file://` navigation under its URL policy. Source-level and contrast validation passed; viewport rendering remains the only unverified check.
- No application source, route, dataset, dependency, or shared style was changed.
