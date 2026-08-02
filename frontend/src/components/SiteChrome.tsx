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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-mist">
          FitandSleek<span className="text-mist/40">·</span>Vector
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] text-mist/55 transition hover:text-mist">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden text-[13px] text-mist/55 transition hover:text-mist sm:inline">
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
    <footer className="border-t border-line py-14">
      <div className="fs-container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-tight text-mist">FitandSleek Vector</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist/40">
            Custom vector database for image similarity search. Qdrant-compatible. Team-owned.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-mist/30">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-mist/55">
            <li>
              <Link href="/console" className="hover:text-mist">
                Console
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-mist">
                API docs
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-mist">
                Get API key
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-mist/30">Deploy</p>
          <ul className="mt-4 space-y-2 text-sm text-mist/55">
            <li>Vercel · Frontend</li>
            <li>Hugging Face · API</li>
            <li>Neon · PostgreSQL</li>
          </ul>
        </div>
      </div>
      <div className="fs-container mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-mist/30 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} FitandSleek Vector</span>
        <span>Built for Year 4 · Original implementation</span>
      </div>
    </footer>
  );
}
