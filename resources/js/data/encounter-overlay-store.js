const DEFAULT_STORAGE_KEY = "cozymuseum.encounters.v1";

function clone(value) {
  return structuredClone(value);
}

function safeParse(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function readOverlay(storage, storageKey) {
  try {
    return safeParse(storage?.getItem(storageKey));
  } catch {
    return {};
  }
}

export function createEncounterOverlayStore(seed = [], {
  storage = globalThis.localStorage,
  storageKey = DEFAULT_STORAGE_KEY,
} = {}) {
  if (!Array.isArray(seed)) throw new TypeError("Encounter store seed must be an array");
  const baseline = clone(seed);
  const baselineById = new Map(baseline.map((row) => [row.organismId, row]));
  let overlay = readOverlay(storage, storageKey);

  function rows() {
    return baseline.map((row) => ({ ...row, ...(overlay[row.organismId] || {}) }));
  }

  return Object.freeze({
    read() {
      return clone(rows());
    },

    write(nextRows) {
      if (!Array.isArray(nextRows)) throw new TypeError("Catalog rows must be an array");
      overlay = Object.fromEntries(nextRows
        .filter((row) => {
          const original = baselineById.get(row?.organismId) || {};
          return row?.organismId && (
            Boolean(row.encountered) !== Boolean(original.encountered)
            || String(row.encounterDate || "") !== String(original.encounterDate || "")
            || String(row.rarityScore ?? "") !== String(original.rarityScore ?? "")
          );
        })
        .map((row) => [row.organismId, {
          encountered: Boolean(row.encountered),
          encounterDate: String(row.encounterDate || ""),
          rarityScore: row.rarityScore === "" ? "" : Number(row.rarityScore),
        }]));
      try {
        storage?.setItem(storageKey, JSON.stringify(overlay));
      } catch {
        // Browser privacy settings may block storage; the session overlay still works.
      }
      return clone(rows());
    },
  });
}
