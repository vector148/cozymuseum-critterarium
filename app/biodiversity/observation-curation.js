import { createHash } from "node:crypto";

import { isCanonicalScientificClass } from "./taxonomy.js";

const REALM_BY_KINGDOM = Object.freeze({
  animalia: "animalia",
  plantae: "plantae_fungi",
  fungi: "plantae_fungi",
  chromista: "sar",
  protozoa: "sar",
  bacteria: "microverse",
  archaea: "microverse",
  viruses: "microverse",
});

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

function aliases(value) {
  return clean(value).split(/[|,;]+/).map(key).filter(Boolean);
}

const VIETNAMESE_NAME_PREFIXES = new Set([
  "bach", "bao", "bo", "buom", "ca", "cay", "chim", "cho", "chuot", "cua", "de", "ech",
  "ga", "giun", "hoa", "ho", "kien", "meo", "muoi", "nam", "nghe", "ngua", "nhen", "oc",
  "ong", "ran", "rua", "sen", "sua", "tao", "thong", "tom", "trung", "ve", "vit", "voi",
]);

function looksVietnamese(value) {
  const raw = clean(value);
  if (/[ăâđêôơưĂÂĐÊÔƠƯáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(raw)) return true;
  return VIETNAMESE_NAME_PREFIXES.has(key(raw).split("-")[0]);
}

function catalogIdentitySet(rows) {
  const identities = new Set();
  for (const row of rows) {
    for (const value of [row.organismId, row.scientificName, row.commonNameEn, row.commonNameVi]) {
      if (key(value)) identities.add(key(value));
    }
    for (const value of aliases(row.alternateNames)) identities.add(value);
  }
  return identities;
}

function candidateAliases(candidate) {
  const common = parseCommonNames(candidate.commonNameRaw);
  return [
    candidate.candidateId,
    candidate.identityKey,
    candidate.scientificNameRaw,
    common.commonNameEn,
    common.commonNameVi,
    common.alternateNames,
  ].flatMap(aliases);
}

function hasAmbiguousScientificName(value) {
  const name = clean(value);
  return !name || /[\/~→|()]|\s+or\s+/i.test(name);
}

function parseCommonNames(value) {
  const raw = clean(value);
  const match = raw.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (!match) return looksVietnamese(raw)
    ? { commonNameEn: "", commonNameVi: raw, alternateNames: "" }
    : { commonNameEn: raw, commonNameVi: "", alternateNames: "" };
  const outer = clean(match[1]);
  const inner = clean(match[2]);
  const vietnamese = looksVietnamese(inner);
  return vietnamese
    ? { commonNameEn: outer, commonNameVi: inner, alternateNames: "" }
    : { commonNameEn: outer || inner, commonNameVi: "", alternateNames: inner };
}

function canonicalLegacyClass(value) {
  const match = clean(value).match(/^([A-Z][A-Za-z-]+)(?:\s*\(|$)/);
  return match && isCanonicalScientificClass(match[1]) ? match[1] : "";
}

function proposalRow(candidate, match, clock) {
  const realmId = REALM_BY_KINGDOM[key(match.kingdom)];
  if (!realmId) return { rejection: "unsupported-realm" };
  const providerClass = clean(match.className);
  const legacyClass = providerClass ? "" : canonicalLegacyClass(candidate.rawClass);
  const className = providerClass || legacyClass;
  if (!className || !isCanonicalScientificClass(className)) return { rejection: "invalid-scientific-class" };
  const scientificName = clean(match.canonicalName || match.species || candidate.scientificNameRaw);
  if (!scientificName) return { rejection: "missing-canonical-name" };
  const names = parseCommonNames(candidate.commonNameRaw);
  return {
    row: {
      organismId: `${realmId.replace(/_/g, "-")}-${key(scientificName)}`,
      realmId,
      commonNameEn: names.commonNameEn || scientificName,
      commonNameVi: names.commonNameVi,
      alternateNames: names.alternateNames,
      scientificName,
      kingdom: clean(match.kingdom),
      phylum: key(match.phylum).replace(/-/g, "_"),
      className,
      classNameProvider: providerClass ? "gbif" : "legacy-observation",
      order: clean(match.order),
      family: clean(match.family),
      genus: clean(match.genus),
      species: clean(match.species),
      rank: clean(match.rank),
      authoritativeTaxonId: clean(match.authoritativeTaxonId),
      lifeState: clean(candidate.lifeStateHint).toLowerCase() === "extinct" ? "extinct" : "extant",
      encountered: false,
      encounterDate: "",
      rarityScore: "",
      sourceUrls: clean(match.sourceUrl),
      provider: providerClass ? "gbif" : "gbif | legacy-observation",
      fetchedAt: clock().toISOString(),
      confidence: Number(match.confidence),
      importBatch: "legacy-observation-curation",
      legacySourceLine: candidate.sourceLine,
      schemaVersion: 1,
    },
  };
}

function previewDigest({ offset, limit, threshold, proposals, rejections, alreadyPresent }) {
  const proposalFields = proposals.map(({ candidateId, row }) => {
    const { fetchedAt: _volatileTimestamp, ...writeRelevantRow } = row;
    return { candidateId, row: writeRelevantRow };
  });
  const rejectionFields = rejections.map(({ candidateId, reason, confidence }) => ({ candidateId, reason, confidence }));
  return createHash("sha256").update(JSON.stringify({
    version: 1,
    offset,
    limit: Number.isFinite(limit) ? limit : null,
    threshold,
    alreadyPresent,
    proposals: proposalFields,
    rejections: rejectionFields,
  })).digest("hex");
}

export function createGbifCandidateMatcher({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("GBIF matcher requires fetch");
  return async (candidate) => {
    const name = clean(candidate?.scientificNameRaw);
    if (!name) return { accepted: false, matchType: "NONE", status: "", confidence: 0 };
    const url = new URL("https://api.gbif.org/v1/species/match");
    url.searchParams.set("name", name);
    const response = await fetchImpl(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`GBIF match returned HTTP ${response.status || "unknown"}`);
    const result = await response.json();
    const usageKey = clean(result.usageKey);
    const matchType = clean(result.matchType).toUpperCase();
    const status = clean(result.status).toUpperCase();
    const confidence = Math.min(1, Math.max(0, (Number(result.confidence) || 0) / 100));
    let detail = null;
    if (usageKey && matchType === "EXACT" && status === "ACCEPTED" && !clean(result.class)) {
      const detailResponse = await fetchImpl(new URL(`https://api.gbif.org/v1/species/${usageKey}`), { headers: { accept: "application/json" } });
      if (!detailResponse.ok) throw new Error(`GBIF taxon detail returned HTTP ${detailResponse.status || "unknown"}`);
      detail = await detailResponse.json();
    }
    return {
      accepted: matchType === "EXACT" && status === "ACCEPTED" && Boolean(usageKey),
      matchType,
      status,
      confidence,
      authoritativeTaxonId: usageKey ? `GBIF:${usageKey}` : "",
      sourceUrl: usageKey ? `https://www.gbif.org/species/${usageKey}` : "",
      canonicalName: clean(result.canonicalName || detail?.canonicalName || result.scientificName || detail?.scientificName),
      kingdom: clean(result.kingdom || detail?.kingdom),
      phylum: clean(result.phylum || detail?.phylum),
      className: clean(result.class || detail?.class),
      order: clean(result.order || detail?.order),
      family: clean(result.family || detail?.family),
      genus: clean(result.genus || detail?.genus),
      species: clean(result.species || detail?.species),
      rank: clean(result.rank || detail?.rank),
    };
  };
}

export async function curateLegacyObservationCandidates({
  manifest,
  store,
  matcher,
  apply = false,
  approvedPreviewDigest = "",
  minConfidence = 0.8,
  offset = 0,
  limit = Infinity,
  clock = () => new Date(),
} = {}) {
  if (!Array.isArray(manifest?.candidates)) throw new TypeError("Observation curation requires a candidate manifest");
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") throw new TypeError("Observation curation requires a store");
  if (typeof matcher !== "function") throw new TypeError("Observation curation requires a matcher");
  const threshold = Number(minConfidence);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new RangeError("Minimum confidence must be between 0 and 1");

  const taxonomyReferences = manifest.candidates.filter((candidate) => candidate.candidateKind === "taxonomy-reference").length;
  const manifestDuplicates = manifest.candidates.filter((candidate) => clean(candidate.duplicateOf)).length;
  const uniqueCandidates = manifest.candidates.filter((candidate) => candidate.candidateKind === "organism-candidate" && !clean(candidate.duplicateOf));
  const resolvedOffset = Math.max(0, Number(offset) || 0);
  const resolvedLimit = Number.isFinite(Number(limit)) ? Math.max(0, Number(limit)) : Infinity;
  const batch = uniqueCandidates.slice(resolvedOffset, Number.isFinite(resolvedLimit) ? resolvedOffset + resolvedLimit : undefined);
  const rows = store.read() ?? [];
  const known = catalogIdentitySet(rows);
  const proposals = [];
  const rejections = [];
  let alreadyPresent = 0;

  for (const candidate of batch) {
    if (candidateAliases(candidate).some((identity) => known.has(identity))) {
      alreadyPresent += 1;
      continue;
    }
    if (hasAmbiguousScientificName(candidate.scientificNameRaw)) {
      rejections.push({ candidateId: candidate.candidateId, reason: "ambiguous-scientific-name", confidence: 0 });
      continue;
    }
    let match;
    try {
      match = await matcher(candidate);
    } catch (error) {
      rejections.push({ candidateId: candidate.candidateId, reason: "provider-error", confidence: 0, error: error.message });
      continue;
    }
    const confidence = Number(match?.confidence) || 0;
    if (!match?.accepted || match.matchType !== "EXACT" || match.status !== "ACCEPTED" || confidence < threshold) {
      rejections.push({ candidateId: candidate.candidateId, reason: "ambiguous-or-low-confidence", confidence, match });
      continue;
    }
    const built = proposalRow(candidate, match, clock);
    if (built.rejection) {
      rejections.push({ candidateId: candidate.candidateId, reason: built.rejection, confidence, match });
      continue;
    }
    if (known.has(key(built.row.organismId)) || known.has(key(built.row.scientificName))) {
      alreadyPresent += 1;
      continue;
    }
    proposals.push({ candidateId: candidate.candidateId, sourceLine: candidate.sourceLine, row: built.row, match });
    for (const identity of [built.row.organismId, built.row.scientificName, built.row.commonNameEn, built.row.commonNameVi].map(key).filter(Boolean)) known.add(identity);
  }

  const digest = previewDigest({
    offset: resolvedOffset,
    limit: resolvedLimit,
    threshold,
    proposals,
    rejections,
    alreadyPresent,
  });
  if (apply && clean(approvedPreviewDigest) !== digest) {
    throw new Error("Apply requires the matching preview digest for this exact batch");
  }
  if (apply && proposals.length) store.write([...rows, ...proposals.map((proposal) => proposal.row)]);
  return {
    summary: {
      sourceCandidates: manifest.candidates.length,
      uniqueOrganismCandidates: uniqueCandidates.length,
      taxonomyReferences,
      manifestDuplicates,
      scanned: batch.length,
      alreadyPresent,
      proposed: proposals.length,
      rejected: rejections.length,
      written: apply ? proposals.length : 0,
    },
    proposals,
    rejections,
    previewDigest: digest,
  };
}
