import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neo-lms.t3.storage.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
  turbopack: {},
};

export default nextConfig;
