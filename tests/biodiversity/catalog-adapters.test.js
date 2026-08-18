import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createBiodiversityCatalog } from "../../app/Modules/Critterarium/Application/Catalog/catalog.js";
import { createOrganismExcelStore } from "../../app/Modules/Critterarium/Infrastructure/Catalog/organism-store.js";
import { createMemoryStore } from "../../app/Modules/Critterarium/Infrastructure/Catalog/memory-store.js";

const seed = [{
  organismId: "panthera-leo",
  realmId: "animalia",
  commonNameEn: "Lion",
  commonNameVi: "Sư tử",
  scientificName: "Panthera leo",
  phylum: "chordata",
  className: "mammalia",
  lifeState: "extant",
  encountered: false,
  encounterDate: "",
  rarityScore: "",
}];

function exerciseCatalog(store) {
  store.write(seed);
  const catalog = createBiodiversityCatalog({
    store,
    clock: () => new Date(2026, 7, 1, 12, 0, 0),
  });

  const living = catalog.list({ realmId: "animalia", atlasMode: "living", locale: "vi" });
  catalog.completeEncounter("panthera-leo", { rarityScore: 8.7 });
  const hall = catalog.list({ realmId: "animalia", atlasMode: "hall_of_fame", encounterYear: "2026", locale: "vi" });

  return {
    living: living.items.map(({ organismId, displayName }) => ({ organismId, displayName })),
    hall: hall.items.map(({ organismId, encountered, encounterDate, rarityScore }) => ({
      organismId,
      encountered,
      encounterDate,
      rarityScore,
    })),
  };
}

test("memory and four-workbook adapters expose the same catalog behavior", () => {
  const databaseDir = mkdtempSync(join(tmpdir(), "cozymuseum-contract-"));
  try {
    const memoryResult = exerciseCatalog(createMemoryStore());
    const excelResult = exerciseCatalog(createOrganismExcelStore({ databaseDir }));
    assert.deepEqual(excelResult, memoryResult);
  } finally {
    rmSync(databaseDir, { recursive: true, force: true });
  }
});
