import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const features = [
  {
    title: "Collections",
    body: "Create, inspect, and delete collections with Cosine, Euclid, or Dot distance — same mental model as Qdrant.",
  },
  {
    title: "Points & Payloads",
    body: "Upsert vectors with rich JSON payloads, scroll pages of points, count, and delete by id or filter.",
  },
  {
    title: "Similarity Search",
    body: "Nearest-neighbor search with score thresholds, payload filters, and optional vector return.",
  },
  {
    title: "Image Pipeline",
    body: "Upload product images, auto-embed them, and search visually across your FitandSleek catalog.",
  },
  {
    title: "Recommend API",
    body: "Positive / negative examples to recommend similar items without crafting a query vector by hand.",
  },
  {
    title: "Snapshots",
    body: "Create collection snapshots for backup checkpoints — console-ready and API-compatible.",
  },
];

const steps = [
  "Create a collection with vector size + distance metric",
  "Upsert points (raw vectors or image uploads)",
  "Search by vector or by image and rank by similarity",
];

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-screen overflow-hidden bg-hero-glow">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-fade opacity-40"
          style={{ backgroundSize: "48px 48px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
        <SiteHeader />

        <div className="fs-container relative flex min-h-screen flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-32">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.28em] text-mint/80">Vector Database</p>
          <h1 className="animate-rise-delay mt-4 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-mist md:text-7xl lg:text-8xl">
            FitandSleek
            <br />
            <span className="text-mint">Vector</span>
          </h1>
          <p className="animate-rise-delay-2 mt-6 max-w-xl text-base text-mist/70 md:text-lg">
            Your own Qdrant-style engine for fitness product image search — collections, payloads, filters, and
            similarity ranking built by your team.
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
            <Link href="/console" className="fs-btn">
              Launch Console
            </Link>
            <Link href="/docs" className="fs-btn-ghost">
              Explore API
            </Link>
          </div>

          <div className="animate-drift pointer-events-none absolute right-8 top-1/3 hidden h-64 w-64 rounded-full border border-mint/25 md:block">
            <div className="absolute inset-6 rounded-full border border-mint/20" />
            <div className="absolute inset-14 animate-pulse-line rounded-full border border-ember/40" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_30px_#3dff9a]" />
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-mist/10 py-20">
        <div className="fs-container">
          <h2 className="font-display text-3xl font-bold text-mist md:text-4xl">Built like Qdrant. Owned by you.</h2>
          <p className="mt-3 max-w-2xl text-mist/60">
            Core vector-database operations mirror Qdrant&apos;s REST shape so your team learns industry patterns while
            shipping an original FitandSleek system.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="border-t border-mint/30 pt-5">
                <h3 className="font-display text-xl font-semibold text-mist">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist/55">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-moss/20 via-transparent to-ember/10" />
        <div className="fs-container relative">
          <h2 className="font-display text-3xl font-bold text-mist md:text-4xl">How it works</h2>
          <ol className="mt-10 space-y-6">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-5">
                <span className="font-mono text-sm text-mint">0{i + 1}</span>
                <p className="text-lg text-mist/80">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Link href="/console/images" className="fs-btn">
              Try Image Search
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-mist/10 py-20">
        <div className="fs-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-mist md:text-4xl">Stack</h2>
            <p className="mt-3 max-w-xl text-mist/60">
              Next.js frontend · Python FastAPI engine · PostgreSQL persistence · custom similarity index
            </p>
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.16em] text-mist/50">
            <span>React</span>
            <span>Next.js</span>
            <span>FastAPI</span>
            <span>PostgreSQL</span>
            <span>NumPy</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
