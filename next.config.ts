import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loodibee.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.nba.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ak-static.cms.nba.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      // Allow any HTTPS image source (more permissive for flexibility)
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
