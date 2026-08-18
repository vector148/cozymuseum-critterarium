import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { createApiRouter } from "../app/Http/Routes/api.js";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const DEFAULT_IMAGES_DIR = resolve(moduleDir, "../images");

export function createApp({
  clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  catalog,
  imagesDir = DEFAULT_IMAGES_DIR,
} = {}) {
  const app = express();

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());
  app.use("/images", express.static(resolve(imagesDir)));
  app.use("/api", createApiRouter({ catalog }));

  return app;
}
