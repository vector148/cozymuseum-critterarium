import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { normalizeSiteUrl, renderRobots, renderSitemap } from "../scripts/generate-search-assets.mjs";

const root = resolve(import.meta.dirname, "..");

test("public HTML uses the CozyMuseum canonical search package", () => {
  const html = readFileSync(resolve(root, "resources/index.html"), "utf8");
  assert.match(html, /<title>CozyMuseum — Your Aesthetic Digital Museum<\/title>/);
  assert.match(html, /Your aesthetic digital museum\. A cozy, local-first sanctuary/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
});

test("search assets share one absolute canonical URL", () => {
  const siteUrl = normalizeSiteUrl("cozymuseum.example/museum/");
  assert.equal(siteUrl, "https://cozymuseum.example/museum/");
  assert.match(renderRobots(siteUrl), /Sitemap: https:\/\/cozymuseum\.example\/museum\/sitemap\.xml/);
  assert.match(renderSitemap(siteUrl, "2026-08-01"), /<loc>https:\/\/cozymuseum\.example\/museum\/<\/loc>/);
  assert.match(renderSitemap(siteUrl, "2026-08-01"), /<lastmod>2026-08-01<\/lastmod>/);
});

test("Vercel and Vite agree on the root production output", () => {
  const vite = readFileSync(resolve(root, "vite.config.js"), "utf8");
  const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));

  assert.match(vite, /outDir:\s*"\.\.\/dist"/);
  assert.equal(vercel.outputDirectory, "dist");
  assert.equal(vercel.buildCommand, "npm run build");
  assert.equal(vercel.cleanUrls, undefined);
  assert.deepEqual(vercel.rewrites, [{ source: "/(.*)", destination: "/index.html" }]);
});

test("sidebar exposes two distinct museum destinations", () => {
  const app = readFileSync(resolve(root, "resources/js/App.jsx"), "utf8");
  const i18n = readFileSync(resolve(root, "resources/js/i18n.js"), "utf8");

  assert.match(app, /museum-invite/);
  assert.match(app, /museum-choice-grid/);
  assert.doesNotMatch(app, /museum-cta-grid/);
  assert.match(app, /https:\/\/github\.com\/vector148\/cozymuseum/);
  assert.match(app, /https:\/\/buymeacoffee\.com\/vector148\/e\/562244/);
  assert.match(app, /MediaCollectionIcon/);
  assert.doesNotMatch(app, /sidebar-icon-row/);
  assert.match(i18n, /Your own museum/);
  assert.match(i18n, /Movie & game museum/);
  assert.match(i18n, /Choose the museum you want to build/);
  assert.match(i18n, /Bảo tàng của riêng bạn/);
  assert.match(i18n, /Bảo tàng phim & game/);
  assert.match(i18n, /Chọn bảo tàng bạn muốn xây dựng/);
});
