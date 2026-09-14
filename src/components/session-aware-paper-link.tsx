'use client';

import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLatestResumableAttempt, removeAttempt, type AttemptRecordV2 } from '@/lib/attempt-storage';

interface Props {
  href: string;
  label: string;
  paperLabel: string;
  dialogId: string;
}

export default function SessionAwarePaperLink({ href, label, paperLabel, dialogId }: Props) {
  const router = useRouter();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wasOpenRef = useRef(false);
  const [activeAttempt, setActiveAttempt] = useState<AttemptRecordV2 | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isDialogOpen && !dialog.open) {
      dialog.showModal();
      wasOpenRef.current = true;
      dialog.querySelector<HTMLButtonElement>('[data-dialog-cancel]')?.focus();
    } else if (!isDialogOpen && dialog.open) {
      dialog.close();
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
    }
  }, [isDialogOpen]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActiveAttempt(null);
  };

  return (
    <>
      <Link
        ref={triggerRef}
        className="btn btn-primary w-full gap-2"
        href={href}
        onClick={(event) => {
          const resumable = getLatestResumableAttempt();
          if (!resumable) {
            return;
          }

          event.preventDefault();
          setActiveAttempt(resumable);
          setIsDialogOpen(true);
        }}
      >
        {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className="steady-dialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeDialog();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
      >
        <div className="steady-dialog-panel">
          <p className="eyebrow mb-3">Before you start a new paper</p>
          <h2 id={`${dialogId}-title`} className="mb-3 text-3xl">Discard this session?</h2>
          <p id={`${dialogId}-description`} className="m-0 leading-7 text-muted-foreground">
            Your saved answers for {paperLabel} will be deleted from this browser. You will not be able to continue this attempt.
          </p>
          <div className="steady-dialog-actions">
            <button className="btn btn-secondary" type="button" data-dialog-cancel onClick={closeDialog}>Keep session</button>
            <button
              className="btn btn-danger gap-2"
              type="button"
              onClick={() => {
                if (activeAttempt) {
                  removeAttempt(activeAttempt.attemptId);
                }
                closeDialog();
                router.push(href);
              }}
            >
              Discard session <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
