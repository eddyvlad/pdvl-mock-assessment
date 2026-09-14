import Link from "next/link";

export default function PracticeLoadError({
  retryHref,
}: {
  retryHref: string;
}) {
  return (
    <main className="page-shell">
      <div className="card mx-auto max-w-xl border-danger">
        <p className="eyebrow mb-3">Practice unavailable</p>
        <h1 className="mb-4 text-4xl">The question set could not be loaded.</h1>
        <p className="mb-6 leading-7 text-muted-foreground">
          Check your connection and try again. Your saved practice session has
          not been changed.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href={retryHref}>
            Retry
          </Link>
          <Link className="btn btn-secondary" href="/">
            Back to landing
          </Link>
        </div>
      </div>
    </main>
  );
}
