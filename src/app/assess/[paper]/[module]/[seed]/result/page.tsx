import { datasetPath } from "@/lib/dataset";
import { isValidSeed, generateSeed } from "@/lib/seed";
import { sampleQuestions, getModuleRng, Question } from "@/lib/questions";
import { MODULE_CONFIG } from "@/lib/config";
import { notFound, redirect } from "next/navigation";
import ResultsClient from "./ResultsClient";

interface Params {
  paper: string;
  module: string;
  seed: string;
}

export default async function Page({ params }: { params: Params }) {
  const { paper, module, seed } = params;
  if (!MODULE_CONFIG[paper]?.[module]) {
    notFound();
  }
  if (!isValidSeed(seed)) {
    redirect(`/assess/${paper}/${module}/${generateSeed()}`);
  }
  const res = await fetch(datasetPath(paper, module));
  if (!res.ok) notFound();
  const pool = (await res.json()) as Question[];
  const rng = getModuleRng(seed, module);
  const cfg = MODULE_CONFIG[paper][module];
  const questions = sampleQuestions(pool, cfg.count, rng);
  return <ResultsClient paper={paper} moduleKey={module} seed={seed} questions={questions} />;
}

