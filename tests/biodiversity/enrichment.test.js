import assert from "node:assert/strict";
import test from "node:test";

import { createBioEnricher, enrichCatalog, parseYouTubeVideoSearchHtml } from "../../app/Modules/Critterarium/Application/Ingestion/enrichment.js";

function response(body, { contentType = "application/json", ok = true } = {}) {
  return {
    ok,
    headers: { get: (name) => name.toLowerCase() === "content-type" ? contentType : "" },
    json: async () => body,
    arrayBuffer: async () => Buffer.from("image"),
  };
}

function rightsFreeCommonsImage() {
  return response({ query: { pages: { 3: {
    fullurl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
    imageinfo: [{
      url: "https://upload.wikimedia.org/lion.jpg",
      descriptionurl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
      width: 2560,
      height: 1440,
      extmetadata: {
        LicenseShortName: { value: "CC0" },
        LicenseUrl: { value: "https://creativecommons.org/publicdomain/zero/1.0/" },
      },
    }],
  } } } });
}

test("API-first enrichment composes GBIF, bilingual Wikipedia, and a natural-history video", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const value = String(url);
    if (value.includes("api.gbif.org")) {
      return response({ usageKey: 5219404, kingdom: "Animalia", phylum: "Chordata", class: "Mammalia", order: "Carnivora", family: "Felidae", genus: "Panthera", species: "Panthera leo", confidence: 99 });
    }
    if (value.includes("commons.wikimedia.org")) return rightsFreeCommonsImage();
    if (value.includes("vi.wikipedia.org")) {
      return response({ query: { pages: { 2: { title: "Sư tử", extract: "Sư tử là một loài mèo lớn.", fullurl: "https://vi.wikipedia.org/wiki/Sư_tử" } } } });
    }
    return response({ query: { pages: { 1: { title: "Lion", extract: "The lion is a large cat.", fullurl: "https://en.wikipedia.org/wiki/Lion", original: { source: "https://upload.wikimedia.org/lion.jpg" } } } } });
  };
  const youtubeSearch = async () => ({
    videos: [
      { videoId: "short", title: "Lion clip", seconds: 20, views: 100, url: "https://www.youtube.com/watch?v=short" },
      { videoId: "wild-4k", title: "Lions in the Wild 4K", seconds: 900, views: 10000, url: "https://www.youtube.com/watch?v=wild-4k" },
    ],
  });
  const enricher = createBioEnricher({ fetchImpl, youtubeSearch, clock: () => new Date("2026-08-01T02:00:00Z") });
  const result = await enricher.enrich({
    organismId: "animalia-panthera-leo",
    realmId: "animalia",
    commonNameEn: "Lion",
    commonNameVi: "Sư tử",
    scientificName: "Panthera leo",
    phylum: "",
    className: "",
    lifeState: "extant",
  });

  assert.equal(result.row.phylum, "chordata");
  assert.equal(result.row.className, "Mammalia");
  assert.equal(result.row.descriptionEn, "Lion (Panthera leo) is an extant taxon classified in class Mammalia, order Carnivora, and family Felidae.");
  assert.equal(result.row.descriptionVi, "Sư tử (Panthera leo) là một đơn vị phân loại hiện sinh thuộc lớp Mammalia, bộ Carnivora và họ Felidae.");
  assert.notEqual(result.row.descriptionEn, "The lion is a large cat.");
  assert.equal(result.row.coverUrl, "https://upload.wikimedia.org/lion.jpg");
  assert.equal(result.row.youtubeId, "wild-4k");
  assert.equal(result.row.videoQualityHint, "4K");
  assert.equal(result.row.fetchedAt, "2026-08-01T02:00:00.000Z");
  assert.ok(calls.some((url) => url.includes("api.gbif.org")));
  assert.ok(result.changes.some((change) => change.field === "descriptionVi"));
});

test("enrichment resolves authoritative identity, marks Full HD imagery, and skips a dead YouTube result", async () => {
  const fetchImpl = async (url) => {
    const value = String(url);
    if (value.includes("api.gbif.org")) {
      return response({
        usageKey: 5219404,
        canonicalName: "Panthera leo",
        scientificName: "Panthera leo Linnaeus, 1758",
        rank: "SPECIES",
        kingdom: "Animalia",
        phylum: "Chordata",
        class: "Mammalia",
        confidence: 99,
      });
    }
    if (value.includes("youtube.com/oembed") && value.includes("dead-video")) return response({}, { ok: false });
    if (value.includes("youtube.com/oembed")) return response({ title: "Lions in the wild 4K" });
    if (value.includes("commons.wikimedia.org")) return rightsFreeCommonsImage();
    if (value.includes("vi.wikipedia.org")) {
      return response({ query: { pages: { 2: { title: "Sư tử", extract: "Sư tử là một loài mèo lớn.", fullurl: "https://vi.wikipedia.org/wiki/Sư_tử" } } } });
    }
    return response({ query: { pages: { 1: {
      title: "Lion",
      extract: "The lion is a large cat.",
      fullurl: "https://en.wikipedia.org/wiki/Lion",
      original: { source: "https://upload.wikimedia.org/lion.jpg", width: 2560, height: 1440 },
    } } } });
  };
  const enricher = createBioEnricher({
    fetchImpl,
    youtubeSearch: async () => ({ videos: [
      { videoId: "dead-video", title: "Lion wildlife documentary 4K", seconds: 900, views: 999999, url: "https://www.youtube.com/watch?v=dead-video" },
      { videoId: "live-video", title: "Lions in the wild 4K", seconds: 600, views: 1000, url: "https://www.youtube.com/watch?v=live-video" },
    ] }),
  });

  const result = await enricher.enrich({ scientificName: "lion", commonNameEn: "lion", lifeState: "extant" }, { overwrite: true });

  assert.equal(result.row.scientificName, "Panthera leo");
  assert.equal(result.row.commonNameEn, "Lion");
  assert.equal(result.row.commonNameVi, "Sư tử");
  assert.equal(result.row.authoritativeTaxonId, "GBIF:5219404");
  assert.equal(result.row.imageQualityHint, "Full HD");
  assert.equal(result.row.youtubeId, "live-video");
  assert.equal(result.row.videoQualityHint, "4K");
});

test("enrichment fills a GBIF Class gap from sourced Wikidata taxonomy", async () => {
  const fetchImpl = async (url) => {
    const value = String(url);
    if (value.includes("/v1/species/match")) return response({ usageKey: 44, canonicalName: "Example fish", kingdom: "Animalia", phylum: "Chordata", confidence: 99 });
    if (value.includes("/v1/species/44/parents")) return response([]);
    if (value.includes("/v1/species/44")) return response({ key: 44, canonicalName: "Example fish", kingdom: "Animalia", phylum: "Chordata", rank: "SPECIES" });
    if (value.includes("query.wikidata.org")) return response({ results: { bindings: [{
      class: { type: "uri", value: "https://www.wikidata.org/entity/Q127282" },
      className: { type: "literal", value: "Actinopterygii" },
    }] } });
    if (value.includes("commons.wikimedia.org")) return response({ query: { pages: {} } });
    if (value.includes("vi.wikipedia.org")) return response({ query: { pages: { 2: { title: "Cá ví dụ" } } } });
    return response({ query: { pages: { 1: { title: "Example fish", pageprops: { wikibase_item: "Q100" } } } } });
  };
  const enricher = createBioEnricher({
    fetchImpl,
    youtubeSearch: async () => ({ videos: [{ videoId: "example-video", title: "Example fish HD", seconds: 300, views: 10, url: "https://www.youtube.com/watch?v=example-video" }] }),
  });

  const result = await enricher.enrich({ scientificName: "Example fish", commonNameEn: "Example fish", lifeState: "extant" }, { overwrite: true });

  assert.equal(result.row.className, "Actinopterygii");
  assert.match(result.row.sourceUrls, /wikidata\.org\/entity\/Q127282/);
});

test("enrichment calls only the selected providers", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    return response({
      usageKey: 5219404,
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      confidence: 99,
    });
  };
  const enricher = createBioEnricher({
    fetchImpl,
    providers: ["gbif"],
    youtubeSearch: async () => { throw new Error("YouTube must not run"); },
  });

  const result = await enricher.enrich({
    organismId: "animalia-panthera-leo",
    realmId: "animalia",
    commonNameEn: "Lion",
    scientificName: "Panthera leo",
    lifeState: "extant",
    confidence: 0.7,
  });

  assert.equal(calls.length, 2);
  assert.ok(calls.every((url) => /api\.gbif\.org/.test(url)));
  assert.equal(result.row.phylum, "chordata");
  assert.equal(result.confidence, 0.99);
  assert.equal(result.row.confidence, 0.99);
  assert.equal(result.row.descriptionEn, "Lion (Panthera leo) is an extant taxon classified in class Mammalia.");
  assert.deepEqual(result.errors, []);
});

test("catalog enrichment previews by default and writes only when apply is true", async () => {
  let rows = [{ organismId: "one", realmId: "animalia", commonNameEn: "Lion", scientificName: "Panthera leo", phylum: "chordata", className: "mammalia", lifeState: "extant" }];
  const store = { read: () => structuredClone(rows), write: (next) => { rows = structuredClone(next); } };
  const enricher = { enrich: async (row) => ({ row: { ...row, descriptionEn: "Filled", confidence: 1 }, changes: [{ field: "descriptionEn", before: "", after: "Filled" }], confidence: 1 }) };

  const preview = await enrichCatalog({ store, enricher, apply: false });
  assert.equal(preview.summary.changed, 1);
  assert.equal(rows[0].descriptionEn, undefined);

  const applied = await enrichCatalog({ store, enricher, apply: true });
  assert.equal(applied.summary.written, 1);
  assert.equal(rows[0].descriptionEn, "Filled");
});

test("catalog enrichment never applies a candidate below the confidence threshold", async () => {
  let rows = [{
    organismId: "one",
    realmId: "animalia",
    commonNameEn: "Lion",
    scientificName: "Panthera leo",
    lifeState: "extant",
  }];
  let writes = 0;
  const store = {
    read: () => structuredClone(rows),
    write: (next) => {
      writes += 1;
      rows = structuredClone(next);
    },
  };
  const enricher = {
    enrich: async (row) => ({
      row: { ...row, descriptionEn: "Uncertain description", confidence: 0.42 },
      changes: [{ field: "descriptionEn", before: "", after: "Uncertain description" }],
      confidence: 0.42,
      errors: [],
    }),
  };

  const result = await enrichCatalog({ store, enricher, apply: true, minConfidence: 0.8 });

  assert.equal(result.summary.changed, 0);
  assert.equal(result.summary.rejected, 1);
  assert.equal(result.summary.written, 0);
  assert.equal(result.report[0].rejected, true);
  assert.equal(writes, 0);
  assert.equal(rows[0].descriptionEn, undefined);
});

test("selected fields can be refreshed without overwriting the rest of the organism", async () => {
  const fetchImpl = async (url) => {
    const value = String(url);
    if (value.includes("api.gbif.org")) {
      return response({ usageKey: 5219404, canonicalName: "Panthera leo", kingdom: "Animalia", phylum: "Chordata", class: "Mammalia", order: "Carnivora", family: "Felidae", confidence: 99 });
    }
    if (value.includes("commons.wikimedia.org")) return response({ query: { pages: {} } });
    if (value.includes("vi.wikipedia.org")) return response({ query: { pages: { 2: { title: "Sư tử", extract: "Third-party prose must not be copied." } } } });
    return response({ query: { pages: { 1: { title: "Lion", extract: "Third-party prose must not be copied." } } } });
  };
  const enricher = createBioEnricher({
    fetchImpl,
    providers: ["gbif", "wikipedia-en", "wikipedia-vi"],
    youtubeSearch: async () => ({ videos: [] }),
  });

  const result = await enricher.enrich({
    organismId: "animalia-panthera-leo",
    scientificName: "Panthera leo",
    commonNameEn: "African lion",
    commonNameVi: "Sư tử châu Phi",
    descriptionEn: "Previously copied prose.",
    descriptionVi: "Văn bản cũ.",
    coverUrl: "https://example.test/keep.jpg",
    lifeState: "extant",
    confidence: 0.99,
  }, { overwriteFields: ["descriptionEn", "descriptionVi"] });

  assert.match(result.row.descriptionEn, /extant taxon classified in class Mammalia/);
  assert.match(result.row.descriptionVi, /hiện sinh thuộc lớp Mammalia/);
  assert.equal(result.row.coverUrl, "https://example.test/keep.jpg");
  assert.ok(result.changes.some((change) => change.field === "descriptionEn"));
  assert.ok(result.changes.some((change) => change.field === "descriptionVi"));
});

test("English names do not masquerade as Vietnamese localization", async () => {
  const fetchImpl = async () => response({
    usageKey: 5219404,
    canonicalName: "Panthera leo",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    confidence: 99,
  });
  const enricher = createBioEnricher({
    fetchImpl,
    providers: ["gbif"],
    youtubeSearch: async () => ({ videos: [] }),
  });

  const result = await enricher.enrich({
    organismId: "animalia-panthera-leo",
    scientificName: "Panthera leo",
    commonNameEn: "Lion",
    commonNameVi: "",
    lifeState: "extant",
    confidence: 0.99,
  });

  assert.equal(result.row.commonNameVi, "");
  assert.equal(result.changes.some((change) => change.field === "commonNameVi"), false);
  assert.match(result.row.descriptionVi, /^Lion \(Panthera leo\)/);
});

test("Wikimedia reads are identified, maxlag-aware, sequential, and retry a 429", async () => {
  const calls = [];
  let active = 0;
  let maxActive = 0;
  let englishAttempts = 0;
  const fetchImpl = async (url, options = {}) => {
    const value = String(url);
    active += 1;
    maxActive = Math.max(maxActive, active);
    await Promise.resolve();
    active -= 1;
    calls.push({ url: value, headers: options.headers || {} });
    if (value.includes("en.wikipedia.org") && englishAttempts++ === 0) {
      return {
        ok: false,
        status: 429,
        headers: { get: (name) => name.toLowerCase() === "retry-after" ? "0" : "" },
      };
    }
    return response({ query: { pages: {} } });
  };
  const enricher = createBioEnricher({
    fetchImpl,
    providers: ["wikipedia-en", "wikipedia-vi"],
    youtubeSearch: async () => ({ videos: [] }),
  });

  await enricher.enrich({
    organismId: "animalia-panthera-leo",
    scientificName: "Panthera leo",
    commonNameEn: "Lion",
    commonNameVi: "Sư tử",
    lifeState: "extant",
    confidence: 0.99,
  }, { overwriteFields: ["commonNameEn", "commonNameVi"] });

  assert.equal(englishAttempts, 2);
  assert.equal(maxActive, 1);
  assert.ok(calls.every((call) => new URL(call.url).searchParams.get("maxlag") === "5"));
  assert.ok(calls.every((call) => call.headers["User-Agent"]?.includes("github.com/vector148/cozymuseum")));
});

test("dependency-free YouTube parser extracts video candidates from initial data", () => {
  const payload = {
    contents: [{ videoRenderer: {
      videoId: "abc123def45",
      title: { runs: [{ text: "Wild tigers in 4K" }] },
      lengthText: { simpleText: "12:34" },
      viewCountText: { simpleText: "1,234,567 views" },
    } }],
  };
  const html = `<script>var ytInitialData = ${JSON.stringify(payload)};</script>`;
  assert.deepEqual(parseYouTubeVideoSearchHtml(html), [{
    videoId: "abc123def45",
    title: "Wild tigers in 4K",
    seconds: 754,
    views: 1234567,
    url: "https://www.youtube.com/watch?v=abc123def45",
  }]);
});

test("enrichment keeps CC0 imagery and rejects attribution-bearing Commons imagery without article fallback", async () => {
  const run = async (license) => {
    const fetchImpl = async (url) => {
      const value = String(url);
      if (value.includes("api.gbif.org")) {
        return response({ usageKey: 1, canonicalName: "Panthera leo", kingdom: "Animalia", phylum: "Chordata", class: "Mammalia", confidence: 99 });
      }
      if (value.includes("commons.wikimedia.org")) {
        return response({ query: { pages: { 3: {
          fullurl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
          imageinfo: [{
            url: "https://upload.wikimedia.org/lion.jpg",
            descriptionurl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
            width: 3840,
            height: 2160,
            extmetadata: {
              LicenseShortName: { value: license },
              LicenseUrl: { value: license === "CC0" ? "https://creativecommons.org/publicdomain/zero/1.0/" : "https://creativecommons.org/licenses/by-sa/4.0/" },
            },
          }],
        } } } });
      }
      if (value.includes("vi.wikipedia.org")) return response({ query: { pages: {} } });
      return response({ query: { pages: { 1: {
        title: "Lion",
        original: { source: "https://upload.wikimedia.org/article-thumbnail.jpg", width: 3840, height: 2160 },
      } } } });
    };
    const enricher = createBioEnricher({
      fetchImpl,
      providers: ["gbif", "wikipedia-en", "wikipedia-vi"],
      youtubeSearch: async () => ({ videos: [] }),
      clock: () => new Date("2026-08-01T02:00:00Z"),
    });
    return enricher.enrich({ scientificName: "Panthera leo", commonNameEn: "Lion", lifeState: "extant" }, { overwrite: true });
  };

  const accepted = await run("CC0");
  assert.equal(accepted.row.coverUrl, "https://upload.wikimedia.org/lion.jpg");
  assert.equal(accepted.row.imageLicense, "CC0");
  assert.equal(accepted.row.imageRightsStatus, "rights-free");
  assert.equal(accepted.row.imageRetrievedAt, "2026-08-01");

  const denied = await run("CC BY-SA 4.0");
  assert.equal(denied.row.coverUrl, undefined);
  assert.equal(denied.row.imageLicense, undefined);
});
