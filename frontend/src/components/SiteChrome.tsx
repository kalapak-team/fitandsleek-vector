import Link from "next/link";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#api", label: "API" },
  { href: "/docs", label: "Docs" },
  { href: "/console", label: "Console" },
  { href: "/#news", label: "News" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          FitandSleek<span className="text-white/40">·</span>Vector
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] text-white/55 transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-[13px] text-white/55 transition hover:text-white sm:inline">
            Sign in
          </Link>
          <Link href="/register" className="fs-btn !px-4 !py-2 text-[13px]">
            Get API Key
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-14">
      <div className="fs-container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">FitandSleek Vector</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/40">
            Custom vector database for image similarity search. Qdrant-compatible. Team-owned.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-white/55">
            <li>
              <Link href="/console" className="hover:text-white">
                Console
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-white">
                API docs
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Get API key
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">Deploy</p>
          <ul className="mt-4 space-y-2 text-sm text-white/55">
            <li>Vercel · Frontend</li>
            <li>Hugging Face · API</li>
            <li>Neon · PostgreSQL</li>
          </ul>
        </div>
      </div>
      <div className="fs-container mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} FitandSleek Vector</span>
        <span>Built for Year 4 · Original implementation</span>
      </div>
    </footer>
  );
}
