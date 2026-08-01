import { Router } from "express";

import { createAtlasController } from "../../Controllers/AtlasController.js";

export function createAtlasRouter({ catalog }) {
  const router = Router();
  const controller = createAtlasController({ catalog });
  router.get("/meta", controller.metadata);
  router.get("/organisms", controller.list);
  router.get("/organisms/:organismId", controller.detail);
  router.post("/organisms/:organismId/encounter", controller.completeEncounter);
  router.delete("/organisms/:organismId/encounter", controller.undoEncounter);
  return router;
}
