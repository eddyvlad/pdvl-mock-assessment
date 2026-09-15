import { EMPTY_STORED_RESULT, parseStoredResult } from "../result-storage";

test("parseStoredResult returns defaults for empty raw storage", () => {
  expect(parseStoredResult(null)).toEqual(EMPTY_STORED_RESULT);
});

test("parseStoredResult returns defaults for malformed JSON", () => {
  expect(parseStoredResult("{not-json")).toEqual(EMPTY_STORED_RESULT);
});

test("parseStoredResult reads answers and score from valid storage", () => {
  expect(
    parseStoredResult(
      JSON.stringify({
        answers: [1, null, 3],
        score: 2,
      }),
    ),
  ).toEqual({
    answers: [1, null, 3],
    score: 2,
  });
});

test("parseStoredResult normalizes invalid answers and missing score", () => {
  expect(
    parseStoredResult(
      JSON.stringify({
        answers: [0, "x", undefined, 2],
      }),
    ),
  ).toEqual({
    answers: [0, null, null, 2],
    score: 0,
  });
});
