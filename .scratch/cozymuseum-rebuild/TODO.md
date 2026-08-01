# CozyMuseum turbo queue

Updated: 2026-08-01

Release progress: **7/7 gates complete**. The clean one-commit root is public and the replacement Vercel deployment is live.

Human-facing index: `docs/PROJECT-ROADMAP.md`

## P0 - Scientific correctness and truthful interaction

- [x] Finish Issue 12: canonical scientific Class values, friendly one-to-one labels, strict detail taxonomy, correction manifest, doctor audit, and workbook apply.
- [x] Finish Issue 13: encounter/rarity/Hall of Fame only for Animalia and Plants & Fungi; remove it from SAR and Microverse at domain, API, and UI layers.
- [x] Finish Issue 14: replace Living/Còn sống with Extant/Hiện sinh and render Extinct/Tuyệt chủng in scientific detail.
- [x] Finish Issue 15: use translucent blurred glass for the over-bright control panel while preserving approved Realm background assets and compact CozyMuseum geometry.

## P0 - Verification and daily release gate

- [x] Run targeted red-green tests for Issues 12–15.
- [x] Run `npm run bio -- taxonomy` preview/apply/idempotency and `npm run bio -- doctor`.
- [x] Browser-QA canonical shark/clownfish Classes, EN/VI life state, Realm-gated Hall, and all four control-panel themes.
- [x] Audit child/parent remotes and create one consolidated follow-up commit; the requested initial GitHub push is already complete.

## P0 - Source governance and media rights

- [x] Finish Issue 16 foundation: ADR-0006, strict Commitlint scopes/rules, and GitHub commit-message workflow.
- [ ] Enable `main` branch protection requiring the Commit message policy workflow.
- [x] Finish Issue 17: ADR-0007 now accepts only CC0/Public Domain images, keeps proof internal, and rejects every attribution-bearing or unclear license.
- [x] Scan all four live workbooks plus committed catalog seeds and publish the 2026-08-01 media-rights audit.
- [x] Finish Issue 18: purged 79 denied remote covers and 74 denied local files; preserved only proven CC0/Public Domain media; enforced scraper/download/intake/migration/doctor gates.

## P0 - CozyMuseum public release

- [x] Finish Issue 19: rename every product, source, documentation, launcher, path, repository, and history surface to CozyMuseum with no former brand compatibility layer.
- [x] Finish Issue 20: remove local catalog media, local media columns/routes, downloader flags, and obsolete downloader tests.
- [x] Finish Issue 21: add a production browser adapter over the full four-workbook showroom snapshot with localStorage encounter persistence; keep local Excel development intact.
- [x] Finish Issue 22: add Vercel deployment denial rules, SPA routing, canonical URL generation, and a source-data write boundary.
- [x] Finish Issue 23: ship accurate title/description/canonical/Open Graph/manifest/robots/sitemap/JSON-LD and verify rendered search assets.
- [x] Finish Issue 24: publish and verify the independent release.
  - [x] Rename the local project folder to `CozyMuseum` and verify the repository from its new path.
  - [x] Replace the public product identity, launcher, package name, repository links, CTA, and search metadata with CozyMuseum.
  - [x] Build the static showroom locally from the full four-workbook snapshot.
  - [x] Add Vercel SPA configuration, deployment exclusions, generated sitemap, robots policy, manifest, canonical metadata, and security headers.
  - [x] Add one compact museum invitation containing two paths: personal CozyMuseum on GitHub and the FourRealm OS v2 movie/game/music museum product page.
  - [x] Rewrite `main` as one clean root commit, update `origin` to `vector148/cozymuseum`, and force-push it.
  - [x] Confirm the new GitHub-triggered Vercel deployment succeeds and smoke-test `/`, `/robots.txt`, `/sitemap.xml`, and `/hall-of-fame` at `https://cozymuseum.vercel.app/`.

## P1 - Curated growth after P0 is clean

- [x] Add the `add-organism` scientific intake skill and preview-first `bio add` pipeline: GBIF identity, canonical Class fallback, Wikimedia Full-HD-aware cover provenance, oEmbed-verified YouTube natural-history link, duplicate protection, and four-workbook-safe apply.
- [x] Finish Issue 11 in bounded 20-row batches: classify all 384 unique raw identities, promote 301 exact accepted proposals, quarantine 59 ambiguous candidates, and publish a reproducible 375-row seed snapshot.
- [ ] Rebuild remote imagery only from CC0/Public Domain sources without weakening the 0.8 confidence gate; local covers are permanently retired by ADR-0007.
- [ ] Replace `xlsx` when a compatible maintained release exists; until then accept only trusted local workbooks per `docs/policies/repository-safety.md`.

## Completed and preserved

- [x] Issues 01–10: catalog/storage seams, four Realm workbooks, bilingual atlas, dependent Phylum/Class UI, detail/video, enrichment CLI, Retired data, encounters, pixel parity, responsive QA, and release hardening.
- [x] Approved Realm backgrounds: Animalia blue, Plants & Fungi green, SAR yellow, and Microverse red.
- [x] One bilingual museum invitation added with unambiguous CozyMuseum versus FourRealm OS v2 paths.
- [x] Migrated 62 curated rows; replay was idempotent with 0 failures.
- [x] Preserved and parsed the 63,034-byte raw legacy archive into 452 candidates / 384 unique identities.
- [x] Hash-verified all 27 legacy media files before safely deleting the old CozyMuseum folder.
- [x] CozyMuseum uses one dedicated origin and one CozyMuseum-only root history.
