import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import * as XLSX from "xlsx";

import { createBiodiversityCatalog } from "../../app/Modules/Critterarium/Application/Catalog/catalog.js";
import { createOrganismExcelStore, REALM_WORKBOOKS } from "../../app/Modules/Critterarium/Infrastructure/Catalog/organism-store.js";

test("two supported Realms persist to two flat single-sheet workbooks", () => {
  const databaseDir = mkdtempSync(join(tmpdir(), "cozymuseum-store-"));
  try {
    const store = createOrganismExcelStore({ databaseDir });
    store.write(Object.keys(REALM_WORKBOOKS).map((realmId, index) => ({
      organismId: `${realmId}-${index}`,
      realmId,
      commonNameEn: realmId,
      scientificName: `Species ${index}`,
      phylum: "other",
      className: "all",
      lifeState: "extant",
    })));

    assert.equal(store.read().length, 2);
    for (const filename of Object.values(REALM_WORKBOOKS)) {
      const path = join(databaseDir, filename);
      assert.equal(existsSync(path), true);
      const workbook = XLSX.read(readFileSync(path), { type: "buffer" });
      assert.deepEqual(workbook.SheetNames, ["Library"]);
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets.Library, { defval: "" });
      assert.equal(rows.length, 1);
      assert.equal(rows[0].encountered, false);
      assert.equal(rows[0].encounterDate, "");
    }
  } finally {
    rmSync(databaseDir, { recursive: true, force: true });
  }
});

test("existing unsupported Realm workbooks remain untouched", () => {
  const databaseDir = mkdtempSync(join(tmpdir(), "cozymuseum-legacy-store-"));
  try {
    for (const filename of ["sar.xlsx", "microverse.xlsx"]) writeFileSync(join(databaseDir, filename), `legacy ${filename}`);
    const store = createOrganismExcelStore({ databaseDir });
    store.initialize();
    store.write([{ organismId: "A00001", realmId: "animalia", scientificName: "Testus syntheticus" }]);
    assert.equal(store.read().length, 1);
    for (const filename of ["sar.xlsx", "microverse.xlsx"]) {
      assert.equal(readFileSync(join(databaseDir, filename), "utf8"), `legacy ${filename}`);
    }
  } finally {
    rmSync(databaseDir, { recursive: true, force: true });
  }
});

test("encounter completion stays on the organism row in its Realm workbook", () => {
  const databaseDir = mkdtempSync(join(tmpdir(), "cozymuseum-encounter-"));
  try {
    const store = createOrganismExcelStore({ databaseDir });
    store.write([{ organismId: "animalia-lion", realmId: "animalia", commonNameEn: "Lion", scientificName: "Panthera leo", phylum: "chordata", className: "mammalia", lifeState: "extant" }]);
    const catalog = createBiodiversityCatalog({ store, clock: () => new Date("2026-08-01T12:00:00+07:00") });

    catalog.completeEncounter("animalia-lion", { rarityScore: 8.5 });

    const workbook = XLSX.read(readFileSync(join(databaseDir, REALM_WORKBOOKS.animalia)), { type: "buffer" });
    const row = XLSX.utils.sheet_to_json(workbook.Sheets.Library, { defval: "" })[0];
    assert.equal(row.encountered, true);
    assert.equal(row.encounterDate, "2026-08-01");
    assert.equal(row.rarityScore, 8.5);
    assert.equal(existsSync(join(databaseDir, "hall-of-fame.xlsx")), false);
  } finally {
    rmSync(databaseDir, { recursive: true, force: true });
  }
});
