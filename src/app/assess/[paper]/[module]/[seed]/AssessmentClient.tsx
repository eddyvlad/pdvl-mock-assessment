'use client';

import { intervalToDuration } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Question } from '@/lib/questions';

interface Props {
  paper: string;
  moduleKey: string;
  seed: string;
  questions: Question[];
  minutes: number;
}

export default function AssessmentClient({paper, moduleKey, seed, questions, minutes}: Props) {
  const router = useRouter();
  const total = questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(Array(total).fill(null));
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [grace, setGrace] = useState(3);

  useEffect(() => {
    const key = `pdvl:${paper}-${moduleKey}:${seed}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        if (obj.end) {
          const freshAnswers = Array(total).fill(null);
          setAnswers(freshAnswers);
          const fresh = {start: Date.now(), answers: freshAnswers};
          localStorage.setItem(key, JSON.stringify(fresh));
          setTimeLeft(minutes * 60);
        } else {
          if (Array.isArray(obj.answers)) {
            setAnswers(obj.answers);
          }
          if (typeof obj.start === 'number') {
            const elapsed = Math.floor((Date.now() - obj.start) / 1000);
            const remaining = minutes * 60 - elapsed;
            setTimeLeft(remaining > 0 ? remaining : 0);
            if (remaining <= 0) {
              handleSubmit();
            }
          }
        }
      } catch {
        // ignore
      }
    } else {
      localStorage.setItem(key, JSON.stringify({start: Date.now(), answers}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paper === 'a' && moduleKey === 'm2') {
      const prev = localStorage.getItem(`pdvl:a-m1:${seed}`);
      if (!prev) {
        router.replace(`/assess/a/m1/${seed}`);
      }
    }
  }, [paper, moduleKey, seed, router]);

  useEffect(() => {
    if (grace > 0) {
      const t = setTimeout(() => setGrace((g) => g - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft > 0) {
      const i = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(i);
    }
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grace, timeLeft]);

  function updateAnswer(qIndex: number, choiceIndex: number) {
    const next = [...answers];
    next[qIndex] = choiceIndex;
    setAnswers(next);
    const key = `pdvl:${paper}-${moduleKey}:${seed}`;
    const stored = localStorage.getItem(key);
    const obj = stored ? JSON.parse(stored) : {start: Date.now()};
    obj.answers = next;
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function handleKey(e: KeyboardEvent) {
    const map: Record<string, number> = {1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3};
    const choice = map[e.key.toLowerCase()];
    if (choice === undefined) return;
    const activeFieldset = (document.activeElement?.closest('fieldset[data-q]')) as HTMLElement | null;
    const qIndex = activeFieldset ? Number(activeFieldset.dataset.q) : 0;
    if (questions[qIndex]?.choices[choice]) {
      updateAnswer(qIndex, choice);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  function handleSubmit() {
    const key = `pdvl:${paper}-${moduleKey}:${seed}`;
    const stored = localStorage.getItem(key);
    const obj = stored ? JSON.parse(stored) : {start: Date.now()};
    obj.end = Date.now();
    obj.answers = answers;
    obj.score = answers.reduce<number>(
      (sum, a, i) => (a !== null && a === questions[i].correctIndex ? sum + 1 : sum),
      0,
    );
    localStorage.setItem(key, JSON.stringify(obj));
    router.push(`/assess/${paper}/${moduleKey}/${seed}/result`);
  }

  const answered = answers.filter((a) => a !== null).length;
  function formatTime(seconds: number) {
    const {minutes = 0, seconds: secs = 0} = intervalToDuration({start: 0, end: seconds * 1000});
    return `${String(minutes).padStart(2, '0')} mins ${String(secs).padStart(2, '0')} seconds`;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Time: {grace > 0 ? `Starts in ${grace}` : formatTime(timeLeft)}</span>
        <span>
          {answered}/{total}
        </span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answers.includes(null)) {
            if (!window.confirm('You have unanswered questions. Submit?')) return;
          }
          handleSubmit();
        }}
      >
        {questions.map((q, qi) => (
          <fieldset key={qi} data-q={qi} className="card !py-4 !px-6 mb-4 shadow">
            <legend className="font-bold mb-2">Q{qi + 1}</legend>
            <p className="font-bold text-primary mb-2 mt-0">{q.prompt}</p>
            <ol type="a" className="!pl-4">
              {q.choices.map((c, ci) => {
                const id = `q${qi}-${ci}`;
                return (
                  <li key={id} className="mb-4 group">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={id}
                        name={`q${qi}`}
                        value={ci}
                        checked={answers[qi] === ci}
                        onChange={() => updateAnswer(qi, ci)}
                      />
                      <label htmlFor={id}
                             className="group-has-[input:checked]:bg-blue-muted group-has-[input:focus]:bg-blue-muted/50 transition-colors duration-500 px-2 py-1">{c}</label>
                    </div>
                  </li>
                );
              })}
            </ol>
          </fieldset>
        ))}
        <p className="text-right">
          <button type="submit" className="btn btn-primary">Submit</button>
        </p>
      </form>
    </div>
  );
}

