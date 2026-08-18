import { Router } from "express";

import { createCritterariumController } from "../Controllers/CritterariumController.js";

export function createCritterariumRouter({ catalog }) {
  const router = Router();
  const controller = createCritterariumController({ catalog });
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
