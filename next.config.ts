import type { NextConfig } from "next";

// GitHub Pages hosts this site under /github-usage-based-billing/.
// In CI we set NEXT_PUBLIC_BASE_PATH=/github-usage-based-billing; in dev it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
