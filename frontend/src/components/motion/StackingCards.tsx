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

  // Short scroll distance — cards pile tightly under the header (no 70vh empty slots).
  return (
    <div
      ref={container}
      className="relative mx-auto w-full max-w-5xl px-4 md:px-6"
      style={{ height: `${items.length * 28 + 20}vh` }}
    >
      {items.map((item, i) => (
        <StackCard
          key={item.title}
          item={item}
          index={i}
          progress={scrollYProgress}
          total={items.length}
          stickyTop={76 + i * 12}
        />
      ))}
    </div>
  );
}

function StackCard({
  item,
  index,
  progress,
  total,
  stickyTop,
}: {
  item: StackCardItem;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
  stickyTop: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(progress, [start, end], [1, 0.97]);
  const opacity = useTransform(progress, [start, end], [1, 0.75]);

  return (
    <div className="sticky mb-2" style={{ top: stickyTop }}>
      <motion.article
        style={{ scale, opacity }}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-line bg-graphite p-4 md:p-5",
          "shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 10% 0%, ${item.accent || "color-mix(in srgb, var(--mint) 18%, transparent)"}, transparent 48%)`,
          }}
        />
        <div className="relative flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mint">0{index + 1}</p>
          {item.tag ? (
            <span className="rounded-md bg-mint/10 px-2 py-0.5 text-[11px] font-medium text-mint">{item.tag}</span>
          ) : null}
        </div>
        <h3 className="relative mt-1.5 text-xl font-bold tracking-tight text-mist md:text-2xl">{item.title}</h3>
        <p className="relative mt-1 max-w-2xl text-sm leading-snug text-mist/60">{item.body}</p>
      </motion.article>
    </div>
  );
}
