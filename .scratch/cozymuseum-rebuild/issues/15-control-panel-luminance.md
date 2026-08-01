# 15 - Reduce taxonomy control-panel glare

Status: ready-for-human

Progress: implemented (5/5 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Use a translucent blurred-glass search and taxonomy surface so the active Realm background remains visible through it while labels and chips retain enough contrast. Preserve the approved blue/green/yellow/red Realm artwork and compact CozyMuseum geometry.

## Acceptance criteria

- [x] The control panel uses a translucent local scrim with visible backdrop blur instead of an opaque black surface.
- [x] Search, row labels, chips, counts, and hints remain readable in every Realm.
- [x] Existing panel dimensions, spacing, radius, and responsive behavior do not change.
- [x] The Realm background assets/colors themselves remain unchanged.
- [x] CSS tests/build and desktop browser screenshots pass.

## Verification

- Background/geometry regression tests.
- Browser screenshots across all four Realms at 1920x1080.

## Comments

- 2026-08-01: All four Realms render the same 154.4px control height and local dark scrim; Animalia/Plants background hashes remain byte-identical. Browser console recorded no warnings or errors.
- 2026-08-01: Owner visual review rejected the nearly opaque `0.92/0.86` scrim. The panel now uses `0.62/0.44` glass with 32px blur and 155% saturation; search uses `0.52`, allowing the Realm artwork to tint the surface without changing geometry.
