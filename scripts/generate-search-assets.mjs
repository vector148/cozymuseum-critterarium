import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultSiteUrl = "https://cozymuseum.vercel.app/";

export function normalizeSiteUrl(value = defaultSiteUrl) {
  const withProtocol = /^https?:\/\//i.test(String(value)) ? String(value) : `https://${value}`;
  const url = new URL(withProtocol);
  url.hash = "";
  url.search = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.toString();
}

export function renderRobots(siteUrl) {
  const canonical = normalizeSiteUrl(siteUrl);
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", canonical)}\n`;
}

export function renderSitemap(siteUrl, lastModified = new Date().toISOString().slice(0, 10)) {
  const canonical = normalizeSiteUrl(siteUrl);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>
</urlset>
`;
}

export function writeSearchAssets({ outputDir = "dist", siteUrl, lastModified } = {}) {
  const canonical = normalizeSiteUrl(siteUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || defaultSiteUrl);
  const target = resolve(outputDir);
  mkdirSync(target, { recursive: true });
  writeFileSync(resolve(target, "robots.txt"), renderRobots(canonical), "utf8");
  writeFileSync(resolve(target, "sitemap.xml"), renderSitemap(canonical, lastModified), "utf8");
  return { siteUrl: canonical, outputDir: target };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const result = writeSearchAssets({ outputDir: resolve(root, "dist") });
  process.stdout.write(`Search assets generated for ${result.siteUrl}\n`);
}

