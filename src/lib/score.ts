export const PAPER_A_PASS_MARK = 30;

export function canPassPaperA(module1Correct: number, module2Correct: number): boolean {
  return module1Correct + module2Correct >= PAPER_A_PASS_MARK;
}
