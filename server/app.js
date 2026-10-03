import { join, resolve } from "node:path";
import express from "express";
import cors from "cors";
import { createApiRouter } from "../app/Http/Routes/api.js";
import { catalogImagesDir } from "../app/Modules/Critterarium/Infrastructure/Storage/local-paths.js";


export function createApp({
  clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  catalog,
  imagesDir = catalogImagesDir(),
  staticDir,
} = {}) {
  const app = express();

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use("/images", express.static(resolve(imagesDir)));
  app.use("/api", createApiRouter({ catalog }));

  if (staticDir) {
    const siteRoot = resolve(staticDir);
    app.use(express.static(siteRoot));
    app.get("*", (request, response) => response.sendFile(join(siteRoot, "index.html")));
  }

  return app;
}
