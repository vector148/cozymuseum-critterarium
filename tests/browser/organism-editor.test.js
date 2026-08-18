import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOrganismEditDraft,
  buildOrganismUpdatePayload,
  coverNeedsImport,
  saveOrganismDraft,
} from "../../resources/js/modules/critterarium/organism-editor.js";

test("an existing organism becomes a complete edit draft", () => {
  const draft = buildOrganismEditDraft({
    organismId: "A00042",
    realmId: "animalia",
    scientificName: "Panthera leo",
    commonNameEn: "Lion",
    commonNameVi: "Su tu",
    descriptionEn: "An extant big cat.",
    habitatVi: "Dong co",
    rarityScore: 8.5,
    encountered: true,
    displayName: "Lion",
  });

  assert.equal(draft.scientificName, "Panthera leo");
  assert.equal(draft.commonNameVi, "Su tu");
  assert.equal(draft.descriptionEn, "An extant big cat.");
  assert.equal(draft.habitatVi, "Dong co");
  assert.equal(draft.score, "8.5");
  assert.equal("organismId" in draft, false);
  assert.equal("displayName" in draft, false);
});

test("the update payload protects identity, realm ownership, and localized display fields", () => {
  const payload = buildOrganismUpdatePayload({
    organismId: "P99999",
    realmId: "plantae_fungi",
    scientificName: "Panthera leo leo",
    commonNameEn: "African lion",
    score: "9.2",
    displayName: "Must not persist",
    displayDescription: "Must not persist",
  });

  assert.equal(payload.scientificName, "Panthera leo leo");
  assert.equal(payload.commonNameEn, "African lion");
  assert.equal(payload.rarityScore, 9.2);
  assert.equal(payload.encountered, true);
  assert.equal("score" in payload, false);
  assert.equal("organismId" in payload, false);
  assert.equal("realmId" in payload, false);
  assert.equal("displayName" in payload, false);
  assert.equal("displayDescription" in payload, false);
});

test("edit mode updates the selected organism instead of creating a duplicate", async () => {
  const calls = [];
  const result = await saveOrganismDraft({
    mode: "edit",
    initialItem: { organismId: "A00042", realmId: "animalia" },
    draft: { scientificName: "Panthera leo", commonNameEn: "Lion", score: "7" },
    api: {
      createOrganism: async (payload) => calls.push(["create", payload]),
      updateOrganism: async (id, payload) => {
        calls.push(["update", id, payload]);
        return { organismId: id, ...payload };
      },
    },
  });

  assert.equal(result.organismId, "A00042");
  assert.deepEqual(calls.map((call) => call[0]), ["update"]);
  assert.equal(calls[0][1], "A00042");
  assert.equal("organismId" in calls[0][2], false);
});

test("an unchanged edit cover is not imported again", () => {
  const initialItem = { coverUrl: "https://example.com/lion.jpg" };
  assert.equal(coverNeedsImport({ mode: "edit", initialItem, coverUrl: "https://example.com/lion.jpg" }), false);
  assert.equal(coverNeedsImport({ mode: "edit", initialItem, coverUrl: "https://example.com/new.jpg" }), true);
  assert.equal(coverNeedsImport({ mode: "create", initialItem: null, coverUrl: "https://example.com/lion.jpg" }), true);
});
