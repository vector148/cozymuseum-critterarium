import { hasRightsFreeImage } from "./media-rights.js";
import { allocateOrganismId } from "./organism-id.js";
import { REALMS, isCanonicalScientificClass } from "./taxonomy.js";

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function key(value) {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validRealm(value) {
  const realmId = key(value).replace(/-/g, "_");
  return REALMS.some((realm) => realm.id === realmId) ? realmId : "";
}

function inferRealm(kingdom) {
  const normalized = key(kingdom);
  if (normalized === "animalia") return "animalia";
  if (["plantae", "fungi"].includes(normalized)) return "plantae_fungi";
  if (["bacteria", "archaea", "viruses", "virus"].includes(normalized)) return "microverse";
  if (["chromista", "protista", "sar"].includes(normalized)) return "sar";
  return "";
}

function validLifeState(value) {
  const state = clean(value).toLowerCase();
  return ["extant", "extinct"].includes(state) ? state : "";
}

function hasFullHdImage(row) {
  const quality = clean(row.imageQualityHint).toLowerCase();
  return Boolean(hasRightsFreeImage(row) && (quality === "full hd" || quality === "4k"));
}

function hasVerifiedNaturalHistoryVideo(row) {
  const quality = clean(row.videoQualityHint).toLowerCase();
  return Boolean(clean(row.youtubeUrl) && clean(row.youtubeId) && (quality === "hd" || quality === "full hd" || quality === "4k"));
}

function hasSameDeclaredIdentity(rows, input) {
  const terms = [input.scientificName, input.name, input.commonNameEn, input.commonNameVi]
    .map((value) => key(value))
    .filter(Boolean);
  return rows.find((row) => terms.some((term) => [
    row.organismId,
    row.scientificName,
    row.commonNameEn,
    row.commonNameVi,
  ].map(key).includes(term))) || null;
}

function hasSameResolvedIdentity(rows, candidate) {
  const identifier = clean(candidate.organismId);
  const taxonId = clean(candidate.authoritativeTaxonId);
  return rows.find((row) => clean(row.organismId) === identifier
    || (taxonId && clean(row.authoritativeTaxonId) === taxonId)) || null;
}

function reason(...messages) {
  return messages.filter(Boolean).join("; ");
}

function freshRecord(input, enriched, clock, knownRows) {
  const resolvedRealm = validRealm(input.realmId) || inferRealm(enriched.kingdom);
  const scientificName = clean(enriched.scientificName) || clean(input.scientificName) || clean(input.name);
  const commonNameEn = clean(enriched.commonNameEn) || clean(input.commonNameEn) || scientificName;
  const commonNameVi = clean(enriched.commonNameVi) || clean(input.commonNameVi);
  const lifeState = validLifeState(input.lifeState || "extant");
  const organismId = resolvedRealm && scientificName ? allocateOrganismId(knownRows, resolvedRealm) : "";
  return {
    ...enriched,
    organismId,
    realmId: resolvedRealm,
    commonNameEn,
    commonNameVi,
    scientificName,
    alternateNames: clean(enriched.alternateNames),
    lifeState,
    encountered: false,
    encounterDate: "",
    rarityScore: "",
    importBatch: "add-organism",
    schemaVersion: 1,
    fetchedAt: clean(enriched.fetchedAt) || clock().toISOString(),
  };
}

function validateCandidate(row, minConfidence) {
  const confidence = Number(row.confidence);
  const problems = [
    !clean(row.organismId) && "could not derive an organism ID",
    !validRealm(row.realmId) && "could not determine one of the four Realms",
    !validLifeState(row.lifeState) && "lifeState must be extant or extinct",
    !clean(row.scientificName) && "missing scientific name",
    !(clean(row.className) && isCanonicalScientificClass(row.className)) && "missing canonical scientific Class",
    !(Number.isFinite(confidence) && confidence >= minConfidence) && `GBIF confidence is below ${minConfidence}`,
    !hasFullHdImage(row) && "missing a provenance-linked Full HD/4K image",
  ];
  return problems.filter(Boolean);
}

function normalizeItems(items) {
  if (!Array.isArray(items) || !items.length) throw new TypeError("Add organism requires at least one input item");
  return items.map((item) => typeof item === "string" ? { name: item } : { ...item });
}

export function createOrganismIntake({
  store,
  enricher,
  clock = () => new Date(),
} = {}) {
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") {
    throw new TypeError("Organism intake requires a store with read and write");
  }
  if (!enricher || typeof enricher.enrich !== "function") {
    throw new TypeError("Organism intake requires an enricher");
  }

  return Object.freeze({
    async add(items, {
      apply = false,
      minConfidence = 0.8,
      strictMedia = false,
    } = {}) {
      const threshold = Number(minConfidence);
      if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
        throw new RangeError("Minimum confidence must be between 0 and 1");
      }

      const inputItems = normalizeItems(items);
      const knownRows = store.read() ?? [];
      const readyRows = [];
      const report = [];
      const summary = { received: inputItems.length, ready: 0, duplicate: 0, rejected: 0, failed: 0, written: 0 };

      for (const input of inputItems) {
        const name = clean(input.name) || clean(input.scientificName) || clean(input.commonNameEn);
        if (!name) {
          summary.rejected += 1;
          report.push({ input, status: "rejected", reason: "missing organism name" });
          continue;
        }
        const existingDeclared = hasSameDeclaredIdentity(knownRows, { ...input, name });
        if (existingDeclared) {
          summary.duplicate += 1;
          report.push({ input, status: "duplicate", organismId: existingDeclared.organismId, reason: "existing declared identity" });
          continue;
        }

        try {
          const enriched = await enricher.enrich({
            commonNameEn: clean(input.commonNameEn) || name,
            commonNameVi: clean(input.commonNameVi),
            scientificName: clean(input.scientificName) || name,
            lifeState: validLifeState(input.lifeState || "extant") || clean(input.lifeState || "extant"),
            realmId: validRealm(input.realmId) || "",
          }, { overwrite: true, strictMedia: Boolean(strictMedia) });
          const row = freshRecord(input, enriched.row || {}, clock, [...knownRows, ...readyRows]);
          const existingResolved = hasSameResolvedIdentity([...knownRows, ...readyRows], row);
          if (existingResolved) {
            summary.duplicate += 1;
            report.push({ input, status: "duplicate", organismId: existingResolved.organismId, reason: "existing authoritative identity", errors: enriched.errors || [] });
            continue;
          }
          const problems = validateCandidate(row, threshold);
          if (problems.length) {
            summary.rejected += 1;
            report.push({ input, status: "rejected", organismId: row.organismId, reason: reason(...problems), errors: enriched.errors || [] });
            continue;
          }
          readyRows.push(row);
          summary.ready += 1;
          report.push({ input, status: "ready", row, errors: enriched.errors || [] });
        } catch (error) {
          summary.failed += 1;
          report.push({ input, status: "failed", reason: error.message });
        }
      }

      if (apply && readyRows.length) {
        store.write([...knownRows, ...readyRows]);
        summary.written = readyRows.length;
      }
      return { summary, items: report };
    },
  });
}
