import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as XLSX from "xlsx";

import { LEGACY_COMMON_NAMES_VI } from "./legacy-translations.js";
import { imageRightsFailures, normalizeRightsFreeLicense } from "./media-rights.js";

const REALM_FILES = Object.freeze([
  { filename: "dong_vat.xlsx", realmId: "animalia" },
  { filename: "thuc_vat.xlsx", realmId: "plantae_fungi" },
  { filename: "sar.xlsx", realmId: "sar" },
  { filename: "sieu_vi.xlsx", realmId: "microverse" },
]);

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function slug(value) {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function canonicalLegacyClass(value, scientificName) {
  const legacyKey = slug(value);
  if (!legacyKey || ["all", "unknown", "unresolved"].includes(legacyKey)) return "";
  if (legacyKey === "pisces") {
    return /carcharodon|carcharocles|otodus|shark/i.test(scientificName)
      ? "Chondrichthyes"
      : "Actinopterygii";
  }
  const known = {
    mammalia: "Mammalia", aves: "Aves", reptilia: "Reptilia", amphibia: "Amphibia",
    insecta: "Insecta", arachnida: "Arachnida", crustacea: "Malacostraca",
    cephalopoda: "Cephalopoda", dinocaridida: "Dinocaridida", trilobita: "Trilobita",
    lycopodiopsida: "Lycopodiopsida", glossopteridopsida: "Glossopteridopsida",
    magnoliopsida: "Magnoliopsida", pinopsida: "Pinopsida", ginkgoopsida: "Ginkgoopsida",
    polypodiopsida: "Polypodiopsida", agaricomycetes: "Agaricomycetes",
  };
  return known[legacyKey] || clean(value);
}

function recordFromLegacy(row, realmId, sourceFilename) {
  const commonNameEn = clean(row.title) || clean(row.original_title);
  const scientificName = clean(row.original_title) || commonNameEn;
  const lifeState = clean(row.lifeState || row.life_state).toLowerCase() === "extinct"
    ? "extinct"
    : "extant";
  const image = {
    coverUrl: clean(row.cover),
    imageSourceUrl: clean(row.imageSourceUrl || row.image_source_url || row.source),
    imageLicense: normalizeRightsFreeLicense(row.imageLicense || row.image_license),
    imageLicenseUrl: clean(row.imageLicenseUrl || row.image_license_url),
    imageRightsStatus: clean(row.imageRightsStatus || row.image_rights_status),
    imageRetrievedAt: clean(row.imageRetrievedAt || row.image_retrieved_at),
  };
  const acceptedImage = imageRightsFailures(image).length
    ? Object.fromEntries(Object.keys(image).map((field) => [field, ""]))
    : image;
  return {
    organismId: `${realmId}-${slug(scientificName || commonNameEn)}`,
    realmId,
    commonNameEn,
    commonNameVi: LEGACY_COMMON_NAMES_VI[commonNameEn] ?? "",
    scientificName,
    alternateNames: "",
    domain: "",
    kingdom: "",
    phylum: slug(row.phylum) || "other",
    className: canonicalLegacyClass(row.class, scientificName),
    order: clean(row.order),
    family: clean(row.family),
    genus: clean(row.genus),
    species: clean(row.species),
    lifeState,
    extinctionYear: clean(row.extinctionYear || row.extinction_year),
    geologicalPeriod: clean(row.geologicalPeriod || row.geological_period),
    iucnStatus: clean(row.iucnStatus || row.iucn_status),
    populationTrend: clean(row.populationTrend || row.population_trend),
    descriptionEn: clean(row.subcategory || row.description),
    descriptionVi: clean(row.descriptionVi || row.description_vi),
    habitatEn: clean(row.habitat),
    habitatVi: clean(row.habitatVi || row.habitat_vi),
    distributionEn: clean(row.distribution),
    distributionVi: clean(row.distributionVi || row.distribution_vi),
    dietEn: clean(row.diet),
    dietVi: clean(row.dietVi || row.diet_vi),
    size: clean(row.size),
    lifespan: clean(row.lifespan),
    ...acceptedImage,
    youtubeUrl: clean(row.youtubeUrl || row.trailerUrl || row.trailer_url),
    youtubeId: clean(row.youtubeId || row.youtube_id),
    videoTitle: clean(row.videoTitle || row.video_title),
    videoQualityHint: clean(row.videoQualityHint || row.video_quality_hint),
    sourceUrls: clean(row.source),
    provider: "legacy-cozymuseum",
    fetchedAt: "",
    confidence: 0.7,
    importBatch: `legacy:${sourceFilename}`,
    schemaVersion: 1,
  };
}

function readFirstSheet(path) {
  const workbook = XLSX.read(readFileSync(path), { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return sheet ? XLSX.utils.sheet_to_json(sheet, { defval: "" }) : [];
}

function mergeMissingLegacyFields(current, candidate) {
  const merged = structuredClone(current);
  for (const [field, value] of Object.entries(candidate)) {
    const currentValue = merged[field];
    const isMissing = currentValue === undefined || currentValue === null || clean(currentValue) === "";
    if (isMissing && value !== undefined && value !== null && clean(value) !== "") merged[field] = value;
  }
  return merged;
}

export function migrateLegacyCozyMuseum({ sourceDatabaseDir, store } = {}) {
  if (!sourceDatabaseDir) throw new TypeError("Legacy migration requires sourceDatabaseDir");
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") {
    throw new TypeError("Legacy migration requires a store with read and write");
  }

  const current = store.read() ?? [];
  const next = structuredClone(current);
  const summary = { input: 0, inserted: 0, updated: 0, unchanged: 0, failed: 0 };
  const failures = [];

  for (const realm of REALM_FILES) {
    const path = join(sourceDatabaseDir, realm.filename);
    if (!existsSync(path)) {
      failures.push({ filename: realm.filename, message: "Workbook not found" });
      summary.failed += 1;
      continue;
    }
    for (const row of readFirstSheet(path)) {
      summary.input += 1;
      try {
        const candidate = recordFromLegacy(row, realm.realmId, realm.filename);
        if (!candidate.commonNameEn || !candidate.scientificName) throw new Error("Missing organism identity");
        const index = next.findIndex((item) => item.organismId === candidate.organismId);
        if (index < 0) {
          next.push(candidate);
          summary.inserted += 1;
        } else {
          const merged = mergeMissingLegacyFields(next[index], candidate);
          if (JSON.stringify(next[index]) === JSON.stringify(merged)) {
            summary.unchanged += 1;
          } else {
            next[index] = merged;
            summary.updated += 1;
          }
        }
      } catch (error) {
        summary.failed += 1;
        failures.push({
          filename: realm.filename,
          title: clean(row.title),
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  if (summary.inserted || summary.updated) store.write(next);
  return { rows: next, summary, failures };
}

export { REALM_FILES };
