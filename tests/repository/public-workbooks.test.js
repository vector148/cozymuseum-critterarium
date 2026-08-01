import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { organismStore } from "../../app/biodiversity/runtime.js";
import { REALM_WORKBOOKS } from "../../app/biodiversity/store.js";

const root = resolve(import.meta.dirname, "../..");

test("the public clone ships four sanitized source workbooks matching the showroom snapshot", () => {
  const filenames = Object.values(REALM_WORKBOOKS).sort();
  assert.deepEqual(filenames, ["animalia.xlsx", "microverse.xlsx", "plantae-fungi.xlsx", "sar.xlsx"]);
  for (const filename of filenames) {
    assert.equal(existsSync(resolve(root, "database", filename)), true, `${filename} must ship with the clone`);
  }

  const gitignore = readFileSync(resolve(root, ".gitignore"), "utf8");
  assert.equal(/^database\/\*\.xlsx$/m.test(gitignore), false, "public source workbooks must not be Git-ignored");
  const vercelignore = readFileSync(resolve(root, ".vercelignore"), "utf8");
  assert.match(vercelignore, /^database\/\*\.xlsx$/m, "Vercel should deploy the equivalent static seed, not duplicate raw workbooks");

  const workbookRows = organismStore.read();
  const snapshotRows = JSON.parse(readFileSync(resolve(root, "database/seeds/catalog.json"), "utf8"));
  const ids = (rows) => rows.map((row) => row.organismId).sort();
  assert.deepEqual(ids(workbookRows), ids(snapshotRows), "workbooks and showroom snapshot must contain the same organisms");
  for (const row of workbookRows) {
    assert.equal(Boolean(row.encountered), false, `${row.organismId} must not ship encountered state`);
    assert.equal(String(row.encounterDate || ""), "", `${row.organismId} must not ship an encounter date`);
    assert.equal(String(row.rarityScore || ""), "", `${row.organismId} must not ship a personal rarity score`);
  }
});
