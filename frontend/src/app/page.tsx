"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { StarField } from "@/components/motion/StarField";
import { StackingCards } from "@/components/motion/StackingCards";
import { StickyScrollStory } from "@/components/motion/StickyScroll";
import { HorizontalScrollGallery } from "@/components/motion/HorizontalScroll";
import { ScrollText } from "@/components/motion/ScrollText";
import { InfinityBrand } from "@/components/motion/InfinityBrand";
import { Marquee } from "@/components/motion/Marquee";
import { SpotlightGrid } from "@/components/motion/SpotlightCards";
import { ArchitectureBeam } from "@/components/motion/AnimatedBeam";

const stackCards = [
  {
    title: "Collections",
    tag: "Core",
    body: "Create distance-aware collections with Cosine, Euclid, or Dot — the same mental model as Qdrant.",
    accent: "color-mix(in srgb, var(--mint) 22%, transparent)",
  },
  {
    title: "Image search",
    tag: "Retail",
    body: "Upload a product photo. FitandSleek Vector embeds and ranks nearest catalog matches in milliseconds.",
    accent: "color-mix(in srgb, var(--ember) 18%, transparent)",
  },
  {
    title: "API keys",
    tag: "Auth",
    body: "Register like Qdrant Cloud. Receive an API key once. Protect search and admin routes by role.",
    accent: "color-mix(in srgb, var(--mint) 16%, transparent)",
  },
  {
    title: "Owned stack",
    tag: "Deploy",
    body: "Next.js · FastAPI · Neon PostgreSQL. Deployed on Vercel + Hugging Face — built by your team.",
    accent: "color-mix(in srgb, var(--ember) 14%, transparent)",
  },
];

const modalities = [
  { title: "Image vectors", body: "Embed product photos into dense vectors ready for similarity ranking." },
  { title: "Text query", body: "Search the same index with text prompts when images are not available." },
  { title: "Filters", body: "must / should / must_not with match and range — precise retail retrieval." },
  { title: "Recommend", body: "Positive and negative examples steer results without hand-crafted vectors." },
  { title: "Snapshots", body: "Checkpoint collections for demos, backups, and classroom milestones." },
  { title: "Scroll & count", body: "Page through points and count with filters — console and API ready." },
];

const news = [
  {
    title: "Built for Fit & Sleek catalog search",
    date: "Aug 2026",
    body: "Same brand energy as fitandsleek-portfolio — denser layout, mint accents, retail-ready vector search.",
  },
  {
    title: "API on Hugging Face Spaces",
    date: "Aug 2026",
    body: "Docker Space on port 7860 with Neon Postgres and Qdrant-shaped endpoints.",
  },
  {
    title: "API keys like Qdrant Cloud",
    date: "Aug 2026",
    body: "Register once, copy your key, authenticate with api-key headers across search routes.",
  },
  {
    title: "Light + dark mode",
    date: "Aug 2026",
    body: "Toggle themes anywhere — landing, console, login — preference saved on device.",
  },
];

const quotes = [
  { q: "Own the vector engine — not just a hosted black box.", a: "FitandSleek Team", initial: "F" },
  { q: "Qdrant-compatible API. Original FitandSleek implementation.", a: "Year 4 Project", initial: "Y" },
  { q: "Image in. Similar products out. Built for athletic retail.", a: "Product Search", initial: "P" },
];

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="overflow-x-hidden bg-ink text-mist">
        <div className="relative z-50 border-b border-line bg-ink/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[12px] text-mist/65 md:px-6">
            <span className="rounded-md bg-mint/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint">
              New
            </span>
            <span>
              Meet FitandSleek Vector · self-owned image search for{" "}
              <Link href="https://fitandsleek-portfolio.vercel.app/en" className="font-medium text-mint underline-offset-2 hover:underline" target="_blank">
                Fit &amp; Sleek
              </Link>
            </span>
          </div>
        </div>

        {/* Hero — denser, portfolio-style */}
        <section className="relative overflow-hidden">
          <StarField className="absolute inset-0 h-full w-full opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--mint)_14%,transparent),transparent_50%)]" />
          <SiteHeader />

          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-24 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-10 md:px-6 md:pb-14 md:pt-28">
            <div>
              <p className="animate-rise text-[12px] font-semibold uppercase tracking-[0.18em] text-mint">Vector database</p>
              <h1 className="animate-rise-delay mt-3 text-[clamp(2.6rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-mist">
                FitandSleek
                <br />
                <span className="text-mint">Vector</span>
              </h1>
              <p className="animate-rise-delay-2 mt-4 max-w-lg text-lg font-semibold leading-snug tracking-tight text-mist/85 md:text-xl">
                Image search, effortless.
              </p>
              <p className="animate-rise-delay-2 mt-3 max-w-md text-sm leading-relaxed text-mist/55 md:text-[15px]">
                Qdrant-shaped API for Fit &amp; Sleek product similarity — collections, filters, recommend. Owned by your
                team.
              </p>
              <div className="animate-rise-delay-2 mt-6 flex flex-wrap gap-2.5">
                <Link href="/register" className="fs-btn">
                  Get API Key
                </Link>
                <Link href="/console" className="fs-btn-ghost">
                  Open Console
                </Link>
                <Link href="https://fitandsleek-portfolio.vercel.app/en" className="fs-btn-ghost" target="_blank">
                  View portfolio
                </Link>
              </div>
            </div>
            <div className="animate-rise-delay grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              {[
                { t: "Cosine · Euclid · Dot", d: "Distance modes for retail embeddings" },
                { t: "api-key auth", d: "Qdrant Cloud–style onboarding" },
                { t: "Vercel + HF + Neon", d: "Live production graph" },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-line bg-graphite/80 p-4 backdrop-blur">
                  <p className="text-sm font-bold text-mist">{c.t}</p>
                  <p className="mt-1 text-xs text-mist/50">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <InfinityBrand />

        <ScrollText className="border-b border-line py-5 text-mist/10">
          {"FitandSleek Vector · Image Search · Fit & Sleek retail · "}
        </ScrollText>

        <section id="api" className="border-b border-line py-12 md:py-14">
          <div className="fs-container">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-mint">API</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-mist md:text-4xl">
                  One API. Every search modality.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-mist/50">Images, text, filters, recommend, scroll — start in seconds.</p>
            </div>
            <div className="mt-8">
              <SpotlightGrid items={modalities} />
            </div>
          </div>
        </section>

        <section id="product" className="relative bg-ink">
          <div className="fs-container pt-10 md:pt-12">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-mint">Capabilities</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-mist md:text-4xl">Stack as you scroll</h2>
            <p className="mt-2 max-w-xl text-sm text-mist/50">Scroll to explore FitandSleek Vector — denser cards, less empty space.</p>
          </div>
          <StackingCards items={stackCards} />
        </section>

        <StickyScrollStory />

        <HorizontalScrollGallery />

        <section className="border-y border-line py-12 md:py-14">
          <div className="fs-container">
            <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-mint">Deploy</p>
            <h2 className="mt-1 text-center text-3xl font-bold tracking-tight text-mist md:text-4xl">Live deployment graph</h2>
            <div className="mt-8">
              <ArchitectureBeam />
            </div>
          </div>
        </section>

        <section id="news" className="py-12 md:py-14">
          <div className="fs-container">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-mint">News</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-mist md:text-4xl">Latest updates</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {news.map((n) => (
                <article key={n.title} className="rounded-xl border border-line bg-graphite p-5 transition hover:border-mint/30">
                  <p className="text-[11px] font-medium text-mint">{n.date}</p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-mist">{n.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist/55">{n.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line py-10">
          <p className="mb-5 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-mist/40">What builders say</p>
          <Marquee pauseOnHover className="[--duration:40s]">
            {quotes.map((item) => (
              <figure key={item.q} className="mx-2 flex w-[300px] gap-3 rounded-xl border border-line bg-graphite p-4 md:w-[340px]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint/15 text-sm font-bold text-mint">
                  {item.initial}
                </span>
                <div>
                  <blockquote className="text-sm leading-snug text-mist/80">&ldquo;{item.q}&rdquo;</blockquote>
                  <figcaption className="mt-2 text-[11px] font-medium text-mist/40">{item.a}</figcaption>
                </div>
              </figure>
            ))}
          </Marquee>
        </section>

        <section className="py-12 md:py-14">
          <div className="fs-container">
            <h2 className="text-3xl font-bold tracking-tight text-mist md:text-4xl">Choose how to get started</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-line bg-graphite p-6">
                <h3 className="text-xl font-bold tracking-tight text-mist">Build on your own</h3>
                <p className="mt-2 text-sm text-mist/50">Launch FitandSleek Vector search with:</p>
                <ul className="mt-4 space-y-2 text-sm text-mist/70">
                  <li>· Collections, search, recommend</li>
                  <li>· API key auth like Qdrant Cloud</li>
                  <li>· Live Swagger on Hugging Face</li>
                  <li>· Console for uploads &amp; snapshots</li>
                </ul>
                <Link href="/register" className="fs-btn mt-6">
                  Create account
                </Link>
              </div>
              <div className="rounded-xl border border-line bg-graphite p-6">
                <h3 className="text-xl font-bold tracking-tight text-mist">Operate in console</h3>
                <p className="mt-2 text-sm text-mist/50">Hands-on control for your team.</p>
                <ul className="mt-4 space-y-2 text-sm text-mist/70">
                  <li>· Manage collections and points</li>
                  <li>· Image upload &amp; similarity search</li>
                  <li>· Rotate and create API keys</li>
                  <li>· Neon-backed persistence</li>
                </ul>
                <Link href="/console" className="fs-btn-ghost mt-6">
                  Open Console
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </SmoothScroll>
  );
}
