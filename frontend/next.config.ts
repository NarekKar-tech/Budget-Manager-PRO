
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "http://backend-service:8000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
