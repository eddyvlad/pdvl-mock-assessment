import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import ResultsClient from "./ResultsClient";

import { MODULE_CONFIG } from "@/lib/config";
import { datasetPath } from "@/lib/dataset";
import { getModuleRng, Question, sampleQuestions } from "@/lib/questions";
import { generateSeed, isValidSeed } from "@/lib/seed";

interface Params {
  paper: string;
  module: string;
  seed: string;
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { paper, module, seed } = await params;
  if (!MODULE_CONFIG[paper]?.[module]) {
    notFound();
  }
  if (!isValidSeed(seed)) {
    redirect(`/assess/${paper}/${module}/${generateSeed()}`);
  }
    const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${protocol}://${host}${datasetPath(paper, module)}`;
  const res = await fetch(url);
  if (!res.ok) notFound();
  const pool = (await res.json()) as Question[];
  const rng = getModuleRng(seed, module);
  const cfg = MODULE_CONFIG[paper][module];
  const questions = sampleQuestions(pool, cfg.count, rng);
  return <ResultsClient paper={paper} moduleKey={module} seed={seed} questions={questions} />;
}

