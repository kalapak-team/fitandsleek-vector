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
    <div ref={ref} className="relative border-t border-white/10" style={{ height: `${panels.length * 90}vh` }}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden bg-black">
        <div className="fs-container grid w-full gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-[13px] text-white/40">Pipeline</p>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              From image
              <br />
              to nearest match
            </h2>
            <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
              <motion.div className="h-full bg-white" style={{ width: indicator }} />
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
  const segment = 1 / total;
  const start = index * segment;
  const fadeIn = Math.min(start + segment * 0.2, 1);
  const fadeOut = Math.min(start + segment * 0.75, 1);
  const end = Math.min(start + segment, 1);
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0.25, 1, 1, 0.25]);
  const y = useTransform(progress, [start, end], [40, -20]);

  return (
    <motion.div style={{ opacity, y }} className="border-l border-white/15 pl-6">
      <p className="font-mono text-[11px] text-white/35">0{index + 1}</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-3 max-w-md text-white/45">{body}</p>
    </motion.div>
  );
}
