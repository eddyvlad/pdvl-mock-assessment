const {
  containsAnalyticsMarkup,
  expectedCanonicalTagUrl,
  expectedCanonicalUrl,
  extractSitemapLocations,
  normalizeBaseUrl,
  resolveCanonicalBaseUrl,
} = require("../../../scripts/production-smoke.cjs") as {
  containsAnalyticsMarkup: (html: string) => boolean;
  expectedCanonicalTagUrl: (baseUrl: string) => string;
  expectedCanonicalUrl: (baseUrl: string) => string;
  extractSitemapLocations: (xml: string) => string[];
  normalizeBaseUrl: (value?: string) => string;
  resolveCanonicalBaseUrl: (baseUrl: string, configuredValue?: string) => string;
};

describe("production smoke helpers", () => {
  it("normalizes a public URL and rejects credentials or unsupported protocols", () => {
    expect(normalizeBaseUrl("https://example.com/path/?ignored=1#section")).toBe("https://example.com/path");
    expect(() => normalizeBaseUrl("ftp://example.com")).toThrow("http or https");
    expect(() => normalizeBaseUrl("https://user:secret@example.com")).toThrow("credentials");
  });

  it("builds the canonical homepage URL", () => {
    expect(expectedCanonicalUrl("https://example.com/app")).toBe("https://example.com/");
    expect(expectedCanonicalTagUrl("https://example.com/app")).toBe("https://example.com");
  });

  it("allows preview checks to expect the production canonical origin", () => {
    expect(
      expectedCanonicalUrl(resolveCanonicalBaseUrl("https://preview.example.com", "https://pdvl.eddyhidayat.com")),
    ).toBe("https://pdvl.eddyhidayat.com/");
    expect(expectedCanonicalUrl(resolveCanonicalBaseUrl("https://example.com"))).toBe("https://example.com/");
  });

  it("extracts sitemap locations and detects analytics markup", () => {
    expect(extractSitemapLocations("<url><loc>https://example.com/</loc></url>")).toEqual(["https://example.com/"]);
    expect(containsAnalyticsMarkup('<script src="https://www.googletagmanager.com/gtag.js"></script>')).toBe(true);
    expect(containsAnalyticsMarkup("<main>Steady Signal</main>")).toBe(false);
  });
});
