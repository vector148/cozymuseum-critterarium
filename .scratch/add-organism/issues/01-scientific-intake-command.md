# 01 - Scientific organism intake command

Status: completed

## Scope

Create the public `npm run bio -- add` preview/apply command and its deep intake service. Reuse the existing store and enrichment seam; do not add a mutation route or fifth database.

## Acceptance criteria

- Preflight and resolved-identity duplicate checks are write-free.
- A ready record has canonical Class, GBIF confidence at/above the requested threshold, valid Realm/life state, Full-HD-aware image metadata, and oEmbed-verified YouTube URL.
- Apply creates one row in the correct Realm workbook; media remains a rights-verified remote link.
- Batch input isolates failures and keeps successful items deterministic.

## Verification

Run the targeted intake/CLI tests, then `npm run verify` and `npm run bio -- doctor`.

## Comments

- 2026-08-01: Added preview-first `bio add`, GBIF-first authoritative identity, a Wikidata Class fallback for GBIF taxonomy gaps, Wikimedia Commons Full-HD-aware image selection, YouTube oEmbed liveness checks, duplicate guards, and atomic apply/download behavior. Fixture tests and a live no-write preview passed.
