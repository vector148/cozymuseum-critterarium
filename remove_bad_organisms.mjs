import { readExcel, writeExcel } from "./app/catalog/adapters/excel-store.js";

const badIds = new Set([
  // PDF links - browser cannot display as images
  "animalia-makaira-nigricans",
  "animalia-perisphinctes-tiziani",
  "animalia-thunnus-tonggol",
  "plantae-fungi-crossosoma-californicum",
  "plantae-fungi-glossopteris-browniana",
  "plantae-fungi-lepidodendron-sternbergii",
  "plantae-fungi-paracryphia-alticola",
  "plantae-fungi-picramnia-latifolia",
  "sar-zoomastigophora",
  // TIF links - won't render in browsers
  "animalia-elephas-maximus",
  "animalia-paradoxides-davidis",
  // Zoo/captive context - not natural history museum appropriate
  "plantae-fungi-pandanus-tectorius",
]);

const files = [
  "animalia.xlsx",
  "plantae-fungi.xlsx",
  "sar.xlsx",
  "microverse.xlsx"
];

let totalRemoved = 0;

for (const file of files) {
  const data = readExcel(file);
  if (!data || data.length === 0) continue;

  const before = data.length;
  const filtered = data.filter(row => !badIds.has(row.organismId));
  const removed = before - filtered.length;

  if (removed > 0) {
    writeExcel(file, filtered);
    console.log(`${file}: removed ${removed} organisms`);
    totalRemoved += removed;
  }
}

console.log(`\nTotal removed: ${totalRemoved}`);
