import assert from "node:assert/strict";
import { relative, resolve } from "node:path";
import test from "node:test";

import { DEFAULT_DATABASE_DIR, catalogImagesDir } from "../../app/Modules/Critterarium/Infrastructure/Storage/local-paths.js";

test("the default catalog data location stays outside the distributable shell", () => {
  const shellRoot = resolve(import.meta.dirname, "../..");
  const relativeData = relative(shellRoot, DEFAULT_DATABASE_DIR);
  assert.ok(relativeData.startsWith("..") || relativeData.includes(":"));
  assert.notEqual(catalogImagesDir(), resolve(shellRoot, "images"));
});
