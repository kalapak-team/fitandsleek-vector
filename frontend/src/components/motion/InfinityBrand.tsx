"use client";

import { Marquee } from "@/components/motion/Marquee";

const brands = ["Next.js", "FastAPI", "PostgreSQL", "Neon", "Vercel", "Hugging Face", "NumPy", "Qdrant-API"];

export function InfinityBrand() {
  return (
    <section className="border-y border-line bg-ink py-6">
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-mist/40">Top stack</p>
      <Marquee pauseOnHover className="[--duration:28s]">
        {brands.map((b) => (
          <span key={b} className="mx-5 text-xl font-bold tracking-tight text-mist/30 md:mx-7 md:text-2xl">
            {b}
          </span>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="mt-3 [--duration:34s]">
        {brands.map((b) => (
          <span key={`r-${b}`} className="mx-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mint/50 md:mx-7">
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
