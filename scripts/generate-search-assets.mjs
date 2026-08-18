import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { buildSearchManifest } from "../resources/js/support/seo/search-manifest.js";
import { answerContractRobotsContent } from "../resources/js/support/seo/answer-contract.js";
const defaultSiteUrl = "https://cozymuseum.app/";
export const publishedArticles = Object.freeze([]);
export const searchManifest = Object.freeze([]);
export const indexableSearchRoutes = Object.freeze([]);

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
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: ${new URL("sitemap.xml", canonical)}\n`;
}

export function renderSitemap(siteUrl, lastModified = new Date().toISOString().slice(0, 10)) {
  const canonical = normalizeSiteUrl(siteUrl);
  const urlBlocks = searchManifest.map((route) => {
    const loc = new URL(route.path.replace(/^\//, ""), canonical).href;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>
`;
}

function routeProduct(route) {
  if (route.path === "/critterarium" || route.answerContract?.entities?.includes("critterarium")) return "Critterarium";
  if (route.path === "/curatale" || route.answerContract?.entities?.includes("curatale")) return "Curatale";
  return null;
}

function renderRouteStructuredData(route, routeUrl, siteUrl) {
  const product = routeProduct(route);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "CozyMuseum",
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "CozyMuseum",
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ];

  if (route.type === "article") {
    graph.push({
      "@type": "BlogPosting",
      headline: route.heading,
      datePublished: route.datePublished,
      dateModified: route.datePublished,
      mainEntityOfPage: routeUrl,
      articleBody: [route.body, ...(route.content || []).map(({ text }) => text)].filter(Boolean).join(" "),
      author: { "@type": "Organization", name: "CozyMuseum" },
      publisher: { "@type": "Organization", name: "CozyMuseum", url: siteUrl },
      description: route.description,
      url: routeUrl,
      isPartOf: { "@id": `${siteUrl}#website` },
      ...(product ? { about: { "@type": "Thing", name: product } } : {}),
    });
  } else if (route.path === "/critterarium") {
    graph.push({
      "@type": "WebApplication",
      "@id": `${routeUrl}#app`,
      name: "Critterarium",
      url: routeUrl,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: route.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  } else if (route.path === "/curatale") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${routeUrl}#app`,
      name: "Curatale",
      url: routeUrl,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Windows, macOS, Linux",
      description: route.description,
      offers: { "@type": "Offer", price: "29", priceCurrency: "USD", url: "https://buymeacoffee.com/vector148/e/562244" },
    });
  } else {
    graph.push({
      "@type": "CollectionPage",
      name: route.heading,
      description: route.description,
      url: routeUrl,
      isPartOf: { "@id": `${siteUrl}#website` },
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function setTagContent(html, pattern, content) {
  return html.replace(pattern, (_, start, end) => `${start}${content}${end}`);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderLinks(links = []) {
  if (!links.length) return "";
  const items = links.map(({ href, label }) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("\n");
  return `<nav aria-label="Related pages">${items}</nav>`;
}

function renderAnswerSources(answerContract) {
  const sources = (answerContract?.claims || [])
    .filter((claim) => claim.status === "evidence")
    .flatMap(({ id, sources: claimSources = [] }) => (
      claimSources.map((source) => ({ id, ...source }))
    ));
  if (!sources.length) return "";
  const items = sources.map((source) => (
    `<li data-claim-id="${escapeHtml(source.id)}"><a href="${escapeHtml(source.url)}">${escapeHtml(source.name)}</a> <span>Published ${escapeHtml(source.publishedAt)}; accessed ${escapeHtml(source.accessedAt)}</span></li>`
  )).join("");
  return `<section class="answer-sources" aria-labelledby="answer-sources-title"><h2 id="answer-sources-title">Sources</h2><ul>${items}</ul></section>`;
}

function renderRouteContent(route) {
  const blocks = route.content || [];
  const body = blocks.map((block) => {
    if (block.type === "heading") {
      const level = Number(block.level) === 3 ? 3 : 2;
      return `<h${level}>${escapeHtml(block.text)}</h${level}>`;
    }
    if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
    return "";
  }).join("\n");
  const answer = route.answerContract;
  
  let ctaHtml = "";
  if (route.type === "article" && route.gallerySearchNames?.en) {
    const ctaUrl = `/critterarium?search=${encodeURIComponent(route.gallerySearchNames.en)}`;
    ctaHtml = `<div class="reading-room-article-footer"><p>Continue from the story to the organism record in the collection.</p><a class="great-hall-action great-hall-action-primary" href="${ctaUrl}">Open in Galleries &rarr;</a></div>`;
  }
  
  const content = `<h1>${escapeHtml(route.heading)}</h1><section class="answer-contract"><p data-answer-contract="question">${escapeHtml(answer?.question || route.heading)}</p><p data-answer-contract="direct-answer">${escapeHtml(answer?.directAnswer || route.body)}</p></section>${body}${renderAnswerSources(answer)}${ctaHtml}`;
  return route.type === "article" ? `<article>${content}</article>` : content;
}

export function renderHomeRouteHtml(indexHtml, siteUrl, route) {
  const canonical = normalizeSiteUrl(siteUrl);
  const routeUrl = new URL(route.path.replace(/^\//, ""), canonical).href;
  let html = indexHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = setTagContent(html, /(<meta name="description" content=")[^"]*(" \/>)/, route.description);
  html = setTagContent(html, /(<link rel="canonical" href=")[^"]*(" \/>)/, routeUrl);
  html = setTagContent(html, /(<meta property="og:title" content=")[^"]*(" \/>)/, route.title);
  html = setTagContent(html, /(<meta property="og:description" content=")[^"]*(" \/>)/, route.description);
  html = setTagContent(html, /(<meta property="og:url" content=")[^"]*(" \/>)/, routeUrl);
  html = setTagContent(
    html,
    /(<meta name="robots" content=")[^"]*(" \/>)/,
    answerContractRobotsContent(route.answerContract),
  );
  html = html.replace(
    '<h2>What is CozyMuseum?</h2><p>',
    '<h2 data-answer-contract="question">What is CozyMuseum?</h2><p data-answer-contract="direct-answer">',
  );
  return html;
}

export function renderIndexableRouteHtml(indexHtml, siteUrl, route) {
  const canonical = normalizeSiteUrl(siteUrl);
  const routeUrl = new URL(route.path.replace(/^\//, ""), canonical).href;
  let html = indexHtml;
  if (route.path === "/curatale") {
    // Product routes need their own visual surface during the pre-hydration frame.
    html = html.replace('<html lang="en" class="theme-great-hall">', '<html lang="en" class="theme-curatale-games">');
  }
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = setTagContent(html, /(<meta name="description" content=")[^"]*(" \/>)/, route.description);
  html = setTagContent(html, /(<link rel="canonical" href=")[^"]*(" \/>)/, routeUrl);
  html = setTagContent(html, /(<meta property="og:title" content=")[^"]*(" \/>)/, route.title);
  html = setTagContent(html, /(<meta property="og:description" content=")[^"]*(" \/>)/, route.description);
  html = setTagContent(html, /(<meta property="og:url" content=")[^"]*(" \/>)/, routeUrl);
  html = setTagContent(html, /(<meta property="og:type" content=")[^"]*(" \/>)/, route.type === "article" ? "article" : "website");
  html = setTagContent(
    html,
    /(<meta name="robots" content=")[^"]*(" \/>)/,
    answerContractRobotsContent(route.answerContract),
  );
  html = html.replace(
    /<main class="main-content[^"]*">.*?<\/main><\/main>/s,
    `<main>${renderRouteContent(route)}${renderLinks(route.links)}</main>`,
  );
  return html.replace("</head>", `    <script id="route-jsonld" type="application/ld+json">${renderRouteStructuredData(route, routeUrl, canonical)}</script>\n  </head>`);
}

export function writeSearchAssets({ outputDir = "dist", siteUrl, lastModified } = {}) {
  const canonical = normalizeSiteUrl(siteUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || defaultSiteUrl);
  const target = resolve(outputDir);
  mkdirSync(target, { recursive: true });
  writeFileSync(resolve(target, "robots.txt"), renderRobots(canonical), "utf8");
  writeFileSync(resolve(target, "sitemap.xml"), renderSitemap(canonical, lastModified), "utf8");

  const indexPath = resolve(target, "index.html");
  if (indexableSearchRoutes.length && readFileSync(indexPath, "utf8")) {
    const indexHtml = readFileSync(indexPath, "utf8");
    const homeRoute = searchManifest.find(({ path }) => path === "/");
    writeFileSync(indexPath, renderHomeRouteHtml(indexHtml, canonical, homeRoute), "utf8");
    for (const route of indexableSearchRoutes) {
      const routeDir = resolve(target, route.path.replace(/^\//, ""));
      mkdirSync(routeDir, { recursive: true });
      writeFileSync(resolve(routeDir, "index.html"), renderIndexableRouteHtml(indexHtml, canonical, route), "utf8");
    }
  }

  return { siteUrl: canonical, outputDir: target };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const result = writeSearchAssets({ outputDir: resolve(root, "dist") });
  process.stdout.write(`Search assets generated for ${result.siteUrl}\n`);
}
