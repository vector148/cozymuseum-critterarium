# 01 - Establish the CozyMuseum foundation and catalog seam

Status: ready-for-human

Progress: implemented (7/7 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Create an independent CozyMuseum application foundation. Define one catalog interface that owns organism identity, taxonomy normalization, locale fallback, filtering, and persistence. Expose health, Realm metadata, organism list, and organism detail through thin delivery adapters.

## Acceptance criteria

- [x] Package identity, startup scripts, product copy, and repository safety describe CozyMuseum.
- [x] Catalog callers do not know workbook filenames or adapter-specific fields.
- [x] In-memory and Excel adapters satisfy the same observable catalog behavior.
- [x] Four Realms are values behind one list/detail interface, not four copied route implementations.
- [x] The adapter maps exactly four Realm workbooks with one `Library` sheet each; callers never know filenames.
- [x] Hall of Fame and completion state do not create another workbook or sheet.
- [x] Local workbooks, images, caches, and secrets are ignored.

## Blocked by

None - can start immediately.

## Verification

- Catalog contract tests.
- HTTP health/metadata/list smoke test.
- Build succeeds without hardcoded per-Realm data modules.

## Comments
