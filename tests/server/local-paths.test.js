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

test("the default catalog cannot read the legacy shared CozyMuseum data directory", () => {
  const normalized = DEFAULT_DATABASE_DIR.replaceAll("\\", "/").toLowerCase();
  assert.ok(normalized.endsWith("/cozymuseum/critterarium/data"), normalized);
  const previousData = process.env.COZYMUSEUM_DATA_DIR;
  const previousImages = process.env.COZYMUSEUM_IMAGES_DIR;
  try {
    delete process.env.COZYMUSEUM_DATA_DIR;
    delete process.env.COZYMUSEUM_IMAGES_DIR;
    assert.ok(catalogImagesDir().replaceAll("\\", "/").toLowerCase()
      .endsWith("/cozymuseum/critterarium/images"));
  } finally {
    if (previousData === undefined) delete process.env.COZYMUSEUM_DATA_DIR;
    else process.env.COZYMUSEUM_DATA_DIR = previousData;
    if (previousImages === undefined) delete process.env.COZYMUSEUM_IMAGES_DIR;
    else process.env.COZYMUSEUM_IMAGES_DIR = previousImages;
  }
});
