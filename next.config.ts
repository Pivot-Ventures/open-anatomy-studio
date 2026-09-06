import type { NextConfig } from "next";

/**
 * The studio is exported as static HTML. EASI serves that export from a
 * nested path (/atlas/organs/) on the easi.pivotventures.tech origin, which
 * `npm run build:easi` handles by rewriting the root-relative asset links in
 * the exported HTML. Model files are loaded relative to the page URL so they
 * work at any mount path without a build-time base path.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
