import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// Usage: node scripts/apply-fun-facts.mjs <path-to-json>

const jsonPath = process.argv[2];
if (!jsonPath || !fs.existsSync(jsonPath)) {
  console.error("Please provide a valid JSON file path.");
  process.exit(1);
}

const facts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const factMap = new Map();
for (const f of facts) {
  if (f.scientificName) {
    factMap.set(f.scientificName, f);
  }
}

const realms = ['animalia', 'plantae-fungi', 'sar', 'microverse'];
let totalUpdated = 0;

for (const realm of realms) {
  const filePath = `database/${realm}.xlsx`;
  if (!fs.existsSync(filePath)) continue;

  try {
    const wb = xlsx.readFile(filePath);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" }); // keep empty cells

    let updated = false;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row.scientificName && factMap.has(row.scientificName)) {
        const fact = factMap.get(row.scientificName);
      if (fact.description) row.descriptionEn = fact.description;
      if (fact.descriptionVi) row.descriptionVi = fact.descriptionVi;
        updated = true;
        totalUpdated++;
      }
    }

    if (updated) {
      const newSheet = xlsx.utils.json_to_sheet(data);
      wb.Sheets[sheetName] = newSheet;
      xlsx.writeFile(wb, filePath);
      console.log(`Updated ${realm}.xlsx`);
    }
  } catch(e) {
    console.error(`Failed on ${realm}:`, e);
  }
}

console.log(`Total organisms updated: ${totalUpdated}`);
