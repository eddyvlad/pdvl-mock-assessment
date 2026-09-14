# Deployment and recovery

## Coverage target

Validate clean installation, build and start assumptions, Vercel or equivalent deployment configuration, environment
fallbacks, canonical route behaviour on direct navigation, static dataset availability, rollback and recovery notes,
and the ability to resume or safely abandon browser-local attempts after failures or upgrades.

## Investigation state

- Status: verified locally, with hosting limits
- Tested or inspected: clean install, webpack production build, `next start` on HTTP port 3001, canonical route smoke,
  environment examples, robots and sitemap, direct invalid-route handling, and browser-local recovery actions.
- Evidence: after ISSUE-040, a fresh `next start` on port 3101 returned 200 and question content for the representative
  practice route and 200 for the dataset asset. After ISSUE-043, all three responses carried the configured security
  headers and no `X-Powered-By`. Missing-seed routes still return 307 redirects and invalid paper/module routes return 404. Robots, sitemap, and noindex metadata render.
- Confirmed findings: no locally reproducible deployment blocker remains. The upstream hosting proxy, rollback controls,
  and backup or recovery procedures are not available in this repository.
- Unresolved questions: HTTPS termination and hosting-specific rollback controls require deployment access.
- Remediation and verification: complete locally. Hosting-specific rollback and disaster recovery remain accepted
  validation limits for this run.
