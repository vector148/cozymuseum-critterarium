import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { shellNavigation } from "../../resources/js/shell-surface.js";

test("Critterarium shell exposes only Atlas and encounter-eligible Hall of Fame", () => {
  assert.deepEqual(shellNavigation({ encounterEnabled: true }).map((item) => item.id), ["living", "hall_of_fame"]);
  assert.deepEqual(shellNavigation({ encounterEnabled: false }).map((item) => item.id), ["living"]);

  const serialized = JSON.stringify(shellNavigation({ encounterEnabled: true }));
  assert.doesNotMatch(serialized, /foyer|reading|journal|curatale|supabase/i);
});

test("Critterarium shell frame is branded, local, and free of platform-only surfaces", async () => {
  const [app, css, index] = await Promise.all([
    readFile(new URL("../../resources/js/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../../resources/css/glass.css", import.meta.url), "utf8"),
    readFile(new URL("../../resources/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(app, /cozymuseum-sidebar-logo\.svg/);
  assert.match(app, /MuseumNavIcon/);
  assert.match(css, /@import url\("\.\/fonts\.css"\)/);
  assert.doesNotMatch(css, /fonts\.googleapis|@import\s+url\(["']https?:/);
  assert.doesNotMatch(`${app}\n${index}`, /reading room|reading_room|curatale|supabase|google analytics|vercel/i);
  assert.doesNotMatch(index, /user-scalable=no|maximum-scale=1/);
});

test("Critterarium shell publishes the verified 2.0 release contract", async () => {
  const [packageText, readme, notices, viteConfig] = await Promise.all([
    readFile(new URL("../../package.json", import.meta.url), "utf8"),
    readFile(new URL("../../README.md", import.meta.url), "utf8"),
    readFile(new URL("../../THIRD_PARTY_NOTICES", import.meta.url), "utf8"),
    readFile(new URL("../../vite.config.js", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.equal(packageJson.version, "2.0.0");
  assert.match(readme, /Current shell version:\*\* `2\.0\.0`/);
  assert.match(notices, /Be Vietnam Pro[\s\S]*Exo 2[\s\S]*SIL Open Font License 1\.1/);
  assert.match(viteConfig, /publicDir:\s*"\.\.\/public"/);
});
