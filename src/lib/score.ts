import { MODULE_CONFIG } from './config';

export const PAPER_A_PASS_MARK = 30;

export function canPassPaperA(module1Correct: number, module2Correct: number): boolean {
  return module1Correct + module2Correct >= PAPER_A_PASS_MARK;
}

export function paperAStatusAfterModule1(module1Correct: number): boolean | null {
  if (module1Correct + MODULE_CONFIG.a.m2.count < PAPER_A_PASS_MARK) return false;
  if (module1Correct >= PAPER_A_PASS_MARK) return true;
  return null;
}
