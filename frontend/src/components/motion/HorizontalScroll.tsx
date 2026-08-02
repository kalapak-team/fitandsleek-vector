"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const slides = [
  { title: "Catalog search", body: "Shoppers upload a look. FitandSleek Vector returns near-duplicates from your product index.", tone: "from-mint/20" },
  { title: "Admin console", body: "Collections, points, snapshots, API keys — operate like Qdrant Cloud, owned by your team.", tone: "from-ember/15" },
  { title: "Website API", body: "Vercel frontend calls Hugging Face backend with api-key. Neon keeps vectors persistent.", tone: "from-mint/15" },
  { title: "Recommend", body: "Positive / negative examples steer recommendations without hand-writing query vectors.", tone: "from-ember/20" },
];

export function HorizontalScrollGallery() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);

  return (
    <section ref={target} className="relative h-[180vh] border-t border-line bg-ink">
      <div className="sticky top-0 flex h-[75vh] items-center overflow-hidden">
        <div className="fs-container absolute left-0 right-0 top-8 z-10 md:top-10">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-mint">Product flows</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-mist md:text-4xl">Built for Fit & Sleek retail search</h2>
        </div>
        <motion.div style={{ x }} className="flex gap-4 px-4 pt-24 md:gap-5 md:px-[6vw] md:pt-28">
          {slides.map((s) => (
            <article
              key={s.title}
              className={`relative h-[42vh] w-[82vw] shrink-0 overflow-hidden rounded-xl border border-line bg-gradient-to-br ${s.tone} to-graphite p-6 md:h-[46vh] md:w-[36vw] md:p-7`}
            >
              <h3 className="relative text-2xl font-bold tracking-tight text-mist md:text-3xl">{s.title}</h3>
              <p className="relative mt-3 max-w-md text-sm leading-relaxed text-mist/60 md:text-base">{s.body}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
