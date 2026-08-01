import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo: help Vercel/Next file tracing from `frontend/`
  outputFileTracingRoot: path.join(__dirname, ".."),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
