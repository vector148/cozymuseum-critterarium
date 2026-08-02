import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createBiodiversityCatalog } from "../../app/biodiversity/catalog.js";
import { createApp } from "../../server/app.js";

function testCatalog() {
  let rows = [{
    organismId: "animalia-panthera-leo",
    realmId: "animalia",
    commonNameEn: "Lion",
    commonNameVi: "Sư tử",
    scientificName: "Panthera leo",
    phylum: "chordata",
    className: "Mammalia",
    lifeState: "extant",
  }, {
    organismId: "sar-macrocystis-pyrifera",
    realmId: "sar",
    commonNameEn: "Giant kelp",
    commonNameVi: "Tảo bẹ khổng lồ",
    scientificName: "Macrocystis pyrifera",
    phylum: "stramenopiles",
    className: "Phaeophyceae",
    lifeState: "extant",
  }];
  return createBiodiversityCatalog({
    clock: () => new Date("2026-08-01T10:00:00+07:00"),
    store: {
      read: () => structuredClone(rows),
      write: (next) => {
        rows = structuredClone(next);
        return structuredClone(rows);
      },
    },
  });
}

test("atlas HTTP surface exposes metadata and filtered localized organisms", async (t) => {
  const server = createApp({ catalog: testCatalog() }).listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const metadataResponse = await fetch(`http://127.0.0.1:${port}/api/atlas/meta?locale=vi&wingId=fauna`);
  assert.equal(metadataResponse.status, 200);
  const metadata = await metadataResponse.json();
  assert.equal(metadata.categories[0].label, "Thú");

  const listResponse = await fetch(
    `http://127.0.0.1:${port}/api/atlas/organisms?wingId=fauna&classId=mammals&lifeState=extant&locale=vi`,
  );
  assert.equal(listResponse.status, 200);
  const list = await listResponse.json();
  assert.equal(list.total, 1);
  assert.equal(list.items[0].displayName, "Sư tử");

  const encounterResponse = await fetch(
    `http://127.0.0.1:${port}/api/atlas/organisms/animalia-panthera-leo/encounter`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rarityScore: 9 }),
    },
  );
  assert.equal(encounterResponse.status, 200);
  assert.equal((await encounterResponse.json()).encounterDate, "2026-08-01");

  const hallResponse = await fetch(
    `http://127.0.0.1:${port}/api/atlas/organisms?wingId=fauna&atlasMode=hall_of_fame&encounterYear=2026&locale=vi`,
  );
  const hall = await hallResponse.json();
  assert.equal(hall.total, 1);
  assert.equal(hall.items[0].rarityScore, 9);

  const rejectedEncounter = await fetch(
    `http://127.0.0.1:${port}/api/atlas/organisms/sar-macrocystis-pyrifera/encounter`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rarityScore: 1 }),
    },
  );
  assert.equal(rejectedEncounter.status, 400);
  assert.match((await rejectedEncounter.json()).message, /not supported for this Realm/);
});

test("local server never exposes a catalog image directory", async (t) => {
  const imagesDir = mkdtempSync(join(tmpdir(), "cozymuseum-images-"));
  mkdirSync(join(imagesDir, "species"));
  writeFileSync(join(imagesDir, "species", "private.txt"), "must stay private");
  const server = createApp({ catalog: testCatalog(), imagesDir }).listen(0);
  t.after(() => {
    server.close();
    rmSync(imagesDir, { recursive: true, force: true });
  });
  await new Promise((resolve) => server.once("listening", resolve));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/images/species/private.txt`);
  assert.equal(response.status, 404);
});
