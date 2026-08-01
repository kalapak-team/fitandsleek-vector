"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const panels = [
  {
    title: "Embed",
    body: "Turn product photos into dense vectors with FitandSleek vision embeddings — ready for similarity ranking.",
  },
  {
    title: "Index",
    body: "Store vectors + payloads in PostgreSQL with Cosine, Euclid, or Dot distance — your own Qdrant-shaped engine.",
  },
  {
    title: "Search",
    body: "Query by image or text. Filters, thresholds, recommend, and scroll APIs mirror industry patterns.",
  },
];

export function StickyScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const indicator = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative" style={{ height: `${panels.length * 90}vh` }}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="fs-container grid w-full gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-mint/70">Sticky scroll</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-mist md:text-6xl">
              From image
              <br />
              to nearest match
            </h2>
            <div className="mt-8 h-1 w-40 overflow-hidden bg-mist/10">
              <motion.div className="h-full bg-mint" style={{ width: indicator }} />
            </div>
          </div>
          <div className="space-y-24 py-24">
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
  // Input stops must stay in [0, 1] — WAAPI throws if Framer maps offsets outside that range.
  const segment = 1 / total;
  const start = index * segment;
  const fadeIn = Math.min(start + segment * 0.2, 1);
  const fadeOut = Math.min(start + segment * 0.75, 1);
  const end = Math.min(start + segment, 1);
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0.25, 1, 1, 0.25]);
  const y = useTransform(progress, [start, end], [40, -20]);

  return (
    <motion.div style={{ opacity, y }} className="border-l border-mint/30 pl-6">
      <p className="font-mono text-xs text-mint/70">0{index + 1}</p>
      <h3 className="mt-2 font-display text-3xl font-bold text-mist">{title}</h3>
      <p className="mt-3 max-w-md text-mist/60">{body}</p>
    </motion.div>
  );
}
