import { datasetPath } from "../dataset";

test("datasetPath maps module keys", () => {
  expect(datasetPath("a", "m1")).toBe(
    "/datasets/v2025-09/paper-a-module-1.json"
  );
  expect(datasetPath("a", "m2")).toBe(
    "/datasets/v2025-09/paper-a-module-2.json"
  );
  expect(datasetPath("b", "3b")).toBe(
    "/datasets/v2025-09/paper-b-module-3b.json"
  );
});
