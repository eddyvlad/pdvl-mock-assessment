import { createAttemptRecord } from "../attempt-storage";
import { calculateScore, getTopicStats, submitAttemptRecord } from "../practice-scoring";
import type { Question } from "../questions";

const questions: Question[] = [
  {
    prompt: "One?",
    choices: ["Yes", "No"],
    correctIndex: 0,
    tags: ["safety", "basics"],
  },
  { prompt: "Two?", choices: ["Yes", "No"], correctIndex: 1, tags: ["safety"] },
  { prompt: "Three?", choices: ["Yes", "No"], correctIndex: 0 },
];

describe("practice scoring", () => {
  it("counts only selected correct answers and leaves unanswered answers incorrect", () => {
    expect(calculateScore([0, null, 1], questions)).toBe(1);
  });

  it("aggregates every tagged question into sorted topic signals", () => {
    expect(getTopicStats([0, null, 0], questions)).toEqual([
      { tag: "basics", correct: 1, total: 1 },
      { tag: "safety", correct: 1, total: 2 },
    ]);
    expect(getTopicStats([0, null, 0], [{ ...questions[2] }])).toEqual([]);
  });

  it("records manual and automatic submission state with a score", () => {
    const record = createAttemptRecord({
      paper: "b",
      module: "3b",
      seed: "abc123",
      total: 3,
      minutes: 30,
      now: 100,
    });
    const submitted = submitAttemptRecord({ ...record, answers: [0, 1, null] }, questions, "auto", 500);

    expect(submitted).toMatchObject({
      status: "submitted",
      submissionMode: "auto",
      submittedAt: 500,
      updatedAt: 500,
      score: 2,
    });
  });
});
