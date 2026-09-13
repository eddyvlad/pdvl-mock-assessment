import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { datasetPath } from "../dataset";

const DATASET_DIRECTORY = join(process.cwd(), "public", "datasets", "v2025-09");

const EXPECTED_POOL_SIZES: Record<string, number> = {
  "paper-a-module-1.json": 152,
  "paper-a-module-2.json": 27,
  "paper-b-module-3b.json": 153,
  "paper-c-module-4b.json": 44,
};

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

test("v2025-09 pools match the question data contract", () => {
  const files = readdirSync(DATASET_DIRECTORY)
    .filter((file) => file.endsWith(".json"))
    .sort();

  expect(files).toEqual(Object.keys(EXPECTED_POOL_SIZES).sort());

  files.forEach((file) => {
    const pool = JSON.parse(
      readFileSync(join(DATASET_DIRECTORY, file), "utf8")
    ) as Array<{
      prompt?: unknown;
      choices?: unknown;
      correctIndex?: unknown;
      explanation?: unknown;
      tags?: unknown;
      difficulty?: unknown;
    }>;

    expect(pool).toHaveLength(EXPECTED_POOL_SIZES[file]);

    pool.forEach((question) => {
      expect(typeof question.prompt).toBe("string");
      expect(Array.isArray(question.choices)).toBe(true);
      expect((question.choices as unknown[]).length).toBeGreaterThanOrEqual(2);
      expect((question.choices as unknown[]).length).toBeLessThanOrEqual(4);
      expect(Number.isInteger(question.correctIndex)).toBe(true);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(
        (question.choices as unknown[]).length
      );
      expect(["easy", "medium", "hard"]).toContain(question.difficulty);

      if (question.explanation !== undefined) {
        expect(
          question.explanation === null || typeof question.explanation === "string"
        ).toBe(true);
      }

      if (question.tags !== undefined) {
        expect(Array.isArray(question.tags)).toBe(true);
        (question.tags as unknown[]).forEach((tag) => {
          expect(typeof tag).toBe("string");
          expect(tag).toMatch(/^[a-z0-9_]+$/);
        });
      }
    });
  });
});
