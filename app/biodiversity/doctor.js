import { isCanonicalScientificClass } from "./taxonomy.js";
import { imageRightsFailures } from "./media-rights.js";

const REQUIRED_IDENTITY = ["organismId", "realmId", "commonNameEn", "scientificName", "phylum", "lifeState"];

function countBy(rows, field) {
  return rows.reduce((counts, row) => {
    const value = String(row[field] || "(missing)");
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

export function inspectBiodiversityCatalog(rows = []) {
  const ids = rows.map((row) => String(row.organismId || ""));
  const duplicateIds = [...new Set(ids.filter((id, index) => id && ids.indexOf(id) !== index))];
  const identityFailures = rows
    .filter((row) => REQUIRED_IDENTITY.some((field) => !String(row[field] ?? "").trim()))
    .map((row) => row.organismId || row.scientificName || row.commonNameEn || "(unknown)");
  const invalidClassNames = rows
    .filter((row) => !isCanonicalScientificClass(row.className))
    .map((row) => ({ organismId: row.organismId || "(unknown)", className: String(row.className || "") }));
  const invalidImageRights = rows
    .map((row) => ({
      organismId: row.organismId || "(unknown)",
      failures: imageRightsFailures(row),
    }))
    .filter((item) => item.failures.length);
  return {
    ok: duplicateIds.length === 0
      && identityFailures.length === 0
      && invalidClassNames.length === 0
      && invalidImageRights.length === 0,
    total: rows.length,
    realms: countBy(rows, "realmId"),
    lifeStates: countBy(rows, "lifeState"),
    encountered: rows.filter((row) => row.encountered === true || String(row.encountered).toLowerCase() === "true").length,
    missing: {
      commonNameVi: rows.filter((row) => !row.commonNameVi).length,
      className: rows.filter((row) => !String(row.className || "").trim()).length,
      descriptionVi: rows.filter((row) => !row.descriptionVi).length,
      coverUrl: rows.filter((row) => !row.coverUrl).length,
      video: rows.filter((row) => !row.youtubeUrl && !row.youtubeId).length,
      imageProvenance: rows.filter((row) => !row.imageSourceUrl).length,
    },
    duplicateIds,
    identityFailures,
    invalidClassNames,
    invalidImageRights,
  };
}
