import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

test("Critterarium uses the canonical product name at internal architecture boundaries", () => {
  // After PRD-0021: canonical paths are in app/Modules/Critterarium/
  const required = [
    "app/Modules/Critterarium/Http/Controllers/CritterariumController.js",
    "app/Modules/Critterarium/Http/Routes/critterarium.js",
    "resources/js/modules/critterarium/hooks/useCritterarium.js",
    "resources/js/modules/critterarium/Critterarium.jsx",
  ];
  for (const path of required) assert.equal(existsSync(join(root, path)), true, path);

  const app = readFileSync(join(root, "resources/js/App.jsx"), "utf8");
  const apiRoutes = readFileSync(join(root, "app/Http/Routes/api.js"), "utf8");
  assert.match(app, /useCritterarium/);
  assert.match(app, /modules\/critterarium/);
  assert.match(apiRoutes, /Modules\/Critterarium/);
  assert.match(apiRoutes, /router\.use\("\/atlas", createCritterariumRouter/);
});
