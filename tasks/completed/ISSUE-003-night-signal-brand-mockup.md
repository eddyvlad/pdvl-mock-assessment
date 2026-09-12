---
id: ISSUE-003
title: Create the Night Signal brand mockup
type: task
---

# Night Signal

## Goal

Create one standalone static mockup that explores PDVL practice through the clarity of a digital instrument panel. This task contains the proposed brand direction and the implementation brief. It is an independent alternative, not a step towards combining the three brand concepts.

## Brand direction and rationale

Give the product a precise, contemporary identity using dark surfaces, large numeric readouts, crisp panel divisions, and a limited signal colour. The current blue/cyan gradient and rounded-card styling becomes a more deliberate system for showing time, progress, choices, and outcomes. The visual reference is a stationary navigation console, not a racing game or an interface to use while driving.

The working name is "Night Signal", paired with "PDVL practice assessments". It is an exploration label, not an approved product rename. The hypothesis is that visible status and decisive controls will appeal to learners who want a focused, self-directed practice experience. Dark styling is a visual proposition, not a claim of better readability or suitability for every learner. The trade-off is that dense panels and bright accents can increase tension; generous question spacing and limited colour should keep the assessment readable.

## Brand personality

Focused, precise, composed, and modern. Use short but complete labels: "Start Paper B", "Time remaining", and "Review answers". Keep questions and explanations in natural language. Avoid military terminology, speed challenges, leaderboard language, productivity scores, or technical vocabulary such as seeds in learner-facing copy.

## Visual language

Use a strong modular grid, asymmetrical desktop composition, dark inset panels, oversized paper letters, and tabular numbers. A fine static grid can appear in the masthead, but never behind question text. Pair a broad reading column with a compact status area on desktop, then stack these on mobile. A single lime marker provides a distinctive recurring signature. Avoid luminous gradients, glass effects, textured paper, and excessive rounding.

## Colour direction

- Near black `#101719`: main canvas.
- Slate `#1D292D`: assessment panels and answer surfaces.
- Mist `#F1F5F2`: primary text.
- Cool grey `#B5C3C5`: secondary text.
- Signal lime `#D6F45B`: primary actions with near-black labels and selected-option outlines.
- Coral `#FF9B85`: labelled errors and time warnings on dark surfaces.

Use lime sparingly so the main action and current selection remain easy to locate. A selected state must not imply that an answer is correct. Completion uses a "Pass" label and check marker; incorrect answers use coral and an explicit label. Verify the contrast of actual text, borders, and focus treatments rather than assuming a dark theme is sufficient.

## Typography

Use `"Helvetica Neue", Arial, sans-serif` for the wordmark, headings, questions, and controls. Large, bold headings should feel compact and deliberate. Use `ui-monospace, "SFMono-Regular", Consolas, monospace` for timers, question identifiers, and score readouts only. Body text starts at 18px with approximately 1.5 line height. Avoid monospaced question paragraphs and condensed labels that become hard to read on phones.

## UI aesthetic and design characteristics

Use flat panels with 2-4px corners, restrained borders, and no ambient glow. Strong differences in type size establish hierarchy. Paper choices are structured modules with clear counts and durations. Answer rows have generous padding, a distinct radio indicator, and a lime border when selected. The timer is prominent but subordinate to the question during normal use. Show focus as a separate visible outline so it cannot be confused with selection. Keep status information sparse enough that the interface does not become a crowded dashboard.

## Imagery, illustration, iconography, and motion

Use a small abstract coordinate grid and a signal marker built entirely with HTML and CSS. Avoid real maps, vehicle photography, speedometers, flashing lights, and sci-fi decoration. Label simple CSS arrows, checks, and status marks with text; hide purely decorative graphics from assistive technology. Future product motion could use brief state changes with reduced-motion support. The mockup uses fixed numbers and static progress bars, with no pulsing, animated countdown, or simulated live data.

## Translation into the product experience

- Landing: present papers as clear entry points into practice. Show Paper A's Module 1 then Module 2 sequence without introducing accounts, a resume-session feature, or a new dashboard workflow.
- Assessment: keep time, answered count, and submission controls distinct from a continuous question list. Preserve the all-questions-on-one-page model; the mockup shows an excerpt, not a one-question wizard.
- Results: use a large score and explicit outcome, then a readable answer review. Keep "Retake same questions", "New question set", and "Share this assessment" understandable. Do not introduce invented performance metrics or compare learners with each other.
- Accessibility: give secondary text sufficient contrast, retain visible keyboard focus, and keep large-text controls legible. Treat dark styling as this concept's default, while documenting a high-contrast specimen rather than implying that dark mode alone fulfils that need.

## Static mockup requirements

Deliver exactly one file at `docs/brand/mockups/night-signal.html`, containing semantic HTML and all CSS in a `<style>` element. It must open directly from disk without JavaScript, frameworks, build tooling, network access, external fonts, images, icon libraries, or application imports. Use HTML/CSS for any decorative graphics. Do not modify or integrate with the application, its routes, datasets, dependencies, or shared styles.

Compose one vertically scrolling page with clearly labelled landing, assessment, and results excerpts. Use the following content to make this alternative comparable with the other brand mockups:

- A Night Signal wordmark, the PDVL descriptor, a concise introduction, and modular paper choices. Show Paper A's two modules and a detailed Paper B entry: 25 questions, 30 minutes, 22 correct to pass. Paper C can show its name and route-planning topic without disputed numeric details.
- A Paper B assessment excerpt with fixed time `18:42`, progress `12 of 25 answered`, two sample questions, A-D radio options, and unselected and selected states. Use neutral illustrative questions explicitly labelled as sample content, not authoritative test material.
- Primary and secondary actions, a static unanswered-question warning, and labelled large-text/high-contrast control specimens. No submission, timer, sharing, or settings logic is required.
- A separate completed Paper B example: `23 of 25 correct`, `Pass`, `22 required`, and one incorrect-answer review showing the learner's answer, correct answer, and explanation. Numeric emphasis must not reduce explanations to unreadable secondary content.
- A small foundation strip showing the palette, sans/monospace hierarchy, and button/focus treatment. Use local anchor navigation or native HTML form behaviour only where useful; illustrative actions must not navigate into the app.

## Acceptance criteria and verification

- The artifact is a single HTML file with embedded CSS, no scripts or external dependencies, and no application changes.
- The direction communicates a precise digital instrument identity through composition, numeric hierarchy, language, and states. It must not be a dark recolouring of the manual or editorial concept.
- All required excerpts and specimens are visible without running an application or selecting a hidden state. Question and explanation readability take precedence over decorative status graphics.
- At 375px and 1280px widths, content stays readable without horizontal scrolling. At 200% zoom, controls and text do not overlap or become clipped.
- Body text and control labels meet a 4.5:1 contrast target; meaningful control boundaries and focus indicators meet 3:1 against adjacent colours. Record the checked pairings when completing the task.
- Radio groups use fieldsets and legends, controls have labels, focus is visible, and primary targets are at least 44px high. Selection, warning, and outcome states remain distinguishable without colour.
- Open the file directly from disk, inspect both viewport sizes and keyboard focus, and check source/network activity for scripts and remote dependencies. Record the outcome and any limitations in completion notes.
- Produce a focused Conventional Commit for this mockup when this backlog task is implemented. Completion of the mockup does not approve a product rebrand.

## Completion notes

- Implemented the standalone mockup at `docs/brand/mockups/night-signal.html`.
- Source checks confirm one HTML file with one embedded style block, no JavaScript, external URLs, images, frameworks, build references, or application imports. Required landing, assessment, warning, results, accessibility, and foundation states are present.
- Checked text pairings meet the 4.5:1 target. The minimum checked ratio is 8.87:1 for coral on the near-black surface.
- Direct browser rendering was attempted, but the connected browser rejected `file://` navigation under its URL policy. Source-level and contrast validation passed; viewport rendering remains the only unverified check.
- No application source, route, dataset, dependency, or shared style was changed.
