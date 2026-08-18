import assert from "node:assert/strict";
import test from "node:test";

import { createOrganismIntake } from "../../app/Modules/Critterarium/Application/Ingestion/organism-intake.js";

test("organism intake previews a doctor-clean, media-ready scientific record without writing", async () => {
  let rows = [];
  let writes = 0;
  const store = {
    read: () => structuredClone(rows),
    write: (next) => {
      writes += 1;
      rows = structuredClone(next);
    },
  };
  const enricher = {
    enrich: async () => ({
      row: {
        scientificName: "Panthera leo",
        commonNameEn: "Lion",
        commonNameVi: "Sư tử",
        kingdom: "Animalia",
        phylum: "chordata",
        className: "Mammalia",
        order: "Carnivora",
        family: "Felidae",
        genus: "Panthera",
        species: "Panthera leo",
        coverUrl: "https://upload.wikimedia.org/lion.jpg",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
        imageLicense: "CC0",
        imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        imageRightsStatus: "rights-free",
        imageRetrievedAt: "2026-08-01",
        imageWidth: 2560,
        imageHeight: 1440,
        imageQualityHint: "Full HD",
        youtubeUrl: "https://www.youtube.com/watch?v=wildlion4k",
        youtubeId: "wildlion4k",
        videoTitle: "Lions in the wild 4K",
        videoQualityHint: "4K",
        sourceUrls: "https://www.gbif.org/species/5219404",
        provider: "gbif | wikipedia-en | youtube",
        authoritativeTaxonId: "GBIF:5219404",
        rank: "SPECIES",
        confidence: 0.99,
      },
      changes: [],
      confidence: 0.99,
      errors: [],
    }),
  };

  const intake = createOrganismIntake({ store, enricher, clock: () => new Date("2026-08-01T04:00:00.000Z") });
  const result = await intake.add([{ name: "Lion" }]);

  assert.equal(writes, 0);
  assert.deepEqual(result.summary, { received: 1, ready: 1, duplicate: 0, rejected: 0, failed: 0, written: 0 });
  assert.equal(result.items[0].status, "ready");
  assert.equal(result.items[0].row.organismId, "A00001");
  assert.equal(result.items[0].row.realmId, "animalia");
  assert.equal(result.items[0].row.lifeState, "extant");
  assert.equal(result.items[0].row.encountered, false);
  assert.equal(result.items[0].row.fetchedAt, "2026-08-01T04:00:00.000Z");
});

test("organism intake applies a ready row once and blocks its exact duplicate before enrichment", async () => {
  let rows = [];
  let writes = 0;
  let enrichments = 0;
  const store = {
    read: () => structuredClone(rows),
    write: (next) => {
      writes += 1;
      rows = structuredClone(next);
    },
  };
  const intake = createOrganismIntake({
    store,
    enricher: {
      enrich: async () => {
        enrichments += 1;
        return {
          row: {
            scientificName: "Panthera tigris",
            commonNameEn: "Tiger",
            kingdom: "Animalia",
            phylum: "chordata",
            className: "Mammalia",
            coverUrl: "https://upload.wikimedia.org/tiger.jpg",
            imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Tiger.jpg",
            imageLicense: "Public Domain",
            imageLicenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
            imageRightsStatus: "rights-free",
            imageRetrievedAt: "2026-08-01",
            imageQualityHint: "Full HD",
            youtubeUrl: "https://www.youtube.com/watch?v=wildtiger4k",
            youtubeId: "wildtiger4k",
            videoQualityHint: "4K",
            confidence: 0.99,
            authoritativeTaxonId: "GBIF:5219405",
          },
          changes: [],
          confidence: 0.99,
          errors: [],
        };
      },
    },
  });

  const applied = await intake.add([{ name: "Tiger" }], { apply: true });
  const replay = await intake.add([{ name: "Tiger" }], { apply: true });

  assert.equal(applied.summary.written, 1);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].organismId, "A00001");
  assert.equal(rows[0].encountered, false);
  assert.equal(replay.summary.duplicate, 1);
  assert.equal(writes, 1);
  assert.equal(enrichments, 1);
});
