import { datasetPath } from "@/lib/dataset";
import { isValidSeed, generateSeed } from "@/lib/seed";
import { sampleQuestions, getModuleRng, Question } from "@/lib/questions";
import AssessmentClient from "./AssessmentClient";
import { notFound, redirect } from "next/navigation";
import { MODULE_CONFIG } from "@/lib/config";

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
  if (!res.ok) {
    notFound();
  }
  const pool = (await res.json()) as Question[];
  const cfg = MODULE_CONFIG[paper][module];
  const rng = getModuleRng(seed, module);
  const questions = sampleQuestions(pool, cfg.count, rng);

  return (
    <AssessmentClient
      paper={paper}
      moduleKey={module}
      seed={seed}
      questions={questions}
      minutes={cfg.minutes}
    />
  );
}

