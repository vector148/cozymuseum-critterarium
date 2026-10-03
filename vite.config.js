import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number(process.env.VITE_PORT ?? 5173);
const apiTarget = process.env.VITE_API_TARGET ?? "http://localhost:3001";
export default defineConfig({
  root: "resources",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/xlsx")) {
            return "vendor-xlsx";
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port,
    strictPort: process.env.VITE_STRICT_PORT === "true",
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
      "/images": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
