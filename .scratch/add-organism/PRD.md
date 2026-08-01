# Add Organism: scientific intake pipeline

Status: implemented and verified  
Owner: Vector148  
Date: 2026-08-01  
Related: `CONTEXT.md`, ADR-0001, ADR-0002, ADR-0005

## Executive summary

CozyMuseum needs the direct, repeatable “add item” experience without importing entertainment-specific scripts or weakening biological correctness. `add-organism` is a Codex skill backed by one public CozyMuseum CLI command. It resolves an organism through GBIF, enriches bilingual prose and rights-cleared remote imagery through Wikipedia/Wikimedia, selects a verified long-form natural-history YouTube video, and inserts only a doctor-clean row into the existing Realm workbook.

## Scope and boundary

### In scope

- Skill name: `add-organism`.
- Public CLI: `npm run bio -- add` for one organism or a JSON batch.
- Exact duplicate guard before remote research, a second guard after authoritative identity resolution, preview by default, and explicit `--apply`.
- GBIF identity/taxonomy confidence gate; Wikipedia/Wikimedia prose and image provenance; YouTube oEmbed liveness check and HD/4K-aware ranking.
- Catalog covers remain remote-only and require exact CC0/Public Domain evidence; no local media path exists.
- One flat row in one of the four existing `Library` sheets; no new workbook, sheet, Hall table, or route.

### Out of scope

- Bypassing source terms, downloading YouTube videos, generating invented organism imagery, or presenting uncertain taxonomy as fact.
- Browser form or API mutation endpoint.
- Automatic location/encounter capture; imported organisms always start unencountered.
- Rewriting or altering an existing record through the add command.

## Functional requirements

1. The command accepts `--name` for one organism or `--input <JSON array>` for a batch, with optional `realmId` and `lifeState` hints.
2. Existing exact declared scientific/common names are skipped before network work; resolved `organismId` and authoritative GBIF identity are checked again before write.
3. GBIF is the authoritative source for scientific name, taxonomy, rank, accepted taxon ID, and confidence. The default threshold is `0.8`.
4. A prospective row must have a known Realm, `extant` or `extinct` life state, and a canonical scientific Class. The realm may be inferred from GBIF kingdom only when unambiguous.
5. Wikipedia/Wikimedia provides bilingual introductory prose and an original image URL. Only image metadata advertising at least 1920 pixels on one side and 1080 pixels on the other is marked `Full HD`; smaller/unknown media is reported honestly.
6. YouTube candidates are ranked for 4K/HD, natural-history terms, duration, and views. The selected watch URL must return a successful YouTube oEmbed response.
7. Preview does not write. `--apply` inserts only ready, non-duplicate rows and never downloads catalog media.
8. Every inserted row starts with `encountered: false`, blank `encounterDate`, and blank `rarityScore`.

## Data and safety contract

- Input item shape: `{ name, scientificName?, commonNameEn?, commonNameVi?, realmId?, lifeState? }`.
- Report shape distinguishes `ready`, `duplicate`, `rejected`, and `failed`, and includes source/error detail without placing reports in Git.
- New records retain `sourceUrls`, `provider`, `fetchedAt`, `confidence`, `authoritativeTaxonId`, image provenance, and video metadata.
- Biological facts may be public, but images and videos retain source/provenance fields; the command never claims their licences without evidence.

## Issues

| Slice | Title | Verification |
| --- | --- | --- |
| 01 | Deep organism intake service and CLI preview/apply | targeted intake and CLI tests |
| 02 | `add-organism` skill and operator documentation | skill command smoke and README review |

## Acceptance criteria

- A fixture-based exact GBIF organism produces a ready preview with canonical taxonomy, HD/Full-HD-aware image metadata, and a verified YouTube link.
- Below-threshold, incomplete taxonomy, duplicate, and dead-video outcomes never write a row.
- Applying a ready organism writes exactly one row to its owning Realm workbook and never creates an encounter/Hall sheet.
- The command handles a JSON batch one item at a time and reports each outcome.
- Existing `npm run verify` remains green.

## Risks and decisions

- Public API/search HTML can change: provider errors stay isolated and are visible in the report; no provider failure becomes guessed data.
- “Full HD” cannot be guaranteed for every taxon; the pipeline requires transparent source dimensions and marks a record incomplete instead of labelling lower resolution as HD.
- The existing enrichment module remains the shared media/taxonomy collector. Intake owns validation, duplicate protection, record construction, and atomic insertion.
