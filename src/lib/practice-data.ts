import { headers } from "next/headers";
import { datasetPath } from "./dataset";
import { getModuleRng, type Question, sampleQuestions } from "./questions";

export async function loadPracticeQuestions(paper: string, module: string, seed: string, count: number) {
  try {
    const host = (await headers()).get("host") ?? "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const response = await fetch(`${protocol}://${host}${datasetPath(paper, module)}`);
    if (!response.ok) {
      return null;
    }

    const pool = (await response.json()) as Question[];
    return sampleQuestions(pool, count, getModuleRng(seed, module));
  } catch {
    return null;
  }
}
