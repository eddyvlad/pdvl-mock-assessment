# Vercel rollback procedure

Use this procedure when the current production deployment causes a material user-facing failure. Keep the release
commit, deployment URL, and smoke-check output with the incident record.

## Immediate rollback

1. Stop merging or promoting new production changes while the failure is being assessed.
2. In the Vercel project, identify the current production deployment and the most recent known-good deployment that was
   previously assigned to the production domain.
3. Use Vercel's Instant Rollback control to assign the known-good deployment to the production domain. Do not rebuild
   during the immediate recovery step.
4. Run the production smoke checks against the public origin:

   ```text
   PRODUCTION_URL=https://www.example.com npm run smoke:production
   ```

5. In a browser, verify landing-page navigation, assessment loading, reload and resume, review submission, results,
   and Paper A chaining.

## Configuration caveat

Instant rollback reuses an earlier deployment. It does not rebuild changed environment variables, so a rollback cannot
be treated as a complete configuration rollback. If `HOST`, `DATASET_VERSION`, or another provider setting caused the
failure, restore the intended value separately and promote a newly built deployment from a known-good commit.

## Restore normal releases

After the incident is understood:

- Keep the rollback in place until a corrected commit passes the `quality` check and the release smoke checks.
- Fix the cause on a branch and merge through the protected `main` workflow.
- Promote the corrected deployment through the normal Vercel release path.
- Confirm that automatic production promotion is active again after the rollback state is cleared.
- Repeat the public smoke and browser checks, then record the final production deployment SHA.

Do not store Vercel credentials or project identifiers in this repository. For loss of the project or deployment history,
follow [the backup and recovery procedure](./backup-and-recovery.md).

## Reference

See [Vercel's Instant Rollback documentation](https://vercel.com/docs/instant-rollback) for the provider controls and
plan-specific deployment retention rules.
