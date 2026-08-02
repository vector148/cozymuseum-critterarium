import { readExcel, writeExcel } from "./app/catalog/adapters/excel-store.js";

const badIds = [
  "animalia-rattus-norvegicus",
  "animalia-chrysochloris-asiatica",
  "animalia-suncus-murinus",
  "animalia-rhynchocyon-petersi",
  "animalia-carnivora",
  "animalia-bos-taurus",
  "plantae_fungi-artocarpus",
  "plantae_fungi-barringtonia",
  "plantae_fungi-basella-alba",
  "plantae_fungi-ocimum-basilicum",
  "plantae_fungi-piper-nigrum",
  "animalia-anabas-testudineus",
  "animalia-engraulidae" // Anchovy (drawing) from screenshot
];

const files = [
  "animalia.xlsx",
  "plantae-fungi.xlsx",
  "sar.xlsx",
  "microverse.xlsx"
];

for (const file of files) {
  const data = readExcel(file);
  if (!data || data.length === 0) continue;
  
  let changed = 0;
  for (const row of data) {
    if (badIds.includes(row.organismId)) {
      if (row.coverUrl) {
        console.log(`[QA] Clearing bad image for ${row.organismId}`);
        row.coverUrl = "";
        row.imageSourceUrl = "";
        row.imageWidth = "";
        row.imageHeight = "";
        row.imageLicense = "";
        row.imageLicenseUrl = "";
        row.imageRightsStatus = "";
        row.imageQualityHint = "";
        row.imageRetrievedAt = "";
        changed++;
      }
    }
  }
  
  if (changed > 0) {
    writeExcel(file, data);
    console.log(`Updated ${file}: cleared ${changed} bad images`);
  }
}
