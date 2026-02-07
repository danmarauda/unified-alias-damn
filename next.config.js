/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration for faster development
  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },

  // Security headers including CSP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev https://clerk.derrimut.aliaslabs.ai https://js.stripe.com https://cdn.vapi.ai https://browser.sentry-cdn.com https://va.vercel-scripts.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.workos.com https://*.workos.com",
              "frame-src 'self' https://clerk.com https://*.clerk.accounts.dev",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
