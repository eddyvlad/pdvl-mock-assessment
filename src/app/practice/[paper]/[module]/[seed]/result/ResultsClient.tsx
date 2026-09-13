'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import clsx from 'clsx';
import { ArrowRight, ArrowUp, CheckCircle2, ClipboardCheck, Home, RotateCcw, Share2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLatestAttempt, matchesAttemptContext, readAttempt, type AttemptRecordV2 } from '@/lib/attempt-storage';
import { trackAssessmentEvent } from '@/lib/analytics';
import { CONFIG } from '@/lib/config';
import { calculateScore, getTopicStats } from '@/lib/practice-scoring';
import type { Question } from '@/lib/questions';

interface Props {
  paper: string;
  moduleKey: string;
  seed: string;
  questions: Question[];
  attemptId?: string;
  newSeed: string;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min ${remainingSeconds} sec`;
}

function formatTopicTag(tag: string) {
  return tag.replaceAll('_', ' ');
}

export default function ResultsClient({ paper, moduleKey, seed, questions, attemptId, newSeed }: Props) {
  const router = useRouter();
  const basePath = `/practice/${paper}/${moduleKey}/${seed}`;
  const [attempt, setAttempt] = useState<AttemptRecordV2 | null>(null);
  const [attemptError, setAttemptError] = useState<'missing' | 'mismatch' | 'paper-a-chain' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!attemptId) {
      setAttemptError('missing');
      return;
    }

    const stored = readAttempt(attemptId);
    if (!stored || stored.status !== 'submitted') {
      setAttemptError('missing');
      return;
    }
    if (!matchesAttemptContext(stored, { paper, module: moduleKey, seed })) {
      setAttemptError('mismatch');
      return;
    }

    const score = stored.score ?? calculateScore(stored.answers, questions);
    const previousModule = paper === 'a' && moduleKey === 'm2'
      ? getLatestAttempt((candidate) => candidate.paper === 'a' && candidate.module === 'm1' && candidate.seed === seed && candidate.status === 'submitted')
      : null;
    if (paper === 'a' && moduleKey === 'm2' && !previousModule) {
      setAttemptError('paper-a-chain');
      return;
    }

    const combinedScore = previousModule ? (previousModule.score ?? 0) + score : score;
    setAttempt(stored);
    trackAssessmentEvent('view_result', {
      paper,
      module: moduleKey,
      seed,
      score,
      total: questions.length,
      pass: paper === 'a' && moduleKey === 'm1' ? false : combinedScore >= (CONFIG[paper]?.passMark ?? 0),
    });
  }, [attemptId, moduleKey, paper, questions, seed]);

  async function copyLink() {
    const url = `${window.location.origin}${basePath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    trackAssessmentEvent('copy_link', { paper, module: moduleKey, seed });
  }

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  if (!attempt) {
    return (
      <div className="card mx-auto max-w-xl border-danger">
        <p className="eyebrow mb-3">Result unavailable</p>
        <h1 className="mb-4 text-4xl">
          {attemptError === 'mismatch'
            ? 'This attempt does not belong to this question set.'
            : attemptError === 'paper-a-chain'
              ? 'The Paper A Module 1 result is not available.'
              : 'Open a completed attempt to see its result.'}
        </h1>
        <p className="mb-6 leading-7 text-muted-foreground">
          {attemptError === 'mismatch'
            ? 'Open the matching result link or return to the landing page.'
            : attemptError === 'paper-a-chain'
              ? 'Complete Module 1 before opening the combined Module 2 result.'
              : 'This result link does not include a completed v2 attempt.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href={basePath}>Return to practice</Link>
          <Link className="btn btn-secondary" href="/">Back to landing</Link>
        </div>
      </div>
    );
  }

  const moduleScore = attempt.score ?? calculateScore(attempt.answers, questions);
  const moduleConfig = CONFIG[paper]?.modules[moduleKey];
  const paperName = CONFIG[paper]?.name ?? `Paper ${paper.toUpperCase()}`;
  const moduleName = moduleConfig?.label ?? moduleKey.toUpperCase();
  const modulePassMark = CONFIG[paper]?.passMark ?? 0;
  const previousModule = paper === 'a' && moduleKey === 'm2'
    ? getLatestAttempt((candidate) => candidate.paper === 'a' && candidate.module === 'm1' && candidate.seed === seed && candidate.status === 'submitted')
    : null;
  const combinedScore = previousModule ? (previousModule.score ?? 0) + moduleScore : null;
  const isPaperASecondModule = paper === 'a' && moduleKey === 'm2';
  const paperPass = paper === 'a' && moduleKey === 'm2'
    ? (combinedScore ?? moduleScore) >= modulePassMark
    : paper !== 'a' && moduleScore >= modulePassMark;
  const isPaperAFirstModule = paper === 'a' && moduleKey === 'm1';
  const topicStats = getTopicStats(attempt.answers, questions);
  const elapsed = attempt.submittedAt ? Math.max(0, Math.floor((attempt.submittedAt - attempt.startedAt) / 1000)) : 0;

  return (
    <section className="space-y-10" aria-labelledby="result-heading">
      <header className="border-b border-border pb-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow mb-2">{paperName} · Module {moduleName}</p>
            <h1 id="result-heading" className="mb-3 text-4xl sm:text-6xl">{isPaperAFirstModule ? 'Module complete.' : paperPass ? 'You passed.' : 'Keep practising.'}</h1>
            <p className="m-0 max-w-2xl leading-7 text-muted-foreground">
              {isPaperAFirstModule
                ? 'Module 2 still contributes to your final Paper A result.'
                : paperPass ? 'Your score is at or above the configured paper threshold.' : 'Review the explanations, then use a fresh attempt to test the topics again.'}
            </p>
          </div>
          <span className={clsx('inline-flex items-center gap-2 border px-4 py-2 text-sm font-bold', isPaperAFirstModule ? 'border-accent text-accent' : paperPass ? 'border-success text-success' : 'border-danger text-danger')}>
            {isPaperAFirstModule ? <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> : paperPass ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
            {isPaperAFirstModule ? 'Paper A in progress' : paperPass ? 'Pass' : 'Not passed'}
          </span>
        </div>

        {isPaperASecondModule && (
          <div className="mb-4 grid gap-4 sm:grid-cols-3" aria-label="Paper A score breakdown">
            <div className="bg-muted p-4">
              <p className="meta-label mb-2">Module 1 subtotal</p>
              <p className="m-0 font-mono text-3xl font-bold text-primary">{previousModule?.score ?? 0}/{CONFIG.a.modules.m1.count}</p>
            </div>
            <div className="bg-muted p-4">
              <p className="meta-label mb-2">Module 2 subtotal</p>
              <p className="m-0 font-mono text-3xl font-bold text-primary">{moduleScore}/{CONFIG.a.modules.m2.count}</p>
            </div>
            <div className="bg-muted p-4">
              <p className="meta-label mb-2">Combined score</p>
              <p className="m-0 font-mono text-3xl font-bold text-primary">{combinedScore ?? moduleScore}/{CONFIG.a.modules.m1.count + CONFIG.a.modules.m2.count}</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {!isPaperASecondModule && <div className="bg-muted p-4">
            <p className="meta-label mb-2">Score</p>
            <p className="m-0 font-mono text-3xl font-bold text-primary">{moduleScore}/{questions.length}</p>
          </div>}
          <div className="bg-muted p-4">
            <p className="meta-label mb-2">Required</p>
            <p className="m-0 font-mono text-3xl font-bold text-primary">{modulePassMark} correct</p>
          </div>
          <div className="bg-muted p-4">
            <p className="meta-label mb-2">Completed</p>
            <p className="m-0 font-mono text-xl font-bold text-primary">{formatDuration(elapsed)}</p>
            <p className="m-0 text-xs text-muted-foreground">{attempt.submissionMode === 'auto' ? 'Time expired' : 'Submitted manually'}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link className="btn btn-primary gap-2" href={basePath}>Retake same set <RotateCcw className="h-4 w-4" aria-hidden="true" /></Link>
        <Link className="btn btn-secondary gap-2" href={`/practice/${paper}/${moduleKey}/${newSeed}`}>New question set <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <button className="btn btn-secondary gap-2" type="button" onClick={copyLink}>{copied ? <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}{copied ? 'Link copied' : 'Copy practice link'}</button>
        <Link className="btn btn-ghost gap-2" href="/"><Home className="h-4 w-4" aria-hidden="true" /> Landing</Link>
      </div>

      {isPaperAFirstModule && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-l-4 border-accent bg-muted p-5">
          <div>
            <p className="eyebrow mb-1">Next in Paper A</p>
            <p className="m-0 font-bold">Continue with Module 2 using the same seed.</p>
          </div>
          <button className="btn btn-primary gap-2" type="button" onClick={() => router.push(`/practice/a/m2/${seed}`)}>Proceed to Module 2 <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      )}

      {topicStats.length > 0 && (
        <section aria-labelledby="topic-heading">
          <div className="mb-4">
            <p className="eyebrow mb-2">Where to focus</p>
            <h2 id="topic-heading" className="mb-0 text-3xl">Topic signals</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topicStats.map((topic) => (
              <div key={topic.tag} className="border border-border bg-card p-4">
                <p className="m-0 font-bold">{formatTopicTag(topic.tag)}</p>
                <p className="m-0 font-mono text-sm text-muted-foreground">{topic.correct}/{topic.total} correct</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {topicStats.length === 0 && (
        <p className="border-l-4 border-accent bg-muted p-4 text-sm text-muted-foreground">Topic cues are not available for this module. Use the question explanations below for your review.</p>
      )}

      <section aria-labelledby="answers-heading">
        <div className="mb-5">
          <p className="eyebrow mb-2">Detailed review</p>
          <h2 id="answers-heading" className="mb-0 text-3xl">Question by question</h2>
        </div>
        <ol className="space-y-4">
          {questions.map((question, index) => {
            const answer = attempt.answers[index];
            const correct = answer !== null && answer === question.correctIndex;
            return (
              <li key={index} className={clsx('border bg-card p-5 sm:p-6', correct ? 'border-success' : 'border-danger')}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-accent">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="m-0 max-w-3xl font-sans text-base font-bold leading-7 tracking-normal">{question.prompt}</h3>
                  </div>
                  <span className={clsx('text-xs font-bold uppercase tracking-wide', correct ? 'text-success' : 'text-danger')}>
                    {correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p className={clsx('m-0 border-l-2 p-3', answer === null ? 'border-danger text-danger' : 'border-border text-muted-foreground')}>
                    <strong className="block text-foreground">Your answer</strong>
                    {answer === null || answer === undefined ? 'Unanswered' : `${String.fromCharCode(65 + Number(answer))}. ${question.choices[Number(answer)]}`}
                  </p>
                  <p className="m-0 border-l-2 border-success p-3 text-muted-foreground">
                    <strong className="block text-foreground">Correct answer</strong>
                    {String.fromCharCode(65 + question.correctIndex)}. {question.choices[question.correctIndex]}
                  </p>
                </div>
                {question.explanation && <p className="m-0 mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Why:</strong> {question.explanation}</p>}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex justify-end border-t border-border pt-6">
        <button className="btn btn-secondary gap-2" type="button" onClick={scrollToTop}>
          <ArrowUp className="h-4 w-4" aria-hidden="true" /> Back to top
        </button>
      </div>
    </section>
  );
}
