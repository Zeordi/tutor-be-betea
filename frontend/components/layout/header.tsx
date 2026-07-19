import Link from 'next/link';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur">
      <Link href="/" className="font-display text-xl text-brand-900">
        BeTea
      </Link>
      <nav className="flex gap-3 text-sm">
        <Link href="/parent/search" className="text-slate-600 hover:text-brand-700">
          Search
        </Link>
        <Link href="/parent/messages" className="text-slate-600 hover:text-brand-700">
          Messages
        </Link>
      </nav>
    </header>
  );
}
