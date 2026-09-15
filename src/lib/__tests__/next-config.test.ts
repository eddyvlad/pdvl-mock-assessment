import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import nextConfig from "../../../next.config";

describe("production security headers", () => {
  it("applies the baseline to pages and public assets", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);

    for (const path of ["/", "/practice/a/m1/abc123", "/datasets/v2025-09/paper-a-module-1.json"]) {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://example.com${path}`,
        nextConfig,
      });

      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
      expect(response.headers.get("x-frame-options")).toBe("DENY");
    }
  });
});
