# 11. Database-Driven JSON Seed

Date: 2026-08-01

## Status

Accepted

## Context

The biological catalog data for CozyMuseum is maintained in four versioned Excel workbooks (`database/*.xlsx`). However, the Vercel-hosted web interface and backend API consume a JSON seed file (`database/seeds/catalog.json`) for fast, structured reads without requiring spreadsheet parsing at runtime.

Previously, the sequence of updating the organism data and publishing it to the web seed could be easily overlooked or disjointed, leading to scenarios where the source data in the Excel files and the JSON seed became out of sync.

## Decision

We establish a strict one-way data flow from the Excel workbooks to the JSON seed:

1. **Database First**: All organism additions, enrichments, and taxonomy updates are applied primarily to the Excel workbooks using the `npm run bio -- enrich` or `npm run bio -- add` commands.
2. **JSON Extraction**: The JSON seed (`database/seeds/catalog.json`) is treated purely as a read-only clone/artifact derived from the workbooks. It must never be edited manually.
3. **Synchronization Script**: We introduced a specific command `npm run bio:sync` (which wraps `npm run bio -- snapshot-seed`) to explicitly pull the latest state from the database workbooks and rebuild the JSON seed.

## Consequences

- **Single Source of Truth**: The Excel workbooks remain the undeniable source of truth.
- **Vercel Readiness**: The JSON clone guarantees fast parsing and deployment on Vercel without large Excel parsers on the frontend.
- **Workflow Requirement**: Contributors must remember to run the synchronization step (`npm run bio:sync`) after making any changes to the catalog, before committing the day's work.

## QA Mechanism & Process

To ensure data quality (specifically regarding appropriate images and videos for a natural history museum context), we employ the following QA process:

1. **Broad QA (QA Diện Rộng)**: Automated scripts (e.g. `clean-videos.mjs`, `remove_bad_organisms.mjs`) are used to scan the database and purge irrelevant, off-topic, or low-quality data (like generic YouTube videos or drawings).
2. **Debt Ledger (Sổ Nợ)**: Any organism that cannot be automatically enriched with a high-quality, rights-free, and natural-context image is completely removed from the Excel database. Its ID and the reason for removal are documented in `.scratch/sổ_nợ.md` so that contributors can manually source and re-add it later.
3. **Database Deletion Over Nullification**: Bad records are purged at the database level rather than just leaving the image URL blank, ensuring the JSON seed only contains complete and presentable data.

## Browser Subagent Integration

To perform visual QA on the local web interface without manual user intervention, agents can utilize the `browser_subagent` tool. This tool acts as a headless browser with mouse and keyboard controls.

**Usage:**
- Start the local dev server (`npm run dev`).
- Invoke the `browser_subagent` tool and provide instructions to navigate to `http://localhost:5173`.
- The subagent can scroll through the UI, click tabs (e.g. Aquarium, Wildlife), inspect cards, and report back on which images look like illustrations, market products, or are otherwise inappropriate.
- This allows automated, visual verification of the JSON seed output as it appears on the web.
