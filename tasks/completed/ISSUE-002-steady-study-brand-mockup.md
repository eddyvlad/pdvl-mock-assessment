---
id: ISSUE-002
title: Create the Steady Study brand mockup
type: task
---

# Steady Study

## Goal

Create one standalone static mockup that explores PDVL practice as a calm, considered learning companion. This task contains the proposed brand direction and the implementation brief. It is an independent alternative, not a step towards combining the three brand concepts.

## Brand direction and rationale

Take an editorial approach inspired by a well-designed workbook: warm paper, expressive serif headings, comfortable reading measures, and useful explanations. Move away from the current blue/cyan gradient and repeated cards towards a page that gives reading and reflection more visual importance.

The working name is "Steady Study", paired with "PDVL practice assessments". It is an exploration label, not an approved product rename. The hypothesis is that a calmer tone can make starting a timed paper and reviewing mistakes feel more manageable. This has not been tested with learners. The main trade-off is reduced urgency, so the timer, time warnings, and submission requirements must remain clear. Do not suggest that the exam is untimed or promise a pass.

## Brand personality

Patient, adult, encouraging, and candid. Use brief, practical copy such as "Choose a paper to practise" and "Review these answers before your next attempt". State unsuccessful outcomes clearly without blame. Avoid childish rewards, motivational slogans, streak pressure, or exaggerated reassurance.

## Visual language

Use an open editorial layout, generous margins, thin rules, small chapter labels, and large serif headings. Group related content through spacing and a few broad tinted panels rather than enclosing every element in a card. A simple curved line or overlapping paper-like shapes can give the introduction a recognisable motif. Keep illustrations away from question text.

## Colour direction

- Warm ivory `#FAF6EF`: page background.
- Deep olive `#283C32`: primary text and filled buttons with ivory labels.
- Pale sage `#E2EBDD`: selected-answer and explanation backgrounds with olive text.
- Clay `#A24632`: restrained emphasis and labelled error text on ivory.
- Plum `#604866`: secondary headings and time-warning accents with explicit labels.

Keep pale colours on large surfaces and use dark text for reading. Distinguish selected, correct, and incorrect states with labels and form indicators, even where their palettes overlap. Verify contrast for the actual pairings used in the mockup.

## Typography

Use `Georgia, "Times New Roman", serif` for the wordmark and main headings. Use `"Trebuchet MS", Arial, sans-serif` for questions, explanations, labels, and controls. The serif should add warmth without slowing assessment reading. Use tabular numerals in the sans-serif timer. Body and question text start at 18px with approximately 1.6 line height and a reading measure around 60-68 characters. Avoid long italic passages and tiny uppercase labels.

## UI aesthetic and design characteristics

Use gentle 10-16px corners on the few panels that need containment, minimal shadows, and clear breathing room between sections. Paper choices are a vertical reading list with prominent titles and concise metadata. Answer rows are generous, softly outlined, and show a dark radio indicator when selected. Keep the main action obvious with a solid olive fill. Explanations receive enough space to read as part of learning, rather than as small secondary text.

## Imagery, illustration, iconography, and motion

Create one modest abstract illustration with CSS circles, curves, and paper-like rectangles to suggest preparation and gradual progress. Avoid decorative road signage, dashboard graphics, lifestyle photography, and mascots. Use small labelled CSS check or arrow shapes only where they clarify an action. Future product motion could use gentle opacity transitions that respect reduced-motion preferences. The mockup remains still and must communicate every state without animation.

## Translation into the product experience

- Landing: open with a concise invitation to practise, then a clear paper list. Explain Paper A's Module 1 then Module 2 sequence without adding a new study plan, account system, or resume-session feature.
- Assessment: make the question list the visual centre. Keep the timer and answered count visible as clear information; time warnings must be explicit even within this restrained palette. Preserve the all-questions-on-one-page model.
- Results: state score and pass/fail first, then show useful explanations and clear options to retake the same questions or try a new set. Any encouragement follows the actual result.
- Accessibility: support a comfortable reading size, strong focus outlines, and full-width answer targets. Large-text and high-contrast treatments should preserve the editorial hierarchy rather than relying on pale surfaces alone.

## Static mockup requirements

Deliver exactly one file at `docs/brand/mockups/steady-study.html`, containing semantic HTML and all CSS in a `<style>` element. It must open directly from disk without JavaScript, frameworks, build tooling, network access, external fonts, images, icon libraries, or application imports. Use HTML/CSS for any decorative graphics. Do not modify or integrate with the application, its routes, datasets, dependencies, or shared styles.

Compose one vertically scrolling page with clearly labelled landing, assessment, and results excerpts. Use the following content to make this alternative comparable with the other brand mockups:

- A Steady Study wordmark, the PDVL descriptor, a brief introduction, and an editorial paper list. Show Paper A's two modules and a detailed Paper B entry: 25 questions, 30 minutes, 22 correct to pass. Paper C can show its name and route-planning topic without disputed numeric details.
- A Paper B assessment excerpt with fixed time `18:42`, progress `12 of 25 answered`, two sample questions, and A-D radio options. Show both unselected and selected options with clear text spacing. Use neutral illustrative questions explicitly labelled as sample content, not authoritative test material.
- Primary and secondary actions, a plainly worded unanswered-question warning, and labelled large-text/high-contrast control specimens. No submission, timer, sharing, or settings logic is required.
- A separate completed Paper B example: `23 of 25 correct`, `Pass`, `22 required`, followed by one incorrect-answer review with the learner's answer, correct answer, and a comfortably sized explanation. Include "Retake same questions", "New question set", and "Share this assessment" action specimens.
- A small foundation strip showing the palette, serif/sans hierarchy, and button/focus treatment. Use local anchor navigation or native HTML form behaviour only where useful; illustrative actions must not navigate into the app.

## Acceptance criteria and verification

- The artifact is a single HTML file with embedded CSS, no scripts or external dependencies, and no application changes.
- The direction is recognisably editorial and centred on reading, with a different composition and emotional tone from both a transport manual and a dark instrument panel.
- All required excerpts and specimens are visible without running an application or selecting a hidden state. Timer and warning information remain easy to find.
- At 375px and 1280px widths, content stays readable without horizontal scrolling. At 200% zoom, controls and text do not overlap or become clipped.
- Body text and control labels meet a 4.5:1 contrast target; meaningful control boundaries and focus indicators meet 3:1 against adjacent colours. Record the checked pairings when completing the task.
- Radio groups use fieldsets and legends, controls have labels, focus is visible, and primary targets are at least 44px high. Decorative shapes are hidden from assistive technology.
- Open the file directly from disk, inspect both viewport sizes and keyboard focus, and check source/network activity for scripts and remote dependencies. Record the outcome and any limitations in completion notes.
- Produce a focused Conventional Commit for this mockup when this backlog task is implemented. Completion of the mockup does not approve a product rebrand.
