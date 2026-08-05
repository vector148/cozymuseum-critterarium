import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("CozyMuseum CLI exposes only public shell intake, enrichment, and doctor commands", () => {
  const result = spawnSync(process.execPath, ["scripts/cozymuseum.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const help = JSON.parse(result.stdout);
  assert.match(help.commands.enrich, /--providers/);
  assert.match(help.commands.enrich, /--min-confidence/);
  assert.match(help.commands.enrich, /--overwrite-fields/);
  assert.match(help.commands.add, /--name <scientific-or-common-name>/);
  assert.match(help.commands.add, /--input <organisms\.json>/);
  assert.deepEqual(Object.keys(help.commands).sort(), ["add", "doctor", "enrich"]);
});
