import { buildScenarioAnswers } from "../dev-scenarios";
import { calculateScore } from "../practice-scoring";
import type { Question } from "../questions";

const questions: Question[] = [
  { prompt: "One?", choices: ["A", "B", "C", "D"], correctIndex: 0 },
  { prompt: "Two?", choices: ["A", "B", "C"], correctIndex: 1 },
  { prompt: "Three?", choices: ["A", "B"], correctIndex: 1 },
  { prompt: "Four?", choices: ["A", "B", "C", "D"], correctIndex: 3 },
  { prompt: "Five?", choices: ["A", "B", "C"], correctIndex: 2 },
];

describe("development assessment scenarios", () => {
  it("fills every question with its correct answer without mutating questions", () => {
    const original = questions.map((question) => ({
      ...question,
      choices: [...question.choices],
    }));
    const plan = buildScenarioAnswers(questions, "all-correct", {
      paper: "b",
      module: "3b",
    });

    expect(plan.answers).toEqual([0, 1, 1, 3, 2]);
    expect(
      plan.answers.every(
        (answer, index) => answer === questions[index].correctIndex,
      ),
    ).toBe(true);
    expect(questions).toEqual(original);
  });

  it("uses deterministic valid wrong choices for every choice count", () => {
    const plan = buildScenarioAnswers(questions, "fail", {
      paper: "c",
      module: "4b",
    });

    expect(
      plan.answers.every(
        (answer, index) =>
          answer >= 0 && answer < questions[index].choices.length,
      ),
    ).toBe(true);
    expect(
      plan.answers.every(
        (answer, index) => answer !== questions[index].correctIndex,
      ),
    ).toBe(true);
    expect(
      buildScenarioAnswers(questions, "fail", { paper: "c", module: "4b" }),
    ).toEqual(plan);
  });

  it("targets the configured standalone pass and fail scores", () => {
    const paperBQuestions = Array.from({ length: 25 }, (_, index) => ({
      prompt: `Question ${index + 1}`,
      choices: ["A", "B", "C", "D"],
      correctIndex: index % 4,
    }));
    const paperCQuestions = paperBQuestions.slice(0, 15);

    expect(
      calculateScore(
        buildScenarioAnswers(paperBQuestions, "pass-with-incorrect", {
          paper: "b",
          module: "3b",
        }).answers,
        paperBQuestions,
      ),
    ).toBe(22);
    expect(
      calculateScore(
        buildScenarioAnswers(paperBQuestions, "fail", {
          paper: "b",
          module: "3b",
        }).answers,
        paperBQuestions,
      ),
    ).toBe(21);
    expect(
      calculateScore(
        buildScenarioAnswers(paperCQuestions, "pass-with-incorrect", {
          paper: "c",
          module: "4b",
        }).answers,
        paperCQuestions,
      ),
    ).toBe(12);
    expect(
      calculateScore(
        buildScenarioAnswers(paperCQuestions, "fail", {
          paper: "c",
          module: "4b",
        }).answers,
        paperCQuestions,
      ),
    ).toBe(11);
  });

  it("handles Paper A edge cases and explains impossible scenarios", () => {
    const moduleOne = Array.from({ length: 30 }, (_, index) => ({
      prompt: `Module 1 question ${index + 1}`,
      choices: ["A", "B", "C", "D"],
      correctIndex: 0,
    }));
    const moduleTwo = moduleOne.slice(0, 5);

    expect(
      buildScenarioAnswers(moduleOne, "pass-with-incorrect", {
        paper: "a",
        module: "m1",
      }).disabledReason,
    ).toMatch(/Module 2/);
    expect(
      calculateScore(
        buildScenarioAnswers(moduleOne, "fail", { paper: "a", module: "m1" })
          .answers,
        moduleOne,
      ),
    ).toBe(24);
    expect(
      calculateScore(
        buildScenarioAnswers(moduleTwo, "pass-with-incorrect", {
          paper: "a",
          module: "m2",
          previousModuleScore: 26,
        }).answers,
        moduleTwo,
      ),
    ).toBe(4);
    expect(
      buildScenarioAnswers(moduleTwo, "pass-with-incorrect", {
        paper: "a",
        module: "m2",
        previousModuleScore: 25,
      }).disabledReason,
    ).toMatch(/every Module 2 answer/);
    expect(
      calculateScore(
        buildScenarioAnswers(moduleTwo, "fail", {
          paper: "a",
          module: "m2",
          previousModuleScore: 24,
        }).answers,
        moduleTwo,
      ),
    ).toBe(5);
    expect(
      buildScenarioAnswers(moduleTwo, "fail", {
        paper: "a",
        module: "m2",
        previousModuleScore: 30,
      }).disabledReason,
    ).toMatch(/already reaches/);
  });
});
