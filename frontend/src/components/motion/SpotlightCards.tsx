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
      className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.12), transparent 40%)`,
        }}
      />
      <h3 className="relative text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-white/45">{body}</p>
    </div>
  );
}

export function SpotlightGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <SpotlightCard key={item.title} title={item.title} body={item.body} />
      ))}
    </div>
  );
}
