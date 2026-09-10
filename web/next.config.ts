import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/gallery", destination: "/designs", permanent: true },
      { source: "/gallery/:path*", destination: "/designs/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
