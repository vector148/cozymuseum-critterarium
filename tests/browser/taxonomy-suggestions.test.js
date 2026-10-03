import assert from "node:assert/strict";
import test from "node:test";

import { suggestTaxonomy } from "../../resources/js/modules/critterarium/taxonomy-suggestions.js";

test("common names offer bounded classes without guessing a fish class", () => {
  assert.deepEqual(suggestTaxonomy("Cow"), [{ realmId: "animalia", phylum: "Chordata", className: "Mammalia" }]);
  assert.deepEqual(suggestTaxonomy("Reptile"), [{ realmId: "animalia", phylum: "Chordata", className: "Reptilia" }]);
  assert.deepEqual(suggestTaxonomy("Fish").map((item) => item.className), ["Actinopterygii", "Sarcopterygii", "Chondrichthyes"]);
  assert.deepEqual(suggestTaxonomy("Lobe-finned fish").map((item) => item.className), ["Sarcopterygii"]);
  assert.deepEqual(suggestTaxonomy("Pufferfish"), []);
});
