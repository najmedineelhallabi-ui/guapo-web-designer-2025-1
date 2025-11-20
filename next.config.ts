import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === 'development';
const LOADER = isDev ? path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js') : '';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slelguoygbfzlpylpxfs.supabase.co',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Allow cross-origin requests from Orchids iframe
  allowedDevOrigins: [
    'www.orchids.app',
    '*.orchids.app',
    '*.daytona.works',
    '*.proxy.daytona.works',
  ],
  // Only enable Turbopack loader in development
  ...(isDev && {
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [LOADER]
        }
      }
    }
  })
};

export default nextConfig;
// Orchids restart: 1763682627312