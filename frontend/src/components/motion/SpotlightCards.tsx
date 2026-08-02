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
      className={cn("relative overflow-hidden rounded-xl border border-line bg-graphite p-5", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(380px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--mint) 22%, transparent), transparent 42%)`,
        }}
      />
      <h3 className="relative text-base font-bold tracking-tight text-mist">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-mist/55">{body}</p>
    </div>
  );
}

export function SpotlightGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <SpotlightCard key={item.title} title={item.title} body={item.body} />
      ))}
    </div>
  );
}
