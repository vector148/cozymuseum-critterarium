import assert from "node:assert/strict";
import test from "node:test";

import { inspectBiodiversityCatalog } from "../../app/biodiversity/doctor.js";

function row(overrides = {}) {
  return {
    organismId: "animalia-clownfish",
    realmId: "animalia",
    commonNameEn: "Clownfish",
    scientificName: "Amphiprioninae",
    phylum: "chordata",
    className: "Actinopterygii",
    lifeState: "extant",
    ...overrides,
  };
}

test("catalog doctor rejects presentation aliases used as scientific Classes", () => {
  const report = inspectBiodiversityCatalog([
    row(),
    row({ organismId: "animalia-shark", scientificName: "Carcharodon carcharias", className: "Fishes" }),
  ]);

  assert.equal(report.ok, false);
  assert.deepEqual(report.invalidClassNames, [{ organismId: "animalia-shark", className: "Fishes" }]);
});

test("catalog doctor permits an explicitly unresolved Class without hiding it as a fake taxon", () => {
  const report = inspectBiodiversityCatalog([row({ className: "" })]);

  assert.equal(report.ok, true);
  assert.equal(report.missing.className, 1);
  assert.deepEqual(report.identityFailures, []);
  assert.deepEqual(report.invalidClassNames, []);
});

test("catalog doctor blocks any displayed image outside the rights-free allowlist", () => {
  const report = inspectBiodiversityCatalog([
    row({
      coverUrl: "https://upload.wikimedia.org/lion.jpg",
      imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Lion.jpg",
      imageLicense: "CC BY-SA 4.0",
      imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      imageRightsStatus: "rights-free",
      imageRetrievedAt: "2026-08-01",
    }),
  ]);

  assert.equal(report.ok, false);
  assert.equal(report.invalidImageRights.length, 1);
  assert.equal(report.invalidImageRights[0].organismId, "animalia-clownfish");
});
