"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  title: string;
  body: string;
  className?: string;
};

export function SpotlightCard({ title, body, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn("relative overflow-hidden border border-mist/10 bg-graphite/60 p-6", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(61,255,154,0.18), transparent 40%)`,
        }}
      />
      <h3 className="relative font-display text-xl font-semibold text-mist">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-mist/55">{body}</p>
    </div>
  );
}

export function SpotlightGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <SpotlightCard key={item.title} title={item.title} body={item.body} />
      ))}
    </div>
  );
}
