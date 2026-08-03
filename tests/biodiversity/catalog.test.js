import assert from "node:assert/strict";
import test from "node:test";

import { createBiodiversityCatalog } from "../../app/biodiversity/catalog.js";

function memoryStore(seed) {
  let rows = structuredClone(seed);
  return {
    read: () => structuredClone(rows),
    write: (next) => {
      rows = structuredClone(next);
      return structuredClone(rows);
    },
  };
}

test("catalog intersects wing, atlas mode, class, localized query, and locale", () => {
  const catalog = createBiodiversityCatalog({
    store: memoryStore([
      {
        organismId: "animalia-panthera-leo",
        realmId: "animalia",
        commonNameEn: "Lion",
        commonNameVi: "Sư tử",
        scientificName: "Panthera leo",
        phylum: "chordata",
        className: "Mammalia",
        lifeState: "extant",
      },
      {
        organismId: "animalia-aenocyon-dirus",
        realmId: "animalia",
        commonNameEn: "Dire wolf",
        commonNameVi: "Sói khủng khiếp",
        scientificName: "Aenocyon dirus",
        phylum: "chordata",
        className: "Mammalia",
        lifeState: "extinct",
      },
      {
        organismId: "plantae-helianthus-annuus",
        realmId: "plantae_fungi",
        commonNameEn: "Sunflower",
        commonNameVi: "Hướng dương",
        scientificName: "Helianthus annuus",
        phylum: "angiosperms",
        className: "Magnoliopsida",
        lifeState: "extant",
      },
    ]),
  });

  const result = catalog.list({
    wingId: "fossils",
    classId: "mammals",
    atlasMode: "retired",
    query: "sói",
    locale: "vi",
  });

  assert.equal(result.total, 1);
  assert.equal(result.items[0].organismId, "animalia-aenocyon-dirus");
  assert.equal(result.items[0].displayName, "Sói khủng khiếp");
  assert.equal(result.locale, "vi");
});

test("encounter completion auto-stamps today and Hall of Fame filters by year", () => {
  const catalog = createBiodiversityCatalog({
    clock: () => new Date("2026-08-01T09:54:00+07:00"),
    store: memoryStore([{
      organismId: "animalia-panthera-leo",
      realmId: "animalia",
      commonNameEn: "Lion",
      commonNameVi: "Sư tử",
      scientificName: "Panthera leo",
      phylum: "chordata",
      className: "Mammalia",
      lifeState: "extant",
      encountered: false,
      encounterDate: "",
      rarityScore: "",
    }]),
  });

  const completed = catalog.completeEncounter("animalia-panthera-leo", { rarityScore: 8.5 });
  assert.equal(completed.encountered, true);
  assert.equal(completed.encounterDate, "2026-08-01");
  assert.equal(completed.rarityScore, 8.5);
  assert.equal(catalog.list({ atlasMode: "hall_of_fame", encounterYear: "2026" }).total, 1);
  assert.equal(catalog.list({ atlasMode: "hall_of_fame", encounterYear: "2025" }).total, 0);

  const undone = catalog.undoEncounter("animalia-panthera-leo");
  assert.equal(undone.encountered, false);
  assert.equal(undone.encounterDate, "");
  assert.equal(catalog.list({ atlasMode: "hall_of_fame" }).total, 0);
});

test("catalog metadata exposes categories and derives counts from records", () => {
  const catalog = createBiodiversityCatalog({
    store: memoryStore([
      {
        organismId: "animalia-panthera-leo",
        realmId: "animalia",
        commonNameEn: "Lion",
        scientificName: "Panthera leo",
        phylum: "chordata",
        className: "Mammalia",
        lifeState: "extant",
      },
      {
        organismId: "animalia-aenocyon-dirus",
        realmId: "animalia",
        commonNameEn: "Dire wolf",
        scientificName: "Aenocyon dirus",
        phylum: "chordata",
        className: "Mammalia",
        lifeState: "extinct",
      },
    ]),
  });

  const metadata = catalog.metadata({ locale: "vi", atlasMode: "living", wingId: "fauna" });

  assert.deepEqual(
    metadata.categories.map((c) => c.id),
    ["mammals"],
  );
  assert.equal(metadata.categories[0].label, "Thú");
  assert.equal(metadata.categories[0].count, 1);

  const retiredMetadata = catalog.metadata({ locale: "vi", atlasMode: "retired", wingId: "fossils" });
  assert.equal(retiredMetadata.categories[0].count, 1);
});

test("friendly Class labels remain one-to-one with canonical scientific Class values", () => {
  const catalog = createBiodiversityCatalog({
    store: memoryStore([
      {
        organismId: "animalia-clownfish",
        realmId: "animalia",
        commonNameEn: "Clownfish",
        commonNameVi: "Cá hề",
        scientificName: "Amphiprioninae",
        phylum: "chordata",
        className: "Actinopterygii",
        lifeState: "extant",
      },
      {
        organismId: "animalia-great-white-shark",
        realmId: "animalia",
        commonNameEn: "Great white shark",
        commonNameVi: "Cá mập trắng lớn",
        scientificName: "Carcharodon carcharias",
        phylum: "chordata",
        className: "Chondrichthyes",
        lifeState: "extant",
      },
    ]),
  });

  const metadata = catalog.metadata({ locale: "en", wingId: "aquarium" });
  const classes = metadata.categories;
  assert.deepEqual(classes.map(({ id, label }) => ({ id, label })), [
    { id: "fishes", label: "Fishes" },
    { id: "sharks_rays", label: "Sharks" },
  ]);

  const sharkEn = catalog.get("animalia-great-white-shark", { locale: "en" });
  const sharkVi = catalog.get("animalia-great-white-shark", { locale: "vi" });
  assert.equal(sharkEn.className, "Chondrichthyes");
  assert.equal(sharkEn.displayClass, "Cartilaginous fishes");
  assert.equal(sharkVi.className, "Chondrichthyes");
  assert.equal(sharkVi.displayClass, "Cá sụn");
});

test("encounter policy allows observable Realms and rejects SAR and Microverse", () => {
  const catalog = createBiodiversityCatalog({
    store: memoryStore([
      { organismId: "animalia-lion", realmId: "animalia", commonNameEn: "Lion", scientificName: "Panthera leo", phylum: "chordata", className: "Mammalia", lifeState: "extant" },
      { organismId: "plantae-sunflower", realmId: "plantae_fungi", commonNameEn: "Sunflower", scientificName: "Helianthus annuus", phylum: "angiosperms", className: "Magnoliopsida", lifeState: "extant" },
      { organismId: "sar-kelp", realmId: "sar", commonNameEn: "Giant kelp", scientificName: "Macrocystis pyrifera", phylum: "stramenopiles", className: "Phaeophyceae", lifeState: "extant" },
      { organismId: "microverse-ecoli", realmId: "microverse", commonNameEn: "E. coli", scientificName: "Escherichia coli", phylum: "bacteria", className: "Gammaproteobacteria", lifeState: "extant" },
    ]),
  });

  assert.equal(catalog.list({ wingId: "all", atlasMode: "hall_of_fame" }).total, 0);
});
