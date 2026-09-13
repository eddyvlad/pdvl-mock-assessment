'use client';

import Link from 'next/link';
import { ArrowRight, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getLatestResumableAttempt, removeAttempt, type AttemptRecordV2 } from '@/lib/attempt-storage';
import { CONFIG } from '@/lib/config';

function readLatestSession() {
  return getLatestResumableAttempt();
}

function DiscardSessionDialog({
  label,
  open,
  onClose,
  onConfirm,
  triggerRef,
}: {
  label: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
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
      id="discard-session-dialog"
      className="steady-dialog"
      aria-labelledby="discard-session-title"
      aria-describedby="discard-session-description"
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
        <p className="eyebrow mb-3">Before you start a new paper</p>
        <h2 id="discard-session-title" className="mb-3 text-3xl">Discard this session?</h2>
        <p id="discard-session-description" className="m-0 leading-7 text-muted-foreground">
          Your saved answers for {label} will be deleted from this browser. You will not be able to continue this attempt.
        </p>
        <div className="steady-dialog-actions">
          <button className="btn btn-secondary" type="button" data-dialog-cancel onClick={onClose}>Keep session</button>
          <button className="btn btn-danger gap-2" type="button" onClick={onConfirm}>Discard session <X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </dialog>
  );
}

export default function ActiveSessionPanel() {
  const [attempt, setAttempt] = useState<AttemptRecordV2 | null>(null);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const discardTriggerRef = useRef<HTMLButtonElement>(null);

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
  const sessionLabel = `${paper?.name ?? `Paper ${attempt.paper.toUpperCase()}`} · ${label}`;

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
        ref={discardTriggerRef}
        className="btn btn-ghost mt-2 w-full gap-2 sm:mt-0 sm:w-auto"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isDiscardDialogOpen}
        aria-controls="discard-session-dialog"
        onClick={() => setIsDiscardDialogOpen(true)}
      >
        New paper <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <DiscardSessionDialog
        label={sessionLabel}
        open={isDiscardDialogOpen}
        onClose={() => setIsDiscardDialogOpen(false)}
        onConfirm={() => {
          removeAttempt(attempt.attemptId);
          setIsDiscardDialogOpen(false);
          setAttempt(null);
        }}
        triggerRef={discardTriggerRef}
      />
    </aside>
  );
}
