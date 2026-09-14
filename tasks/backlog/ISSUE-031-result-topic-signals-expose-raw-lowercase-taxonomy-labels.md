---
id: ISSUE-031
title: Result topic signals expose raw lowercase taxonomy labels
type: content
depends_on: []
---

# Result topic signals expose raw lowercase taxonomy labels

Area: Results page topic signals

## Problem

The `Where to focus` topic-signal cards display dataset tag values with underscores replaced by spaces, but keep the labels entirely lowercase. Labels such as `ivrd pdpa`, `vlps`, and `vl eligibility obligations` look like internal taxonomy metadata and are harder to scan as learner-facing topics.

## Reproduction

1. Open the completed Paper B result at `http://localhost:3000/practice/b/3b/QB2001/result?attempt=b-3b-QB2001-mu08yo6s-q6l6im`, or complete any tagged Paper A, B, or C attempt.
2. Scroll to the `Where to focus` and `Topic signals` section.
3. Inspect the labels on the topic cards, including acronym-containing tags where present.

## Expected behaviour

Topic signals should be presented as readable, polished learner-facing labels while retaining their original topic meaning. Words should use consistent title or sentence case, and known acronyms such as IVRD, PDPA, VL, and VLPS should retain their conventional uppercase form where appropriate. Topic counts and ordering should remain unchanged.

## Actual behaviour

The result cards show raw lowercase labels such as `decals`, `equipment permissions`, `ivrd pdpa`, `vl eligibility obligations`, and `vlps`. The formatter only replaces underscores with spaces, so the taxonomy naming convention is exposed directly instead of being formatted for the results UI.

## Root cause

`formatTopicTag` in `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx:35-37` returns `tag.replaceAll('_', ' ')` without applying display casing or acronym handling. The topic card at `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx:218-221` renders that string directly. Dataset tags are correctly stored as lowercase snake_case for aggregation, so the presentation formatter is the appropriate narrow fix point.

## Implementation scope

- Component/module: result-page topic-signal label formatting in `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx`.
- Files likely to modify: `src/app/practice/[paper]/[module]/[seed]/result/ResultsClient.tsx`; add focused formatter tests if the current test setup can cover the display helper.
- Behaviour that should change: convert topic tags into consistent learner-facing labels, including explicit handling for known acronyms used by the current datasets.
- Behaviour that should remain unchanged: tag aggregation keys, topic counts, ordering, score calculations, dataset schema, result-card layout, question review content, and the no-tags fallback message.

## Acceptance criteria

- Topic-signal cards no longer display raw lowercase taxonomy strings as their visible labels.
- Multi-word topics use consistent readable casing.
- Known acronyms in current tags render conventionally, including the relevant IVRD, PDPA, VL, and VLPS labels.
- Topic counts, sorting, card order, and the underlying tag values remain unchanged.
- The formatted labels remain readable in both light and dark themes and at desktop, tablet, and mobile widths without clipping or overflow.
- Results pages with no topic tags continue to show the existing fallback message.

## Verification

1. Open completed results for Papers A, B, and C and inspect several topic labels, including tags containing underscores and acronyms.
2. Compare the visible labels with the source tag values to confirm only presentation formatting changes.
3. Check light and dark themes at 1280 by 720, 768 by 900, 390 by 844, and 320 by 640 viewports for wrapping and overflow.
4. Verify topic counts and ordering match the current results and that untagged content still uses the fallback message.
5. Run focused formatter or result tests, then run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.

## Severity

Low
