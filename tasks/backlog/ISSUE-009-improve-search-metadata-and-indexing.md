---
id: ISSUE-009
title: Improve search metadata and indexing foundations
type: task
---

# Improve search metadata and indexing foundations

## Goal

Give search engines a useful description and a clear homepage URL for Steady Signal, while keeping individual seeded tests, reviews, and results out of search results.

## Context

The root metadata in `src/app/layout.tsx` currently uses "Steady Signal | PDVL Practice Tests" and "Clear, timed practice for Singapore's PDVL course." It already derives `metadataBase` from `HOST`, with a localhost fallback, and declares Open Graph metadata and an existing image. The repository currently has no sitemap or robots route. Practice, review, and result pages live under `/practice`.

The companion task [ISSUE-008](ISSUE-008-clarify-pdvl-mock-test-identity.md) supplies the approved visible copy. These changes should describe the same product but can be implemented independently.

## Metadata requirements

- Homepage title: "PDVL Mock Tests & Practice Exams Singapore | Steady Signal".
- Homepage meta description: "Prepare for Singapore's PDVL exam with timed mock tests for Papers A, B and C. Review your answers and learn from explanations with Steady Signal."
- Align the homepage Open Graph title and description with that wording. Preserve the existing locale and image configuration when overriding metadata.
- Add a homepage canonical URL derived from the existing `HOST` configuration. Scope homepage-specific canonical metadata to the homepage so practice, review, and result pages do not inherit it.
- Keep metadata server-rendered. Do not add a keywords meta tag, hidden keyword content, or dependencies.

## Indexing and configuration requirements

- Add a sitemap containing only the absolute canonical homepage URL. Exclude seeded routes, reviews, results, attempt parameters, and question parameters.
- Add a robots file that allows crawling and references the sitemap using the configured origin.
- Apply `noindex, follow` across the `/practice` route subtree, including review, result, and query-string variants. Use inherited route metadata so descendants consistently receive the policy.
- Do not block `/practice` in robots.txt: crawlers must be able to fetch the pages to observe `noindex`. This is an indexing policy, not an access-control mechanism.
- Reuse `HOST` as the source of the site origin. Document that production must configure the actual public HTTPS origin instead of localhost or the example domain. Retain local development support; no new environment variable is needed.
- Do not redirect seeded links or change their behavior as part of indexing work.

## Acceptance criteria and validation

- Inspect production-rendered homepage HTML for the approved title and description, matching Open Graph copy, one correct canonical, and absence of `noindex`.
- Inspect representative practice, review, and result URLs, including attempt and question parameters, for `noindex, follow` and absence of an inherited homepage canonical.
- Verify that `/sitemap.xml` contains only the canonical homepage and `/robots.txt` references that sitemap without blocking the practice subtree.
- Verify generated absolute URLs use the configured production origin. Document configuration verification as a deployment prerequisite rather than inventing a domain.
- Smoke-check that opening and sharing a seeded test, continuing an attempt, reviewing answers, and viewing results still work.
- Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` during implementation. Prefer rendered-output checks for metadata inheritance and indexing behavior.
- Record completion findings and produce at least one focused Conventional Commit when this task is implemented.

## Post-deployment checks

Document the following steps in the README for the site owner after deployment:

- Confirm the public homepage, sitemap, robots file, and metadata resolve using the production origin.
- Use Google Search Console URL Inspection to check homepage indexability and Google's selected canonical; request a recrawl after the changes are live.
- Check the indexing report for representative practice URLs and observe whether their exclusion is attributed to `noindex` after recrawling.
- Record a baseline and review homepage impressions, clicks, and relevant PDVL queries over comparable periods after recrawling. Treat any changes as observations, not proof of causation or guaranteed ranking improvements.

Search Console account changes, deployment, and external submissions are outside this implementation task. The deliverable is code and documentation, with no API changes or storage migrations.

## Reference guidance

- [Google search snippets](https://developers.google.com/search/docs/appearance/snippet): Google may choose page text or the meta description; the exact excerpt is not an acceptance criterion.
- [Google title links](https://developers.google.com/search/docs/appearance/title-link): descriptive titles and visible headings help communicate page purpose.
- [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing): pages must remain crawlable for the directive to be seen.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): publish canonical URLs in the sitemap.
