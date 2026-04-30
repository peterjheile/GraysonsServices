import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 300,       // Check for changes every 800ms
        aggregateTimeout: 200,
      };
    }
    return config;
  },

  turbopack: {}
};

export default nextConfig;