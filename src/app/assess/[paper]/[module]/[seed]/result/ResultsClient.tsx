'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generateSeed } from '@/lib/seed';
import type { Question } from '@/lib/questions';
import { MODULE_CONFIG } from '@/lib/config';
import clsx from 'clsx';

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

  let combined: { total: number; score: number } | null = null;
  if (paper === 'a' && moduleKey === 'm2') {
    const key = `pdvl:a-m1:${seed}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        if (typeof obj.score === 'number') {
          combined = {total: MODULE_CONFIG.a.m1.count + MODULE_CONFIG.a.m2.count, score: obj.score + score};
        }
      } catch {
        // ignore
      }
    }
  }

  let passMark = 0;
  if (paper === 'a') passMark = 30;
  if (paper === 'b') passMark = 22;
  if (paper === 'c') passMark = 30;
  if (!combined && passMark > questions.length) passMark = questions.length;

  return (
    <div className="pdvl-results space-y-4">
      <h1>Result</h1>
      <p>
        Score: {combined ? `${combined.score}/${combined.total}` : `${score}/${questions.length}`} —
        {(combined ? combined.score >= passMark : score >= passMark) ? 'Pass' : 'Fail'}
      </p>
      {paper === 'a' && moduleKey === 'm1' && (
        <p>
          <Link className="btn btn-primary" href={`/assess/a/m2/${seed}`}>
            Proceed to Module 2
          </Link>
        </p>
      )}
      <p className="flex gap-2 flex-wrap">
        <Link className="btn btn-secondary" href={`/assess/${paper}/${moduleKey}/${seed}`}>
          Retake
        </Link>
        <Link className="btn btn-ghost" href={`/assess/${paper}/${moduleKey}/${generateSeed()}`}>
          New seed
        </Link>
      </p>
      <ol className="space-y-2">
        {questions.map((q, i) => {
          const user = answers[i];
          const isCorrect = user !== undefined && user !== null && user === q.correctIndex;
          const userAnswer = q.choices[user];
          return (
            <li key={i} className="card !py-4 !px-6 shadow-2xl">
              <p className="font-semibold text-primary mt-0">{q.prompt}</p>
              <ol type="a">
                {q.choices.map((c, ci) => {
                  const id = `q${i}-${ci}`;
                  const isCorrect = ci === q.correctIndex;
                  return (
                    <li key={id} className={clsx({'text-green-500': isCorrect})}>
                      {c}
                    </li>
                  );
                })}
              </ol>
              <p className={clsx({
                'text-green-500': isCorrect,
                'text-red-500': !isCorrect,
              })}>
                <strong>Your answer:</strong> {
                user === null ? 'Not answered' : userAnswer
              }
              </p>
              {q.explanation && <p className="text-muted-foreground italic text-sm">{q.explanation}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

