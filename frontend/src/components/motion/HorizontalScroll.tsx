"use client";

const slides = [
  { title: "Catalog search", body: "Shoppers upload a look. FitandSleek Vector returns near-duplicates from your product index.", tone: "from-mint/20" },
  { title: "Admin console", body: "Collections, points, snapshots, API keys — operate like Qdrant Cloud, owned by your team.", tone: "from-ember/15" },
  { title: "Website API", body: "Vercel frontend calls Hugging Face backend with api-key. Neon keeps vectors persistent.", tone: "from-mint/15" },
  { title: "Recommend", body: "Positive / negative examples steer recommendations without hand-writing query vectors.", tone: "from-ember/20" },
];

/** Native horizontal scroll — no 180vh vertical empty track. */
export function HorizontalScrollGallery() {
  return (
    <section className="border-t border-line bg-ink py-10 md:py-12">
      <div className="fs-container">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-mint">Product flows</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-mist md:text-4xl">
          Built for Fit &amp; Sleek retail search
        </h2>
      </div>
      <div className="mt-5 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-thin md:gap-4 md:px-6">
        {slides.map((s) => (
          <article
            key={s.title}
            className={`relative h-auto min-h-[180px] w-[min(82vw,320px)] shrink-0 overflow-hidden rounded-xl border border-line bg-gradient-to-br ${s.tone} to-graphite p-5 md:w-[300px]`}
          >
            <h3 className="text-xl font-bold tracking-tight text-mist">{s.title}</h3>
            <p className="mt-2 text-sm leading-snug text-mist/60">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
