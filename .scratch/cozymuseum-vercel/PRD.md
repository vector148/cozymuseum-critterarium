# CozyMuseum public experience and Vercel release

Status: approved for implementation
Owner: Vector148
Date: 2026-08-01
Related: ADR-0007, ADR-0008

## Outcome

Publish the existing biological collection experience as **CozyMuseum**: a cozy, bilingual, local-first digital museum whose public build is safe to deploy as static files on Vercel. Preserve the four-Realm interaction model and scientific catalog while separating the public seed from the owner's private Excel workbooks.

## Positioning

- Canonical product name: `CozyMuseum`.
- GitHub About and canonical description: `Your aesthetic digital museum. A cozy, local-first sanctuary to collect, catalog, and display your favorite critters with a beautiful Liquid Glass UI.`
- Primary audience: cozy-game, collection, nature, completionist, and digital-museum enthusiasts.
- Product promise: a calm, aesthetic catalog for discovering organisms and remembering direct encounters; not a textbook, social network, or authoritative conservation assessment.
- Primary query family: `cozy digital museum`, `critter collection tracker`, `aesthetic creature catalog`, and their natural Vietnamese equivalents.

## Public/private boundary

- Production is client-first and reads a committed, reviewed `database/seeds/catalog.json` snapshot containing the full published content of all four workbooks, including the owner's showroom state.
- Encounter completion stores only organism ID, automatic date, and rarity score in that browser's localStorage.
- Production never reads or writes Excel, never invokes Express, and never requires a long-running process.
- Local development retains the current Express + four-workbook workflow.
- Raw workbook files remain non-downloadable deployment inputs; their full approved catalog content is exported into the read-only web snapshot. Vercel excludes reports, backups, local media, local skills, and scratch material.

## Media requirements

- Catalog images use remote HTTPS URLs only and must pass ADR-0007's exact CC0/Public Domain evidence gate.
- YouTube uses public watch URLs and the official privacy-enhanced embed; no video, audio, thumbnail, or image download exists.
- Bundled UI backgrounds are design assets, not catalog media, and require their own first-party or rights-cleared review.
- Missing media is a supported state and uses the existing generated fallback.

## Search and answer package

| Field | Decision |
| --- | --- |
| Canonical page | `/` |
| Title | `CozyMuseum — Your Aesthetic Digital Museum` |
| Meta description | Canonical GitHub About copy above |
| Visible identity | `CozyMuseum` in the sidebar with no former public-brand residue |
| Schema | `WebApplication` plus `WebSite`; facts must match visible product behavior |
| Language | EN/VI application; default document language `en` with in-app persistent locale |
| Crawl controls | root `robots.txt` that allows the public app and points to an absolute sitemap |
| Discovery | root `sitemap.xml` containing only the canonical app URL and truthful build date |
| Canonical host | configured by `SITE_URL`/`VITE_SITE_URL`; safe default used only until a custom production URL exists |
| Social preview | honest title/description; no fabricated review, rating, FAQ, or marketing claim |

`robots.txt` and the sitemap help discovery but do not promise crawling, indexing, ranking, or rich results. No `llms.txt` is required for Google Search and none is added as a fake SEO signal.

## Acceptance criteria

1. The production bundle boots without `/api`, Excel, Express, or local image routes.
2. Completing and undoing an eligible encounter survives a page reload in the same browser and changes no seed file.
3. Every card and detail hero reads only `coverUrl`; no `localCover`, `/images/species`, downloader, or `--download-assets` path remains active.
4. The public UI, HTML title, description, manifest, health response, launcher, README, and GitHub About use CozyMuseum where user-facing.
5. `robots.txt`, `sitemap.xml`, canonical metadata, Open Graph metadata, and truthful JSON-LD ship in `dist`.
6. Vercel ignores all private/local artifacts and rewrites application routes to the SPA entry.
7. Local Express + Excel development and all scientific taxonomy/encounter rules remain green.
8. Source, tests, production build, and the catalog doctor pass before release.
9. A compact bilingual sidebar CTA invites visitors to create their own museum and links to `https://github.com/vector148/cozymuseum`.
10. The sidebar footer presents one compact museum invitation containing two equally legible paths: create a personal CozyMuseum on GitHub, or explore the separate FourRealm OS v2 movie/game/music museum product page.

## Verification

- Targeted browser-store, remote-media, SEO, server, and catalog tests.
- `npm run build`, followed by inspection of `dist/index.html`, `dist/robots.txt`, and `dist/sitemap.xml`.
- `npm run verify` and a local production preview smoke test.
- Git diff audit proving no workbook, local image, report, or ignored skill enters the public commit.
