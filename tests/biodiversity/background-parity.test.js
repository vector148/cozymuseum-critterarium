import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("Animalia and Plantae backgrounds stay byte-identical to the approved Realm assets", () => {
  assert.equal(
    sha256(resolve(root, "public/bg-animalia.jpg")),
    "ae3090b9a75a72808c67ce8a6ca4d3b7ee27fcb58d2db6d6b16dbc3963d6c0c1",
  );
  assert.equal(
    sha256(resolve(root, "public/bg-plantae-fungi.jpg")),
    "b0ec06117b394bc07d048a8384727ced8b43d9204e050e195a723e28f2980d71",
  );

  const css = readFileSync(resolve(root, "resources/css/glass.css"), "utf8");
  assert.match(css, /html\.theme-bio-animalia\s*\{[^}]*url\('\/bg-animalia\.jpg'\)/s);
  assert.match(css, /html\.theme-bio-plantae_fungi\s*\{[^}]*url\('\/bg-plantae-fungi\.jpg'\)/s);
});

test("taxonomy controls use a translucent blurred scrim without changing Realm backgrounds", () => {
  const css = readFileSync(resolve(root, "resources/css/glass.css"), "utf8");
  assert.match(css, /\.atlas-controls\s*\{[^}]*--control-scrim:[^}]*rgba\(2, 14, 20, 0\.62\)[^}]*rgba\(2, 14, 20, 0\.44\)[^}]*background:\s*var\(--control-scrim\)[^}]*backdrop-filter:\s*blur\(32px\) saturate\(155%\)/s);
  assert.match(css, /\.atlas-controls \.glass-input\s*\{[^}]*rgba\(1, 12, 18, 0\.52\)/s);
});
