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
        ink: "#0b1210",
        graphite: "#121a17",
        mist: "#d7ebe3",
        mint: "#3dff9a",
        moss: "#1f6b4f",
        ember: "#ff6b3d",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(61,255,154,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(61,255,154,0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(61,255,154,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255,107,61,0.12), transparent 50%)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        rise: "rise 0.8s ease-out both",
        "rise-delay": "rise 0.8s ease-out 0.15s both",
        "rise-delay-2": "rise 0.8s ease-out 0.3s both",
        "pulse-line": "pulseLine 2.4s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
