import { CONFIG } from "./config";

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

export type PaperAStatusPresentation = {
  badge: string;
  heading: string;
  description: string;
  tone: "accent" | "danger" | "success";
};

export function paperAStatusPresentation(status: boolean | null): PaperAStatusPresentation {
  if (status === false) {
    return {
      badge: "Not passed",
      heading: "Paper A pass is no longer possible.",
      description: "Module 2 remains available, but even a perfect score cannot reach the Paper A pass mark.",
      tone: "danger",
    };
  }

  if (status === true) {
    return {
      badge: "Threshold secured",
      heading: "Paper A threshold secured.",
      description:
        "Your Module 1 score already reaches the Paper A pass mark. Module 2 remains available to complete the paper.",
      tone: "success",
    };
  }

  return {
    badge: "Pending",
    heading: "Module 1 complete.",
    description: "Module 2 still contributes to your final Paper A result.",
    tone: "accent",
  };
}
