jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

import { headers } from "next/headers";
import { getDatasetProtocol, loadPracticeQuestions } from "../practice-data";

const mockedHeaders = headers as jest.MockedFunction<typeof headers>;

afterEach(() => {
  jest.restoreAllMocks();
  mockedHeaders.mockReset();
});

test.each([
  ["https", "https"],
  ["https, http", "https"],
  ["HTTP", "http"],
])("uses the first valid forwarded protocol from %s", (forwardedProtocol, expectedProtocol) => {
  const requestHeaders = new Headers({ "x-forwarded-proto": forwardedProtocol });

  expect(getDatasetProtocol(requestHeaders, "http://localhost:3000", "production")).toBe(expectedProtocol);
});

test("uses the configured local HTTP origin when no protocol is forwarded", () => {
  expect(getDatasetProtocol(new Headers(), "http://localhost:3001", "production")).toBe("http");
});

test("keeps development dataset requests on HTTP", () => {
  expect(getDatasetProtocol(new Headers({ "x-forwarded-proto": "https" }), "https://example.com", "development")).toBe(
    "http",
  );
});

test("falls back to HTTPS for an invalid configured origin in production", () => {
  expect(getDatasetProtocol(new Headers({ "x-forwarded-proto": "ftp" }), "localhost:3001", "production")).toBe("https");
});

test("keeps the friendly null result when the dataset response is unavailable", async () => {
  mockedHeaders.mockResolvedValue(new Headers({ host: "localhost:3000", "x-forwarded-proto": "http" }));
  jest.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

  await expect(loadPracticeQuestions("b", "3b", "000000", 25)).resolves.toBeNull();
});

test("keeps the friendly null result when the dataset request throws", async () => {
  mockedHeaders.mockResolvedValue(new Headers({ host: "localhost:3000", "x-forwarded-proto": "http" }));
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("connection refused"));

  await expect(loadPracticeQuestions("b", "3b", "000000", 25)).resolves.toBeNull();
});
