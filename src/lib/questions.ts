import { moduleRng } from "./seed";

export interface Question {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  tags?: string[];
}

export function shuffleQuestionChoices(q: Question, rng: () => number): Question {
  const indices = q.choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const choices = indices.map((i) => q.choices[i]);
  const correctIndex = indices.indexOf(q.correctIndex);
  return { ...q, choices, correctIndex };
}

export function sampleQuestions(pool: Question[], count: number, rng: () => number): Question[] {
  const indices = pool.map((_, i) => i);
  for (let i = 0; i < count; i += 1) {
    const j = i + Math.floor(rng() * (indices.length - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const selected = indices.slice(0, count).map((i) => pool[i]);
  return selected.map((q) => shuffleQuestionChoices(q, rng));
}

export function getModuleRng(seed: string, moduleKey: string) {
  return moduleRng(seed, moduleKey);
}

