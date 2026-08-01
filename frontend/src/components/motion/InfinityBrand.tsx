"use client";

import { Marquee } from "@/components/motion/Marquee";

const brands = ["Next.js", "FastAPI", "PostgreSQL", "Neon", "Vercel", "Hugging Face", "NumPy", "Qdrant-API"];

export function InfinityBrand() {
  return (
    <section className="border-y border-mist/10 bg-graphite/40 py-10">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.24em] text-mist/40">Infinity brand</p>
      <Marquee pauseOnHover className="[--duration:28s]">
        {brands.map((b) => (
          <span key={b} className="mx-6 font-display text-2xl font-semibold tracking-tight text-mist/35 md:text-3xl">
            {b}
          </span>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="mt-4 [--duration:34s]">
        {brands.map((b) => (
          <span key={`r-${b}`} className="mx-6 font-mono text-sm uppercase tracking-[0.2em] text-mint/35">
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
