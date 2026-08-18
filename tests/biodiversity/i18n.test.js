import assert from "node:assert/strict";
import test from "node:test";

import { availableAtlasModes, t } from "../../resources/js/i18n.js";

test("life-state copy uses taxon-level Extant and Extinct concepts", () => {
  assert.equal(t("en", "living"), "Galleries");
  assert.equal(t("vi", "living"), "Khu trưng bày");
  assert.equal(t("en", "extantStatus"), "Extant");
  assert.equal(t("vi", "extantStatus"), "Hiện sinh");
  assert.equal(t("en", "extinctStatus"), "Extinct");
  assert.equal(t("vi", "extinctStatus"), "Tuyệt chủng");
});

test("Hall of Fame navigation exists only when Realm metadata enables encounters", () => {
  assert.deepEqual(availableAtlasModes(true), ["living", "hall_of_fame"]);
  assert.deepEqual(availableAtlasModes(false), ["living"]);
});
