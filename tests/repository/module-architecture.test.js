import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

// Lát 1 — contract test cho cây module đích (sẽ ĐỎ trước khi di chuyển)
test("Critterarium module tree satisfies PRD-0021 target architecture", () => {
  const required = [
    // Backend
    "app/Modules/Critterarium/Domain/Taxonomy/taxonomy.js",
    "app/Modules/Critterarium/Domain/Organisms/organism-id.js",
    "app/Modules/Critterarium/Domain/MediaRights/media-rights.js",
    "app/Modules/Critterarium/Infrastructure/Catalog/excel-store.js",
    "app/Modules/Critterarium/Infrastructure/Catalog/memory-store.js",
    "app/Modules/Critterarium/Infrastructure/Catalog/organism-store.js",
    "app/Modules/Critterarium/Application/Catalog/catalog.js",
    "app/Modules/Critterarium/Application/Ingestion/organism-intake.js",
    "app/Modules/Critterarium/Application/Ingestion/enrichment.js",
    "app/Modules/Critterarium/Application/Diagnostics/doctor.js",
    "app/Modules/Critterarium/Http/Controllers/CritterariumController.js",
    "app/Modules/Critterarium/Http/Routes/critterarium.js",
    // Operations
    "app/Modules/Operations/Release/cleanroom.js",
    // Frontend feature module
    "resources/js/modules/critterarium/Critterarium.jsx",
    "resources/js/modules/critterarium/hooks/useCritterarium.js",
    "resources/js/modules/critterarium/api/index.js",
  ];
  for (const path of required) {
    assert.equal(existsSync(join(root, path)), true, `Missing target path: ${path}`);
  }
});

test("Critterarium old implementation tree is removed after migration", () => {
  const forbidden = [
    "app/biodiversity/catalog.js",
    "app/biodiversity/doctor.js",
    "app/biodiversity/enrichment.js",
    "app/biodiversity/media-rights.js",
    "app/biodiversity/organism-id.js",
    "app/biodiversity/organism-intake.js",
    "app/biodiversity/taxonomy.js",
    "app/biodiversity/runtime.js",
    "app/catalog/adapters/excel-store.js",
    "app/catalog/adapters/memory-store.js",
    "app/Http/Controllers/CritterariumController.js",
    "app/Http/Routes/api/critterarium.js",
    "resources/js/api/index.js",
    "resources/js/data/encounter-overlay-store.js",
    "resources/js/hooks/useCritterarium.js",
    "resources/js/pages/Critterarium.jsx",
  ];
  for (const path of forbidden) {
    assert.equal(existsSync(join(root, path)), false, `Old path still exists: ${path}`);
  }
});

test("Composition roots reference module paths not old paths", () => {
  const app = readFileSync(join(root, "resources/js/App.jsx"), "utf8");
  const apiRoutes = readFileSync(join(root, "app/Http/Routes/api.js"), "utf8");

  // App.jsx must import from module, not from pages/
  assert.doesNotMatch(app, /pages\/Critterarium\.jsx/, "App.jsx still imports from pages/");
  assert.match(app, /modules\/critterarium/, "App.jsx does not import from critterarium module");

  // api.js must import from Modules/, not from biodiversity/
  assert.doesNotMatch(apiRoutes, /biodiversity\/runtime/, "api.js still imports from biodiversity/runtime");
  assert.match(apiRoutes, /Modules\/Critterarium/, "api.js does not reference Modules/Critterarium");
});
