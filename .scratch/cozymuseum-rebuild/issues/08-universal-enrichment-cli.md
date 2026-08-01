# 08 - Forge the universal biological enrichment CLI

Status: ready-for-human

Progress: implemented (6/6 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Create one command that enriches organism records through scientific APIs first, public web/media sources second, and an explicit AI-needed manifest last. Preview is the default; apply is atomic, thresholded, idempotent, and provenance-preserving.

## Acceptance criteria

- [x] CLI supports target scope, provider, dry-run/apply, media download, overwrite policy, confidence threshold, and JSON output.
- [x] Provider candidates normalize into one patch contract.
- [x] Ambiguous or low-confidence matches never auto-apply.
- [x] Applied fields record source, provider, timestamp, and confidence.
- [x] Media stays under root images/species and validates type/size.
- [x] Reapplying the same plan creates no duplicates or unintended rewrites.

## Blocked by

- 01 - Establish the CozyMuseum foundation and catalog seam.
- 03 - Migrate all four legacy CozyMuseum workbooks.

## Verification

- Provider replay fixtures.
- Write-free preview, stale-plan, and idempotent-apply tests.
- Catalog doctor.

## Comments

- 2026-08-01: Targeted CLI/enrichment tests passed. A full apply enriched 57 records, reused 22 existing assets, downloaded 14 new assets, and isolated five remote media failures without corrupting the four workbooks.
