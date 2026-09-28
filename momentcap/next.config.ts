import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app lives inside another repo that has its own lockfile; pin the root here.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
