import { BookOpen, CheckCircle2, Clock3, Layers3 } from "lucide-react";
import type { Metadata } from "next";
import ActiveSessionPanel from "@/components/active-session-panel";
import SessionAwarePaperLink from "@/components/session-aware-paper-link";
import { CONFIG } from "@/lib/config";
import { generateSeed } from "@/lib/seed";
import { homepageDescription, homepageTitle } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: "/",
  },
};

const PAPER_DETAILS = {
  a: {
    letter: "A",
    eyebrow: "Two-part paper",
    title: "Safety and passenger care",
    description:
      "Build a complete Paper A attempt across on-the-road safety and essential passenger handling.",
    action: "Start Paper A",
  },
  b: {
    letter: "B",
    eyebrow: "Rules and regulations",
    title: "PDVL responsibilities",
    description:
      "Practise the rules and regulations that apply to private hire car driver vocational licence holders.",
    action: "Start Paper B",
  },
  c: {
    letter: "C",
    eyebrow: "Route planning",
    title: "Digital navigation",
    description:
      "Test your understanding of route planning principles using digital navigational tools.",
    action: "Start Paper C",
  },
} as const;

const MODULE_DESCRIPTIONS = {
  "1": "Apply on-the-road safety practices",
  "2": "Apply essential engagement and handling techniques with passengers",
  "3B": "Comply with rules and regulations for PDVL holders",
  "4B": "Apply principles of route planning using digital navigational tools",
} as const;

type PaperKey = keyof typeof PAPER_DETAILS;

function PaperCard({ paperKey, seed }: { paperKey: PaperKey; seed: string }) {
  const paper = CONFIG[paperKey];
  const details = PAPER_DETAILS[paperKey];
  const modules = Object.entries(paper.modules);
  const firstModule = modules[0];

  if (!firstModule) {
    return null;
  }

  return (
    <article className="card flex h-full flex-col gap-6 p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span
          className="font-serif text-7xl leading-none text-primary"
          aria-hidden="true"
        >
          {details.letter}
        </span>
        <span className="eyebrow pt-2 text-right">{details.eyebrow}</span>
      </div>

      <div>
        <h2 className="mb-3 text-3xl">{paper.name}</h2>
        <h3 className="mb-2 font-sans text-xl font-bold tracking-normal">
          {details.title}
        </h3>
        <p className="m-0 text-sm leading-6 text-muted-foreground">
          {details.description}
        </p>
      </div>

      <div className="flex-1 space-y-3 border-y border-border py-4">
        {modules.map(([moduleKey, module]) => (
          <div key={moduleKey} className="flex items-start gap-3">
            <Layers3
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <div>
              <p className="m-0 text-sm font-bold">Module {module.label}</p>
              <p className="m-0 text-sm leading-5 text-muted-foreground">
                {
                  MODULE_DESCRIPTIONS[
                    module.label as keyof typeof MODULE_DESCRIPTIONS
                  ]
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
          <span>
            <strong>
              {modules.reduce((sum, [, module]) => sum + module.count, 0)}
            </strong>{" "}
            questions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
          <span>
            <strong>
              {modules.reduce((sum, [, module]) => sum + module.minutes, 0)}
            </strong>{" "}
            minutes
          </span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
          <span>
            Paper pass mark:{" "}
            <strong className="text-foreground">
              {paper.passMark} correct
            </strong>
          </span>
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-5">
        <SessionAwarePaperLink
          dialogId={`replace-active-session-dialog-${paperKey}`}
          href={`/practice/${paperKey}/${firstModule[0]}/${seed}`}
          label={details.action}
          paperLabel={paper.name}
        />
      </div>
    </article>
  );
}

export default function Home() {
  const seeds = {
    a: generateSeed(),
    b: generateSeed(),
    c: generateSeed(),
  };

  return (
    <main className="page-shell landing-page">
      <header className="mb-14 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Singapore PDVL · practice test</p>
          <h1 className="mb-6 max-w-2xl">
            PDVL mock tests for steady exam preparation.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Prepare for Singapore&apos;s Private Hire Car Driver&apos;s
            Vocational Licence (PDVL) with timed mock tests for Papers A, B and
            C. Practise one question at a time, review your answers, and learn
            from explanations after submitting.
          </p>
        </div>
        <div className="border-l-4 border-accent bg-muted p-5 text-sm leading-6">
          <p className="eyebrow mb-2">How it works</p>
          <p className="m-0">
            Choose a paper, work through the guided questions, then review the
            complete attempt before submitting.
          </p>
          <p className="mt-3 mb-0 font-bold text-foreground">
            Keep your thinking steady under pressure.
          </p>
        </div>
      </header>

      <ActiveSessionPanel />

      <section id="papers" aria-labelledby="papers-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Practice papers</p>
            <h2 id="papers-heading" className="mb-0">
              Choose your PDVL mock exam
            </h2>
          </div>
          <p className="m-0 max-w-sm text-sm leading-6 text-muted-foreground">
            Every link creates a reproducible question set. You can share it or
            retake the same set later.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PaperCard paperKey="a" seed={seeds.a} />
          <PaperCard paperKey="b" seed={seeds.b} />
          <PaperCard paperKey="c" seed={seeds.c} />
        </div>
      </section>
    </main>
  );
}
