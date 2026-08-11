import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV === 'development',

    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'graysonsservices.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.graysonsservices.com',
        pathname: '/media/**',
      },
    ],
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 300,
        aggregateTimeout: 200,
      };
    }

    return config;
  },

  turbopack: {},
};

export default nextConfig;