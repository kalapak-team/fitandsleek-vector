"use client";

import { useEffect, useRef } from "react";

/** Soft particle field inspired by x.ai hero WebGL atmospheres. */
export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; z: number; r: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.55 + 0.15,
      }));
    };

    let t = 0;
    const draw = () => {
      t += 0.0025;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(w * 0.55, h * 0.35, 0, w * 0.55, h * 0.35, Math.max(w, h) * 0.7);
      g.addColorStop(0, "rgba(255,255,255,0.045)");
      g.addColorStop(0.45, "rgba(255,255,255,0.015)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const drift = Math.sin(t + s.z * 12) * 0.35;
        const x = s.x + drift;
        const y = s.y + Math.cos(t * 0.6 + s.z * 8) * 0.25;
        const pulse = 0.65 + Math.sin(t * 2 + s.z * 20) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.a * pulse})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
