# Deployment and recovery

## Coverage target

Validate clean installation, build and start assumptions, Vercel or equivalent deployment configuration, environment
fallbacks, canonical route behaviour on direct navigation, static dataset availability, rollback and recovery notes,
and the ability to resume or safely abandon browser-local attempts after failures or upgrades.

## Investigation state

- Status: NO-GO finding recorded
- Tested or inspected: clean install, webpack production build, `next start` on HTTP port 3001, canonical route smoke,
  environment examples, robots and sitemap, direct invalid-route handling, and browser-local recovery actions.
- Evidence: `HOST=http://localhost:3001 npm run start -- -p 3001` served `/` with 200 but rendered the friendly dataset load
  error for `/practice/b/3b/000000`; the source hard-codes HTTPS when `NODE_ENV` is not development. Missing-seed routes
  return 307 redirects and invalid paper/module routes return 404. Robots, sitemap, and noindex metadata render.
- Confirmed findings: production start cannot serve practice content over the documented HTTP origin. This is the release
  gate tracked in [ISSUE-040](../../tasks/backlog/ISSUE-040-production-dataset-fetch-protocol.md).
- Unresolved questions: HTTPS termination and hosting-specific rollback controls require deployment access.
- Remediation and verification: protocol remediation and a repeat production start smoke are pending.
