import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-[15px] font-extrabold tracking-tight text-mist">
          FITANDSLEEK <span className="text-mint">VECTOR</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] font-medium text-mist/60 transition hover:text-mint">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden text-[13px] font-medium text-mist/60 transition hover:text-mist sm:inline">
            Sign in
          </Link>
          <Link href="/register" className="fs-btn !px-3.5 !py-2 text-[12px]">
            Get API Key
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-10">
      <div className="fs-container grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-sm font-extrabold tracking-tight text-mist">
            FITANDSLEEK <span className="text-mint">VECTOR</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist/45">
            Custom vector database for Fit &amp; Sleek image similarity. Qdrant-compatible. Team-owned.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mist/35">Product</p>
          <ul className="mt-3 space-y-1.5 text-sm text-mist/60">
            <li>
              <Link href="/console" className="hover:text-mint">
                Console
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-mint">
                API docs
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-mint">
                Get API key
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mist/35">Brand</p>
          <ul className="mt-3 space-y-1.5 text-sm text-mist/60">
            <li>
              <Link href="https://fitandsleek-portfolio.vercel.app/en" className="hover:text-mint" target="_blank">
                Fit &amp; Sleek portfolio
              </Link>
            </li>
            <li>Vercel · Hugging Face · Neon</li>
          </ul>
        </div>
      </div>
      <div className="fs-container mt-8 flex flex-col gap-1 border-t border-line pt-5 text-xs text-mist/35 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} FitandSleek Vector</span>
        <span>Year 4 · Original implementation</span>
      </div>
    </footer>
  );
}
