const EVIDENCE_STATUSES = new Set(["evidence", "inference", "hypothesis"]);
const ENTITY_IDS = new Set(["cozymuseum", "critterarium", "curatale", "reading-room"]);
const REVIEW_STATES = new Set(["proposed", "approved"]);

function requiredText(value, field) {
  const text = String(value || "").trim();
  if (!text) throw new TypeError(`Answer contract ${field} is required`);
  return text;
}

function publicHttpUrl(value, field) {
  const text = requiredText(value, field);
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new TypeError(`Answer contract ${field} must use HTTP or HTTPS`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new TypeError(`Answer contract ${field} must use HTTP or HTTPS`);
  }
  return url.toString();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new TypeError(`Answer contract ${field} must use YYYY-MM-DD`);
  }
  const date = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) {
    throw new TypeError(`Answer contract ${field} must use YYYY-MM-DD`);
  }
  return text;
}

function normalizeSource(value, claimId) {
  if (!value || typeof value !== "object") {
    throw new TypeError(`Evidence claim ${claimId} requires a visible source`);
  }

  const source = Object.freeze({
    name: requiredText(value.name, `source name for ${claimId}`),
    url: publicHttpUrl(value.url, `source URL for ${claimId}`),
    publishedAt: isoDate(value.publishedAt, `source date for ${claimId}`),
    accessedAt: isoDate(value.accessedAt, `source access date for ${claimId}`),
  });
  return source;
}

function normalizeSources(value, claimId) {
  const values = Array.isArray(value?.sources)
    ? value.sources
    : value?.source
      ? [value.source]
      : [];
  if (!values.length) {
    throw new TypeError(`Evidence claim ${claimId} requires a visible source`);
  }
  return Object.freeze(values.map((source) => normalizeSource(source, claimId)));
}

function normalizeClaim(value) {
  const id = requiredText(value?.id, "claim ID");
  const status = requiredText(value?.status, `claim status for ${id}`);
  if (!EVIDENCE_STATUSES.has(status)) {
    throw new TypeError(`Claim ${id} has an invalid evidence status`);
  }

  return Object.freeze({
    id,
    text: requiredText(value?.text, `claim text for ${id}`),
    status,
    ...(status === "evidence" ? { sources: normalizeSources(value, id) } : {}),
  });
}

function normalizeSnippet(value) {
  const mode = String(value?.mode || "full").trim();
  if (!new Set(["full", "limited", "none"]).has(mode)) {
    throw new TypeError(`Unknown snippet policy: ${mode}`);
  }
  const maxCharacters = Number.isInteger(value?.maxCharacters)
    ? value.maxCharacters
    : null;
  const reason = String(value?.reason || "").trim();
  if (mode !== "full" && !reason) {
    throw new TypeError("Restrictive snippet policy requires a reason");
  }
  if (mode === "limited" && (!maxCharacters || maxCharacters < 1)) {
    throw new TypeError("Limited snippet policy requires a positive character limit");
  }
  return Object.freeze({ mode, maxCharacters, reason });
}

export function normalizeAnswerContract(value) {
  const input = value && typeof value === "object" ? value : {};
  const reviewState = String(input.reviewState || "proposed").trim();
  if (!REVIEW_STATES.has(reviewState)) {
    throw new TypeError(`Unknown answer contract review state: ${reviewState}`);
  }
  const owner = String(input.owner || "").trim();
  if (reviewState === "approved" && !owner) {
    throw new TypeError("Approved answer contract requires a decision owner");
  }
  const entities = Object.freeze((Array.isArray(input.entities) ? input.entities : [])
    .map((entity) => {
      const id = requiredText(entity, "entity ID");
      if (!ENTITY_IDS.has(id)) throw new TypeError(`Unknown entity ID: ${id}`);
      return id;
    }));
  const claims = (Array.isArray(input.claims) ? input.claims : []).map(normalizeClaim);
  const claimIds = new Set();
  for (const claim of claims) {
    if (claimIds.has(claim.id)) {
      throw new TypeError(`Duplicate claim ID: ${claim.id}`);
    }
    claimIds.add(claim.id);
  }

  return Object.freeze({
    question: requiredText(input.question, "question"),
    directAnswer: requiredText(input.directAnswer, "direct answer"),
    entities,
    claims: Object.freeze(claims),
    snippet: normalizeSnippet(input.snippet),
    revalidateAt: String(input.revalidateAt || "").trim(),
    reviewState,
    owner,
  });
}

export function answerContractRobotsContent(answerContract) {
  const snippet = answerContract?.snippet || { mode: "full" };
  const directive = snippet.mode === "none"
    ? "max-snippet:0"
    : snippet.mode === "limited"
      ? `max-snippet:${snippet.maxCharacters}`
      : "max-snippet:-1";
  return `index,follow,max-image-preview:large,${directive}`;
}
