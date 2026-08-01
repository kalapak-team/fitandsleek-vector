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
    <section ref={target} className="relative h-[300vh] border-t border-white/10 bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="fs-container absolute left-0 right-0 top-16 z-10">
          <p className="text-[13px] text-white/40">Product flows</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-white">
            Built for real retail search
          </h2>
        </div>
        <motion.div style={{ x }} className="flex gap-5 px-[10vw] pt-28">
          {slides.map((s) => (
            <article
              key={s.title}
              className="relative h-[52vh] w-[78vw] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 md:w-[40vw] md:p-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
              <h3 className="relative text-3xl font-semibold tracking-tight text-white md:text-4xl">{s.title}</h3>
              <p className="relative mt-4 max-w-md text-white/45">{s.body}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
