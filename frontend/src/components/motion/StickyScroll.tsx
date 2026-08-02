"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

export function StickyScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const indicator = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative border-t border-line" style={{ height: `${panels.length * 60}vh` }}>
      <div className="sticky top-0 flex min-h-[70vh] items-center overflow-hidden bg-ink py-10">
        <div className="fs-container grid w-full gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-mint">Pipeline</p>
            <h2 className="mt-2 text-3xl font-bold leading-[1.05] tracking-tight text-mist md:text-4xl">
              From image to nearest match
            </h2>
            <div className="mt-5 h-1 w-28 overflow-hidden rounded-full bg-mist/10">
              <motion.div className="h-full bg-mint" style={{ width: indicator }} />
            </div>
          </div>
          <div className="space-y-8 py-2">
            {panels.map((p, i) => (
              <StickyPanel key={p.title} index={i} title={p.title} body={p.body} progress={scrollYProgress} total={panels.length} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StickyPanel({
  title,
  body,
  index,
  progress,
  total,
}: {
  title: string;
  body: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const fadeIn = Math.min(start + segment * 0.2, 1);
  const fadeOut = Math.min(start + segment * 0.75, 1);
  const end = Math.min(start + segment, 1);
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0.3, 1, 1, 0.35]);
  const y = useTransform(progress, [start, end], [16, -8]);

  return (
    <motion.div style={{ opacity, y }} className="rounded-lg border border-line bg-panel p-4 pl-5">
      <p className="font-mono text-[11px] text-mint">0{index + 1}</p>
      <h3 className="mt-1 text-xl font-bold tracking-tight text-mist">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-mist/55">{body}</p>
    </motion.div>
  );
}
