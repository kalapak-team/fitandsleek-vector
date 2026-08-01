import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        graphite: "#0a0a0a",
        mist: "#ededed",
        mint: "#ffffff",
        moss: "#2a2a2a",
        ember: "#a3a3a3",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "sans-serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(calc(-100% - var(--gap)))" },
          to: { transform: "translateX(0)" },
        },
        "marquee-vertical-reverse": {
          from: { transform: "translateY(calc(-100% - var(--gap)))" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "rise-delay": "rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s both",
        "rise-delay-2": "rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.24s both",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "marquee-reverse": "marquee-reverse var(--duration) linear infinite",
        "marquee-vertical-reverse": "marquee-vertical-reverse var(--duration) linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
