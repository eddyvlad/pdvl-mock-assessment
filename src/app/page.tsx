import Link from "next/link";
import { generateSeed } from "@/lib/seed";

export default function Home() {
  const seedA = generateSeed();
  const seedB = generateSeed();
  const seedC = generateSeed();
  const seedA2 = generateSeed();
  return (
    <main className="pdvl-landing">
      <h1>PDVL Mock Assessments</h1>
      <ul>
        <li>
          <Link href={`/assess/a/m1/${seedA}`}>Paper A – Module 1</Link>
        </li>
        <li>
          <Link href={`/assess/a/m2/${seedA2}`}>Paper A – Module 2</Link>
        </li>
        <li>
          <Link href={`/assess/b/3b/${seedB}`}>Paper B – Module 3B</Link>
        </li>
        <li>
          <Link href={`/assess/c/4b/${seedC}`}>Paper C – Module 4B</Link>
        </li>
      </ul>
    </main>
  );
}

