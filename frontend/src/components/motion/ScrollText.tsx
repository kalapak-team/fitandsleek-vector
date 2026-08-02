"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

type ScrollTextProps = {
  children: string;
  baseVelocity?: number;
  className?: string;
  scrollDependent?: boolean;
};

export function ScrollText({
  children,
  baseVelocity = -5,
  className,
  scrollDependent = true,
}: ScrollTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-5, 0, 5], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const direction = useRef<1 | -1>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    if (scrollDependent) {
      if (velocityFactor.get() < 0) direction.current = -1;
      else if (velocityFactor.get() > 0) direction.current = 1;
      moveBy += direction.current * moveBy * velocityFactor.get();
    }
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex w-max gap-8 text-5xl font-semibold uppercase tracking-tight text-mist/[0.08] md:text-7xl" style={{ x }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i}>{children}</span>
        ))}
      </motion.div>
    </div>
  );
}
