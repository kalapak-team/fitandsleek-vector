"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const slides = [
  { title: "Catalog search", body: "Shoppers upload a look. FitandSleek Vector returns near-duplicates from your product index." },
  { title: "Admin console", body: "Collections, points, snapshots, API keys — operate like Qdrant Cloud, owned by your team." },
  { title: "Website API", body: "Vercel frontend calls Hugging Face backend with api-key. Neon keeps vectors persistent." },
  { title: "Recommend", body: "Positive / negative examples steer recommendations without hand-writing query vectors." },
];

export function HorizontalScrollGallery() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={target} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="fs-container absolute left-0 right-0 top-16 z-10">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-mint/70">Horizontal scroll</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-mist md:text-5xl">Built for real product flows</h2>
        </div>
        <motion.div style={{ x }} className="flex gap-6 px-[10vw] pt-28">
          {slides.map((s) => (
            <article
              key={s.title}
              className="relative h-[55vh] w-[78vw] shrink-0 overflow-hidden border border-mist/10 bg-gradient-to-br from-graphite to-ink p-8 md:w-[42vw] md:p-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(61,255,154,0.16),transparent_45%)]" />
              <h3 className="relative font-display text-3xl font-bold text-mist md:text-4xl">{s.title}</h3>
              <p className="relative mt-4 max-w-md text-mist/60">{s.body}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
