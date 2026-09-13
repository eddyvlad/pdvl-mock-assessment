import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="navbar flex items-center gap-3 px-1">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Steady Signal home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Steady Signal</span>
        </Link>
        <span className="hidden text-sm text-muted-foreground sm:inline">PDVL practice tests</span>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/#papers" className="nav-link hidden sm:inline">Papers</Link>
          <span className="hidden text-muted-foreground md:inline">
            by <Link href="https://eddyhidayat.com" target="_blank" rel="noreferrer" className="font-bold">eddyhiday.com</Link>
          </span>
        </div>
      </div>
    </nav>
  );
}
