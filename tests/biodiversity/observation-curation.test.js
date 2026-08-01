import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryStore } from "../../app/catalog/adapters/memory-store.js";
import { createGbifCandidateMatcher, curateLegacyObservationCandidates } from "../../app/biodiversity/observation-curation.js";

function candidate(overrides = {}) {
  return {
    candidateId: "legacy-observation-cypraea-tigris",
    candidateKind: "organism-candidate",
    sourceLine: 145,
    commonNameRaw: "Cowries (Ốc tiền)",
    scientificNameRaw: "Cypraea tigris",
    rawFamily: "Cypraeidae (Họ Ốc tiền)",
    rawOrder: "Littorinimorpha",
    rawClass: "Gastropoda",
    identityKey: "cypraea-tigris",
    duplicateOf: "",
    ...overrides,
  };
}

test("candidate curation separates source noise, de-duplicates the catalog, and previews an exact accepted taxon", async () => {
  const existing = {
    organismId: "animalia-panthera-leo",
    realmId: "animalia",
    commonNameEn: "Lion",
    alternateNames: "African lion",
    scientificName: "Panthera leo",
    phylum: "chordata",
    className: "Mammalia",
    lifeState: "extant",
  };
  const store = createMemoryStore([existing]);
  const manifest = {
    candidates: [
      candidate({ candidateId: "taxonomy-chordata", candidateKind: "taxonomy-reference", scientificNameRaw: "Chordata" }),
      candidate({ candidateId: "legacy-lion", commonNameRaw: "African lion", scientificNameRaw: "Panthera leo", identityKey: "panthera-leo" }),
      candidate({ candidateId: "legacy-lion-copy", scientificNameRaw: "Panthera leo", identityKey: "panthera-leo", duplicateOf: "legacy-lion" }),
      candidate(),
    ],
  };
  const matched = [];
  const matcher = async (item) => {
    matched.push(item.scientificNameRaw);
    return {
      accepted: true,
      matchType: "EXACT",
      status: "ACCEPTED",
      confidence: 0.99,
      authoritativeTaxonId: "GBIF:2303067",
      sourceUrl: "https://www.gbif.org/species/2303067",
      canonicalName: "Cypraea tigris",
      kingdom: "Animalia",
      phylum: "Mollusca",
      className: "Gastropoda",
      order: "Littorinimorpha",
      family: "Cypraeidae",
      genus: "Cypraea",
      species: "Cypraea tigris",
      rank: "SPECIES",
    };
  };

  const result = await curateLegacyObservationCandidates({ manifest, store, matcher });

  assert.deepEqual(matched, ["Cypraea tigris"]);
  assert.deepEqual(result.summary, {
    sourceCandidates: 4,
    uniqueOrganismCandidates: 2,
    taxonomyReferences: 1,
    manifestDuplicates: 1,
    scanned: 2,
    alreadyPresent: 1,
    proposed: 1,
    rejected: 0,
    written: 0,
  });
  assert.equal(store.read().length, 1, "preview must not write");
  assert.equal(result.proposals[0].row.organismId, "animalia-cypraea-tigris");
  assert.equal(result.proposals[0].row.commonNameEn, "Cowries");
  assert.equal(result.proposals[0].row.commonNameVi, "Ốc tiền");
  assert.equal(result.proposals[0].row.className, "Gastropoda");
  assert.equal(result.proposals[0].row.confidence, 0.99);
  assert.equal(result.proposals[0].row.provider, "gbif");
});

test("GBIF matcher exposes exact accepted identity and provenance through the curation seam", async () => {
  const calls = [];
  const matcher = createGbifCandidateMatcher({
    fetchImpl: async (url) => {
      calls.push(String(url));
      return {
        ok: true,
        json: async () => ({
          usageKey: 2303067,
          matchType: "EXACT",
          status: "ACCEPTED",
          confidence: 99,
          scientificName: "Cypraea tigris Linnaeus, 1758",
          canonicalName: "Cypraea tigris",
          kingdom: "Animalia",
          phylum: "Mollusca",
          class: "Gastropoda",
          order: "Littorinimorpha",
          family: "Cypraeidae",
          genus: "Cypraea",
          species: "Cypraea tigris",
          rank: "SPECIES",
        }),
      };
    },
  });

  const result = await matcher(candidate());

  assert.match(calls[0], /api\.gbif\.org\/v1\/species\/match/);
  assert.match(calls[0], /Cypraea(?:%20|\+)tigris/);
  assert.equal(result.accepted, true);
  assert.equal(result.className, "Gastropoda");
  assert.equal(result.authoritativeTaxonId, "GBIF:2303067");
  assert.equal(result.sourceUrl, "https://www.gbif.org/species/2303067");
  assert.equal(result.confidence, 0.99);
});

test("GBIF matcher resolves a missing Class from the accepted taxon record", async () => {
  const calls = [];
  const matcher = createGbifCandidateMatcher({
    fetchImpl: async (url) => {
      calls.push(String(url));
      if (String(url).endsWith("/2403157")) {
        return { ok: true, json: async () => ({ class: "Actinopterygii" }) };
      }
      return {
        ok: true,
        json: async () => ({
          usageKey: 2403157,
          matchType: "EXACT",
          status: "ACCEPTED",
          confidence: 99,
          canonicalName: "Heteroconger hassi",
          kingdom: "Animalia",
          phylum: "Chordata",
          order: "Anguilliformes",
          rank: "SPECIES",
        }),
      };
    },
  });

  const result = await matcher(candidate({ scientificNameRaw: "Heteroconger hassi" }));

  assert.equal(calls.length, 2);
  assert.equal(result.className, "Actinopterygii");
});

test("apply is rejected unless the caller supplies the matching preview digest", async () => {
  const store = createMemoryStore();
  const matcher = async () => ({
    accepted: true,
    matchType: "EXACT",
    status: "ACCEPTED",
    confidence: 0.99,
    authoritativeTaxonId: "GBIF:2303067",
    sourceUrl: "https://www.gbif.org/species/2303067",
    canonicalName: "Cypraea tigris",
    kingdom: "Animalia",
    phylum: "Mollusca",
    className: "Gastropoda",
    rank: "SPECIES",
  });

  await assert.rejects(
    () => curateLegacyObservationCandidates({ manifest: { candidates: [candidate()] }, store, matcher, apply: true }),
    /matching preview digest/i,
  );
  assert.equal(store.read().length, 0);
});

test("a preview-approved batch applies once and replays idempotently", async () => {
  const store = createMemoryStore();
  const manifest = { candidates: [candidate()] };
  const matcher = async () => ({
    accepted: true,
    matchType: "EXACT",
    status: "ACCEPTED",
    confidence: 0.99,
    authoritativeTaxonId: "GBIF:2303067",
    sourceUrl: "https://www.gbif.org/species/2303067",
    canonicalName: "Cypraea tigris",
    kingdom: "Animalia",
    phylum: "Mollusca",
    className: "Gastropoda",
    order: "Littorinimorpha",
    family: "Cypraeidae",
    genus: "Cypraea",
    species: "Cypraea tigris",
    rank: "SPECIES",
  });

  const preview = await curateLegacyObservationCandidates({ manifest, store, matcher });
  const applied = await curateLegacyObservationCandidates({
    manifest,
    store,
    matcher,
    apply: true,
    approvedPreviewDigest: preview.previewDigest,
  });
  const replayPreview = await curateLegacyObservationCandidates({ manifest, store, matcher });
  const replay = await curateLegacyObservationCandidates({
    manifest,
    store,
    matcher,
    apply: true,
    approvedPreviewDigest: replayPreview.previewDigest,
  });

  assert.equal(applied.summary.written, 1);
  assert.equal(store.read().length, 1);
  assert.equal(replayPreview.summary.alreadyPresent, 1);
  assert.equal(replay.summary.written, 0);
});

test("offset and limit select a bounded window from the unique organism queue", async () => {
  const first = candidate({ candidateId: "first", scientificNameRaw: "Cypraea tigris", identityKey: "cypraea-tigris" });
  const second = candidate({ candidateId: "second", scientificNameRaw: "Pieris rapae", identityKey: "pieris-rapae" });
  const matched = [];
  const matcher = async (item) => {
    matched.push(item.candidateId);
    return { accepted: false, matchType: "NONE", status: "", confidence: 0 };
  };

  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [first, second] },
    store: createMemoryStore(),
    matcher,
    offset: 1,
    limit: 1,
  });

  assert.deepEqual(matched, ["second"]);
  assert.equal(result.summary.scanned, 1);
});

test("ambiguous legacy scientific names are rejected before a provider call", async () => {
  let calls = 0;
  const ambiguous = candidate({
    candidateId: "legacy-lobster",
    scientificNameRaw: "Homarus americanus / gammarus",
    identityKey: "homarus-americanus-gammarus",
  });
  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [ambiguous] },
    store: createMemoryStore(),
    matcher: async () => {
      calls += 1;
      return { accepted: true, matchType: "EXACT", status: "ACCEPTED", confidence: 1 };
    },
  });

  assert.equal(calls, 0);
  assert.equal(result.summary.rejected, 1);
  assert.equal(result.rejections[0].reason, "ambiguous-scientific-name");
});

test("a provider failure stays in the rejection report and does not abort the batch", async () => {
  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [candidate()] },
    store: createMemoryStore(),
    matcher: async () => { throw new Error("network unavailable"); },
  });

  assert.equal(result.summary.rejected, 1);
  assert.deepEqual(result.rejections[0], {
    candidateId: "legacy-observation-cypraea-tigris",
    reason: "provider-error",
    confidence: 0,
    error: "network unavailable",
  });
});

test("Vietnamese-only legacy names stay in Vietnamese and fall back to the canonical name in English", async () => {
  const lotus = candidate({
    candidateId: "legacy-lotus",
    commonNameRaw: "Hoa sen",
    scientificNameRaw: "Nelumbo nucifera",
    identityKey: "nelumbo-nucifera",
  });
  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [lotus] },
    store: createMemoryStore(),
    matcher: async () => ({
      accepted: true,
      matchType: "EXACT",
      status: "ACCEPTED",
      confidence: 0.99,
      authoritativeTaxonId: "GBIF:2882413",
      canonicalName: "Nelumbo nucifera",
      kingdom: "Plantae",
      phylum: "Tracheophyta",
      className: "Magnoliopsida",
      rank: "SPECIES",
    }),
  });

  assert.equal(result.proposals[0].row.commonNameEn, "Nelumbo nucifera");
  assert.equal(result.proposals[0].row.commonNameVi, "Hoa sen");
});

test("a canonical legacy Class may fill a provider gap without storing the friendly suffix", async () => {
  const fish = candidate({
    candidateId: "legacy-blue-tang",
    commonNameRaw: "Blue tang (Cá đuôi gai xanh)",
    scientificNameRaw: "Paracanthurus hepatus",
    identityKey: "paracanthurus-hepatus",
    rawClass: "Actinopterygii (Lớp Cá vây tia)",
  });
  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [fish] },
    store: createMemoryStore(),
    matcher: async () => ({
      accepted: true,
      matchType: "EXACT",
      status: "ACCEPTED",
      confidence: 0.99,
      authoritativeTaxonId: "GBIF:2379534",
      canonicalName: "Paracanthurus hepatus",
      kingdom: "Animalia",
      phylum: "Chordata",
      className: "",
      rank: "SPECIES",
    }),
  });

  assert.equal(result.proposals[0].row.className, "Actinopterygii");
  assert.equal(result.proposals[0].row.classNameProvider, "legacy-observation");
  assert.match(result.proposals[0].row.provider, /legacy-observation/);
});

test("a fossil-block hint promotes an accepted candidate into Retired instead of Extant", async () => {
  const fossil = candidate({
    candidateId: "legacy-stegosaurus",
    commonNameRaw: "Stegosaurus",
    scientificNameRaw: "Stegosaurus stenops",
    identityKey: "stegosaurus-stenops",
    rawClass: "Reptilia",
    lifeStateHint: "extinct",
  });
  const result = await curateLegacyObservationCandidates({
    manifest: { candidates: [fossil] },
    store: createMemoryStore(),
    matcher: async () => ({
      accepted: true,
      matchType: "EXACT",
      status: "ACCEPTED",
      confidence: 0.99,
      authoritativeTaxonId: "GBIF:4824216",
      canonicalName: "Stegosaurus stenops",
      kingdom: "Animalia",
      phylum: "Chordata",
      className: "",
      rank: "SPECIES",
    }),
  });

  assert.equal(result.proposals[0].row.lifeState, "extinct");
});

test("preview digest changes when a write-relevant proposal field changes", async () => {
  const store = createMemoryStore();
  const matcher = async () => ({
    accepted: true,
    matchType: "EXACT",
    status: "ACCEPTED",
    confidence: 0.99,
    authoritativeTaxonId: "GBIF:4824216",
    canonicalName: "Stegosaurus stenops",
    kingdom: "Animalia",
    phylum: "Chordata",
    className: "Reptilia",
    rank: "SPECIES",
  });
  const extant = await curateLegacyObservationCandidates({
    manifest: { candidates: [candidate({ scientificNameRaw: "Stegosaurus stenops", identityKey: "stegosaurus-stenops" })] },
    store,
    matcher,
    clock: () => new Date("2026-08-01T00:00:00Z"),
  });
  const extinct = await curateLegacyObservationCandidates({
    manifest: { candidates: [candidate({ scientificNameRaw: "Stegosaurus stenops", identityKey: "stegosaurus-stenops", lifeStateHint: "extinct" })] },
    store,
    matcher,
    clock: () => new Date("2026-08-01T00:00:00Z"),
  });

  assert.notEqual(extant.previewDigest, extinct.previewDigest);
});
