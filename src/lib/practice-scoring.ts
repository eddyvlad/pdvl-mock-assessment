import type { AttemptRecordV2, SubmissionMode } from "./attempt-storage";
import type { Question } from "./questions";

export function countAnswered(answers: Array<number | null>) {
  return answers.filter((answer) => answer !== null).length;
}

export function calculateScore(
  answers: Array<number | null>,
  questions: Question[],
) {
  return questions.reduce(
    (score, question, index) =>
      answers[index] !== null && answers[index] === question.correctIndex
        ? score + 1
        : score,
    0,
  );
}

export function submitAttemptRecord(
  record: AttemptRecordV2,
  questions: Question[],
  submissionMode: SubmissionMode,
  now = Date.now(),
): AttemptRecordV2 {
  return {
    ...record,
    status: "submitted",
    submittedAt: now,
    submissionMode,
    updatedAt: now,
    score: calculateScore(record.answers, questions),
  };
}

export function getTopicStats(
  answers: Array<number | null>,
  questions: Question[],
) {
  const topics = new Map<string, { correct: number; total: number }>();

  questions.forEach((question, index) => {
    question.tags?.forEach((tag) => {
      const current = topics.get(tag) ?? { correct: 0, total: 0 };
      current.total += 1;
      if (answers[index] !== null && answers[index] === question.correctIndex) {
        current.correct += 1;
      }
      topics.set(tag, current);
    });
  });

  return Array.from(topics.entries())
    .map(([tag, stats]) => ({ tag, ...stats }))
    .sort((left, right) => left.tag.localeCompare(right.tag));
}
