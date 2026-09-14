import { notFound, redirect } from "next/navigation";
import PracticeLoadError from "@/components/practice-load-error";
import { CONFIG } from "@/lib/config";
import { loadPracticeQuestions } from "@/lib/practice-data";
import { generateSeed, isValidSeed } from "@/lib/seed";
import ResultsClient from "./ResultsClient";

interface Params {
  paper: string;
  module: string;
  seed: string;
}

type SearchParams = Record<string, string | string[] | undefined>;

function getStringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { paper, module, seed } = await params;
  const moduleConfig = CONFIG[paper]?.modules?.[module];
  if (!moduleConfig) {
    notFound();
  }

  if (!isValidSeed(seed)) {
    redirect(`/practice/${paper}/${module}/${generateSeed()}`);
  }

  const questions = await loadPracticeQuestions(
    paper,
    module,
    seed,
    moduleConfig.count,
  );
  if (!questions) {
    return (
      <PracticeLoadError
        retryHref={`/practice/${paper}/${module}/${seed}/result`}
      />
    );
  }

  const query = await searchParams;
  return (
    <main className="page-shell max-w-5xl">
      <ResultsClient
        paper={paper}
        moduleKey={module}
        seed={seed}
        questions={questions}
        attemptId={getStringParam(query.attempt)}
        newSeed={generateSeed()}
      />
    </main>
  );
}
