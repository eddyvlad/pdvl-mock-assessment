'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Clock3, Send } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  attemptId?: string;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function SubmitAttemptDialog({
  unanswered,
  open,
  onClose,
  onConfirm,
  triggerRef,
}: {
  unanswered: number;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      wasOpenRef.current = true;
      dialog.querySelector<HTMLButtonElement>('[data-dialog-cancel]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
    }
  }, [open, triggerRef]);

  return (
    <dialog
      ref={dialogRef}
      id="submit-attempt-dialog"
      className="steady-dialog"
      aria-modal="true"
      aria-labelledby="submit-attempt-title"
      aria-describedby="submit-attempt-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="steady-dialog-panel">
        <p className="eyebrow mb-3">Before you submit</p>
        <h2 id="submit-attempt-title" className="mb-3 text-3xl">Submit this attempt?</h2>
        <p id="submit-attempt-description" className="m-0 leading-7 text-muted-foreground">
          {unanswered} question{unanswered === 1 ? '' : 's'} unanswered. Unanswered questions will count as incorrect.
        </p>
        <div className="steady-dialog-actions">
          <button className="btn btn-secondary" type="button" data-dialog-cancel onClick={onClose}>Keep reviewing</button>
          <button className="btn btn-primary gap-2" type="button" onClick={onConfirm}>Submit attempt <Send className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </dialog>
  );
}

export default function ReviewClient({ paper, moduleKey, seed, questions, attemptId }: Props) {
  const router = useRouter();
  const basePath = `/practice/${paper}/${moduleKey}/${seed}`;
  const attemptRef = useRef<AttemptRecordV2 | null>(null);
  const submittingRef = useRef(false);
  const [attempt, setAttempt] = useState<AttemptRecordV2 | null>(null);
  const [attemptError, setAttemptError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const submitTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  const finishAttempt = useCallback((mode: 'manual' | 'auto') => {
    const current = attemptRef.current;
    if (!current || current.status !== 'in-progress' || submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    const finalRecord = submitAttemptRecord(current, questions, mode);
    writeAttempt(finalRecord);
    removeActiveSession();
    trackAssessmentEvent('assessment_submit', {
      paper,
      module: moduleKey,
      seed,
      score: finalRecord.score ?? calculateScore(current.answers, questions),
      total: questions.length,
      elapsed: Math.max(0, Math.floor((Date.now() - current.startedAt) / 1000)),
      auto: mode === 'auto',
    });
    router.replace(`${basePath}/result?attempt=${encodeURIComponent(current.attemptId)}`);
  }, [basePath, moduleKey, paper, questions, router, seed]);

  useEffect(() => {
    if (!attemptId) {
      setLoading(false);
      return;
    }

    const stored = readAttempt(attemptId);
    if (!stored || !matchesAttemptContext(stored, { paper, module: moduleKey, seed })) {
      setAttemptError(true);
      setLoading(false);
      return;
    }
    if (stored.status === 'submitted') {
      router.replace(`${basePath}/result?attempt=${encodeURIComponent(stored.attemptId)}`);
      return;
    }

    setAttempt(stored);
    setLoading(false);
  }, [attemptId, basePath, moduleKey, paper, router, seed]);

  useEffect(() => {
    if (!attempt || attempt.status !== 'in-progress') {
      return;
    }

    const updateTime = () => {
      const current = attemptRef.current;
      if (!current) {
        return;
      }

      const remaining = Math.max(0, Math.ceil((current.expiresAt - Date.now()) / 1_000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        finishAttempt('auto');
      }
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1_000);
    return () => window.clearInterval(timer);
  }, [attempt, finishAttempt]);

  function submit() {
    const current = attemptRef.current;
    if (!current) {
      return;
    }

    const unanswered = current.answers.length - countAnswered(current.answers);
    if (unanswered > 0) {
      setUnansweredCount(unanswered);
      setIsSubmitDialogOpen(true);
      return;
    }

    finishAttempt('manual');
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading your saved answers...</p>;
  }

  if (!attempt) {
    return (
      <div className="card border-danger">
        <p className="eyebrow mb-3">Review unavailable</p>
        <h1 className="mb-4 text-4xl">{attemptError ? 'This practice attempt does not belong to this question set.' : 'This practice attempt is no longer available.'}</h1>
        <p className="mb-6 leading-7 text-muted-foreground">{attemptError ? 'Open the matching practice link or start a new attempt from the landing page.' : 'Start a new practice set from the landing page to continue.'}</p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href={basePath}>Return to practice</Link>
          <Link className="btn btn-secondary" href="/">Back to landing</Link>
        </div>
      </div>
    );
  }

  const answered = countAnswered(attempt.answers);
  const unanswered = questions.length - answered;
  const paperName = CONFIG[paper]?.name ?? `Paper ${paper.toUpperCase()}`;
  const moduleName = CONFIG[paper]?.modules[moduleKey]?.label ?? moduleKey.toUpperCase();

  return (
    <section className="space-y-6" aria-labelledby="review-heading">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-2">{paperName} · Module {moduleName}</p>
          <h1 id="review-heading" className="mb-3 text-4xl sm:text-5xl">Review before you submit.</h1>
          <p className="m-0 text-muted-foreground">Check each answer once. You can jump back to any question.</p>
        </div>
        <div className={clsx('border-l-4 bg-muted px-4 py-3 text-sm', timeLeft <= 60 ? 'border-danger' : 'border-accent')}>
          <span className="meta-label mb-1 block">Time remaining</span>
          <span className="flex items-center gap-2 font-mono text-lg font-bold" aria-label={`${formatTime(timeLeft)} remaining`}><Clock3 className="h-4 w-4" aria-hidden="true" /> {formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="border-l-4 border-accent bg-muted px-4 py-3 text-sm">
        <strong>{answered} of {questions.length}</strong> answered
        {unanswered > 0 && <span className="ml-2 text-danger">{unanswered} still open</span>}
      </div>

      {unanswered > 0 && (
        <div className="flex items-start gap-3 border border-danger bg-card p-4" role="alert">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <p className="m-0 text-sm leading-6"><strong>{unanswered} question{unanswered === 1 ? '' : 's'} unanswered.</strong> Submitting will count them as incorrect, and you will be asked to confirm.</p>
        </div>
      )}

      <ol className="space-y-3" aria-label="Question review">
        {questions.map((question, index) => {
          const answer = attempt.answers[index];
          const isAnswered = answer !== null && answer !== undefined;
          return (
            <li key={index} className={clsx('border bg-card p-4 sm:p-5', isAnswered ? 'border-border' : 'border-danger')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm font-bold text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 className="review-question-heading mb-2">{question.prompt}</h2>
                    <p className={clsx('m-0 text-sm', isAnswered ? 'text-muted-foreground' : 'font-bold text-danger')}>
                      {isAnswered ? `Selected: ${String.fromCharCode(65 + Number(answer))}. ${question.choices[Number(answer)]}` : 'No answer selected'}
                    </p>
                  </div>
                </div>
                <span className={clsx('inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide', isAnswered ? 'text-success' : 'text-danger')}>
                  {isAnswered ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <CircleAlert className="h-4 w-4" aria-hidden="true" />}
                  {isAnswered ? 'Answered' : 'Needs answer'}
                </span>
              </div>
              <button className="btn btn-ghost mt-4 gap-2" type="button" aria-label={`Edit answer for question ${String(index + 1).padStart(2, '0')}`} onClick={() => router.push(`${basePath}?attempt=${encodeURIComponent(attempt.attemptId)}&question=${index}&return=review`)}>
                Edit answer <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
        <button className="btn btn-secondary gap-2" type="button" onClick={() => router.push(`${basePath}?attempt=${encodeURIComponent(attempt.attemptId)}`)}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to questions
        </button>
        <button
          ref={submitTriggerRef}
          className="btn btn-primary gap-2"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isSubmitDialogOpen}
          aria-controls="submit-attempt-dialog"
          onClick={submit}
        >
          Submit attempt <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <SubmitAttemptDialog
        unanswered={unansweredCount}
        open={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={() => {
          setIsSubmitDialogOpen(false);
          finishAttempt('manual');
        }}
        triggerRef={submitTriggerRef}
      />
    </section>
  );
}
