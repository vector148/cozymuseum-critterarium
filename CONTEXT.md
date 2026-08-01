# CozyMuseum Context

CozyMuseum is a bilingual EN/VI, local-first digital museum for cataloging organisms and remembering direct real-world encounters. Its public Vercel build is a read-only showroom of the approved four-workbook catalog; visitor encounter changes stay in that browser.

## Domain ownership

- `app/biodiversity/` owns taxonomy, filtering, localization, encounters, enrichment, media-rights validation, and diagnostics.
- `app/catalog/adapters/excel-store.js` owns local workbook persistence.
- `resources/js/api/browser-api.js` owns production read-only delivery plus the browser encounter overlay.
- `server/` is a thin local HTTP adapter and never serves catalog media.
- `database/` contains exactly four source workbooks; `database/seeds/catalog.json` is their reviewed public snapshot.

## Vocabulary

- Realm: Animalia, Plants & Fungi, SAR, or Microverse.
- Extant / Hiện sinh: the taxon still has existing individuals.
- Retired: the product view for extinct taxa.
- Hall of Fame: directly encountered eligible organisms ranked by the owner's 0–10 natural-rarity score.
- Phylum → Class: dependent taxonomy filters; Class options come only from the chosen Phylum.

Read the active PRD under `.scratch/cozymuseum-vercel/`, the project queue under `.scratch/cozymuseum-rebuild/`, and durable decisions under `docs/adr/` before non-trivial work.
