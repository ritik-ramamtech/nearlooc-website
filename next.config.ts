import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  eslint: {
    // Treat no-img-element as warning only, not build-blocking
    ignoreDuringBuilds: false,
  },
  webpack: (config) => {
    // Remotion requires these node modules to be ignored in browser bundles
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  
};

export default nextConfig;
