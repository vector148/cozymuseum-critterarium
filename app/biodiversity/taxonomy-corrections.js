import { isCanonicalScientificClass } from "./taxonomy.js";

function clean(value) {
  return String(value ?? "").trim();
}

function expandManifest(manifest) {
  if (!manifest || !Array.isArray(manifest.groups)) throw new TypeError("Taxonomy correction manifest requires groups");
  return manifest.groups.flatMap((group) => {
    const className = clean(group.className);
    if (!isCanonicalScientificClass(className)) {
      throw new TypeError(`${className || "(empty)"} is not a canonical scientific Class`);
    }
    if (!Array.isArray(group.organismIds) || !group.organismIds.length) {
      throw new TypeError(`Taxonomy correction group ${className || "(unresolved)"} requires organismIds`);
    }
    return group.organismIds.map((organismId) => ({
      organismId: clean(organismId),
      className,
      taxonomyClassProvider: clean(group.provider),
      taxonomyClassConfidence: Number(group.confidence),
      taxonomyClassSourceUrl: clean(group.sourceUrl),
      taxonomyClassRationale: clean(group.rationale),
      taxonomyClassReviewedAt: clean(manifest.reviewedAt),
    }));
  });
}

function differs(row, patch) {
  return Object.entries(patch).some(([field, value]) => row[field] !== value);
}

export function applyTaxonomyClassCorrections({ store, manifest, apply = false } = {}) {
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") {
    throw new TypeError("Taxonomy corrections require a store with read and write");
  }
  const corrections = expandManifest(manifest);
  const rows = store.read() ?? [];
  const indexById = new Map(rows.map((row, index) => [clean(row.organismId), index]));
  const report = [];
  let changed = 0;
  let unchanged = 0;
  let missing = 0;

  for (const correction of corrections) {
    const index = indexById.get(correction.organismId);
    if (index === undefined) {
      missing += 1;
      report.push({ organismId: correction.organismId, status: "missing" });
      continue;
    }
    const { organismId, ...patch } = correction;
    if (!differs(rows[index], patch)) {
      unchanged += 1;
      report.push({ organismId, status: "unchanged", className: patch.className });
      continue;
    }
    changed += 1;
    rows[index] = { ...rows[index], ...patch };
    report.push({ organismId, status: "changed", className: patch.className });
  }

  const written = Boolean(apply && changed);
  if (written) store.write(rows);
  return {
    summary: { selected: corrections.length, changed, unchanged, missing, written },
    report,
  };
}
