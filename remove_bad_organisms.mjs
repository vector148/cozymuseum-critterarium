import { readExcel, writeExcel } from "./app/catalog/adapters/excel-store.js";

const badIds = [
  "animalia-chrysochloris-asiatica",
  "animalia-rhynchocyon-petersi",
  "animalia-engraulidae",
  "plantae_fungi-artocarpus",
  "plantae_fungi-barringtonia",
  "plantae_fungi-basella-alba",
  "animalia-rattus-norvegicus",
  "animalia-anabas-testudineus",
  "animalia-suncus-murinus",
  "animalia-carnivora",
  "animalia-bos-taurus",
  "plantae_fungi-ocimum-basilicum",
  "plantae_fungi-piper-nigrum"
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
  
  const originalLength = data.length;
  const filteredData = data.filter(row => !badIds.includes(row.organismId));
  
  if (filteredData.length < originalLength) {
    writeExcel(file, filteredData);
    console.log(`Updated ${file}: removed ${originalLength - filteredData.length} organisms completely.`);
  }
}
