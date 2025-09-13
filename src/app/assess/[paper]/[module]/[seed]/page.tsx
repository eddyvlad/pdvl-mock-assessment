import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import AssessmentClient from './AssessmentClient';

import { MODULE_CONFIG } from '@/lib/config';
import { datasetPath } from '@/lib/dataset';
import { getModuleRng, Question, sampleQuestions } from '@/lib/questions';
import { generateSeed, isValidSeed } from '@/lib/seed';

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
  const {paper, module, seed} = await params;
  if (!MODULE_CONFIG[paper]?.[module]) {
    notFound();
  }
  if (!isValidSeed(seed)) {
    redirect(`/assess/${paper}/${module}/${generateSeed()}`);
  }
  const host = (await headers()).get('host') ?? 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const url = `${protocol}://${host}${datasetPath(paper, module)}`;
  const res = await fetch(url);
  if (!res.ok) {
    notFound();
  }
  const pool = (await res.json()) as Question[];
  const cfg = MODULE_CONFIG[paper][module];
  const rng = getModuleRng(seed, module);
  const questions = sampleQuestions(pool, cfg.count, rng);
  const paperName = paper.toUpperCase();
  const moduleTitle = module.charAt(0).toUpperCase() === 'M' ? module.slice(1) : module.toUpperCase();

  return (
    <>
      <div className="prose dark:prose-invert mx-auto max-w-prose m-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-0">Paper {paperName}</h1>
          <h2 className="mt-0">Module {moduleTitle}</h2>
        </div>
        <AssessmentClient
          paper={paper}
          moduleKey={module}
          seed={seed}
          questions={questions}
          minutes={cfg.minutes}
        />
      </div>
    </>
  );
}

