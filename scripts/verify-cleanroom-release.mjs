import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FORBIDDEN_DIRECTORIES = new Set([
  ".agents", ".private", ".scratch", ".vercel", "backup", "database", "docs", "marketing", "reports",
]);
const FORBIDDEN_FILENAMES = [
  /^\.env(?:\.|$)/i,
  /(?:recovery|backup)[-_ ]?codes?/i,
  /^(?:context|handoff|agents?)\.md$/i,
  /(?:prd|adr|roadmap|audit)/i,
  /vercel\.json/i,
];
const FORBIDDEN_EXTENSIONS = new Set([".xlsx", ".xls", ".csv", ".sqlite", ".db", ".sql", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm"]);
const IGNORED_DIRECTORIES = new Set([".git", "dist", "node_modules"]);
const SECRET_PATTERNS = [
  /(?:service_role|supabase_service|database_password|vercel_oidc_token)\s*[=:]/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const PLATFORM_SURFACE_PATTERN = /\b(?:curatale|supabase|gtag|googletagmanager|vercel|foyer|greathall)\b|reading[-_ ]room/i;

function portable(root, path) {
  return relative(root, path).replaceAll("\\", "/");
}

export function inspectCleanroomTree(rootDir) {
  const root = resolve(rootDir);
  const violations = [];

  function scan(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      const relativePath = portable(root, path);
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue;
        if (FORBIDDEN_DIRECTORIES.has(entry.name)) {
          for (const nested of readdirSync(path, { recursive: true, withFileTypes: true })) {
            if (nested.isFile()) violations.push({ path: portable(root, resolve(nested.parentPath, nested.name)), reason: `forbidden directory ${entry.name}` });
          }
          continue;
        }
        scan(path);
        continue;
      }

      const filenameViolation = FORBIDDEN_FILENAMES.find((pattern) => pattern.test(entry.name));
      if (filenameViolation) {
        violations.push({ path: relativePath, reason: "forbidden release filename" });
        continue;
      }
      const extension = extname(entry.name).toLowerCase();
      if (FORBIDDEN_EXTENSIONS.has(extension) && !relativePath.startsWith("public/brand/")) {
        violations.push({ path: relativePath, reason: `forbidden release extension ${extension}` });
        continue;
      }
      if ([".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".txt", ".html", ".css"].includes(extension)) {
        const content = readFileSync(path, "utf8");
        if (SECRET_PATTERNS.some((pattern) => pattern.test(content))) violations.push({ path: relativePath, reason: "secret-like content" });
        if (/^(?:app|resources|server)\//.test(relativePath) && PLATFORM_SURFACE_PATTERN.test(content)) {
          violations.push({ path: relativePath, reason: "public-platform runtime surface" });
        }
      }
    }
  }

  scan(root);
  violations.sort((left, right) => left.path.localeCompare(right.path));
  return { ok: violations.length === 0, violations };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] || ".");
  if (!existsSync(root)) throw new Error(`Release root does not exist: ${root}`);
  const report = inspectCleanroomTree(root);
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}
