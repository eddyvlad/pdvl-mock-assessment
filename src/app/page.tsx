import Link from 'next/link';
import { generateSeed } from '@/lib/seed';
import { ChevronsRightIcon } from 'lucide-react';

export default function Home() {
  const seedA = generateSeed();
  const seedB = generateSeed();
  const seedC = generateSeed();
  return (
    <main className="p-8 prose dark:prose-invert mx-auto max-w-prose">
      <h1 className="mb-6">PDVL Mock Assessments</h1>
      <p>Practice with timed mock papers, module-based MCQs, and clear explanations aligned to the PDVL syllabus (Modules 1–4B). Built for private-hire drivers. References to taxis are for comparison only.</p>
      <ul className="space-y-6 list-none not-prose">
        <li className="text-left card py-4 px-6 shadow-lg">
          <h2 className="font-bold">Paper A</h2>
          <p className="text-sm text-muted-foreground mb-4">Paper A is a 2-module paper that covers the following
            topics:</p>

          <h3 className="!mb-0">Module 1</h3>
          <p className="mb-4">Apply On-the-Road Safety Practices</p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Questions:</strong> 30<br/>
            <strong>Duration:</strong> 35 mins
          </p>
          <hr className="my-4"/>
          <h3 className="!mb-0">Module 2</h3>
          <p className="mb-4">Apply Essential Engagement and Handling Techniques with Passengers</p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Questions:</strong> 5<br/>
            <strong>Duration:</strong> 10 mins
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            At least <strong>30 questions</strong> from <strong>both modules</strong> must be correct to pass.
          </p>

          <p className="text-right">
            <Link className="btn btn-primary w-content ml-auto" href={`/assess/a/m1/${seedA}`}>
              Proceed to Paper A <ChevronsRightIcon className="w-4 h-4 inline-block ml-2 vertical-align-middle"/>
            </Link>
          </p>
        </li>
        <li className="text-left card py-4 px-6 shadow-lg">
          <h2 className="font-bold">Paper B</h2>
          <h3 className="!mb-0">Module 3B</h3>
          <p className="mb-4">Comply With Rules And Regulations For Private Hire Car Driver’s Vocational Licence Holders</p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Questions:</strong> 25<br/>
            <strong>Duration:</strong> 30 mins
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            At least <strong>22 questions</strong> must be correct to pass.
          </p>
          <p className="text-right">
            <Link className="btn btn-primary w-content" href={`/assess/b/3b/${seedB}`}>
              Proceed to Paper B <ChevronsRightIcon className="w-4 h-4 inline-block ml-2 vertical-align-middle"/>
            </Link>
          </p>
        </li>
        <li className="text-left card py-4 px-6 shadow-lg">
          <h2 className="font-bold">Paper C</h2>
          <h3 className="!mb-0">Module 4B</h3>
          <p className="mb-4">Apply Principles Of Route Planning Using Digital Navigational Tools</p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Questions:</strong> 15<br/>
            <strong>Duration:</strong> 30 mins
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            At least <strong>12 questions</strong> must be correct to pass.
          </p>
          <p className="text-right">
            <Link className="btn btn-primary w-content" href={`/assess/c/4b/${seedC}`}>
              Proceed to Paper C <ChevronsRightIcon className="w-4 h-4 inline-block ml-2 vertical-align-middle"/>
            </Link>
          </p>
        </li>
      </ul>
    </main>
  );
}

