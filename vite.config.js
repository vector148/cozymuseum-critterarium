import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { normalizeSiteUrl } from "./scripts/generate-search-assets.mjs";

const port = Number(process.env.VITE_PORT ?? 5173);
const apiTarget = process.env.VITE_API_TARGET ?? "http://localhost:3001";
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL);

export default defineConfig({
  root: "resources",
  publicDir: "../public",
  plugins: [
    react(),
    {
      name: "cozymuseum-canonical-url",
      transformIndexHtml(html) {
        return html.replaceAll("__SITE_URL__", siteUrl);
      },
    },
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: process.env.VITE_STRICT_PORT === "true",
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
