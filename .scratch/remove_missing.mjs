import { readExcel, writeExcel } from '../app/catalog/adapters/excel-store.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const files = ['animalia.xlsx', 'microverse.xlsx', 'plantae-fungi.xlsx', 'sar.xlsx'];
let allMissing = [];

for (const file of files) {
  const rows = readExcel(file);
  const valid = [];
  
  for (const row of rows) {
    if (row.coverUrl) {
      valid.push(row);
    } else {
      allMissing.push(row);
    }
  }
  
  console.log(`Processed ${file}: ${valid.length} valid, ${rows.length - valid.length} missing.`);
  
  // Write back to Excel
  writeExcel(file, valid);
}

// Generate Markdown
let md = `# Danh sách sinh vật nợ data (Thiếu ảnh bản quyền CC0 / Public Domain)\n\n`;
md += `Tổng cộng: ${allMissing.length} sinh vật\n\n`;
md += `| Tên khoa học | Tên tiếng Việt | Lớp (Class) | Mức phân loại |\n`;
md += `|---|---|---|---|\n`;

for (const m of allMissing) {
  const name = m.scientificName || m.name || 'N/A';
  const vi = m.commonNameVi || m.commonNameEn || 'N/A';
  const cls = m.className || 'N/A';
  const rank = m.rank || 'N/A';
  md += `| ${name} | ${vi} | ${cls} | ${rank} |\n`;
}

const docsDir = '../docs';
if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
}

writeFileSync(`${docsDir}/con-no-data.md`, md, 'utf-8');
console.log(`\nWritten missing data to docs/con-no-data.md`);
