import { canPassPaperA, paperAStatusAfterModule1, paperAStatusPresentation } from "../score";

test("fails if module 1 score is 24 even with perfect module 2", () => {
  expect(canPassPaperA(24, 5)).toBe(false);
});

test("requires a perfect module 2 when module 1 score is 25", () => {
  expect(canPassPaperA(25, 5)).toBe(true);
  expect(canPassPaperA(25, 4)).toBe(false);
});

test.each([
  [
    24,
    false,
    "Not passed",
    "Paper A pass is no longer possible.",
    "Module 2 remains available, but even a perfect score cannot reach the Paper A pass mark.",
    "danger",
  ],
  [25, null, "Pending", "Module 1 complete.", "Module 2 still contributes to your final Paper A result.", "accent"],
  [
    30,
    true,
    "Threshold secured",
    "Paper A threshold secured.",
    "Your Module 1 score already reaches the Paper A pass mark. Module 2 remains available to complete the paper.",
    "success",
  ],
])("maps a Module 1 score of %s to its Paper A outcome", (score, expectedStatus, badge, heading, description, tone) => {
  const status = paperAStatusAfterModule1(score);

  expect(status).toBe(expectedStatus);
  expect(paperAStatusPresentation(status)).toMatchObject({ badge, heading, description, tone });
});
