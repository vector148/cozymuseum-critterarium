# 07 - Build rich organism detail with natural-history video

Status: ready-for-human

Progress: implemented (6/6 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Build a focused biological detail panel with localized names and prose, formal taxonomy, ecology, conservation/extinction context, image provenance, encounter controls, and an embedded natural-history YouTube video with direct-link fallback.

## Acceptance criteria

- [x] Detail renders only meaningful available fields.
- [x] Scientific name, Phylum, Class, Order, and Family have explicit labels.
- [x] Ecology and temporal/conservation metadata are readable in EN/VI.
- [x] Extant detail integrates encounter completion; extinct detail does not.
- [x] YouTube watch URLs derive a privacy-enhanced embed safely.
- [x] Direct watch and source links remain available when embed playback fails.

## Blocked by

- 03 - Migrate all four legacy CozyMuseum workbooks.
- 04 - Add persistent bilingual EN/VI atlas behavior.
- 06 - Record real-world encounters and rank Hall of Fame.

## Verification

- Video URL normalization tests.
- Detail/encounter API contract tests.
- Keyboard and browser modal smoke.

## Comments
