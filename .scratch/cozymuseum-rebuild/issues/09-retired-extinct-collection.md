# 09 - Seed and enrich the Retired extinct collection

Status: ready-for-human

Progress: implemented (6/6 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Create a sourced starter set of extinct organisms across relevant Realms and Phyla. The Retired sidebar mode uses the same dependent Phylum/Class rows, cards, and detail language as Living while adding temporal context.

## Acceptance criteria

- [x] Extinct records use stable scientific identity and lifeState=extinct.
- [x] Retired mode excludes extant records and Hall of Fame encounter actions.
- [x] Phylum row derives from extinct records in the active Realm.
- [x] Class row regenerates from the selected extinct Phylum.
- [x] Geological period/extinction timing and at least one source are stored when supported.
- [x] Retired produces non-empty demonstrable results.

## Blocked by

- 05 - Build dependent Phylum and Class control rows.
- 08 - Forge the universal biological enrichment CLI.

## Verification

- Doctor, filter, and API tests.
- Browser review of populated Retired modes.

## Comments
