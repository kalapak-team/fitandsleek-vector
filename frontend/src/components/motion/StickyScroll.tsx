"use client";

const panels = [
  {
    title: "Embed",
    body: "Turn product photos into dense vectors — ready for Fit & Sleek similarity ranking.",
  },
  {
    title: "Index",
    body: "Store vectors + payloads in PostgreSQL with Cosine, Euclid, or Dot — your own Qdrant-shaped engine.",
  },
  {
    title: "Search",
    body: "Query by image or text. Filters, recommend, and scroll APIs for the retail catalog.",
  },
];

/** Compact pipeline — all steps visible, no multi-viewport sticky spacer. */
export function StickyScrollStory() {
  return (
    <section className="border-t border-line bg-ink py-10 md:py-12">
      <div className="fs-container grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-mint">Pipeline</p>
          <h2 className="mt-1 text-3xl font-bold leading-[1.05] tracking-tight text-mist md:text-4xl">
            From image to nearest match
          </h2>
          <div className="mt-4 h-1 w-28 overflow-hidden rounded-full bg-mist/10">
            <div className="h-full w-full bg-mint" />
          </div>
        </div>
        <div className="grid gap-2">
          {panels.map((p, i) => (
            <div key={p.title} className="rounded-lg border border-line bg-graphite p-4">
              <p className="font-mono text-[11px] text-mint">0{i + 1}</p>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-mist">{p.title}</h3>
              <p className="mt-1 text-sm leading-snug text-mist/55">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
