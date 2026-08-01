import assert from "node:assert/strict";
import test from "node:test";

import { extractLegacyObservationCandidates } from "../../app/biodiversity/legacy-observations.js";

test("legacy observation extraction preserves raw candidates and separates taxonomy references", () => {
  const source = [
    "1", "Chordata", "Ngành Dây sống", "脊索動物門", "Có dây sống", "~530 triệu năm → nay",
    "2", "Monarch Butterfly (Bướm vua)", "Danaus plexippus", "Nymphalidae", "Lepidoptera", "Insecta",
    "3", "Monarch butterfly", "Danaus plexippus", "Nymphalidae", "Lepidoptera", "Insecta",
  ].join("\n");

  const result = extractLegacyObservationCandidates(source);

  assert.deepEqual(result.summary, {
    rawCandidates: 3,
    organismCandidates: 2,
    taxonomyReferences: 1,
    uniqueOrganismCandidates: 1,
  });
  assert.equal(result.candidates.length, 3);
  assert.equal(result.candidates[0].candidateKind, "taxonomy-reference");
  assert.equal(result.candidates[1].candidateKind, "organism-candidate");
  assert.equal(result.candidates[2].duplicateOf, result.candidates[1].candidateId);
});

test("legacy fossil headings mark only their declared candidate block as extinct", () => {
  const source = [
    "Các hóa thạch ACNH 2020 (2 loài)",
    "1", "T. rex", "Tyrannosaurus rex", "Tyrannosauridae", "Theropoda", "Reptilia",
    "SIÊU GIỚI ARCHAEPLASTIDA",
    "2", "Lion", "Panthera leo", "Felidae", "Carnivora", "Mammalia",
  ].join("\n");

  const result = extractLegacyObservationCandidates(source);

  assert.equal(result.candidates[0].lifeStateHint, "extinct");
  assert.equal(result.candidates[1].lifeStateHint, undefined);
});
