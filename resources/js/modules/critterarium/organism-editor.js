const EDITABLE_FIELDS = Object.freeze([
  "scientificName",
  "commonNameEn",
  "commonNameVi",
  "descriptionEn",
  "descriptionVi",
  "kingdom",
  "phylum",
  "className",
  "order",
  "family",
  "genus",
  "rank",
  "lifeState",
  "iucnStatus",
  "geologicalPeriod",
  "extinctionYear",
  "habitatEn",
  "habitatVi",
  "distributionEn",
  "distributionVi",
  "dietEn",
  "dietVi",
  "size",
  "lifespan",
  "coverUrl",
  "imageSourceUrl",
  "imageLicense",
  "imageLicenseUrl",
  "imageRightsStatus",
  "youtubeUrl",
  "videoTitle",
  "sourceUrls",
  "authoritativeTaxonId",
  "isDangerous",
]);

const DEFAULT_DRAFT = Object.freeze({
  realmId: "animalia",
  scientificName: "",
  commonNameEn: "",
  commonNameVi: "",
  descriptionEn: "",
  descriptionVi: "",
  kingdom: "Animalia",
  phylum: "Chordata",
  className: "Mammalia",
  order: "",
  family: "",
  genus: "",
  rank: "SPECIES",
  lifeState: "extant",
  iucnStatus: "",
  geologicalPeriod: "",
  extinctionYear: "",
  habitatEn: "",
  habitatVi: "",
  distributionEn: "",
  distributionVi: "",
  dietEn: "",
  dietVi: "",
  size: "",
  lifespan: "",
  coverUrl: "",
  imageSourceUrl: "",
  imageLicense: "",
  imageLicenseUrl: "",
  imageRightsStatus: "",
  youtubeUrl: "",
  videoTitle: "",
  sourceUrls: "",
  authoritativeTaxonId: "",
  isDangerous: false,
  score: "",
});

function text(value) {
  return String(value ?? "").trim();
}

export function buildOrganismCreateDraft() {
  return { ...DEFAULT_DRAFT };
}

export function buildOrganismEditDraft(item = {}) {
  const draft = buildOrganismCreateDraft();
  draft.realmId = text(item.realmId) || draft.realmId;
  for (const field of EDITABLE_FIELDS) {
    draft[field] = field === "isDangerous" ? Boolean(item[field]) : text(item[field]);
  }
  draft.score = item.rarityScore === "" || item.rarityScore === null || item.rarityScore === undefined
    ? ""
    : String(item.rarityScore);
  return draft;
}

export function buildOrganismUpdatePayload(draft = {}) {
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    payload[field] = field === "isDangerous" ? Boolean(draft[field]) : text(draft[field]);
  }

  const score = Number(draft.score);
  const hasScore = text(draft.score) !== "" && Number.isFinite(score) && score > 0;
  payload.rarityScore = hasScore ? score : "";
  payload.encountered = hasScore;
  if (!hasScore) payload.encounterDate = "";
  return payload;
}

export function coverNeedsImport({ mode = "create", initialItem, coverUrl } = {}) {
  if (mode !== "edit") return true;
  return text(coverUrl) !== text(initialItem?.coverUrl);
}

export async function saveOrganismDraft({ mode = "create", initialItem, draft, api }) {
  if (mode === "edit") {
    const organismId = text(initialItem?.organismId);
    if (!organismId) throw new Error("An organism ID is required for editing");
    return api.updateOrganism(organismId, buildOrganismUpdatePayload(draft));
  }
  return api.createOrganism({ ...draft });
}
