"use client";

import { Marquee } from "@/components/motion/Marquee";

const brands = ["Next.js", "FastAPI", "PostgreSQL", "Neon", "Vercel", "Hugging Face", "NumPy", "Qdrant-API"];

export function InfinityBrand() {
  return (
    <section className="border-y border-white/10 bg-black py-12">
      <p className="mb-8 text-center text-[12px] uppercase tracking-[0.22em] text-white/30">Stack</p>
      <Marquee pauseOnHover className="[--duration:32s]">
        {brands.map((b) => (
          <span key={b} className="mx-8 text-2xl font-semibold tracking-tight text-white/25 md:text-3xl">
            {b}
          </span>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="mt-5 [--duration:38s]">
        {brands.map((b) => (
          <span key={`r-${b}`} className="mx-8 font-mono text-xs uppercase tracking-[0.22em] text-white/20">
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
