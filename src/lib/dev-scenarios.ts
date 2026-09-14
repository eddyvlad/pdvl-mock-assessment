import { CONFIG } from "./config";
import type { Question } from "./questions";

export type DevScenario = "all-correct" | "pass-with-incorrect" | "fail";

export interface DevScenarioContext {
  paper: string;
  module: string;
  previousModuleScore?: number;
}

export interface DevScenarioPlan {
  answers: number[];
  disabledReason?: string;
}

function guaranteedWrongAnswer(question: Question) {
  if (question.choices.length < 2) {
    return question.correctIndex;
  }

  return (question.correctIndex + 1) % question.choices.length;
}

function createAnswerPlan(questions: Question[], correctCount: number): DevScenarioPlan {
  return {
    answers: questions.map((question, index) =>
      index < correctCount ? question.correctIndex : guaranteedWrongAnswer(question),
    ),
  };
}

function disabled(reason: string): DevScenarioPlan {
  return { answers: [], disabledReason: reason };
}

export function buildScenarioAnswers(
  questions: Question[],
  scenario: DevScenario,
  context: DevScenarioContext,
): DevScenarioPlan {
  const paper = CONFIG[context.paper];
  const moduleConfig = paper?.modules[context.module];
  if (!paper || !moduleConfig) {
    return disabled("This development scenario is unavailable for the selected question set.");
  }

  const total = questions.length;
  if (scenario === "all-correct") {
    return createAnswerPlan(questions, total);
  }

  let correctCount: number;
  if (context.paper === "a" && context.module === "m1") {
    if (scenario === "pass-with-incorrect") {
      return disabled(
        "Paper A Module 1 cannot demonstrate a final pass with incorrect answers because Module 2 contributes to the combined score.",
      );
    }

    correctCount = paper.passMark - CONFIG.a.modules.m2.count - 1;
  } else if (context.paper === "a" && context.module === "m2") {
    if (context.previousModuleScore === undefined) {
      return disabled("This Paper A scenario needs a matching submitted Module 1 result for the same seed.");
    }

    if (scenario === "pass-with-incorrect") {
      correctCount = Math.max(0, paper.passMark - context.previousModuleScore);
      if (correctCount >= total) {
        return disabled(
          "This pass scenario requires every Module 2 answer to be correct, so it cannot include an incorrect answer.",
        );
      }
    } else {
      correctCount = paper.passMark - context.previousModuleScore - 1;
      if (correctCount < 0) {
        return disabled(
          "A failing Paper A result is impossible because the recorded Module 1 score already reaches the paper pass mark.",
        );
      }
    }
  } else {
    correctCount = scenario === "pass-with-incorrect" ? paper.passMark : paper.passMark - 1;
  }

  if (correctCount < 0 || correctCount > total) {
    return disabled("This development scenario cannot reach its target with the selected question count.");
  }

  return createAnswerPlan(questions, correctCount);
}
