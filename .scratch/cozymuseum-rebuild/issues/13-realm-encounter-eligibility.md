# 13 - Gate encounters and Hall of Fame by observable Realm

Status: ready-for-human

Progress: implemented (7/7 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD and ADR-0004

## What to build

Keep encounter completion, rarity score, and Hall of Fame only for Animalia and Plants & Fungi. Remove the mechanism entirely from SAR and Microverse at both UI and catalog boundaries.

## Acceptance criteria

- [x] Realm metadata declares encounter eligibility from one domain policy.
- [x] Animalia and Plants & Fungi still allow encounter completion.
- [x] SAR and Microverse completion attempts fail through the catalog/API.
- [x] SAR and Microverse details contain no encounter or rarity controls.
- [x] Hall of Fame navigation is absent in SAR and Microverse.
- [x] Switching from Hall of Fame to SAR/Microverse returns to the extant mode.
- [x] Targeted tests, full verify, and browser smoke pass.

## Verification

- Catalog and HTTP contract tests.
- Production build.
- Browser realm-switch/detail smoke.

## Comments

- 2026-08-01: Browser QA measured 0 Hall controls and 0 encounter controls in both SAR and Microverse; Hall-to-SAR fell back to Hiện sinh. HTTP completion for SAR returns 400.
