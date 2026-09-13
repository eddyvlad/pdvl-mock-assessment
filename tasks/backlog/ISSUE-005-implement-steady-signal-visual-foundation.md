---
id: ISSUE-005
title: Implement the Steady Signal visual foundation and shell
type: task
---

# Implement the Steady Signal visual foundation and shell

## Goal

Replace the current blue and cyan gradient based shell with the Steady Signal visual foundation. Establish the typography, colour tokens, spacing, surfaces, controls, responsive rules, and shared header and theme treatment that the landing, assessment, and results tasks will use.

## Context

The current application uses `src/app/globals.css` for Tailwind theme values and shared utilities, `src/components/nav-bar.tsx` for the header, `src/app/layout.tsx` for the global shell, and `src/app/theme-toggle.tsx` for system, light, and dark theme state. The existing visual language relies on gradients, rounded cards, and generic blue actions.

The replacement should use the completed Steady Signal mockup at `docs/brand/mockups/steady-signal.html` as the visual reference. The working name is a brand exploration label and does not require a production logo asset or a product rename.

## Design requirements

### Typography

- Use `Georgia, "Times New Roman", serif` for the wordmark and major headings.
- Use `"Trebuchet MS", Arial, sans-serif` for body text, questions, explanations, labels, navigation, and controls.
- Use `ui-monospace, SFMono-Regular, Consolas, monospace` for timers, question identifiers, score values, and compact metadata.
- Keep body and question text readable on small screens with approximately 1.5-1.6 line height.
- Keep the type hierarchy and fallback stacks usable without downloading external fonts.

### Theme tokens

Use Steady Study tokens for the default light theme:

- Ivory `#FAF6EF` for the page background.
- White `#FFFDF9` for contained surfaces.
- Olive `#283C32` for primary text and filled controls.
- Sage `#E2EBDD` for selected and supporting surfaces.
- Clay `#A24632` for warnings, errors, and focus.
- Plum `#604866` for secondary emphasis.
- Line `#D6D0C7` for dividers and borders.

Use Night Signal tokens for explicit dark mode:

- Near black `#101719` for the page background.
- Slate `#1D292D` for contained surfaces.
- Mist `#F1F5F2` for primary text.
- Cool grey `#B5C3C5` for secondary text.
- Signal lime `#D6F45B` for primary actions and selected borders.
- Coral `#FF9B85` for warnings, errors, and focus.
- Line `#506268` for dividers and borders.

Preserve the existing three theme choices. `system` follows `prefers-color-scheme`, `light` uses the Steady Study tokens, and `dark` uses the Night Signal tokens. Keep the current theme storage and event behavior unless the implementation requires a small internal refactor.

### Shared shell and controls

- Replace the current header treatment with a Steady Signal wordmark, a compact PDVL descriptor, section-aware navigation, and the existing theme control restyled to match the new tokens.
- Create consistent styles or components for primary, secondary, ghost, warning, selected, disabled, and focus-visible controls.
- Use modest rounding in light mode and restrained panel corners in dark mode. Keep border and focus treatments visible without relying on shadows.
- Remove the current blue and cyan gradients, backdrop blur treatment, generic announcement styling, and decorative animation from the shared shell.
- Support a narrow mobile layout, a readable desktop max width, keyboard focus, reduced motion, and 200% zoom.
- Keep decorative marks separate from content and expose meaningful labels through text or native semantics.

## Scope boundaries

This task changes shared styling and shell components only. It does not redesign the landing page, assessment flow, result content, question data, scoring, routes, persistence, analytics, or error behavior. The landing, guided assessment, and results tasks consume this foundation.

## Acceptance criteria

- The shared shell uses the Steady Signal type stacks and light and dark token mappings above.
- Existing `system`, `light`, and `dark` theme controls continue to work and remain keyboard accessible.
- The header, navigation, buttons, focus states, and global surfaces no longer depend on the previous blue/cyan gradient identity.
- Text pairings meet WCAG AA targets, with body text at least 4.5:1 and meaningful focus or control boundaries at least 3:1 against adjacent colours.
- The shell remains usable at 375px, 1280px, and 200% zoom without clipping or horizontal overflow.
- Reduced motion disables nonessential transitions and animation.
- Existing application behavior and data contracts remain unchanged.
- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before completion. Include the responsive and theme checks in completion notes.
- Produce one focused Conventional Commit for this task.
