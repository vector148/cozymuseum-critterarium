import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import * as XLSX from "xlsx";

import { migrateLegacyCozyMuseum } from "../../app/biodiversity/legacy-migration.js";

test("legacy migration maps all four workbook realms without mutating its source", () => {
  const sourceDatabaseDir = mkdtempSync(join(tmpdir(), "cozymuseum-legacy-"));
  const realmFiles = [
    ["dong_vat.xlsx", "Lion", "Panthera leo"],
    ["thuc_vat.xlsx", "Sunflower", "Helianthus annuus"],
    ["sar.xlsx", "Diatom", "Bacillariophyceae"],
    ["sieu_vi.xlsx", "Influenza A virus", "Influenza A virus"],
  ];

  for (const [filename, title, scientificName] of realmFiles) {
    const sheet = XLSX.utils.json_to_sheet([{
      id: 1,
      title,
      original_title: scientificName,
      subcategory: `${title} description`,
      phylum: "other",
      class: "all",
      status: "active",
      cover: "https://example.test/cover.jpg",
      source: "https://example.test/source",
    }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Data");
    XLSX.writeFile(workbook, join(sourceDatabaseDir, filename));
  }

  const before = Object.fromEntries(realmFiles.map(([filename]) => [
    filename,
    readFileSync(join(sourceDatabaseDir, filename)).toString("base64"),
  ]));
  let targetRows = [];
  const store = {
    read: () => structuredClone(targetRows),
    write: (rows) => {
      targetRows = structuredClone(rows);
      return structuredClone(targetRows);
    },
  };

  try {
    const result = migrateLegacyCozyMuseum({ sourceDatabaseDir, store });
    assert.equal(result.summary.inserted, 4);
    assert.equal(targetRows.length, 4);
    assert.deepEqual(
      targetRows.map((row) => row.realmId),
      ["animalia", "plantae_fungi", "sar", "microverse"],
    );
    assert.equal(targetRows[0].scientificName, "Panthera leo");
    assert.equal(targetRows[0].lifeState, "extant");
    assert.equal(targetRows[0].className, "");
    assert.equal(targetRows[0].coverUrl, "");
    assert.equal(targetRows[0].imageSourceUrl, "");
    assert.equal(new Set(targetRows.map((row) => row.organismId)).size, 4);
    for (const [filename] of realmFiles) {
      assert.equal(readFileSync(join(sourceDatabaseDir, filename)).toString("base64"), before[filename]);
    }

    targetRows[0] = {
      ...targetRows[0],
      descriptionVi: "Mô tả đã được làm giàu",
      youtubeUrl: "https://www.youtube.com/watch?v=wild-lion",
      provider: "gbif | wikipedia-vi | youtube",
      confidence: 0.99,
    };

    const second = migrateLegacyCozyMuseum({ sourceDatabaseDir, store });
    assert.equal(second.summary.inserted, 0);
    assert.equal(second.summary.unchanged, 4);
    assert.equal(targetRows.length, 4);
    assert.equal(targetRows[0].descriptionVi, "Mô tả đã được làm giàu");
    assert.equal(targetRows[0].youtubeUrl, "https://www.youtube.com/watch?v=wild-lion");
    assert.equal(targetRows[0].localCover, undefined);
    assert.equal(targetRows[0].provider, "gbif | wikipedia-vi | youtube");
    assert.equal(targetRows[0].confidence, 0.99);
  } finally {
    rmSync(sourceDatabaseDir, { recursive: true, force: true });
  }
});
