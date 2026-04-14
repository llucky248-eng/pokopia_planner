import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pokopia_planner",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
