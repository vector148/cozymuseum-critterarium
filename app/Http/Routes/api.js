import { Router } from "express";

import { critterariumCatalog } from "../../Modules/Critterarium/runtime.js";
import { createCritterariumRouter } from "../../Modules/Critterarium/Http/Routes/critterarium.js";
import mediaRouter from "./api/media.js";

export function createApiRouter({ catalog = critterariumCatalog } = {}) {
  const router = Router();
  router.use("/atlas", createCritterariumRouter({ catalog }));
  router.use("/media", mediaRouter);
  router.get("/health", (_, response) => response.json({ ok: true, product: "CozyMuseum" }));
  return router;
}
