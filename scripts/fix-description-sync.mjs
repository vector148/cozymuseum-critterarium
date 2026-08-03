import xlsx from 'xlsx';
import fs from 'fs';

// This script:
// 1. Fixes animalia.xlsx: copies 'description' -> 'descriptionEn' where descriptionEn is empty or shorter
// 2. Overwrites the fun facts from all batch JSONs into both descriptionEn and descriptionVi for all realms

const realms = ['animalia', 'plantae-fungi', 'sar', 'microverse'];

// Load all fun fact batches
const batchFiles = fs.readdirSync('.scratch').filter(f => f.startsWith('fun_facts_batch_') && f.endsWith('.json'));
const factMap = new Map();
for (const file of batchFiles) {
  const facts = JSON.parse(fs.readFileSync(`.scratch/${file}`, 'utf8'));
  for (const f of facts) {
    if (f.scientificName) {
      factMap.set(f.scientificName, f);
    }
  }
}
console.log(`Loaded ${factMap.size} fun facts from ${batchFiles.length} batch files`);

let totalFixed = 0;
let totalFunFact = 0;

for (const realm of realms) {
  const filePath = `database/${realm}.xlsx`;
  if (!fs.existsSync(filePath)) continue;

  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

  let changed = false;
  for (const row of data) {
    // Step 1: For animalia, copy old 'description' -> 'descriptionEn' if descriptionEn is shorter
    if (realm === 'animalia' && row.description) {
      const oldDesc = row.description.trim();
      const existingEn = (row.descriptionEn || '').trim();
      // Prefer the fun fact (description) over old short descriptionEn
      if (oldDesc.length > existingEn.length) {
        row.descriptionEn = oldDesc;
        changed = true;
        totalFixed++;
      }
    }

    // Step 2: Apply fun facts from batch JSONs -> always use descriptionEn and descriptionVi
    if (factMap.has(row.scientificName)) {
      const fact = factMap.get(row.scientificName);
      if (fact.description) {
        row.descriptionEn = fact.description;
        changed = true;
      }
      if (fact.descriptionVi) {
        row.descriptionVi = fact.descriptionVi;
        changed = true;
      }
      totalFunFact++;
    }
  }

  if (changed) {
    const newSheet = xlsx.utils.json_to_sheet(data);
    wb.Sheets[sheetName] = newSheet;
    xlsx.writeFile(wb, filePath);
    console.log(`Updated ${filePath}`);
  }
}

console.log(`\nDone! Fixed ${totalFixed} animalia EN copies, applied ${totalFunFact} fun facts.`);
