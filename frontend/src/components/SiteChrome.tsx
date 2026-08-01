import Link from "next/link";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#story", label: "Pipeline" },
  { href: "/#integration", label: "Integrate" },
  { href: "/docs", label: "API" },
  { href: "/console", label: "Console" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="fs-container flex items-center justify-between py-5">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-mist md:text-2xl">
          FitandSleek <span className="text-mint">Vector</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-mist/70 transition hover:text-mint">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/register" className="fs-btn text-xs uppercase tracking-[0.14em]">
          Get API Key
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-mist/10 py-10">
      <div className="fs-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg text-mist">
          FitandSleek <span className="text-mint">Vector</span>
        </p>
        <p className="text-sm text-mist/45">Custom vector database · Qdrant-compatible API · Built for image search</p>
      </div>
    </footer>
  );
}
