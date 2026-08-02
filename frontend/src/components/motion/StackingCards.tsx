"use client";

import { cn } from "@/lib/utils";

export type StackCardItem = {
  title: string;
  body: string;
  accent?: string;
  tag?: string;
};

/** Compact stacked cards — no tall sticky scroll track / empty gaps. */
export function StackingCards({ items }: { items: StackCardItem[] }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 pb-6 md:px-6">
      {items.map((item, index) => (
        <article
          key={item.title}
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-line bg-graphite p-4 md:p-5",
            "shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
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
        </article>
      ))}
    </div>
  );
}
