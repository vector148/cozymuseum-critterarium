import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the shell exposes one localized create and edit workflow", async () => {
  const [app, critterarium, detail, dialog] = await Promise.all([
    readFile(new URL("../../resources/js/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../../resources/js/modules/critterarium/Critterarium.jsx", import.meta.url), "utf8"),
    readFile(new URL("../../resources/js/modules/critterarium/components/OrganismDetailModal.jsx", import.meta.url), "utf8"),
    readFile(new URL("../../resources/js/modules/critterarium/components/OrganismCreateDialog.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(app, /locale-header-btn/);
  assert.match(app, /setLocale\(locale === "en" \? "vi" : "en"\)/);
  assert.match(detail, /onEdit/);
  assert.match(detail, /onDelete/);
  assert.match(critterarium, /mode="edit"/);
  assert.match(critterarium, /updateOrganism/);
  assert.match(critterarium, /removeOrganism/);
  assert.match(dialog, /initialItem/);
  assert.match(dialog, /saveOrganismDraft/);
  assert.match(dialog, /t\(locale,/);
});
