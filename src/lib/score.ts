import { CONFIG } from './config';

export function canPassPaperA(module1Correct: number, module2Correct: number): boolean {
  const passMark = CONFIG.a.passMark;
  return module1Correct + module2Correct >= passMark;
}

export function paperAStatusAfterModule1(module1Correct: number): boolean | null {
  const passMark = CONFIG.a.passMark;
  const maxWithModule2 = module1Correct + CONFIG.a.modules.m2.count;
  if (maxWithModule2 < passMark) return false;
  if (module1Correct >= passMark) return true;
  return null;
}
