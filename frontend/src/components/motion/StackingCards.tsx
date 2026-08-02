"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type StackCardItem = {
  title: string;
  body: string;
  accent?: string;
  tag?: string;
};

export function StackingCards({ items }: { items: StackCardItem[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative" style={{ height: `${items.length * 70}vh` }}>
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
  const scale = useTransform(progress, [start, end], [1, 0.94]);
  const opacity = useTransform(progress, [start, end], [1, 0.55]);

  return (
    <div className="sticky top-0 flex h-[70vh] items-end justify-center px-4 pb-6 pt-4 md:items-center md:px-6 md:pb-8">
      <motion.article
        style={{ scale, opacity, top: `${index * 12}px` }}
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-xl border border-line bg-graphite p-6 md:p-8",
          "shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 12% 0%, ${item.accent || "color-mix(in srgb, var(--mint) 18%, transparent)"}, transparent 50%)`,
          }}
        />
        <div className="relative flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mint">0{index + 1}</p>
          {item.tag ? <span className="rounded-md bg-mint/10 px-2 py-1 text-[11px] font-medium text-mint">{item.tag}</span> : null}
        </div>
        <h3 className="relative mt-3 text-2xl font-bold tracking-tight text-mist md:text-4xl">{item.title}</h3>
        <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-mist/60 md:text-base">{item.body}</p>
      </motion.article>
    </div>
  );
}
