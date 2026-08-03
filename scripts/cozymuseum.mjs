#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { inspectBiodiversityCatalog } from "../app/biodiversity/doctor.js";
import {
  createBioEnricher,
  ENRICHMENT_PROVIDERS,
  enrichCatalog,
} from "../app/biodiversity/enrichment.js";
import { migrateLegacyCozyMuseum } from "../app/biodiversity/legacy-migration.js";
import { extractLegacyObservationCandidates } from "../app/biodiversity/legacy-observations.js";
import { createGbifCandidateMatcher, curateLegacyObservationCandidates } from "../app/biodiversity/observation-curation.js";
import { createOrganismIntake } from "../app/biodiversity/organism-intake.js";
import { organismStore } from "../app/biodiversity/runtime.js";
import { syncSeedOrganisms } from "../app/biodiversity/seeds.js";
import { applyTaxonomyClassCorrections } from "../app/biodiversity/taxonomy-corrections.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const envPath = resolve(root, ".env");
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
} catch {
  // Ignore env file errors
}

const args = process.argv.slice(2);
const command = args[0] || "help";

function option(name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || fallback : fallback;
}

function flag(name) {
  return args.includes(name);
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function writeAtomically(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(temporary, bytes);
    renameSync(temporary, path);
  } finally {
    if (existsSync(temporary)) rmSync(temporary, { force: true });
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

if (command === "migrate") {
  const requestedLegacyRoot = option("--from");
  if (!requestedLegacyRoot) throw new Error("migrate requires an explicit --from <legacy-backup> path");
  const legacyRoot = resolve(root, requestedLegacyRoot);
  const data = migrateLegacyCozyMuseum({
    sourceDatabaseDir: resolve(legacyRoot, "database"),
    store: organismStore,
  });
  output({
    command,
    legacyRoot,
    data: data.summary,
    dataFailures: data.failures,
  });
} else if (command === "split-store") {
  output({ command, ...organismStore.migrateUnifiedWorkbook({ removeLegacy: true }) });
} else if (command === "seed") {
  const seedPath = resolve(root, option("--file", "database/seeds/catalog.json"));
  const seeds = JSON.parse(readFileSync(seedPath, "utf8"));
  output({ command, seedPath, ...syncSeedOrganisms({ store: organismStore, seeds }) });
} else if (command === "snapshot-seed") {
  const seedPath = resolve(root, option("--output", "database/seeds/catalog.json"));
  const rows = organismStore.read()
    .map((row) => ({ ...row }))
    .sort((left, right) => `${left.realmId}:${left.organismId}`.localeCompare(`${right.realmId}:${right.organismId}`));
  const report = inspectBiodiversityCatalog(rows);
  if (!report.ok) throw new Error("Refusing to snapshot an invalid catalog");
  writeAtomically(seedPath, Buffer.from(`${JSON.stringify(rows, null, 2)}\n`, "utf8"));
  output({ command, seedPath, total: rows.length, realms: report.realms, lifeStates: report.lifeStates });
} else if (command === "extract-observations") {
  const sourcePath = resolve(root, option("--source", "database/seeds/legacy-observations.txt"));
  const archivePath = resolve(root, option("--archive", "database/seeds/legacy-observations.txt"));
  const manifestPath = resolve(root, option("--output", "database/seeds/legacy-observation-candidates.json"));
  const sourceBytes = readFileSync(sourcePath);
  const extracted = extractLegacyObservationCandidates(sourceBytes.toString("utf8"));
  writeAtomically(archivePath, sourceBytes);
  writeAtomically(manifestPath, Buffer.from(`${JSON.stringify(extracted, null, 2)}\n`, "utf8"));
  output({
    command,
    sourcePath,
    archivePath,
    manifestPath,
    sourceSha256: sha256(sourceBytes),
    archiveSha256: sha256(readFileSync(archivePath)),
    ...extracted.summary,
  });
} else if (command === "enrich") {
  const apply = flag("--apply");
  const providerOption = option("--providers", option("--provider"));
  const providers = providerOption
    ? providerOption.split(",").map((provider) => provider.trim()).filter(Boolean)
    : ENRICHMENT_PROVIDERS;
  const minConfidence = Number(option("--min-confidence", "0.8"));
  const overwriteFields = option("--overwrite-fields", "").split(",").map((field) => field.trim()).filter(Boolean);
  const requestedId = option("--id");
  const requestedRealm = option("--realm");
  const requestedLifeState = option("--life-state");
  const rows = organismStore.read();
  const organismIds = rows
    .filter((row) => !requestedId || row.organismId === requestedId)
    .filter((row) => !requestedRealm || row.realmId === requestedRealm)
    .filter((row) => !requestedLifeState || row.lifeState === requestedLifeState)
    .map((row) => row.organismId);
  const result = await enrichCatalog({
    store: organismStore,
    enricher: createBioEnricher({ providers }),
    organismIds,
    apply,
    overwrite: flag("--overwrite"),
    overwriteFields,
    minConfidence,
    limit: Number(option("--limit", "Infinity")),
    batchSize: Number(option("--batch-size", "10")),
    onProgress: ({ scanned, organismId }) => process.stderr.write(`[${scanned}/${organismIds.length}] ${organismId}\n`),
  });
  output({
    command,
    mode: apply ? "apply" : "preview",
    providers,
    overwriteFields,
    minConfidence,
    selected: organismIds.length,
    enrichment: result.summary,
    changes: result.report.filter((item) => item.changes.length || item.errors.length).map((item) => ({
      organismId: item.organismId,
      fields: item.changes.map((change) => change.field),
      errors: item.errors,
    })),
  });
} else if (command === "add") {
  const apply = flag("--apply");
  const providerOption = option("--providers", option("--provider"));
  const providers = providerOption
    ? providerOption.split(",").map((provider) => provider.trim()).filter(Boolean)
    : ENRICHMENT_PROVIDERS;
  const inputPath = option("--input");
  const items = inputPath
    ? JSON.parse(readFileSync(resolve(root, inputPath), "utf8"))
    : [{
      name: option("--name"),
      scientificName: option("--scientific-name"),
      commonNameEn: option("--common-name-en"),
      commonNameVi: option("--common-name-vi"),
      realmId: option("--realm"),
      lifeState: option("--life-state", "extant"),
      unsplashId: option("--unsplash-id"),
    }];
  const intake = createOrganismIntake({
    store: organismStore,
    enricher: createBioEnricher({ providers }),
  });
  const result = await intake.add(items, {
    apply,
    minConfidence: Number(option("--min-confidence", "0.8")),
    strictMedia: flag("--strict-media"),
  });
  output({
    command,
    mode: apply ? "apply" : "preview",
    providers,
    summary: result.summary,
    items: result.items.map((item) => ({
      status: item.status,
      input: item.input,
      organismId: item.row?.organismId || item.organismId || "",
      scientificName: item.row?.scientificName || "",
      realmId: item.row?.realmId || "",
      reason: item.reason || "",
      errors: item.errors || [],
    })),
  });
} else if (command === "curate-observations") {
  const apply = flag("--apply");
  const offset = Number(option("--offset", "0"));
  const limit = Number(option("--limit", "20"));
  const minConfidence = Number(option("--min-confidence", "0.8"));
  const manifestPath = resolve(root, option("--file", "database/seeds/legacy-observation-candidates.json"));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const result = await curateLegacyObservationCandidates({
    manifest,
    store: organismStore,
    matcher: createGbifCandidateMatcher(),
    apply,
    approvedPreviewDigest: option("--preview-digest"),
    minConfidence,
    offset,
    limit,
    clock: () => new Date(),
  });
  const reportPath = resolve(root, option(
    "--report",
    `reports/observation-curation/offset-${offset}-limit-${limit}-${apply ? "apply" : "preview"}.json`,
  ));
  writeAtomically(reportPath, Buffer.from(`${JSON.stringify({
    command,
    mode: apply ? "apply" : "preview",
    manifestPath,
    offset,
    limit,
    minConfidence,
    ...result,
  }, null, 2)}\n`, "utf8"));
  output({
    command,
    mode: apply ? "apply" : "preview",
    manifestPath,
    reportPath,
    offset,
    limit,
    minConfidence,
    previewDigest: result.previewDigest,
    summary: result.summary,
    proposals: result.proposals.map(({ candidateId, row }) => ({
      candidateId,
      organismId: row.organismId,
      scientificName: row.scientificName,
      realmId: row.realmId,
      className: row.className,
      confidence: row.confidence,
    })),
    rejections: result.rejections.map(({ candidateId, reason, confidence, error }) => ({ candidateId, reason, confidence, error })),
  });
} else if (command === "taxonomy") {
  const manifestPath = resolve(root, option("--file", "database/seeds/taxonomy-class-corrections.json"));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const result = applyTaxonomyClassCorrections({ store: organismStore, manifest, apply: flag("--apply") });
  output({ command, mode: flag("--apply") ? "apply" : "preview", manifestPath, ...result });
  if (result.summary.missing) process.exitCode = 1;
} else if (command === "doctor") {
  const report = inspectBiodiversityCatalog(organismStore.read());
  output(report);
  if (!report.ok) process.exitCode = 1;
} else {
  output({
    product: "CozyMuseum",
    commands: {
      migrate: "npm run bio -- migrate --from <legacy-backup>",
      splitStore: "npm run bio -- split-store",
      seed: "npm run bio -- seed [--file database/seeds/catalog.json]",
      add: "npm run bio -- add --name <scientific-or-common-name> [--realm animalia|plantae_fungi|sar|microverse] [--life-state extant|extinct] [--providers gbif,wikipedia-en,wikipedia-vi,youtube] [--min-confidence 0..1] [--apply] | --input <organisms.json>",
      snapshotSeed: "npm run bio -- snapshot-seed [--output database/seeds/catalog.json]",
      extractObservations: "npm run bio -- extract-observations [--source database/seeds/legacy-observations.txt] [--archive database/seeds/legacy-observations.txt] [--output database/seeds/legacy-observation-candidates.json]",
      curateObservations: "npm run bio -- curate-observations [--file database/seeds/legacy-observation-candidates.json] [--offset N] [--limit N] [--min-confidence 0..1] [--preview-digest SHA256 --apply] [--report reports/path.json]",
      enrich: "npm run bio -- enrich [--id <organism-id>] [--realm <realm>] [--life-state extant|extinct] [--providers gbif,wikipedia-en,wikipedia-vi,youtube] [--min-confidence 0..1] [--limit N] [--batch-size N] [--overwrite | --overwrite-fields field,field] [--apply]",
      taxonomy: "npm run bio -- taxonomy [--file database/seeds/taxonomy-class-corrections.json] [--apply]",
      doctor: "npm run bio -- doctor",
    },
  });
}
