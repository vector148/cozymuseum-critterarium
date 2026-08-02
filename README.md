# CozyMuseum

**Current shell version:** `1.1.0`

> Your aesthetic digital museum. A cozy, local-first sanctuary to collect, catalog, and display your favorite critters with a beautiful Liquid Glass UI.

CozyMuseum is a bilingual EN/VI biological collection with four vivid Realms, dependent Phylum → Class filtering, a scientifically accurate detail view, extinct collections, natural-history YouTube links, and a personal Hall of Fame for organisms encountered outdoors.

The hosted build is a read-only showroom of all four workbook catalogs. Visitors may mark encounters, but those changes stay in their own browser and never alter the owner's source data.

**Live museum:** [cozymuseum.vercel.app](https://cozymuseum.vercel.app/)

## Start locally

On Windows, double-click [`scripts/CozyMuseum.bat`](scripts/CozyMuseum.bat). A desktop shortcut should point to that file; move only the shortcut, not the launcher.

Or use a terminal:

```bash
npm install
npm run dev
```

The local app uses an Express adapter and exactly four single-sheet Excel workbooks:

- `database/animalia.xlsx`
- `database/plantae-fungi.xlsx`
- `database/sar.xlsx`
- `database/microverse.xlsx`

These four rights-reviewed workbooks are versioned with the repository, so every clone includes the complete editable database rather than an empty schema. Their public release rows keep encounter/date/rarity values blank; personal Hall of Fame activity remains in each visitor's browser.

Extant, Retired, Hall of Fame, taxonomy, encounter date, and rarity are row fields and filtered views—not extra workbooks or sheets.

## Add organisms in four ways

All intake paths resolve scientific identity first, require canonical taxonomy, keep field-level sources and confidence, accept only remote CC0/Public Domain cover images with exact proof, and verify public YouTube watch links. Preview is the default; add `--apply` only after reviewing the proposed records.

### 1. Add one organism by name

```bash
npm run bio -- add --name "Panthera leo" --realm animalia
npm run bio -- add --name "Panthera leo" --realm animalia --apply
```

### 2. Import a JSON batch

Create a local JSON array in `backup/add-organisms.json`:

```json
[
  { "name": "Danaus plexippus", "realmId": "animalia" },
  { "scientificName": "Ginkgo biloba", "realmId": "plantae_fungi" }
]
```

Then preview and apply:

```bash
npm run bio -- add --input backup/add-organisms.json
npm run bio -- add --input backup/add-organisms.json --apply
```

### 3. Ask Codex with the add-organism skill

```text
Use $add-organism to add these organisms to my CozyMuseum collection: <your list>.
Preview first, report uncertain matches, then apply only the accepted records.
```

The skill lives at `.agents/skills/add-organism/` and delegates writes to the same validated CLI instead of editing workbooks directly.

### 4. Prepare records with another AI, then validate locally

Ask any AI for JSON only using this contract:

```text
Return a JSON array of organism intake records. Each item may contain name,
scientificName, commonNameEn, commonNameVi, realmId, and lifeState.
Do not invent taxonomy, image rights, or source URLs; CozyMuseum will resolve
and validate those fields locally before any write.
```

Save the response under ignored `backup/`, then run the JSON batch flow above. Unverified AI output never bypasses the local intake gate.

## Enrich and verify

```bash
npm run bio -- enrich --id animalia-panthera-leo --providers gbif,wikipedia-en,wikipedia-vi,youtube --min-confidence 0.8
npm run bio -- enrich --id animalia-panthera-leo --providers gbif,wikipedia-en,wikipedia-vi,youtube --min-confidence 0.8 --apply
npm run bio -- doctor
npm run verify
```

Images remain remote links. CozyMuseum never downloads, caches, or serves catalog photos locally. A URL alone is not permission: every displayed image must retain exact CC0/Public Domain evidence. YouTube uses the official privacy-enhanced player and a direct watch link; no video or audio is downloaded.

## Build the read-only showroom

Refresh the committed web snapshot from all four workbooks, then build:

```bash
npm run bio -- snapshot-seed
npm run build
```

Production uses `database/seeds/catalog.json` and stores each visitor's encounter overlay in localStorage. The four source workbooks remain downloadable from GitHub but are excluded from the Vercel payload because the equivalent catalog snapshot is already compiled into the showroom. Local skills, reports, backups, state, and scratch files are also excluded. Set `SITE_URL` to the final canonical HTTPS URL before the production build; it drives the canonical tag, `robots.txt`, and `sitemap.xml`.

```bash
SITE_URL=https://your-domain.example npm run build
```

The release output is `dist/`. The repository includes `vercel.json`, `.vercelignore`, search metadata, JSON-LD, a web manifest, root robots rules, and a one-page canonical sitemap.

## Architecture

- `app/biodiversity/` — catalog, taxonomy, encounter, enrichment, and diagnostics.
- `app/catalog/adapters/` — memory and Excel storage adapters.
- `resources/js/` — React application and production browser adapter.
- `resources/css/` — compact Liquid Glass visual system and Realm themes.
- `server/` — local-only HTTP delivery adapter.
- `database/` — four local workbooks and the public read-only snapshot.
- `docs/adr/` — durable engineering, scientific, source, media-rights, and deployment decisions.
- `.scratch/` — PRDs, issues, audits, and implementation queues.

## Product rules

- Phylum is the first filter row; Class is the dependent second row.
- `Extant` / `Hiện sinh` means a taxon still has living individuals; `Extinct` / `Tuyệt chủng` is its scientific opposite.
- Class values in data and detail views are canonical scientific taxa. Friendly labels are presentation only.
- Hall of Fame exists only for directly observable Animalia and Plants & Fungi.
- Completing an encounter stamps today's local date and stores a 0–10 personal rarity score.
- SAR and Microverse deliberately have no encounter or Hall of Fame mechanics.

## License and support

Source code is MIT licensed. Catalog media remains governed by its exact source rights and [`docs/adr/0007-media-rights-and-provenance.md`](docs/adr/0007-media-rights-and-provenance.md).

Want a museum of your own? [Create yours from CozyMuseum on GitHub](https://github.com/vector148/cozymuseum). For a matching collection manager built around games, films, social channels, and music, [explore FourRealm OS v2](https://buymeacoffee.com/vector148/e/562244).
