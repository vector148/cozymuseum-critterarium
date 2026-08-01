# CozyMuseum Handoff

Updated: 2026-08-01

Open this repository root directly as its own Codex workspace. The product and repository identity are CozyMuseum; no earlier public brand or inherited repository history is retained.

## Current product contract

- Four Realm workbooks with one `Library` sheet each.
- Full approved workbook content exported to `database/seeds/catalog.json` for the read-only public showroom.
- Production uses the browser catalog adapter and localStorage encounter overlay; local development uses Express + Excel.
- Search → Phylum row → dependent Class row → organism cards.
- Extant and Retired everywhere; Hall of Fame only for Animalia and Plants & Fungi.
- EN/VI locale persistence, canonical scientific taxonomy, remote CC0/Public Domain images, official YouTube embeds, and no catalog-media downloads.
- Public brand, GitHub CTA, metadata, manifest, robots, sitemap, JSON-LD, and launcher all use CozyMuseum.
- Production showroom: `https://cozymuseum.vercel.app/` (Vercel deployment and deep-link smoke tests passing).
- Repository history: one independent root commit on `main`; origin is `https://github.com/vector148/cozymuseum.git`.

## Start and verify

- One click: `scripts/CozyMuseum.bat`
- Development: `npm run dev`
- Full verification: `npm run verify`
- Refresh showroom: `npm run bio -- snapshot-seed`
- Production build: `npm run build`

## Read first

1. `AGENTS.md`
2. `CONTEXT.md`
3. `.scratch/cozymuseum-vercel/PRD.md`
4. `.scratch/cozymuseum-rebuild/TODO.md`
5. `docs/adr/0007-media-rights-and-provenance.md`
6. `docs/adr/0008-static-cozymuseum-showcase-on-vercel.md`

## Release cautions

- A remote image URL is not a license; exact CC0/Public Domain proof remains mandatory.
- Do not reintroduce `localCover`, `/images`, media download flags, raw workbook downloads, or server writes in production.
- Keep `SITE_URL` aligned with `https://cozymuseum.vercel.app/` unless the canonical domain changes.
- GitHub repository: `https://github.com/vector148/cozymuseum`.
