import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="navbar bg-accent flex items-center gap-2 p-2">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Logo" className="h-8 w-8"/>
      </Link>
      <div className="text-foreground font-bold text-xl ml-2">
        PDVL Mock Assessments
      </div>
      <div className="ml-auto text-sm">
        by <Link href="https://eddyhidayat.com" target="_blank" className="font-bold underline">eddyhidayat.com</Link>
      </div>
    </nav>
  );
}
