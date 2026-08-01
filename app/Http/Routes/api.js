import { Router } from "express";

import { biodiversityCatalog } from "../../biodiversity/runtime.js";
import { createAtlasRouter } from "./api/atlas.js";

export function createApiRouter({ catalog = biodiversityCatalog } = {}) {
  const router = Router();
  router.use("/atlas", createAtlasRouter({ catalog }));
  router.get("/health", (_, response) => response.json({ ok: true, product: "CozyMuseum" }));
  return router;
}
