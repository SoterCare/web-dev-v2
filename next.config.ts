import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Trailing slash consistency (prevents duplicate content)
  trailingSlash: false,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com', // Common Hygraph asset domain
      },
      {
        protocol: 'https',
        hostname: 'eu-central-1-shared-euc1-02.graphassets.com', // Potential specific hygraph region, adding generally
      }
    ],
  },

  // Enable compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // HTTP security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect www to non-www (or vice versa)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sotercare.com" }],
        destination: "https://sotercare.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
