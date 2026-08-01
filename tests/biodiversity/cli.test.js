import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("CozyMuseum CLI advertises provider selection and a confidence threshold", () => {
  const result = spawnSync(process.execPath, ["scripts/cozymuseum.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const help = JSON.parse(result.stdout);
  assert.match(help.commands.enrich, /--providers/);
  assert.match(help.commands.enrich, /--min-confidence/);
  assert.match(help.commands.enrich, /--overwrite-fields/);
  assert.match(help.commands.migrate, /--from <legacy-backup>/);
  assert.match(help.commands.extractObservations, /database\/seeds\/legacy-observations\.txt/);
  assert.match(help.commands.taxonomy, /taxonomy-class-corrections\.json/);
  assert.match(help.commands.curateObservations, /--preview-digest/);
  assert.match(help.commands.curateObservations, /--offset/);
  assert.match(help.commands.snapshotSeed, /database\/seeds\/catalog\.json/);
  assert.match(help.commands.add, /--name <scientific-or-common-name>/);
  assert.match(help.commands.add, /--input <organisms\.json>/);
});

test("legacy migration refuses an implicit deleted sibling path", () => {
  const result = spawnSync(process.execPath, ["scripts/cozymuseum.mjs", "migrate"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /explicit --from <legacy-backup>/);
});
