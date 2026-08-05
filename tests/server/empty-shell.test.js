import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { createBiodiversityCatalog } from "../../app/biodiversity/catalog.js";

test("clean shell boots with an empty catalog and initializes user data outside the repository", async (t) => {
  const dataDir = mkdtempSync(join(tmpdir(), "cozymuseum-empty-shell-"));
  const sourceDatabase = resolve("database");
  const previousDataDir = process.env.COZYMUSEUM_DATA_DIR;
  process.env.COZYMUSEUM_DATA_DIR = dataDir;

  t.after(() => {
    if (previousDataDir === undefined) delete process.env.COZYMUSEUM_DATA_DIR;
    else process.env.COZYMUSEUM_DATA_DIR = previousDataDir;
    rmSync(dataDir, { recursive: true, force: true });
  });

  const { createApp } = await import(`../../server/app.js?empty-shell=${Date.now()}`);
  const server = createApp().listen(0);
  t.after(() => server.close());
  await new Promise((resolveListening) => server.once("listening", resolveListening));

  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms?wingId=fauna&locale=en`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).total, 0);

  const createResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      realmId: "animalia",
      scientificName: "Testus syntheticus",
      commonNameEn: "First specimen",
      className: "Mammalia",
      lifeState: "extant",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.organismId, "A00001");

  const savedResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms?wingId=fauna&locale=en`);
  assert.equal((await savedResponse.json()).total, 1);

  const updateResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms/A00001`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commonNameEn: "Updated specimen" }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).commonNameEn, "Updated specimen");

  const { createOrganismExcelStore } = await import("../../app/biodiversity/store.js");
  const restartedStore = createOrganismExcelStore({ databaseDir: dataDir });
  const restartedCatalog = createBiodiversityCatalog({ store: restartedStore });
  assert.equal(restartedCatalog.list({ wingId: "fauna", locale: "en" }).total, 1);
  assert.equal(restartedCatalog.get("A00001", { locale: "en" }).displayName, "Updated specimen");

  const detailResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms/A00001?locale=en`);
  assert.equal(detailResponse.status, 200);
  assert.equal((await detailResponse.json()).displayName, "Updated specimen");

  const deleteResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms/A00001`, { method: "DELETE" });
  assert.equal(deleteResponse.status, 204);
  const emptyAgain = await fetch(`http://127.0.0.1:${server.address().port}/api/atlas/organisms?wingId=fauna&locale=en`);
  assert.equal((await emptyAgain.json()).total, 0);

  for (const filename of ["animalia.xlsx", "plantae-fungi.xlsx", "sar.xlsx", "microverse.xlsx"]) {
    assert.equal(existsSync(join(dataDir, filename)), true, `${filename} should be initialized in user data`);
  }
  assert.notEqual(resolve(dataDir), sourceDatabase);
});
