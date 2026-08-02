"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type StackCardItem = {
  title: string;
  body: string;
  accent?: string;
};

export function StackingCards({ items }: { items: StackCardItem[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative" style={{ height: `${items.length * 100}vh` }}>
      {items.map((item, i) => (
        <StackCard key={item.title} item={item} index={i} progress={scrollYProgress} total={items.length} />
      ))}
    </div>
  );
}

function StackCard({
  item,
  index,
  progress,
  total,
}: {
  item: StackCardItem;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(progress, [start, end], [1, 0.92]);
  const opacity = useTransform(progress, [start, end], [1, 0.4]);

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-5">
      <motion.article
        style={{ scale, opacity, top: `${index * 16}px` }}
        className={cn(
          "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-graphite p-8 md:p-12",
          "shadow-[0_40px_100px_rgba(0,0,0,0.25)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 0%, ${item.accent || "color-mix(in srgb, var(--mist) 8%, transparent)"}, transparent 55%)`,
          }}
        />
        <p className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-mist/35">0{index + 1}</p>
        <h3 className="relative mt-4 text-3xl font-semibold tracking-tight text-mist md:text-5xl">{item.title}</h3>
        <p className="relative mt-4 max-w-xl text-base leading-relaxed text-mist/45 md:text-lg">{item.body}</p>
      </motion.article>
    </div>
  );
}
