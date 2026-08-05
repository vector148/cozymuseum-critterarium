import * as XLSX from "xlsx";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

function defaultUserDataDir() {
  if (process.env.COZYMUSEUM_DATA_DIR?.trim()) return resolve(process.env.COZYMUSEUM_DATA_DIR.trim());
  const applicationData = process.env.LOCALAPPDATA || process.env.APPDATA;
  return applicationData
    ? resolve(applicationData, "CozyMuseum", "data")
    : resolve(homedir(), ".local", "share", "CozyMuseum", "data");
}

export const DEFAULT_DATABASE_DIR = defaultUserDataDir();

function assertCatalogFilename(filename, allowedExtensions) {
  if (
    typeof filename !== "string" ||
    !filename ||
    filename.includes("..") ||
    filename.startsWith("/") || filename.startsWith("\\\\") || /^[a-zA-Z]:/.test(filename) ||
    !allowedExtensions.includes(extname(filename).toLowerCase())
  ) {
    throw new Error(`Invalid catalog filename: ${String(filename)}`);
  }
}

function replaceFileAtomically(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(temporaryPath, bytes);
    renameSync(temporaryPath, path);
  } finally {
    if (existsSync(temporaryPath)) rmSync(temporaryPath, { force: true });
  }
}

export function createExcelStore({ databaseDir = DEFAULT_DATABASE_DIR } = {}) {
  const root = resolve(databaseDir);

  function pathFor(filename, extensions = [".xlsx"]) {
    assertCatalogFilename(filename, extensions);
    return resolve(root, filename);
  }

  function read(filename) {
    const path = pathFor(filename);
    if (!existsSync(path)) return [];
    const workbook = XLSX.read(readFileSync(path), { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return worksheet ? XLSX.utils.sheet_to_json(worksheet, { defval: "" }) : [];
  }

  function write(filename, rows) {
    const path = pathFor(filename);
    if (!Array.isArray(rows)) throw new TypeError("Catalog rows must be an array");
    const cleanRows = rows.map((row) => ({ ...row }));
    const worksheet = XLSX.utils.json_to_sheet(cleanRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Library");
    const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    replaceFileAtomically(path, bytes);
    return cleanRows;
  }

  function readJson(filename) {
    const path = pathFor(filename, [".json"]);
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8"));
  }

  function writeJson(filename, value) {
    const path = pathFor(filename, [".json"]);
    replaceFileAtomically(path, Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8"));
    return value;
  }

  return Object.freeze({ root, pathFor, read, write, readJson, writeJson });
}

const defaultStore = createExcelStore();

export const dbPath = (filename) => defaultStore.pathFor(filename, [".xlsx", ".json"]);
export const readExcel = (filename) => defaultStore.read(filename);
export const writeExcel = (filename, rows) => defaultStore.write(filename, rows);
export const readJson = (filename) => defaultStore.readJson(filename);
export const writeJson = (filename, value) => defaultStore.writeJson(filename, value);
