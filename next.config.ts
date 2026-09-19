import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production-clean UI even while developing (no dev-tools button/overlay).
  devIndicators: false,
  // Don't leak framework version via the `X-Powered-By` header.
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      // Supabase Storage (site-assets, portfolio-images)
      { protocol: "https", hostname: "**.supabase.co" },
      // Embedded portfolio content
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/services/cybersecurity",
        destination: "/services/lead-generation-crm",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
