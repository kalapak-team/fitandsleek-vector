"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BeamProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  pathColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 60,
  pathColor = "rgba(255,255,255,0.12)",
  gradientStartColor = "#ffffff",
  gradientStopColor = "#a3a3a3",
  pathWidth = 2,
  pathOpacity = 0.35,
  duration = 5,
  delay = 0,
  className,
}: BeamProps) {
  const id = useRef(`beam-${Math.random().toString(36).slice(2)}`).current;
  const [pathD, setPathD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const from = fromRef.current.getBoundingClientRect();
      const to = toRef.current.getBoundingClientRect();
      const startX = from.left - container.left + from.width / 2;
      const startY = from.top - container.top + from.height / 2;
      const endX = to.left - container.left + to.width / 2;
      const endY = to.top - container.top + to.height / 2;
      const midY = (startY + endY) / 2 - curvature;
      setSize({ w: container.width, h: container.height });
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${midY} ${endX},${endY}`);
    };
    update();
    const t = window.setTimeout(update, 50);
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      fill="none"
      width={size.w}
      height={size.h}
      className={cn("pointer-events-none absolute inset-0", className)}
      viewBox={`0 0 ${size.w} ${size.h}`}
    >
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} />
      <path d={pathD} stroke={`url(#${id})`} strokeWidth={pathWidth} strokeLinecap="round" />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: 0, x2: 0 }}
          animate={{ x1: [0, size.w || 1], x2: [0, (size.w || 1) * 0.95] }}
          transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="0.2" stopColor={gradientStartColor} />
          <stop offset="0.325" stopColor={gradientStopColor} />
          <stop offset="1" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}

const Node = forwardRef<HTMLDivElement, { label: string; sub: string }>(function Node({ label, sub }, ref) {
  return (
    <div ref={ref} className="z-10 w-44 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center backdrop-blur">
      <p className="text-lg font-semibold tracking-tight text-white">{label}</p>
      <p className="mt-1 text-xs text-white/40">{sub}</p>
    </div>
  );
});

export function ArchitectureBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vercelRef = useRef<HTMLDivElement>(null);
  const hfRef = useRef<HTMLDivElement>(null);
  const neonRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-16 py-10 md:flex-row md:justify-between md:gap-8"
    >
      <Node ref={vercelRef} label="Vercel" sub="Next.js frontend" />
      <Node ref={hfRef} label="Hugging Face" sub="FastAPI vector engine" />
      <Node ref={neonRef} label="Neon" sub="PostgreSQL" />
      <AnimatedBeam containerRef={containerRef} fromRef={vercelRef} toRef={hfRef} delay={0.2} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hfRef}
        toRef={neonRef}
        delay={0.8}
        gradientStartColor="#a3a3a3"
        gradientStopColor="#ffffff"
      />
    </div>
  );
}
