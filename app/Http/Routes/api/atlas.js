import { Router } from "express";

import { createAtlasController } from "../../Controllers/AtlasController.js";

export function createAtlasRouter({ catalog }) {
  const router = Router();
  const controller = createAtlasController({ catalog });
  router.get("/meta", controller.metadata);
  router.get("/organisms", controller.list);
  router.post("/organisms", controller.create);
  router.get("/organisms/:organismId", controller.detail);
  router.patch("/organisms/:organismId", controller.update);
  router.delete("/organisms/:organismId", controller.remove);
  router.post("/organisms/:organismId/encounter", controller.completeEncounter);
  router.delete("/organisms/:organismId/encounter", controller.undoEncounter);
  return router;
}
