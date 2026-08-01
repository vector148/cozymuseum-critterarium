import assert from "node:assert/strict";
import test from "node:test";

import {
  imageRightsFailures,
  isRightsFreeLicense,
  normalizeRightsFreeLicense,
} from "../../app/biodiversity/media-rights.js";

test("rights-free allowlist accepts only CC0 and Public Domain declarations", () => {
  assert.equal(normalizeRightsFreeLicense("CC0 1.0"), "CC0");
  assert.equal(normalizeRightsFreeLicense("Public domain"), "Public Domain");
  assert.equal(isRightsFreeLicense("CC0"), true);
  assert.equal(isRightsFreeLicense("Public Domain Mark 1.0"), true);

  for (const denied of ["CC BY 4.0", "CC BY-SA 4.0", "GFDL 1.2", "fair use", "", "See linked Wikimedia source"]) {
    assert.equal(isRightsFreeLicense(denied), false, denied);
  }
});

test("a displayed remote image requires complete internal rights-free proof and forbids local media", () => {
  const valid = {
    coverUrl: "https://upload.wikimedia.org/example.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
    imageLicense: "CC0",
    imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    imageRightsStatus: "rights-free",
    imageRetrievedAt: "2026-08-01",
  };
  assert.deepEqual(imageRightsFailures(valid), []);
  assert.deepEqual(imageRightsFailures({}), []);
  assert.ok(imageRightsFailures({ ...valid, localCover: "/images/species/animalia/example.jpg" }).includes("local catalog media is forbidden"));
  assert.ok(imageRightsFailures({ ...valid, imageLicense: "CC BY 4.0" }).includes("image license is not CC0 or Public Domain"));
  assert.ok(imageRightsFailures({ ...valid, imageSourceUrl: "" }).includes("missing exact image source"));
});
