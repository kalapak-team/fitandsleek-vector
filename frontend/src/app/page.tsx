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
    body: "Create distance-aware collections with Cosine, Euclid, or Dot — the same mental model as Qdrant.",
    accent: "rgba(255,255,255,0.08)",
  },
  {
    title: "Image search",
    body: "Upload a product photo. FitandSleek Vector embeds and ranks nearest catalog matches in milliseconds.",
    accent: "rgba(255,255,255,0.06)",
  },
  {
    title: "API keys",
    body: "Register like Qdrant Cloud. Receive an API key once. Protect search and admin routes by role.",
    accent: "rgba(255,255,255,0.07)",
  },
  {
    title: "Owned stack",
    body: "Next.js · FastAPI · Neon PostgreSQL. Deployed on Vercel + Hugging Face — built by your team.",
    accent: "rgba(255,255,255,0.05)",
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
    title: "Cinematic landing live on Vercel",
    date: "Aug 2026",
    body: "Smooth scroll, stacking cards, and starfield hero — x.ai energy for FitandSleek Vector.",
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
    title: "Image similarity for athletic retail",
    date: "2026",
    body: "Built for FitandSleek catalog search — find near-duplicates from a single photo.",
  },
];

const quotes = [
  { q: "Own the vector engine — not just a hosted black box.", a: "FitandSleek Team" },
  { q: "Qdrant-compatible API. Original FitandSleek implementation.", a: "Year 4 Project" },
  { q: "Image in. Similar products out. Built for athletic retail.", a: "Product Search" },
];

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="overflow-x-hidden bg-black text-mist">
        {/* Announcement — x.ai style */}
        <div className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2.5 text-center text-[12px] text-white/60 md:px-8">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              New
            </span>
            <span>
              Meet FitandSleek Vector · Our self-owned image search engine{" "}
              <Link href="/register" className="text-white underline-offset-2 hover:underline">
                Get started
              </Link>
            </span>
          </div>
        </div>

        {/* HERO */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <StarField className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,#000_100%)]" />
          <SiteHeader />

          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-28 md:px-8">
            <p className="animate-rise text-[13px] tracking-wide text-white/45">Vector database</p>
            <h1 className="animate-rise-delay mt-5 text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
              FitandSleek
              <br />
              Vector
            </h1>
            <p className="animate-rise-delay-2 mt-8 max-w-2xl text-[clamp(1.25rem,3vw,2rem)] font-medium leading-snug tracking-[-0.02em] text-white/80">
              Frontier vector search for everything you build.
            </p>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/45 md:text-lg">
              Image similarity, collections, filters, and recommendations — Qdrant-shaped API for FitandSleek product
              search. Owned by your team.
            </p>
            <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="fs-btn">
                Get API Key
              </Link>
              <Link href="/console" className="fs-btn-ghost">
                Open Console
              </Link>
            </div>
          </div>
        </section>

        <ScrollText className="border-y border-white/10 py-10 text-white/[0.08]">
          {"FitandSleek Vector · Image Search · "}
        </ScrollText>

        {/* One API */}
        <section id="api" className="border-b border-white/10 py-28">
          <div className="fs-container">
            <h2 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
              One API.
              <br />
              <span className="text-white/40">Every search modality.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/45">
              Images, text, filters, recommend, scroll — one unified surface. Start building in seconds.
            </p>
            <div className="mt-14">
              <SpotlightGrid items={modalities} />
            </div>
          </div>
        </section>

        <InfinityBrand />

        {/* Stacking */}
        <section id="product" className="relative bg-black">
          <div className="fs-container pt-24">
            <p className="text-[13px] text-white/40">Capabilities</p>
            <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-white">
              Stack as you scroll
            </h2>
          </div>
          <StackingCards items={stackCards} />
        </section>

        <StickyScrollStory />

        <HorizontalScrollGallery />

        {/* Beam */}
        <section className="border-y border-white/10 py-28">
          <div className="fs-container">
            <h2 className="text-center text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-white">
              Live deployment graph
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-white/45">
              Frontend on Vercel · API on Hugging Face · Database on Neon
            </p>
            <div className="mt-16">
              <ArchitectureBeam />
            </div>
          </div>
        </section>

        {/* News */}
        <section id="news" className="py-28">
          <div className="fs-container">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-white">Latest news</h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
              {news.map((n) => (
                <article key={n.title} className="bg-black p-8 transition hover:bg-white/[0.03] md:p-10">
                  <p className="text-[12px] text-white/35">{n.date}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">{n.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{n.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="border-y border-white/10 py-16">
          <Marquee pauseOnHover className="[--duration:45s]">
            {quotes.map((item) => (
              <figure key={item.q} className="mx-3 w-[320px] border border-white/10 bg-white/[0.03] p-6 md:w-[400px]">
                <blockquote className="text-lg leading-snug text-white/80">&ldquo;{item.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-[12px] uppercase tracking-[0.16em] text-white/35">{item.a}</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* Get started — x.ai two columns */}
        <section className="py-28">
          <div className="fs-container">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-white">
              Choose how to get started
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
                <h3 className="text-2xl font-semibold tracking-tight text-white">Build on your own</h3>
                <p className="mt-3 text-sm text-white/45">Launch FitandSleek Vector search with:</p>
                <ul className="mt-6 space-y-3 text-sm text-white/65">
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Access to collections, search, recommend
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> API key auth like Qdrant Cloud
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Live Swagger docs on Hugging Face
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Console for uploads and snapshots
                  </li>
                </ul>
                <Link href="/register" className="fs-btn mt-8">
                  Create account
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
                <h3 className="text-2xl font-semibold tracking-tight text-white">Operate in console</h3>
                <p className="mt-3 text-sm text-white/45">Hands-on control for your team.</p>
                <ul className="mt-6 space-y-3 text-sm text-white/65">
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Manage collections and points
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Image upload and similarity search
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Rotate and create API keys
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/30">—</span> Neon-backed persistence
                  </li>
                </ul>
                <Link href="/console" className="fs-btn-ghost mt-8">
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
