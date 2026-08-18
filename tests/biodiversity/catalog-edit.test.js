import assert from "node:assert/strict";
import test from "node:test";

import { createBiodiversityCatalog } from "../../app/Modules/Critterarium/Application/Catalog/catalog.js";

test("catalog updates editable metadata without changing identity or workbook ownership", () => {
  let rows = [{
    organismId: "A00001",
    realmId: "animalia",
    scientificName: "Panthera leo",
    commonNameEn: "Lion",
  }];
  const catalog = createBiodiversityCatalog({
    store: {
      read: () => structuredClone(rows),
      write: (next) => { rows = structuredClone(next); },
    },
  });

  const updated = catalog.update("A00001", {
    organismId: "P99999",
    realmId: "plantae_fungi",
    commonNameEn: "African lion",
    displayName: "Computed copy",
    displayDescription: "Computed copy",
  });

  assert.equal(updated.organismId, "A00001");
  assert.equal(updated.realmId, "animalia");
  assert.equal(updated.commonNameEn, "African lion");
  assert.equal("displayName" in updated, false);
  assert.equal("displayDescription" in updated, false);
});
