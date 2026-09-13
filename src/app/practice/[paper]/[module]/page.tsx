import { notFound, redirect } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { generateSeed } from '@/lib/seed';

interface Params {
  paper: string;
  module: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { paper, module } = await params;
  if (!CONFIG[paper]?.modules?.[module]) {
    notFound();
  }

  redirect(`/practice/${paper}/${module}/${generateSeed()}`);
}
