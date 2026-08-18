export const ORGANISM_WORKBOOK_COLUMNS = Object.freeze([
  "organismId",
  "scientificName",
  "commonNameEn",
  "commonNameVi",
  "descriptionEn",
  "descriptionVi",
  "encountered",
  "encounterDate",
  "rarityScore",
  "isDangerous",
  "coverUrl",
  "imageSourceUrl",
  "imageLicense",
  "youtubeUrl",
  "youtubeId",
  "videoTitle",
  "videoQualityHint",
  "sourceUrls",
  "provider",
  "fetchedAt",
  "lifeState",
  "domain",
  "kingdom",
  "phylum",
  "className",
  "order",
  "family",
  "genus",
  "importBatch",
  "schemaVersion",
  "taxonomyClassProvider",
  "taxonomyClassConfidence",
  "taxonomyClassSourceUrl",
  "taxonomyClassRationale",
  "taxonomyClassReviewedAt",
  "rank",
  "authoritativeTaxonId",
  "legacySourceLine",
  "imageWidth",
  "imageHeight",
  "imageQualityHint",
  "imageLicenseUrl",
  "imageRightsStatus",
  "imageRetrievedAt",
]);

export const REALM_ID_PREFIXES = Object.freeze({
  animalia: "A",
  plantae_fungi: "P",
  sar: "S",
  microverse: "M",
});

export const ORGANISM_ID_PATTERN = /^[APSM]\d{5}$/;

function text(value) {
  return String(value ?? "").trim();
}

function boolean(value) {
  return value === true || text(value).toLowerCase() === "true";
}


export function canonicalWorkbookRow(source = {}) {
  const normalized = {
    ...source,
    descriptionEn: text(source.descriptionEn) || text(source.description),
    taxonomyClassProvider: text(source.taxonomyClassProvider) || text(source.classNameProvider),
    encountered: boolean(source.encountered),
    encounterDate: text(source.encounterDate),
    rarityScore: source.rarityScore ?? "",
    isDangerous: boolean(source.isDangerous),
    schemaVersion: 2,
  };

  return Object.fromEntries(ORGANISM_WORKBOOK_COLUMNS.map((column) => [column, normalized[column] ?? ""]));
}

export function runtimeOrganismRow(source = {}, realmId) {
  return {
    ...canonicalWorkbookRow(source),
    realmId,
  };
}

export function isOrganismIdForRealm(organismId, realmId) {
  const prefix = REALM_ID_PREFIXES[realmId];
  return Boolean(prefix && new RegExp(`^${prefix}\\d{5}$`).test(text(organismId)));
}

export function nextOrganismId(rows, realmId) {
  const prefix = REALM_ID_PREFIXES[realmId];
  if (!prefix) throw new Error(`Unknown CozyMuseum Realm: ${String(realmId)}`);

  const highest = (rows || []).reduce((maximum, row) => {
    const identifier = text(row?.organismId);
    if (!isOrganismIdForRealm(identifier, realmId)) return maximum;
    return Math.max(maximum, Number(identifier.slice(1)));
  }, 0);

  if (highest >= 99999) throw new Error(`Organism ID capacity exhausted for ${realmId}`);
  return `${prefix}${String(highest + 1).padStart(5, "0")}`;
}
