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

function candidateKind({ commonNameRaw, scientificNameRaw, rawClass }) {
  if (
    /[→~]/.test(rawClass)
    || /^ngành\b/i.test(commonNameRaw)
    || /^ngành\b/i.test(scientificNameRaw)
  ) return "taxonomy-reference";
  return "organism-candidate";
}

export function extractLegacyObservationCandidates(source) {
  const lines = String(source ?? "").split(/\r?\n/).map(clean);
  const candidates = [];
  const firstByIdentity = new Map();
  let fossilCandidatesRemaining = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const lineKey = slug(lines[index]);
    if (/^sieu-gioi-/.test(lineKey)) fossilCandidatesRemaining = 0;
    const fossilHeading = lineKey.match(/hoa-thach.*?(\d+)-loai/);
    if (fossilHeading) {
      fossilCandidatesRemaining = Number(fossilHeading[1]) || 0;
      continue;
    }
    if (!/^\d+$/.test(lines[index]) || index + 5 >= lines.length) continue;
    const [commonNameRaw, scientificNameRaw, rawFamily, rawOrder, rawClass] = lines.slice(index + 1, index + 6);
    if (!commonNameRaw || ["Tên thường", "Ngành"].includes(commonNameRaw)) continue;

    const sourceLine = index + 1;
    const identityKey = slug(scientificNameRaw || commonNameRaw) || `line-${sourceLine}`;
    const kind = candidateKind({ commonNameRaw, scientificNameRaw, rawClass });
    const firstCandidateId = firstByIdentity.get(identityKey);
    const candidateId = firstCandidateId
      ? `legacy-observation-${identityKey}-${sourceLine}`
      : `legacy-observation-${identityKey}`;
    const candidate = {
      candidateId,
      candidateKind: kind,
      sourceLine,
      commonNameRaw,
      scientificNameRaw,
      rawFamily,
      rawOrder,
      rawClass,
      identityKey,
      duplicateOf: firstCandidateId || "",
      ...(fossilCandidatesRemaining > 0 ? { lifeStateHint: "extinct" } : {}),
    };
    candidates.push(candidate);
    if (!firstCandidateId) firstByIdentity.set(identityKey, candidateId);
    if (fossilCandidatesRemaining > 0) fossilCandidatesRemaining -= 1;
    index += 5;
  }

  const organismCandidates = candidates.filter((candidate) => candidate.candidateKind === "organism-candidate");
  return {
    summary: {
      rawCandidates: candidates.length,
      organismCandidates: organismCandidates.length,
      taxonomyReferences: candidates.length - organismCandidates.length,
      uniqueOrganismCandidates: new Set(organismCandidates.map((candidate) => candidate.identityKey)).size,
    },
    candidates,
  };
}
