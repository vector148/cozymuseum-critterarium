# Full-catalog rights-safe enrichment

Status: approved for implementation  
Owner: Vector148  
Date: 2026-08-01  
Related: ADR-0005, ADR-0007, `add-organism`

Implementation note (2026-08-01): bulk apply is paused and assigned to a separate IDE. Codex completed the preview/rate-limit hardening only; reconciliation is required before snapshot or release.

## Outcome

Enrich every existing CozyMuseum record as far as authoritative and rights-safe sources permit, then republish the four-workbook snapshot. Missing media remains an honest state when no CC0/Public Domain candidate exists.

## Source contract

- GBIF: accepted scientific identity, canonical taxonomy, rank, and confidence.
- Wikipedia/Wikidata: page title, entity identity, taxonomy fallback, and source URL only; never copy article extracts.
- Wikimedia Commons: remote image only when exact file metadata proves CC0 or Public Domain.
- YouTube: verified public watch URL and title only; never download, cache, or rehost media.
- CozyMuseum: short bilingual descriptions authored deterministically from structured scientific facts.

## Safety boundary

- Preview before apply; confidence remains at least `0.8`.
- Existing organism identity and encounter fields are never overwritten by the bulk run.
- Previously copied descriptions are replaced only through the explicit `--overwrite-fields descriptionEn,descriptionVi` gate.
- The four sanitized source workbooks are versioned under ADR-0009; personal encounter fields remain blank and the reviewed Vercel snapshot is regenerated after apply.
- Completeness is reported honestly. Legal unavailability is not bypassed with weaker licenses or invented media.

## Acceptance criteria

1. Tests prove third-party extracts are not stored and selected-field refresh preserves unrelated fields.
2. All 404 current records are scanned with isolated provider errors.
3. All written covers pass ADR-0007 and `bio doctor` returns zero media-rights failures.
4. All descriptions are short CozyMuseum-authored EN/VI taxonomy summaries.
5. `database/seeds/catalog.json` matches the post-enrichment workbooks.
6. A before/after report records filled fields and unresolved gaps.
7. All four clean workbooks are staged as public clone data and contain zero personal encounter values.

## Verification

- Targeted enrichment, CLI, media-rights, and adapter tests.
- Preview sample, then batched apply.
- `npm run bio -- snapshot-seed`.
- `npm run bio -- doctor` and `npm run verify`.
