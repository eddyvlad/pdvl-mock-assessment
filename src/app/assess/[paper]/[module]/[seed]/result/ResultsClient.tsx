"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { generateSeed } from "@/lib/seed";
import type { Question } from "@/lib/questions";
import { MODULE_CONFIG } from "@/lib/config";

interface Props {
  paper: string;
  moduleKey: string;
  seed: string;
  questions: Question[];
}

export default function ResultsClient({ paper, moduleKey, seed, questions }: Props) {
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
        if (typeof obj.score === "number") {
          setScore(obj.score);
        }
      } catch {
        // ignore
      }
    }
  }, [paper, moduleKey, seed]);

  let passMark = 0;
  if (paper === "a") passMark = 30;
  if (paper === "b") passMark = 22;
  if (paper === "c") passMark = 30;

  let combined: { total: number; score: number } | null = null;
  if (paper === "a" && moduleKey === "m2") {
    const key = `pdvl:a-m1:${seed}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        if (typeof obj.score === "number") {
          combined = { total: MODULE_CONFIG.a.m1.count + MODULE_CONFIG.a.m2.count, score: obj.score + score };
        }
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="pdvl-results">
      <h1>Result</h1>
      <p>
        Score: {combined ? `${combined.score}/${combined.total}` : `${score}/${questions.length}`} —
        {(combined ? combined.score >= passMark : score >= passMark) ? "Pass" : "Fail"}
      </p>
      {paper === "a" && moduleKey === "m1" && (
        <p>
          <Link href={`/assess/a/m2/${seed}`}>Proceed to Module 2</Link>
        </p>
      )}
      <p>
        <Link href={`/assess/${paper}/${moduleKey}/${seed}`}>Retake</Link> |{' '}
        <Link href={`/assess/${paper}/${moduleKey}/${generateSeed()}`}>New seed</Link>
      </p>
      <ol>
        {questions.map((q, i) => {
          const user = answers[i];
          return (
            <li key={i} className="pdvl-review">
              <p>{q.prompt}</p>
              <p>
                Your answer: {user !== undefined && user !== null ? q.choices[user] : "—"} | Correct: {q.choices[q.correctIndex]}
              </p>
              {q.explanation && <p>{q.explanation}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

