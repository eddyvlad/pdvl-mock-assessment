export type StoredAnswer = number | null;

export type StoredResult = {
  answers: StoredAnswer[];
  score: number;
};

export const EMPTY_STORED_RESULT: StoredResult = {
  answers: [],
  score: 0,
};

export function parseStoredResult(raw: string | null): StoredResult {
  if (!raw) {
    return EMPTY_STORED_RESULT;
  }

  try {
    const parsed = JSON.parse(raw) as {
      answers?: unknown;
      score?: unknown;
    };

    return {
      answers: Array.isArray(parsed.answers)
        ? parsed.answers.map((answer) => (typeof answer === "number" ? answer : null))
        : [],
      score: typeof parsed.score === "number" ? parsed.score : 0,
    };
  } catch {
    return EMPTY_STORED_RESULT;
  }
}
