import type { NextConfig } from "next";

export const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "assets.workos.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.workos.com",
        pathname: "/**",
      },
    ],
  },

  // Proxy configuration for API routes
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "https://api.aliasmosaic.com/:path*",
      },
    ];
  },

  // Advanced logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Enable React 19 features
  reactStrictMode: true,

  // Enable Next.js 15 features
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-*",
      "@heroicons/react",
      "lucide-react",
    ],
  },

  // Bundle optimization
  bundlePagesRouterDependencies: true,

  // Enable proxy support
  async redirects() {
    return [
      {
        source: "/api/auth/login",
        destination: "/login",
        permanent: true,
      },
    ];
  },

  // Custom headers
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
