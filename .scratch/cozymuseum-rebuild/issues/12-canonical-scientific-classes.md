# 12 - Separate canonical scientific Classes from friendly labels

Status: ready-for-human

Progress: implemented (8/8 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD and ADR-0003

## What to build

Replace legacy presentation groups in `className` with canonical scientific Class names, keep approachable localized labels in collection surfaces, and make the detail panel scientifically strict.

## Acceptance criteria

- [x] `className` contains only canonical scientific Class names or an empty unresolved value.
- [x] Clownfish resolves to `Actinopterygii`; great white shark and megalodon resolve to `Chondrichthyes`.
- [x] Existing broad aliases such as `pisces`, `crustacea`, and `all` are removed from canonical Class data.
- [x] Class chips and card pills remain localized and friendly but map one-to-one to canonical Class IDs.
- [x] Detail Class renders canonical `className` in both EN and VI and omits unresolved Class.
- [x] Corrections are deterministic, previewable, idempotent, sourced, and write only through the shared catalog store.
- [x] Catalog doctor reports prohibited Class aliases and fails when any remain.
- [x] Targeted tests, full verify, and browser smoke pass.

## Verification

- Taxonomy correction and catalog tests.
- `npm run bio -- taxonomy` preview and `npm run bio -- taxonomy --apply`.
- `npm run verify`.
- Browser smoke on the Chordata Class row and great-white-shark detail.

## Comments

- 2026-08-01: GBIF audit exposed 3 `pisces`, 2 `crustacea`, and 36 `all` values in the current workbooks. Provider results are inputs, not unquestioned truth when rank conventions or homonyms conflict with the accepted product taxonomy.
- 2026-08-01: Applied 74 sourced corrections, then replayed the manifest with 74 unchanged and 0 missing. Doctor reports 0 invalid aliases and 4 deliberately unresolved SAR Classes. Browser QA verified friendly EN/VI fish labels with canonical `Chondrichthyes` in detail.
