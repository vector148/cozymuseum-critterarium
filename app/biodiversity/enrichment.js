import { isCanonicalScientificClass } from "./taxonomy.js";
import {
  normalizeRightsFreeLicense,
} from "./media-rights.js";

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function extractJsonObject(source, startAt) {
  const start = source.indexOf("{", startAt);
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return null;
}

function richText(value) {
  return clean(value?.simpleText ?? value?.runs?.map((run) => run.text).join("") ?? "");
}

function durationSeconds(value) {
  const parts = clean(value).split(":").map(Number);
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

async function fetchWithTimeout(fetchImpl, url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs);
  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function parseYouTubeVideoSearchHtml(html) {
  const source = String(html ?? "");
  const markers = ["var ytInitialData =", "window[\"ytInitialData\"] =", "ytInitialData ="];
  let payload = null;
  for (const marker of markers) {
    const markerIndex = source.indexOf(marker);
    if (markerIndex < 0) continue;
    const json = extractJsonObject(source, markerIndex + marker.length);
    if (!json) continue;
    try {
      payload = JSON.parse(json);
      break;
    } catch {
      // Try the next known marker.
    }
  }
  if (!payload) return [];
  const videos = [];
  const stack = [payload];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    const renderer = current.videoRenderer;
    if (renderer?.videoId) {
      const videoId = clean(renderer.videoId);
      videos.push({
        videoId,
        title: richText(renderer.title),
        seconds: durationSeconds(richText(renderer.lengthText)),
        views: Number(richText(renderer.viewCountText).replace(/[^0-9]/g, "")) || 0,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
    for (const value of Object.values(current)) {
      if (Array.isArray(value)) stack.push(...value);
      else if (value && typeof value === "object") stack.push(value);
    }
  }
  const seen = new Set();
  return videos.filter((video) => {
    if (!video.videoId || seen.has(video.videoId)) return false;
    seen.add(video.videoId);
    return true;
  });
}

export function createYouTubeSearch({ fetchImpl = globalThis.fetch, timeoutMs = 12000 } = {}) {
  return async (query) => {
    const url = new URL("https://www.youtube.com/results");
    url.searchParams.set("search_query", query);
    url.searchParams.set("hl", "en");
    url.searchParams.set("gl", "US");
    const response = await fetchWithTimeout(fetchImpl, url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    }, timeoutMs);
    if (!response.ok) throw new Error(`YouTube search returned HTTP ${response.status}`);
    return { videos: parseYouTubeVideoSearchHtml(await response.text()) };
  };
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

function taxonomyKey(value) {
  return slug(value).replace(/-/g, "_");
}

const WIKIMEDIA_USER_AGENT = "CozyMuseum/0.1 (https://github.com/vector148/cozymuseum)";

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryAfterMilliseconds(response) {
  const value = clean(response?.headers?.get?.("retry-after"));
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? Math.max(0, timestamp - Date.now()) : null;
}

async function fetchJson(fetchImpl, url, timeoutMs, headers = {}, {
  retries = 0,
  baseDelayMs = 0,
  maxDelayMs = 60000,
} = {}) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetchWithTimeout(fetchImpl, url, { headers: { accept: "application/json", ...headers } }, timeoutMs);
    if (response.ok) return response.json();
    const status = Number(response.status) || 0;
    const rateLimited = status === 429 || status === 503;
    const retryAfterMs = retryAfterMilliseconds(response);
    const delayMs = Math.max(retryAfterMs ?? 0, baseDelayMs * (2 ** attempt));
    if (!rateLimited || attempt >= retries || delayMs > maxDelayMs) {
      const retryHint = retryAfterMs === null ? "" : `; retry after ${Math.ceil(retryAfterMs / 1000)}s`;
      throw new Error(`Request failed: ${status || "unknown"}${retryHint}`);
    }
    if (delayMs > 0) await sleep(delayMs);
  }
  throw new Error("Request failed after retries");
}

async function fetchGbifTaxon(fetchImpl, query, timeoutMs) {
  const match = await fetchJson(fetchImpl, new URL(`/v1/species/match?name=${encodeURIComponent(query)}`, "https://api.gbif.org"), timeoutMs);
  if (!match?.usageKey) return match;
  try {
    const accepted = await fetchJson(fetchImpl, new URL(`/v1/species/${match.usageKey}`, "https://api.gbif.org"), timeoutMs);
    const resolved = { ...match, ...accepted, usageKey: accepted?.key || accepted?.usageKey || match.usageKey };
    if (clean(resolved.class)) return resolved;
    const parents = await fetchJson(fetchImpl, new URL(`/v1/species/${resolved.usageKey}/parents`, "https://api.gbif.org"), timeoutMs);
    const taxonomicClass = Array.isArray(parents)
      ? parents.find((parent) => clean(parent.rank).toUpperCase() === "CLASS")
      : null;
    return { ...resolved, class: taxonomicClass?.canonicalName || taxonomicClass?.scientificName || "" };
  } catch {
    return match;
  }
}

function wikipediaUrl(locale, query) {
  const url = new URL(`https://${locale}.wikipedia.org/w/api.php`);
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "0",
    gsrlimit: "1",
    prop: "extracts|pageimages|info|pageprops",
    exintro: "1",
    explaintext: "1",
    piprop: "original|thumbnail",
    pithumbsize: "1920",
    inprop: "url",
    redirects: "1",
    maxlag: "5",
    format: "json",
    origin: "*",
  });
  return url;
}

async function fetchINaturalistImage(fetchImpl, query, timeoutMs) {
  const url = new URL("https://api.inaturalist.org/v1/observations");
  url.searchParams.set("taxon_name", query);
  url.searchParams.set("photo_license", "cc0");
  url.searchParams.set("quality_grade", "research");
  url.searchParams.set("order_by", "votes");
  url.searchParams.set("per_page", "1");
  const payload = await fetchJson(fetchImpl, url, timeoutMs, {
    accept: "application/json",
    "user-agent": "CozyMuseum/0.1 (local personal scientific atlas)",
  });
  const photo = payload?.results?.[0]?.photos?.[0];
  if (!photo?.url || photo.license_code !== "cc0") return null;
  const width = photo.original_dimensions?.width;
  const height = photo.original_dimensions?.height;
  return {
    coverUrl: clean(photo.url).replace(/square\.(jpg|jpeg|png)$/i, "original.$1"),
    imageSourceUrl: clean(`https://www.inaturalist.org/photos/${photo.id}`),
    imageWidth: Number(width) || "",
    imageHeight: Number(height) || "",
    imageLicense: "CC0",
    imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    imageRightsStatus: "rights-free",
    imageQualityHint: width && height ? imageQuality(width, height) : "HD",
  };
}

function wikimediaCommonsImageUrl(query, featured = false) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  const negativeKeywords = '-"specimen" -"illustration" -"drawing" -"fossil" -"track" -"trap" -"museum" -"dead" -"map" -"fishing" -"catch" -"caught" -"market" -"food" -"dish" -"painting" -"art" -"sketch" -"vintage" -"botanical" -"statue" -"model" -"sculpture" -"captive" -"zoo"';
  const searchQuery = featured ? `"${query}" (incategory:Featured_pictures_of_animals OR incategory:Featured_pictures_of_plants OR incategory:Featured_pictures_of_fungi OR incategory:Quality_images) ${negativeKeywords}` : `"${query}" ${negativeKeywords}`;
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: searchQuery,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo|info",
    iiprop: "url|size|extmetadata",
    inprop: "url",
    maxlag: "5",
    format: "json",
    origin: "*",
  });
  return url;
}

function firstWikipediaPage(payload) {
  return Object.values(payload?.query?.pages || {})[0] || null;
}

function stripMarkup(value) {
  return clean(value).replace(/<[^>]+>/g, "");
}

function firstCommonsImage(payload) {
  const candidates = Object.values(payload?.query?.pages || {})
    .map((page) => {
      const image = page?.imageinfo?.[0];
      if (!image?.url) return null;
      const imageLicense = normalizeRightsFreeLicense(stripMarkup(image.extmetadata?.LicenseShortName?.value));
      if (!imageLicense) return null;
      return {
        coverUrl: clean(image.url),
        imageSourceUrl: clean(image.descriptionurl || page.fullurl),
        imageWidth: Number(image.width) || "",
        imageHeight: Number(image.height) || "",
        imageLicense,
        imageLicenseUrl: clean(stripMarkup(image.extmetadata?.LicenseUrl?.value))
          || (imageLicense === "CC0"
            ? "https://creativecommons.org/publicdomain/zero/1.0/"
            : "https://creativecommons.org/publicdomain/mark/1.0/"),
        imageRightsStatus: "rights-free",
      };
    })
    .filter(Boolean)
    .map((candidate) => ({ ...candidate, imageQualityHint: imageQuality(candidate.imageWidth, candidate.imageHeight) }));
  return candidates.sort((left, right) => {
    const pixels = (item) => Number(item.imageWidth || 0) * Number(item.imageHeight || 0);
    return pixels(right) - pixels(left);
  })[0] || null;
}

async function resolveWikidataClass(fetchImpl, initialEntityId, timeoutMs) {
  const entityId = clean(initialEntityId);
  if (!entityId) return null;
  const url = new URL("https://query.wikidata.org/sparql");
  url.searchParams.set("format", "json");
  url.searchParams.set("query", `SELECT ?class ?className WHERE {
    wd:${entityId} wdt:P171* ?class .
    ?class wdt:P105 wd:Q37517 ; wdt:P225 ?className .
  } LIMIT 1`);
  const payload = await fetchJson(fetchImpl, url, timeoutMs, {
    accept: "application/sparql-results+json",
    "user-agent": "CozyMuseum/0.1 (local personal scientific atlas)",
  });
  const binding = payload?.results?.bindings?.[0];
  const className = clean(binding?.className?.value);
  const sourceUrl = clean(binding?.class?.value).replace("http://", "https://");
  return isCanonicalScientificClass(className) && sourceUrl
    ? { className, sourceUrl }
    : null;
}

function videoScore(video, queryWords) {
  const title = clean(video.title).toLowerCase();
  const duration = Number(video.seconds) || 0;
  const views = Number(video.views) || 0;
  if (!video.videoId && !video.url) return -Infinity;
  if (duration > 0 && duration < 45) return -100;
  
  // Require at least one word from the query to be in the title
  const hasRelevance = queryWords.some(word => title.includes(word));
  if (!hasRelevance) return -200;

  let score = Math.log10(Math.max(views, 1));
  if (/\b4k\b|2160p/.test(title)) score += 35;
  if (/\bfull\s*hd\b|1080p|\bhd\b/.test(title)) score += 15;
  if (/wildlife|in the wild|nature|natural history|documentary/.test(title)) score += 24;
  if (/shorts?|compilation|meme|cartoon|gameplay|10 hours|epic/.test(title)) score -= 50;
  if (duration >= 180) score += 5;
  return score;
}

function rankedVideos(result, queryWords) {
  return [...(result?.videos || [])].sort((left, right) => videoScore(right, queryWords) - videoScore(left, queryWords));
}

async function isEmbeddableYouTubeVideo(video, fetchImpl, timeoutMs) {
  const url = clean(video?.url) || (clean(video?.videoId) ? `https://www.youtube.com/watch?v=${clean(video.videoId)}` : "");
  if (!url) return false;
  try {
    const endpoint = new URL("https://www.youtube.com/oembed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("format", "json");
    const response = await fetchWithTimeout(fetchImpl, endpoint, { headers: { accept: "application/json" } }, timeoutMs);
    return response.ok;
  } catch {
    return false;
  }
}

async function bestVerifiedVideo(result, queryWords, fetchImpl, timeoutMs) {
  for (const video of rankedVideos(result, queryWords)) {
    if (videoScore(video, queryWords) > -100 && await isEmbeddableYouTubeVideo(video, fetchImpl, timeoutMs)) return video;
  }
  return null;
}

function imageQuality(width, height) {
  const shortSide = Math.min(Number(width) || 0, Number(height) || 0);
  const longSide = Math.max(Number(width) || 0, Number(height) || 0);
  if (longSide >= 3840 && shortSide >= 2160) return "4K";
  if (longSide >= 1920 && shortSide >= 1080) return "Full HD";
  if (longSide >= 1280 && shortSide >= 720) return "HD";
  return "";
}

function appendSources(...values) {
  const urls = values.flatMap((value) => clean(value).split(/[|,;]+/)).map(clean).filter(Boolean);
  return [...new Set(urls)].join(" | ");
}

function localizedSubject(commonName, scientificName) {
  const common = clean(commonName);
  const scientific = clean(scientificName);
  if (common && scientific && common.toLowerCase() !== scientific.toLowerCase()) return `${common} (${scientific})`;
  return common || scientific || "This taxon";
}

function joinedClassification(parts, locale) {
  const values = parts.filter(Boolean);
  if (values.length < 2) return values[0] || "";
  const conjunction = locale === "vi" ? " và " : ", and ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values.at(-1)}`;
}

function authoredTaxonomyDescription({
  locale,
  commonName,
  scientificName,
  lifeState,
  className,
  order,
  family,
}) {
  const subject = localizedSubject(commonName, scientificName);
  const extinct = clean(lifeState).toLowerCase() === "extinct";
  if (locale === "vi") {
    const classification = joinedClassification([
      clean(className) ? `lớp ${clean(className)}` : "",
      clean(order) ? `bộ ${clean(order)}` : "",
      clean(family) ? `họ ${clean(family)}` : "",
    ], "vi");
    return `${subject} là một đơn vị phân loại ${extinct ? "đã tuyệt chủng" : "hiện sinh"}${classification ? ` thuộc ${classification}` : ""}.`;
  }
  const classification = joinedClassification([
    clean(className) ? `class ${clean(className)}` : "",
    clean(order) ? `order ${clean(order)}` : "",
    clean(family) ? `family ${clean(family)}` : "",
  ], "en");
  return `${subject} is an ${extinct ? "extinct" : "extant"} taxon${classification ? ` classified in ${classification}` : ""}.`;
}

export const ENRICHMENT_PROVIDERS = Object.freeze([
  "gbif",
  "inaturalist",
  "wikipedia-en",
  "wikipedia-vi",
  "youtube",
]);

function providerSet(providers) {
  const selected = providers === undefined ? ENRICHMENT_PROVIDERS : providers;
  if (!Array.isArray(selected) || !selected.length) throw new TypeError("At least one enrichment provider is required");
  const normalized = [...new Set(selected.map((provider) => clean(provider).toLowerCase()).filter(Boolean))];
  const unsupported = normalized.filter((provider) => !ENRICHMENT_PROVIDERS.includes(provider));
  if (unsupported.length) throw new Error(`Unsupported enrichment provider: ${unsupported.join(", ")}`);
  return new Set(normalized);
}

function changeSet(before, candidate, { overwrite = false, overwriteFields = [] } = {}) {
  const next = structuredClone(before);
  const changes = [];
  const selectedOverwriteFields = new Set(overwriteFields.map((field) => clean(field)).filter(Boolean));
  for (const [field, value] of Object.entries(candidate)) {
    const normalized = typeof value === "string" ? clean(value) : value;
    if (normalized === "" || normalized === undefined || normalized === null) continue;
    const current = before[field];
    const shouldWrite = overwrite || selectedOverwriteFields.has(field) || current === "" || current === undefined || current === null;
    if (!shouldWrite || String(current) === String(normalized)) continue;
    next[field] = normalized;
    changes.push({ field, before: current ?? "", after: normalized });
  }
  return { row: next, changes };
}

export function createBioEnricher({
  fetchImpl = globalThis.fetch,
  youtubeSearch,
  clock = () => new Date(),
  requestTimeoutMs = 12000,
  providers,
} = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("Bio enricher requires fetch");
  const enabledProviders = providerSet(providers);
  const resolvedYouTubeSearch = youtubeSearch ?? createYouTubeSearch({ fetchImpl, timeoutMs: requestTimeoutMs });
  if (typeof resolvedYouTubeSearch !== "function") throw new TypeError("Bio enricher requires YouTube search");
  const liveNetwork = fetchImpl === globalThis.fetch;
  const wikimediaHeaders = {
    "User-Agent": WIKIMEDIA_USER_AGENT,
    "Api-User-Agent": WIKIMEDIA_USER_AGENT,
  };
  const wikimediaRetry = {
    retries: 2,
    baseDelayMs: liveNetwork ? 1500 : 0,
    maxDelayMs: 60000,
  };
  const wikimediaIntervalMs = liveNetwork ? 350 : 0;
  let nextWikimediaRequestAt = 0;
  const scheduledWikimediaRead = async (url) => {
    if (wikimediaIntervalMs > 0) {
      const waitMs = Math.max(0, nextWikimediaRequestAt - Date.now());
      if (waitMs > 0) await sleep(waitMs);
      nextWikimediaRequestAt = Date.now() + wikimediaIntervalMs;
    }
    return fetchJson(fetchImpl, url, requestTimeoutMs, wikimediaHeaders, wikimediaRetry);
  };

  return Object.freeze({
    async enrich(row, { overwrite = false, overwriteFields = [] } = {}) {
      const query = clean(row.scientificName) || clean(row.commonNameEn);
      if (!query) throw new Error("Organism requires a scientific or common name");
      const errors = [];
      const selectedOverwriteFields = new Set(overwriteFields.map((field) => clean(field)).filter(Boolean));
      const shouldRefresh = (field) => overwrite || selectedOverwriteFields.has(field) || !clean(row[field]);
      const gbifPromise = enabledProviders.has("gbif") ? fetchGbifTaxon(fetchImpl, query, requestTimeoutMs)
        .catch((error) => { errors.push({ provider: "gbif", message: error.message }); return null; }) : Promise.resolve(null);
      const queryWords = [...new Set(`${clean(row.commonNameEn)} ${query}`.toLowerCase().split(/\s+/).filter(w => w.length > 3))];
      const videoPromise = enabledProviders.has("youtube") && shouldRefresh("youtubeUrl") ? resolvedYouTubeSearch(`${clean(row.commonNameEn) || query} ${query} animal documentary`)
        .then((result) => bestVerifiedVideo(result, queryWords, fetchImpl, requestTimeoutMs))
        .catch((error) => { errors.push({ provider: "youtube", message: error.message }); return null; }) : Promise.resolve(null);
      const wikimediaRead = async (provider, url, transform) => {
        try {
          return transform(await scheduledWikimediaRead(url));
        } catch (error) {
          errors.push({ provider, message: error.message });
          return null;
        }
      };
      const wikiEn = enabledProviders.has("wikipedia-en") && (shouldRefresh("commonNameEn") || shouldRefresh("className"))
        ? await wikimediaRead("wikipedia-en", wikipediaUrl("en", query), firstWikipediaPage)
        : null;
      const wikiVi = enabledProviders.has("wikipedia-vi") && shouldRefresh("commonNameVi")
        ? await wikimediaRead("wikipedia-vi", wikipediaUrl("vi", clean(row.commonNameVi) || query), firstWikipediaPage)
        : null;
      const commonsImageFeatured = (enabledProviders.has("wikipedia-en") || enabledProviders.has("wikipedia-vi")) && shouldRefresh("coverUrl")
        ? await wikimediaRead("wikimedia", wikimediaCommonsImageUrl(query, true), firstCommonsImage)
        : null;
      const commonsImageNormal = (!commonsImageFeatured && (enabledProviders.has("wikipedia-en") || enabledProviders.has("wikipedia-vi")) && shouldRefresh("coverUrl"))
        ? await wikimediaRead("wikimedia", wikimediaCommonsImageUrl(query, false), firstCommonsImage)
        : null;
      const commonsImage = commonsImageFeatured || commonsImageNormal;
      const inatImage = enabledProviders.has("inaturalist") && shouldRefresh("coverUrl")
        ? await fetchINaturalistImage(fetchImpl, query, requestTimeoutMs).catch((error) => { errors.push({ provider: "inaturalist", message: error.message }); return null; })
        : null;
      const [gbif, video] = await Promise.all([gbifPromise, videoPromise]);
      const gbifSource = gbif?.usageKey ? `https://www.gbif.org/species/${gbif.usageKey}` : "";
      const image = commonsImage || inatImage || {};
      const videoId = clean(video?.videoId || video?.id);
      const videoUrl = clean(video?.url) || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");
      const title = clean(video?.title);
      const quality = /\b4k\b|2160p/i.test(title) ? "4K" : /\bfull\s*hd\b|1080p|\bhd\b/i.test(title) ? "HD" : "";
      const gbifConfidence = Number(gbif?.confidence);
      const matchConfidence = Number.isFinite(gbifConfidence)
        ? Math.min(1, Math.max(0, gbifConfidence / 100))
        : Number(row.confidence) || 0;
      const providerClass = clean(gbif?.class);
      let wikidataClass = null;
      if (!isCanonicalScientificClass(providerClass) || !providerClass) {
        const entityId = clean(wikiEn?.pageprops?.wikibase_item || wikiVi?.pageprops?.wikibase_item);
        if (entityId) {
          try {
            wikidataClass = await resolveWikidataClass(fetchImpl, entityId, requestTimeoutMs);
          } catch (error) {
            errors.push({ provider: "wikidata", message: error.message });
          }
        }
      }
      const resolvedScientificName = clean(gbif?.canonicalName || gbif?.scientificName || row.scientificName);
      const resolvedCommonNameEn = clean(wikiEn?.title || row.commonNameEn || resolvedScientificName);
      const resolvedCommonNameVi = clean(wikiVi?.title || row.commonNameVi);
      const resolvedClassName = providerClass && isCanonicalScientificClass(providerClass) ? providerClass : wikidataClass?.className || clean(row.className);
      const resolvedOrder = clean(gbif?.order || row.order);
      const resolvedFamily = clean(gbif?.family || row.family);
      const descriptionFacts = {
        scientificName: resolvedScientificName,
        lifeState: row.lifeState,
        className: resolvedClassName,
        order: resolvedOrder,
        family: resolvedFamily,
      };
      const candidate = {
        scientificName: resolvedScientificName,
        commonNameEn: resolvedCommonNameEn,
        commonNameVi: resolvedCommonNameVi,
        kingdom: gbif?.kingdom,
        phylum: taxonomyKey(gbif?.phylum),
        className: resolvedClassName,
        order: resolvedOrder,
        family: resolvedFamily,
        genus: gbif?.genus,
        species: gbif?.species,
        rank: gbif?.rank,
        authoritativeTaxonId: gbif?.usageKey ? `GBIF:${gbif.usageKey}` : "",
        taxonomyClassProvider: providerClass ? "gbif" : wikidataClass ? "wikidata" : "",
        taxonomyClassConfidence: providerClass || wikidataClass ? matchConfidence : "",
        taxonomyClassSourceUrl: providerClass ? gbifSource : wikidataClass?.sourceUrl || "",
        taxonomyClassRationale: providerClass ? "GBIF accepted taxon classification" : wikidataClass ? "Wikidata taxonomic parent chain" : "",
        descriptionEn: authoredTaxonomyDescription({ ...descriptionFacts, locale: "en", commonName: resolvedCommonNameEn }),
        descriptionVi: authoredTaxonomyDescription({ ...descriptionFacts, locale: "vi", commonName: resolvedCommonNameVi || resolvedCommonNameEn }),
        ...image,
        imageRetrievedAt: image.coverUrl ? clock().toISOString().slice(0, 10) : "",
        youtubeUrl: videoUrl,
        youtubeId: videoId,
        videoTitle: title,
        videoQualityHint: quality,
        sourceUrls: appendSources(row.sourceUrls, gbifSource, wikiEn?.fullurl, wikiVi?.fullurl, wikidataClass?.sourceUrl, image.imageSourceUrl, videoUrl),
        confidence: matchConfidence,
      };
      const merged = changeSet(row, candidate, { overwrite, overwriteFields });
      if (gbif && matchConfidence > (Number(merged.row.confidence) || 0)) {
        merged.changes.push({
          field: "confidence",
          before: merged.row.confidence ?? "",
          after: matchConfidence,
        });
        merged.row.confidence = matchConfidence;
      }
      if (merged.changes.length) {
        merged.row.fetchedAt = clock().toISOString();
        merged.row.provider = appendSources(
          row.provider,
          gbif ? "gbif" : "",
          inatImage ? "inaturalist" : "",
          wikiEn ? "wikipedia-en" : "",
          wikiVi ? "wikipedia-vi" : "",
          commonsImage ? "wikimedia" : "",
          wikidataClass ? "wikidata" : "",
          video ? "youtube" : "",
        );
      }
      return {
        ...merged,
        confidence: matchConfidence,
        errors,
      };
    },
  });
}

export async function enrichCatalog({
  store,
  enricher,
  organismIds = [],
  apply = false,
  overwrite = false,
  overwriteFields = [],
  minConfidence = 0.8,
  limit = Infinity,
  batchSize = 10,
  onProgress = () => {},
} = {}) {
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") throw new TypeError("Catalog enrichment requires a store");
  if (!enricher || typeof enricher.enrich !== "function") throw new TypeError("Catalog enrichment requires an enricher");
  const confidenceThreshold = Number(minConfidence);
  if (!Number.isFinite(confidenceThreshold) || confidenceThreshold < 0 || confidenceThreshold > 1) {
    throw new RangeError("Minimum confidence must be between 0 and 1");
  }
  const rows = store.read() ?? [];
  const selected = new Set(organismIds.filter(Boolean));
  const report = [];
  let scanned = 0;
  let changed = 0;
  let rejected = 0;
  let failed = 0;
  let pendingChanges = 0;

  for (let index = 0; index < rows.length && scanned < limit; index += 1) {
    if (selected.size && !selected.has(rows[index].organismId)) continue;
    scanned += 1;
    try {
      const result = await enricher.enrich(rows[index], { overwrite, overwriteFields });
      const confidence = Number(result.confidence ?? result.row?.confidence) || 0;
      const belowThreshold = result.changes.length > 0 && confidence < confidenceThreshold;
      if (belowThreshold) {
        rejected += 1;
      } else if (result.changes.length) {
        changed += 1;
        if (apply) {
          rows[index] = result.row;
          pendingChanges += 1;
        }
      }
      report.push({
        organismId: rows[index].organismId,
        changes: result.changes,
        confidence,
        rejected: belowThreshold,
        errors: result.errors || [],
      });
    } catch (error) {
      failed += 1;
      report.push({ organismId: rows[index].organismId, changes: [], errors: [{ provider: "pipeline", message: error.message }] });
    }
    if (apply && pendingChanges && scanned % Math.max(1, batchSize) === 0) {
      store.write(rows);
      pendingChanges = 0;
    }
    onProgress({ scanned, changed, rejected, failed, organismId: rows[index].organismId });
  }
  if (apply && pendingChanges) store.write(rows);
  return {
    summary: {
      scanned,
      changed,
      rejected,
      unchanged: scanned - changed - rejected - failed,
      failed,
      written: apply ? changed : 0,
    },
    report,
  };
}
