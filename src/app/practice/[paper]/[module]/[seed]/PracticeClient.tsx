'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, Check, Clock3, ListChecks } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createAttemptRecord,
  getLatestAttempt,
  getLatestResumableAttempt,
  isResumableAttempt,
  matchesAttemptContext,
  readAttempt,
  removeActiveSession,
  type AttemptRecordV2,
  writeAttempt,
} from '@/lib/attempt-storage';
import { trackAssessmentEvent } from '@/lib/analytics';
import { CONFIG } from '@/lib/config';
import { calculateScore, countAnswered, submitAttemptRecord } from '@/lib/practice-scoring';
import type { Question } from '@/lib/questions';

interface Props {
  paper: string;
  moduleKey: string;
  seed: string;
  questions: Question[];
  minutes: number;
  attemptId?: string;
  questionIndex?: number;
  returnToReview?: boolean;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function PracticeClient({
  paper,
  moduleKey,
  seed,
  questions,
  minutes,
  attemptId,
  questionIndex,
  returnToReview,
}: Props) {
  const router = useRouter();
  const total = questions.length;
  const basePath = `/practice/${paper}/${moduleKey}/${seed}`;
  const paperName = CONFIG[paper]?.name ?? `Paper ${paper.toUpperCase()}`;
  const moduleName = CONFIG[paper]?.modules[moduleKey]?.label ?? moduleKey.toUpperCase();
  const attemptRef = useRef<AttemptRecordV2 | null>(null);
  const initializedRouteRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const [attempt, setAttempt] = useState<AttemptRecordV2 | null>(null);
  const [attemptError, setAttemptError] = useState(false);
  const [grace, setGrace] = useState(3);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const initializationKey = `${paper}/${moduleKey}/${seed}/${attemptId ?? ''}/${questionIndex ?? ''}`;

  const finishAttempt = useCallback((record: AttemptRecordV2, mode: 'manual' | 'auto') => {
    if (submittingRef.current || record.status === 'submitted') {
      return;
    }

    submittingRef.current = true;
    const finalRecord = submitAttemptRecord(record, questions, mode);
    writeAttempt(finalRecord);
    removeActiveSession();
    attemptRef.current = finalRecord;
    setAttempt(finalRecord);
    setTimeLeft(0);
    trackAssessmentEvent('assessment_submit', {
      paper,
      module: moduleKey,
      seed,
      score: finalRecord.score ?? calculateScore(record.answers, questions),
      total,
      elapsed: Math.max(0, Math.floor((Date.now() - record.startedAt) / 1000)),
      auto: mode === 'auto',
    });
    router.replace(`${basePath}/result?attempt=${encodeURIComponent(record.attemptId)}`, { scroll: true });
  }, [basePath, moduleKey, paper, questions, router, seed, total]);

  const patchAttempt = useCallback((patch: Partial<AttemptRecordV2>) => {
    const current = attemptRef.current;
    if (!current || current.status !== 'in-progress') {
      return null;
    }

    const updated = { ...current, ...patch, updatedAt: Date.now() };
    attemptRef.current = updated;
    setAttempt(updated);
    writeAttempt(updated);
    return updated;
  }, []);

  const updateAnswer = useCallback((index: number, choice: number) => {
    const current = attemptRef.current;
    if (!current || current.status !== 'in-progress' || !questions[index]?.choices[choice]) {
      return;
    }

    const previousChoice = current.answers[index];
    const answers = [...current.answers];
    answers[index] = choice;
    patchAttempt({ answers, currentQuestion: index });
    trackAssessmentEvent('answer_select', {
      i: index,
      choice,
      changed: previousChoice !== choice,
    });
  }, [patchAttempt, questions]);

  useEffect(() => {
    if (paper === 'a' && moduleKey === 'm2') {
      const previous = getLatestAttempt((candidate) => (
        candidate.paper === 'a' &&
        candidate.module === 'm1' &&
        candidate.seed === seed &&
        candidate.status === 'submitted'
      ));
      if (!previous) {
        router.replace(`/practice/a/m1/${seed}`);
        return;
      }
    }

    if (initializedRouteRef.current === initializationKey) {
      return;
    }
    initializedRouteRef.current = initializationKey;

    const context = { paper, module: moduleKey, seed };
    let stored = attemptId ? readAttempt(attemptId) : getLatestResumableAttempt();
    if (attemptId && (!stored || !matchesAttemptContext(stored, context))) {
      setAttemptError(true);
      return;
    }
    if (!attemptId && stored && !matchesAttemptContext(stored, context)) {
      stored = null;
    }
    if (stored?.status === 'submitted') {
      router.replace(`${basePath}/result?attempt=${encodeURIComponent(stored.attemptId)}`, { scroll: true });
      return;
    }
    if (stored && stored.status === 'in-progress' && isResumableAttempt(stored)) {
      const savedQuestion = Number.isInteger(questionIndex) && questionIndex !== undefined && questionIndex >= 0 && questionIndex < total
        ? questionIndex
        : Math.min(stored.currentQuestion, Math.max(total - 1, 0));
      const restored = savedQuestion === stored.currentQuestion
        ? stored
        : { ...stored, currentQuestion: savedQuestion, updatedAt: Date.now() };
      if (restored !== stored) {
        writeAttempt(restored);
      }
      attemptRef.current = restored;
      setAttempt(restored);
      setGrace(0);
      setTimeLeft(Math.max(0, Math.ceil((restored.expiresAt - Date.now()) / 1000)));
      return;
    }

    if (stored && stored.status === 'in-progress') {
      finishAttempt(stored, 'auto');
      return;
    }

    const fresh = createAttemptRecord({ paper, module: moduleKey, seed, total, minutes });
    writeAttempt(fresh);
    attemptRef.current = fresh;
    setAttempt(fresh);
    setGrace(3);
    setTimeLeft(minutes * 60);
    trackAssessmentEvent('assessment_start', {
      paper,
      module: moduleKey,
      seed,
      count: total,
      minutes,
      version: 2,
    });
  }, [attemptId, basePath, finishAttempt, initializationKey, minutes, moduleKey, paper, questionIndex, router, seed, total]);

  useEffect(() => {
    if (!attempt || attempt.status !== 'in-progress') {
      return;
    }

    if (grace > 0) {
      const timer = window.setTimeout(() => setGrace((value) => value - 1), 1_000);
      return () => window.clearTimeout(timer);
    }

    const updateTime = () => {
      const current = attemptRef.current;
      if (!current) {
        return;
      }

      const remaining = Math.max(0, Math.ceil((current.expiresAt - Date.now()) / 1_000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        finishAttempt(current, 'auto');
      }
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1_000);
    return () => window.clearInterval(timer);
  }, [attempt, finishAttempt, grace]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const current = attemptRef.current;
      if (!current || current.status !== 'in-progress') {
        return;
      }

      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const choice = map[event.key.toLowerCase()];
      if (choice === undefined || !questions[current.currentQuestion]?.choices[choice]) {
        return;
      }

      event.preventDefault();
      updateAnswer(current.currentQuestion, choice);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [questions, updateAnswer]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < total) {
      patchAttempt({ currentQuestion: index });
    }
  };

  if (attemptError) {
    return (
      <main className="page-shell">
        <div className="card mx-auto max-w-xl border-danger">
          <p className="eyebrow mb-3">Practice unavailable</p>
          <h1 className="mb-4 text-4xl">This practice attempt does not belong to this question set.</h1>
          <p className="mb-6 leading-7 text-muted-foreground">Open the matching practice link or start a new attempt from the landing page.</p>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={() => router.replace(basePath)}>Open this practice set</button>
            <button className="btn btn-secondary" type="button" onClick={() => router.replace('/')}>Back to landing</button>
          </div>
        </div>
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="page-shell">
        <p className="eyebrow">Preparing your practice</p>
        <h1 className="mb-4 text-4xl">Loading the question set...</h1>
        <p className="text-muted-foreground">Your attempt will be saved as you work.</p>
      </main>
    );
  }

  const currentQuestion = Math.min(attempt.currentQuestion, Math.max(total - 1, 0));
  const question = questions[currentQuestion];
  const answered = countAnswered(attempt.answers);
  const progress = total === 0 ? 0 : ((currentQuestion + 1) / total) * 100;

  if (!question) {
    return null;
  }

  return (
    <main className="page-shell max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">{paperName} · Module {moduleName}</p>
          <h1 className="mb-0 text-4xl sm:text-5xl">Practice, one signal at a time.</h1>
        </div>
        <div className={clsx('border-l-4 bg-card px-4 py-3', timeLeft <= 60 && grace === 0 ? 'border-danger' : 'border-accent')}>
          <p className="meta-label mb-1">{grace > 0 ? 'Get ready' : 'Time remaining'}</p>
          <p className="m-0 flex items-center gap-2 font-mono text-xl font-bold" aria-label={grace > 0 ? `Practice starts in ${grace} seconds` : `${formatTime(timeLeft)} remaining`}>
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {grace > 0 ? `Starts in ${grace}` : formatTime(timeLeft)}
          </p>
        </div>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold">
            <span>Question {currentQuestion + 1} of {total}</span>
            <span className="text-muted-foreground">{answered} answered</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={currentQuestion + 1} aria-label={`Question ${currentQuestion + 1} of ${total}`}>
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="flex items-center gap-2 text-sm text-muted-foreground"><ListChecks className="h-4 w-4" aria-hidden="true" /> Saved automatically</span>
      </div>

      <section className="card border-primary/30 p-5 sm:p-8" aria-labelledby={`question-${currentQuestion}`}>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Question {currentQuestion + 1}</p>
            <h2 id={`question-${currentQuestion}`} className="practice-question-heading mb-0 max-w-3xl font-sans text-2xl font-bold leading-8 tracking-normal sm:text-3xl">{question.prompt}</h2>
          </div>
          <span className="hidden shrink-0 font-mono text-sm text-muted-foreground sm:inline">{String(currentQuestion + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>

        <fieldset>
          <legend className="sr-only">Choose an answer</legend>
          <div className="grid gap-3">
            {question.choices.map((choice, choiceIndex) => {
              const selected = attempt.answers[currentQuestion] === choiceIndex;
              const label = String.fromCharCode(65 + choiceIndex);
              const id = `q${currentQuestion}-${choiceIndex}`;
              return (
                <label key={id} htmlFor={id} className={clsx('flex cursor-pointer items-start gap-4 border p-4 transition-colors hover:border-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring', selected ? 'border-primary bg-muted' : 'border-border bg-background')}>
                  <input
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    type="radio"
                    id={id}
                    name={`question-${currentQuestion}`}
                    value={choiceIndex}
                    checked={selected}
                    onChange={() => updateAnswer(currentQuestion, choiceIndex)}
                  />
                  <span className="flex gap-3 text-base leading-7">
                    <span className="font-mono font-bold text-accent">{label}</span>
                    <span>{choice}</span>
                  </span>
                  {selected && <Check className="ml-auto mt-1 h-5 w-5 shrink-0 text-primary" aria-label="Selected" />}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-5">
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-secondary gap-2" type="button" disabled={currentQuestion === 0} onClick={() => goToQuestion(currentQuestion - 1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            {returnToReview ? (
              <Link className="btn btn-secondary gap-2" href={`${basePath}/review?attempt=${encodeURIComponent(attempt.attemptId)}`}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to review
              </Link>
            ) : null}
          </div>
          <button className="btn btn-primary gap-2" type="button" onClick={() => {
            if (currentQuestion === total - 1) {
              router.push(`${basePath}/review?attempt=${encodeURIComponent(attempt.attemptId)}`);
            } else {
              goToQuestion(currentQuestion + 1);
            }
          }}>
            {currentQuestion === total - 1 ? 'Review answers' : 'Next question'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <p className="mt-5 text-center text-sm text-muted-foreground" aria-live={grace > 0 ? 'polite' : undefined}>
        {grace > 0 ? `The timer starts after the ${grace}-second grace period.` : 'Use 1–4 or A–D to select an answer.'}
      </p>
    </main>
  );
}
