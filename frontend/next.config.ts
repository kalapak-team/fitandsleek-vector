import type { NextConfig } from "next";

// `standalone` is only for Docker/HF self-hosting — Vercel breaks with it.
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
};

export default nextConfig;
