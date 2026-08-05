import { existsSync, rmSync } from "node:fs";

import { createExcelStore } from "../catalog/adapters/excel-store.js";

export const REALM_WORKBOOKS = Object.freeze({
  animalia: "animalia.xlsx",
  plantae_fungi: "plantae-fungi.xlsx",
  sar: "sar.xlsx",
  microverse: "microverse.xlsx",
});

export const LEGACY_UNIFIED_WORKBOOK = "organisms.xlsx";

function normalizedRow(row) {
  return {
    ...row,
    encountered: row.encountered === true || String(row.encountered).toLowerCase() === "true",
    encounterDate: String(row.encounterDate || ""),
    rarityScore: row.rarityScore ?? "",
  };
}

export function createOrganismExcelStore({ databaseDir } = {}) {
  const excel = createExcelStore(databaseDir ? { databaseDir } : {});
  const workbookEntries = Object.entries(REALM_WORKBOOKS);

  function hasRealmWorkbooks() {
    return workbookEntries.some(([, filename]) => existsSync(excel.pathFor(filename)));
  }

  function initialize() {
    for (const [, filename] of workbookEntries) {
      if (!existsSync(excel.pathFor(filename))) excel.write(filename, []);
    }
    return Object.fromEntries(workbookEntries.map(([realmId, filename]) => [realmId, excel.pathFor(filename)]));
  }

  function read() {
    if (!hasRealmWorkbooks()) return excel.read(LEGACY_UNIFIED_WORKBOOK).map(normalizedRow);
    return workbookEntries.flatMap(([realmId, filename]) => excel.read(filename).map((row) => normalizedRow({ ...row, realmId })));
  }

  function write(rows) {
    if (!Array.isArray(rows)) throw new TypeError("Organism rows must be an array");
    const unknownRealms = [...new Set(rows.map((row) => row.realmId).filter((realmId) => !REALM_WORKBOOKS[realmId]))];
    if (unknownRealms.length) throw new Error(`Unknown CozyMuseum workbook owner: ${unknownRealms.join(", ")}`);
    for (const [realmId, filename] of workbookEntries) {
      excel.write(filename, rows.filter((row) => row.realmId === realmId).map(normalizedRow));
    }
    return rows.map(normalizedRow);
  }

  function migrateUnifiedWorkbook({ removeLegacy = false } = {}) {
    const legacyPath = excel.pathFor(LEGACY_UNIFIED_WORKBOOK);
    const rows = excel.read(LEGACY_UNIFIED_WORKBOOK).map(normalizedRow);
    if (!rows.length) return { input: 0, written: 0, removedLegacy: false };
    write(rows);
    if (removeLegacy) rmSync(legacyPath, { force: true });
    return { input: rows.length, written: rows.length, removedLegacy: removeLegacy && !existsSync(legacyPath) };
  }

  return Object.freeze({
    read,
    write,
    initialize,
    migrateUnifiedWorkbook,
    paths: () => Object.fromEntries(workbookEntries.map(([realmId, filename]) => [realmId, excel.pathFor(filename)])),
  });
}
