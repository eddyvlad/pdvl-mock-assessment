const EXPECTED_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
};

function normalizeBaseUrl(value) {
  if (!value) {
    throw new Error("PRODUCTION_URL is required, for example: PRODUCTION_URL=https://example.com");
  }

  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("PRODUCTION_URL must use http or https");
  }
  if (url.username || url.password) {
    throw new Error("PRODUCTION_URL must not contain credentials");
  }

  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString();
}

function expectedCanonicalUrl(baseUrl) {
  return new URL("/", `${baseUrl}/`).toString();
}

function expectedCanonicalTagUrl(baseUrl) {
  return expectedCanonicalUrl(baseUrl).replace(/\/$/, "");
}

function resolveCanonicalBaseUrl(baseUrl, configuredValue) {
  return configuredValue ? normalizeBaseUrl(configuredValue) : baseUrl;
}

function extractSitemapLocations(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
}

function containsAnalyticsMarkup(html) {
  return /googletagmanager|google-analytics|gtag\(/i.test(html);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertSecurityHeaders(response, label) {
  for (const [header, expected] of Object.entries(EXPECTED_HEADERS)) {
    assert(response.headers.get(header) === expected, `${label} is missing ${header}: ${expected}`);
  }
  assert(!response.headers.has("x-powered-by"), `${label} exposes x-powered-by`);
}

async function fetchPath(baseUrl, path, options = {}) {
  const url = new URL(path, `${baseUrl}/`);
  const response = await fetch(url, {
    redirect: "manual",
    ...options,
  });
  return { body: await response.text(), response, url };
}

async function checkSuccessfulPage(baseUrl, path, label) {
  const result = await fetchPath(baseUrl, path);
  assert(result.response.status === 200, `${label} returned HTTP ${result.response.status}`);
  assert(!/application error|internal server error/i.test(result.body), `${label} contains a server error state`);
  assertSecurityHeaders(result.response, label);
  return result;
}

async function checkRedirect(baseUrl, path, expectedPrefix, label) {
  const result = await fetchPath(baseUrl, path);
  assert(result.response.status >= 300 && result.response.status < 400, `${label} did not redirect`);
  const location = result.response.headers.get("location");
  assert(location, `${label} did not provide a location`);
  const target = new URL(location, baseUrl);
  assert(target.pathname.startsWith(`${expectedPrefix}/`), `${label} target does not preserve its route context`);
  assert(/\/[0-9A-Za-z]{6}$/.test(target.pathname), `${label} target does not contain a six-character base62 seed`);
  assertSecurityHeaders(result.response, label);
  return result;
}

async function run() {
  const baseUrl = normalizeBaseUrl(process.env.PRODUCTION_URL);
  const canonicalBaseUrl = resolveCanonicalBaseUrl(baseUrl, process.env.EXPECTED_CANONICAL_URL);
  const seed = process.env.PRODUCTION_SMOKE_SEED ?? "abc123";
  assert(/^[0-9A-Za-z]{6}$/.test(seed), "PRODUCTION_SMOKE_SEED must be a six-character base62 seed");

  const homepage = await checkSuccessfulPage(baseUrl, "/", "homepage");
  assert(
    homepage.body.includes(`<link rel="canonical" href="${expectedCanonicalTagUrl(canonicalBaseUrl)}"`),
    "homepage canonical URL is incorrect",
  );
  assert(
    !containsAnalyticsMarkup(homepage.body),
    "homepage contains analytics markup while analytics should be disabled",
  );

  const routeCases = [
    { dataset: "paper-a-module-1.json", module: "m1", paper: "a" },
    { dataset: "paper-a-module-2.json", module: "m2", paper: "a" },
    { dataset: "paper-b-module-3b.json", module: "3b", paper: "b" },
    { dataset: "paper-c-module-4b.json", module: "4b", paper: "c" },
  ];

  for (const routeCase of routeCases) {
    const route = `/practice/${routeCase.paper}/${routeCase.module}`;
    const practice = await checkSuccessfulPage(baseUrl, `${route}/${seed}`, `${route} practice route`);
    assert(/noindex[", ]/i.test(practice.body), `${route} practice route is missing noindex metadata`);
    await checkSuccessfulPage(baseUrl, `${route}/${seed}/review`, `${route} review route`);
    await checkSuccessfulPage(baseUrl, `${route}/${seed}/result`, `${route} result route`);
    await checkSuccessfulPage(baseUrl, `/datasets/v2025-09/${routeCase.dataset}`, `${route} dataset asset`);
    await checkRedirect(baseUrl, route, route, `${route} missing-seed route`);
    await checkRedirect(baseUrl, `${route}/not-valid`, route, `${route} invalid-seed route`);
  }

  const robots = await checkSuccessfulPage(baseUrl, "/robots.txt", "robots route");
  assert(
    robots.body.includes(new URL("/sitemap.xml", `${canonicalBaseUrl}/`).toString()),
    "robots does not reference the sitemap",
  );

  const sitemap = await checkSuccessfulPage(baseUrl, "/sitemap.xml", "sitemap route");
  assert(
    JSON.stringify(extractSitemapLocations(sitemap.body)) === JSON.stringify([expectedCanonicalUrl(canonicalBaseUrl)]),
    "sitemap does not contain only the canonical homepage",
  );

  console.log(`Production smoke checks passed for ${baseUrl} (canonical ${canonicalBaseUrl})`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error(`Production smoke checks failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  containsAnalyticsMarkup,
  expectedCanonicalUrl,
  expectedCanonicalTagUrl,
  extractSitemapLocations,
  normalizeBaseUrl,
  resolveCanonicalBaseUrl,
};
