import assert from "node:assert/strict";
import test from "node:test";

import { syncSeedOrganisms } from "../../app/biodiversity/seeds.js";

test("retired seed sync is additive and idempotent", () => {
  let rows = [{ organismId: "manual", commonNameEn: "Keep me" }];
  const store = { read: () => structuredClone(rows), write: (next) => { rows = structuredClone(next); } };
  const seeds = [{ organismId: "animalia-dodo", realmId: "animalia", commonNameEn: "Dodo", scientificName: "Raphus cucullatus", phylum: "chordata", className: "Aves", lifeState: "extinct" }];

  const first = syncSeedOrganisms({ store, seeds });
  const second = syncSeedOrganisms({ store, seeds });

  assert.deepEqual(first, { inserted: 1, unchanged: 0 });
  assert.deepEqual(second, { inserted: 0, unchanged: 1 });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].organismId, "manual");
});
