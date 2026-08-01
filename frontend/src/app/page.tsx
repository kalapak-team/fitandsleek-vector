"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
    accent: "rgba(61,255,154,0.28)",
  },
  {
    title: "Image search",
    body: "Upload a product photo. FitandSleek Vector embeds and ranks nearest catalog matches in milliseconds.",
    accent: "rgba(255,107,61,0.25)",
  },
  {
    title: "API keys",
    body: "Register like Qdrant Cloud. Receive an API key once. Protect search and admin routes by role.",
    accent: "rgba(61,255,154,0.2)",
  },
  {
    title: "Owned stack",
    body: "Next.js · FastAPI · Neon PostgreSQL. Deployed on Vercel + Hugging Face — built by your team.",
    accent: "rgba(255,107,61,0.2)",
  },
];

const spotlights = [
  { title: "Points & payloads", body: "Upsert vectors with rich JSON metadata — title, category, price, filename." },
  { title: "Filters", body: "must / should / must_not with match and range conditions for precise retrieval." },
  { title: "Recommend", body: "Positive and negative examples steer results without hand-crafted query vectors." },
  { title: "Snapshots", body: "Checkpoint collections for demos, backups, and classroom checkpoints." },
  { title: "Scroll & count", body: "Page through points and count with filters — console and API ready." },
  { title: "Swagger docs", body: "Explore every Qdrant-shaped endpoint live at /docs on your Space." },
];

const quotes = [
  { q: "Own the vector engine — not just a hosted black box.", a: "FitandSleek Team" },
  { q: "Qdrant-compatible API. Original FitandSleek implementation.", a: "Year 4 Project" },
  { q: "Image in. Similar products out. Built for athletic retail.", a: "Product Search" },
];

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="overflow-x-hidden bg-ink">
        {/* HERO — Adobe / x.ai cinematic energy, brand first */}
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_60%_0%,rgba(61,255,154,0.2),transparent_55%),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(255,107,61,0.14),transparent_50%),linear-gradient(180deg,#0b1210_0%,#0e1714_50%,#0b1210_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-30" style={{ backgroundSize: "56px 56px" }} />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-mint/10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 bottom-10 h-[380px] w-[380px] rounded-full bg-ember/10 blur-[110px]" />
          <SiteHeader />

          <div className="fs-container relative flex min-h-screen flex-col justify-end pb-20 pt-28 md:justify-center md:pb-28">
            <p className="animate-rise font-mono text-xs uppercase tracking-[0.3em] text-mint/80">Vector database</p>
            <h1 className="animate-rise-delay mt-5 max-w-5xl font-display text-6xl font-extrabold leading-[0.9] tracking-tight text-mist md:text-8xl lg:text-[7.5rem]">
              FitandSleek
              <br />
              <span className="bg-gradient-to-r from-mint via-mist to-ember bg-clip-text text-transparent">Vector</span>
            </h1>
            <p className="animate-rise-delay-2 mt-7 max-w-xl text-lg text-mist/65 md:text-xl">
              Cinematic product search infrastructure — Qdrant-shaped, team-owned, image-native.
            </p>
            <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="fs-btn">
                Get API Key
              </Link>
              <Link href="/console" className="fs-btn-ghost">
                Launch Console
              </Link>
            </div>
          </div>
        </section>

        <ScrollText className="border-y border-mist/10 bg-graphite/30 py-8">FitandSleek Vector · Image Search · </ScrollText>

        <InfinityBrand />

        {/* Stacking cards */}
        <section className="relative bg-ink">
          <div className="fs-container pt-24">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-mint/70">Stacking cards</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold text-mist md:text-6xl">
              Capabilities that stack as you scroll
            </h2>
          </div>
          <StackingCards items={stackCards} />
        </section>

        {/* Spotlight */}
        <section className="border-t border-mist/10 py-24">
          <div className="fs-container">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-mint/70">Spotlight cards</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-mist md:text-5xl">Operator surface</h2>
            <p className="mt-3 max-w-2xl text-mist/55">Hover to reveal depth — console primitives for collections, filters, and recovery.</p>
            <div className="mt-12">
              <SpotlightGrid items={spotlights} />
            </div>
          </div>
        </section>

        <StickyScrollStory />

        <HorizontalScrollGallery />

        {/* Animated beam architecture */}
        <section className="border-t border-mist/10 py-24">
          <div className="fs-container">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-mint/70">Animated beam</p>
            <h2 className="mt-3 text-center font-display text-4xl font-bold text-mist md:text-5xl">Live deployment graph</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-mist/55">
              Frontend on Vercel · API on Hugging Face · Database on Neon
            </p>
            <div className="mt-14">
              <ArchitectureBeam />
            </div>
          </div>
        </section>

        {/* Marquee quotes */}
        <section className="border-t border-mist/10 py-16">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.22em] text-mist/40">Marquee</p>
          <Marquee pauseOnHover className="[--duration:45s]">
            {quotes.map((item) => (
              <figure key={item.q} className="mx-3 w-[320px] border border-mist/10 bg-graphite/50 p-6 md:w-[420px]">
                <blockquote className="text-lg text-mist/80">&ldquo;{item.q}&rdquo;</blockquote>
                <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-mint/60">{item.a}</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(61,255,154,0.16),transparent_55%)]" />
          <div className="fs-container relative text-center">
            <h2 className="font-display text-4xl font-bold text-mist md:text-6xl">Create account. Get your key.</h2>
            <p className="mx-auto mt-4 max-w-xl text-mist/60">Qdrant-style onboarding — API key shown once, then power your FitandSleek website search.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="fs-btn">
                Sign up
              </Link>
              <Link href="https://kalapak-fitandsleek-vector.hf.space/docs" className="fs-btn-ghost" target="_blank">
                Open API Docs
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </SmoothScroll>
  );
}
