'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MODULE_CONFIG } from '@/lib/config';
import type { Question } from '@/lib/questions';
import { canPassPaperA } from '@/lib/score';
import { generateSeed } from '@/lib/seed';

interface Props {
  paper: string;
  moduleKey: string;
  seed: string;
  questions: Question[];
}

export default function ResultsClient({paper, moduleKey, seed, questions}: Props) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const key = `pdvl:${paper}-${moduleKey}:${seed}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        if (Array.isArray(obj.answers)) {
          setAnswers(obj.answers);
        }
        if (typeof obj.score === 'number') {
          setScore(obj.score);
        }
      } catch {
        // ignore
      }
    }
  }, [paper, moduleKey, seed]);

  let combined: { total: number; score: number; m1Score: number } | null = null;
  if (paper === 'a' && moduleKey === 'm2') {
    const key = `pdvl:a-m1:${seed}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        if (typeof obj.score === 'number') {
          combined = {
            total: MODULE_CONFIG.a.m1.count + MODULE_CONFIG.a.m2.count,
            score: obj.score + score,
            m1Score: obj.score,
          };
        }
      } catch {
        // ignore
      }
    }
  }

  let passMark = 0;
  if (paper === 'a') passMark = 30;
  if (paper === 'b') passMark = 22;
  if (paper === 'c') passMark = 12;
  if (!combined && passMark > questions.length) passMark = questions.length;

  let nextModule = null;
  if (paper === 'a' && moduleKey === 'm1') {
    nextModule = {
      paper: 'a',
      moduleName: 'Module 2',
      moduleKey: 'm2',
      seed,
    };
  }

  const userPassed = paper === 'a' && combined
    ? canPassPaperA(combined.m1Score, score)
    : combined
      ? combined.score >= passMark
      : score >= passMark;

  return (
    <div className="space-y-8">
      <header className="flex flex-row justify-between flex-wrap items-center gap-4 *:!m-0">
        <p>
          <span className={clsx({
            'text-green-500': userPassed,
            'text-red-500': !userPassed,
          })}>
            {userPassed ? 'Pass' : 'Fail'}
          </span>
        </p>
        <p>
          Score: {combined ? `${combined.score}/${combined.total}` : `${score}/${questions.length}`}
        </p>
        <p className="flex gap-2">
          <Link className="btn btn-secondary" href={`/assess/${paper}/${moduleKey}/${seed}`}>
            Retake
          </Link>
          <Link className="btn btn-ghost" href={`/assess/${paper}/${moduleKey}/${generateSeed()}`}>
            New seed
          </Link>
        </p>
      </header>
      {nextModule && (
        <p className="text-right">
          <Link className="btn btn-primary"
                href={`/assess/${nextModule.paper}/${nextModule.moduleKey}/${nextModule.seed}`}>
            Proceed to {nextModule.moduleName}
          </Link>
        </p>
      )}
      <ol className="space-y-2 list-inside !p-0">
        {questions.map((q, i) => {
          const user = answers[i];
          return (
            <li key={i} className="card !py-4 !px-6">
              <p className="font-semibold text-primary mt-0">{q.prompt}</p>
              <ol type="a">
                {q.choices.map((c, ci) => {
                  const id = `q${i}-${ci}`;
                  const isCorrectAnswer = ci === q.correctIndex;
                  const isUserAnswer = user !== undefined && user !== null && ci === user;
                  return (
                    <li key={id}>
                      <span className={clsx({
                        'text-green-500': isCorrectAnswer,
                        'text-red-500': !isCorrectAnswer && isUserAnswer,
                      })}>{c}</span>
                      {isUserAnswer && (
                        <span className={clsx('ml-2 text-xs whitespace-nowrap border rounded px-2 py-1', {
                          '!border-green-500 text-green-500': isCorrectAnswer,
                          '!border-red-500 text-red-500': !isCorrectAnswer,
                        })}>
                          Your Answer
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
              {(user === null) && (
                <p className="text-red-500 italic text-sm">
                  You did not answer this question.
                </p>
              )}
              {q.explanation && <p className="text-muted-foreground italic text-sm">{q.explanation}</p>}
            </li>
          );
        })}
      </ol>
      {nextModule && (
        <p className="text-right">
          <Link className="btn btn-primary"
                href={`/assess/${nextModule.paper}/${nextModule.moduleKey}/${nextModule.seed}`}>
            Proceed to {nextModule.moduleName}
          </Link>
        </p>
      )}
    </div>
  );
}

