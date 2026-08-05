#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { inspectBiodiversityCatalog } from "../app/biodiversity/doctor.js";
import { createBioEnricher, ENRICHMENT_PROVIDERS, enrichCatalog } from "../app/biodiversity/enrichment.js";
import { createOrganismIntake } from "../app/biodiversity/organism-intake.js";
import { organismStore } from "../app/biodiversity/runtime.js";

const args = process.argv.slice(2);
const command = args[0] || "help";

function option(name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || fallback : fallback;
}

function flag(name) {
  return args.includes(name);
}

function providers() {
  const value = option("--providers", option("--provider"));
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : ENRICHMENT_PROVIDERS;
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

if (command === "add") {
  const selectedProviders = providers();
  const inputPath = option("--input");
  const items = inputPath
    ? JSON.parse(readFileSync(resolve(inputPath), "utf8"))
    : [{
      name: option("--name"),
      scientificName: option("--scientific-name"),
      commonNameEn: option("--common-name-en"),
      commonNameVi: option("--common-name-vi"),
      realmId: option("--realm"),
      lifeState: option("--life-state", "extant"),
    }];
  const intake = createOrganismIntake({ store: organismStore, enricher: createBioEnricher({ providers: selectedProviders }) });
  output({
    command,
    mode: flag("--apply") ? "apply" : "preview",
    providers: selectedProviders,
    ...await intake.add(items, {
      apply: flag("--apply"),
      minConfidence: Number(option("--min-confidence", "0.8")),
      strictMedia: flag("--strict-media"),
    }),
  });
} else if (command === "enrich") {
  const selectedProviders = providers();
  const requestedId = option("--id");
  const organismIds = organismStore.read()
    .filter((row) => !requestedId || row.organismId === requestedId)
    .map((row) => row.organismId);
  const result = await enrichCatalog({
    store: organismStore,
    enricher: createBioEnricher({ providers: selectedProviders }),
    organismIds,
    apply: flag("--apply"),
    overwrite: flag("--overwrite"),
    overwriteFields: option("--overwrite-fields").split(",").map((item) => item.trim()).filter(Boolean),
    minConfidence: Number(option("--min-confidence", "0.8")),
  });
  output({ command, mode: flag("--apply") ? "apply" : "preview", providers: selectedProviders, ...result });
} else if (command === "doctor") {
  const report = inspectBiodiversityCatalog(organismStore.read());
  output(report);
  if (!report.ok) process.exitCode = 1;
} else {
  output({
    product: "CozyMuseum",
    commands: {
      add: "npm run bio -- add --name <scientific-or-common-name> [--realm animalia|plantae_fungi|sar|microverse] [--life-state extant|extinct] [--providers gbif,wikipedia-en,wikipedia-vi,youtube] [--min-confidence 0..1] [--apply] | --input <organisms.json>",
      enrich: "npm run bio -- enrich [--id <organism-id>] [--providers gbif,wikipedia-en,wikipedia-vi,youtube] [--min-confidence 0..1] [--overwrite | --overwrite-fields field,field] [--apply]",
      doctor: "npm run bio -- doctor",
    },
  });
}
