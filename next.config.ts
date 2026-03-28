import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Custom domain via CNAME — no basePath needed
  basePath: "",
  // Disable image optimization (not compatible with static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
