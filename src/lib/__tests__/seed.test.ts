import { moduleRng } from "../seed";
import { sampleQuestions, Question } from "../questions";

test("mulberry32 deterministic", () => {
  const rng1 = moduleRng("aaaaaa", "m1");
  const rng2 = moduleRng("aaaaaa", "m1");
  expect(rng1()).toBe(rng2());
});

test("sampleQuestions deterministic", () => {
  const pool: Question[] = Array.from({ length: 5 }, (_, i) => ({
    prompt: `Q${i}`,
    choices: ["a", "b", "c", "d"],
    correctIndex: 0,
  }));
  const rngA = moduleRng("bbbbbb", "m1");
  const selected1 = sampleQuestions(pool, 3, rngA);
  const rngB = moduleRng("bbbbbb", "m1");
  const selected2 = sampleQuestions(pool, 3, rngB);
  expect(selected1).toEqual(selected2);
});
