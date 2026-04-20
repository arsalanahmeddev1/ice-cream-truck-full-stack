import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller dev graphs (less work on each refresh — helps weak PCs)
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  // Webpack dev only (`npm run dev` uses --webpack). Ignores stop the watcher
  // from crawling huge trees (common cause of freezes on Windows).
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions as object),
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/coverage/**",
        ],
        aggregateTimeout: 500,
        followSymlinks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
