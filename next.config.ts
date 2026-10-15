import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Enable image optimization features
    formats: ['image/webp', 'image/avif'],
    // Enable placeholder blur for better UX
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['framer-motion', '@headlessui/react'],
  },
};

export default nextConfig;
