import assert from "node:assert/strict";
import test from "node:test";

import { applyTaxonomyClassCorrections } from "../../app/biodiversity/taxonomy-corrections.js";

function memoryStore(seed) {
  let rows = structuredClone(seed);
  let writes = 0;
  return {
    read: () => structuredClone(rows),
    write: (next) => {
      writes += 1;
      rows = structuredClone(next);
    },
    snapshot: () => structuredClone(rows),
    writes: () => writes,
  };
}

const manifest = {
  reviewedAt: "2026-08-01",
  groups: [
    {
      className: "Actinopterygii",
      provider: "itis",
      confidence: 1,
      sourceUrl: "https://www.itis.gov/",
      rationale: "Canonical Class for ray-finned fishes",
      organismIds: ["animalia-clownfish"],
    },
    {
      className: "Chondrichthyes",
      provider: "itis",
      confidence: 1,
      sourceUrl: "https://www.itis.gov/",
      rationale: "Canonical Class for cartilaginous fishes",
      organismIds: ["animalia-shark"],
    },
  ],
};

test("taxonomy corrections preview without writes, apply through store, and replay idempotently", () => {
  const store = memoryStore([
    { organismId: "animalia-clownfish", realmId: "animalia", className: "pisces", untouched: "keep" },
    { organismId: "animalia-shark", realmId: "animalia", className: "Fishes", untouched: "keep" },
  ]);

  const preview = applyTaxonomyClassCorrections({ store, manifest });
  assert.equal(preview.summary.changed, 2);
  assert.equal(preview.summary.written, false);
  assert.equal(store.writes(), 0);

  const applied = applyTaxonomyClassCorrections({ store, manifest, apply: true });
  assert.equal(applied.summary.changed, 2);
  assert.equal(applied.summary.written, true);
  assert.equal(store.writes(), 1);
  assert.deepEqual(store.snapshot().map((item) => [item.className, item.untouched]), [
    ["Actinopterygii", "keep"],
    ["Chondrichthyes", "keep"],
  ]);
  assert.equal(store.snapshot()[0].taxonomyClassProvider, "itis");
  assert.equal(store.snapshot()[0].taxonomyClassReviewedAt, "2026-08-01");

  const replay = applyTaxonomyClassCorrections({ store, manifest, apply: true });
  assert.equal(replay.summary.changed, 0);
  assert.equal(replay.summary.written, false);
  assert.equal(store.writes(), 1);
});

test("taxonomy corrections reject friendly aliases as canonical Class values", () => {
  const store = memoryStore([{ organismId: "animalia-shark", realmId: "animalia", className: "Fishes" }]);
  const invalid = { ...manifest, groups: [{ ...manifest.groups[0], className: "Fishes", organismIds: ["animalia-shark"] }] };

  assert.throws(() => applyTaxonomyClassCorrections({ store, manifest: invalid }), /canonical scientific Class/);
  assert.equal(store.writes(), 0);
});
