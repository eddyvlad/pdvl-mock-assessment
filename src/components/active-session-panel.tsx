'use client';

import Link from 'next/link';
import { ArrowRight, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLatestResumableAttempt, removeActiveSession, type AttemptRecordV2 } from '@/lib/attempt-storage';
import { CONFIG } from '@/lib/config';

function readLatestSession() {
  return getLatestResumableAttempt();
}

export default function ActiveSessionPanel() {
  const [attempt, setAttempt] = useState<AttemptRecordV2 | null>(null);
  const [minutesRemaining, setMinutesRemaining] = useState(0);

  useEffect(() => {
    const refresh = () => setAttempt(readLatestSession());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('pdvl-attempt-change', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('pdvl-attempt-change', refresh);
    };
  }, []);

  useEffect(() => {
    if (!attempt) {
      return;
    }

    const refreshTime = () => setMinutesRemaining(Math.max(1, Math.ceil((attempt.expiresAt - Date.now()) / 60_000)));
    refreshTime();
    const timer = window.setInterval(refreshTime, 30_000);

    return () => window.clearInterval(timer);
  }, [attempt]);

  if (!attempt) {
    return null;
  }

  const paper = CONFIG[attempt.paper];
  const moduleConfig = paper?.modules[attempt.module];
  const answered = attempt.answers.filter((answer) => answer !== null).length;
  const label = moduleConfig ? `Module ${moduleConfig.label}` : attempt.module.toUpperCase();

  return (
    <aside className="mb-12 border-l-4 border-accent bg-secondary px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6" aria-label="Continue last session">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-primary p-2 text-primary-foreground" aria-hidden="true">
          <RotateCcw className="h-4 w-4" />
        </span>
        <div>
          <p className="eyebrow mb-1">Continue last session</p>
          <h2 className="mb-1 text-2xl">{paper?.name ?? `Paper ${attempt.paper.toUpperCase()}`} · {label}</h2>
          <p className="m-0 text-sm text-muted-foreground">
            {answered} of {attempt.answers.length} answered · about {minutesRemaining} min left
          </p>
        </div>
      </div>
      <Link
        className="btn btn-primary mt-5 w-full gap-2 sm:mt-0 sm:w-auto"
        href={`/practice/${attempt.paper}/${attempt.module}/${attempt.seed}?attempt=${encodeURIComponent(attempt.attemptId)}`}
      >
        Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <button
        className="btn btn-ghost mt-2 w-full gap-2 sm:mt-0 sm:w-auto"
        type="button"
        onClick={() => {
          if (window.confirm('Discard this active session and choose a new paper?')) {
            removeActiveSession();
            setAttempt(null);
          }
        }}
      >
        New paper <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
