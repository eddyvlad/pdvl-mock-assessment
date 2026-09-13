---
id: ISSUE-008
title: Clarify the landing page's PDVL mock test identity
type: task
---

# Clarify the landing page's PDVL mock test identity

## Goal

Make the purpose of Steady Signal immediately clear to visitors and search engines through natural, visible PDVL mock test copy while preserving its calm visual identity.

## Context

The landing page in `src/app/page.tsx` currently leads with "Keep your thinking steady under pressure." Its introduction refers to timed mock papers without explicitly describing a PDVL mock test. The user wants the relevant search terms restored and has chosen a descriptive main heading. They also explicitly requested replacing "practice desk" with "practice test".

Google can generate search snippets from visible page content as well as a meta description. Clear on-page explanations should support the search metadata, without promising a particular excerpt or ranking. See [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

## Copy and placement

Use the following approved wording:

- Hero eyebrow: "Singapore PDVL · practice test".
- Main heading: "PDVL mock tests for steady exam preparation."
- Introduction: "Prepare for Singapore's Private Hire Car Driver's Vocational Licence (PDVL) with timed mock tests for Papers A, B and C. Practise one question at a time, review your answers, and learn from explanations after submitting."
- Paper section heading: "Choose your PDVL mock exam".
- Keep "Keep your thinking steady under pressure." as a short closing sentence in the existing "How it works" panel, following its explanation of the guided flow.

## Experience requirements

- Retain the Steady Signal wordmark, serif heading, supporting sans-serif text, palette, and existing light and dark themes.
- Keep the introduction readable and the paper selector easy to reach. Do not add a large explanatory section or repeat keywords across every card.
- Render the descriptive copy on the server so it is present in the initial HTML.
- Use one H1 and a logical hierarchy for the paper section and its cards.
- Preserve the paper configuration, actions, active-session panel, and guided test behavior.
- Avoid unsupported claims about official affiliation, actual exam questions, or guaranteed passes.

## Acceptance criteria and validation

- Initial homepage HTML contains the approved copy, including the expanded meaning of PDVL and the mock test and mock exam terms.
- "Practice desk" no longer appears in the landing-page hero.
- Inspect the page at 375px and 1280px in both themes and at 200% zoom. Text wraps comfortably without clipping or horizontal overflow.
- Verify heading hierarchy, keyboard access to paper actions, and session continuation with and without a valid active attempt.
- Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` during implementation. Visual and rendered-HTML checks are sufficient for the copy change; do not add tests that merely duplicate its text.
- Record completion findings and produce at least one focused Conventional Commit when this task is implemented.

## Scope boundaries

This task covers visible landing-page copy and the small layout adjustments needed to accommodate it. Search metadata and indexing controls belong to the companion SEO foundations task. No new dependencies, API changes, or storage migrations are required. Search ranking and Google's exact excerpt are observations, not acceptance criteria.
