# 04 - Add persistent bilingual EN/VI atlas behavior

Status: ready-for-human

Progress: implemented (5/5 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Add a compact EN/VI switch between the three sidebar modes and the four-Realm grid. Localize modes, Phylum/Class rows, controls, common names, descriptions, encounter copy, and accessible labels. Scientific names remain invariant and incomplete Vietnamese records fall back deterministically.

## Acceptance criteria

- [x] Locale control is keyboard accessible, visible between mode navigation and Realm buttons, and never occupies a taxonomy row.
- [x] Selected locale persists across reloads.
- [x] Fallback order is selected locale, English, scientific name.
- [x] Realm/Phylum/Class identifiers do not change with locale.
- [x] Vietnamese renders as UTF-8 without mojibake.

## Blocked by

- 02 - Deliver the Animalia atlas tracer bullet.
- 03 - Migrate all four legacy CozyMuseum workbooks.

## Verification

- Locale and fallback tests.
- Reload persistence browser smoke.
- EN and VI screenshots at the same viewport.

## Comments
