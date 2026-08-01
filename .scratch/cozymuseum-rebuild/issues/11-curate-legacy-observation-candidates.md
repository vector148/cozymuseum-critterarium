# 11 - Curate the archived legacy observation candidates

Status: ready-for-human

Progress: complete (6/6 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Turn the preserved raw legacy observations into reviewable, confidence-scored organism proposals without polluting the four canonical workbooks. Work in bounded batches and promote only concrete organisms or recognizable organism groups that satisfy the organism-level ADR.

## Acceptance criteria

- [x] Read exclusively from `database/seeds/legacy-observation-candidates.json`; never recreate a dependency on the deleted sibling.
- [x] De-duplicate the 384 unique organism identities against stable catalog IDs and scientific/common-name aliases.
- [x] Separate concrete organisms/groups from taxonomy-only references before enrichment.
- [x] Enrich proposals through the universal provider contract with a minimum confidence of 0.8 and retain provenance.
- [x] Preview every batch before apply; ambiguous candidates remain in a rejection report and never enter a workbook.
- [x] Re-run tests and catalog doctor after each applied batch with no duplicate IDs or identity failures.

## Verification

- Candidate batch replay fixture.
- Preview/apply/idempotency report.
- `npm run bio -- doctor`.

## Comments

- 2026-08-01: The legacy source was preserved byte-for-byte before deletion. Extraction produced 452 raw candidates: 416 organism/group candidates, 36 taxonomy references, and 384 unique organism identities.
- 2026-08-01: Bounded 20-row batches classified all 384 unique identities. Replay found 325 already present and 59 rejected, with zero new proposals and zero duplicate writes.
- 2026-08-01: 301 exact accepted GBIF proposals were promoted with provenance. Catalog doctor is green at 375 rows: 343 Extant and 32 Extinct, with no duplicate IDs, identity failures, or invalid Class names.
- 2026-08-01: The declared 33-fossil section contains 32 extractable organism rows before the next superkingdom heading; those 32 rows receive an extinct hint and the section terminator prevents spillover.
- 2026-08-01: Every preview/apply pair is bound by a SHA-256 digest of its write-relevant proposal rows. Reports stay local under `reports/observation-curation/`; the sanitized catalog is versioned at `database/seeds/catalog.json`.
