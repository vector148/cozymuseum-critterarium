import { readExcel, writeExcel } from '../app/catalog/adapters/excel-store.js';

const file = 'animalia.xlsx';
const rows = readExcel(file);
const valid = rows.filter(r => r.organismId !== 'animalia-homo-sapiens' && r.scientificName !== 'Homo sapiens');

console.log(`Original: ${rows.length}, Now: ${valid.length}`);
writeExcel(file, valid);
