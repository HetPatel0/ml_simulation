import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "react-syntax-highlighter",
      "katex",
    ],
  },
  async redirects() {
    return [
      // /privacy merged into /about#privacy — keep old links working.
      { source: "/privacy", destination: "/about#privacy", permanent: true },
      // /newsletter route removed — home strip form remains the signup path.
      { source: "/newsletter", destination: "/#newsletter-heading", permanent: true },
    ];
  },
  async headers() {    return [
      {
        source: "/:path*.{png,jpg,jpeg,webp,avif,svg}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/audio/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
