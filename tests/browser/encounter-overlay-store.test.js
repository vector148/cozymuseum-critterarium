import assert from "node:assert/strict";
import test from "node:test";

import { createEncounterOverlayStore } from "../../resources/js/data/encounter-overlay-store.js";

function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    value: (key) => values.get(key),
  };
}

test("browser store persists only the personal encounter overlay", () => {
  const key = "cozymuseum.encounters.v1";
  const storage = fakeStorage();
  const seed = [{
    organismId: "animalia-panthera-leo",
    commonNameEn: "Lion",
    encountered: false,
    encounterDate: "",
    rarityScore: "",
  }];
  const store = createEncounterOverlayStore(seed, { storage, storageKey: key });

  store.write([{ ...seed[0], encountered: true, encounterDate: "2026-08-01", rarityScore: 8.5 }]);

  assert.deepEqual(JSON.parse(storage.value(key)), {
    "animalia-panthera-leo": { encountered: true, encounterDate: "2026-08-01", rarityScore: 8.5 },
  });
  assert.equal(seed[0].encountered, false);

  const reloaded = createEncounterOverlayStore(seed, { storage, storageKey: key });
  assert.equal(reloaded.read()[0].encountered, true);
  assert.equal(reloaded.read()[0].rarityScore, 8.5);

  reloaded.write(seed);
  assert.deepEqual(JSON.parse(storage.value(key)), {});
});

test("browser store fails safely when storage is unavailable", () => {
  const brokenStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  };
  const store = createEncounterOverlayStore([{ organismId: "one", encountered: false }], { storage: brokenStorage });
  store.write([{ organismId: "one", encountered: true, encounterDate: "2026-08-01", rarityScore: 4 }]);
  assert.equal(store.read()[0].encountered, true);
});

