# 03 - Migrate all four legacy CozyMuseum workbooks

Status: ready-for-human

Progress: implemented (7/7 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Create a repeatable migration that reads the legacy CozyMuseum input directory without modifying it, normalizes all four workbook schemas into organism records, copies only CozyMuseum-specific local images, and emits an auditable report.

## Acceptance criteria

- [x] Exactly 62 current legacy records are accounted for as inserted, updated, skipped, or failed.
- [x] Realm ownership derives from source workbook.
- [x] Normalized rows are written back to the corresponding one of four new Realm workbooks, each with exactly one `Library` sheet.
- [x] Scientific/common names, description, taxonomy, sources, and media map correctly.
- [x] Stable identity prevents duplicates on a second run.
- [x] Source workbook hashes remain unchanged.
- [x] Only CozyMuseum-specific images are copied under the root species media directory.

## Blocked by

- 01 - Establish the CozyMuseum foundation and catalog seam.

## Verification

- Fixture migration test.
- Source-before/source-after hash comparison.
- Second-run idempotency test.
- Migration report review.

## Comments
