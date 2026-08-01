# 06 - Record real-world encounters and rank Hall of Fame

Status: ready-for-human

Progress: implemented (11/11 acceptance criteria verified; temporary QA encounter cleared)

## Parent

CozyMuseum Rebuild PRD

## What to build

Let the owner mark an eligible extant organism as directly encountered through one compact completion interaction. Require only a 0–10 rarity score; completion automatically stamps the current local date. Hall of Fame shows encountered organisms, ranks by rarity, and filters by completion year.

## Acceptance criteria

- [x] Only extant organism details offer Mark encountered.
- [x] Completion requires a numeric rarity score from 0 through 10.
- [x] Completion automatically stores today as encounterDate and asks for no location or notes.
- [x] Completion writes `encountered`, `encounterDate`, and `rarityScore` on the existing organism row in its Realm workbook; no Hall of Fame workbook/sheet exists.
- [x] Hall of Fame contains only encountered records in the active Realm.
- [x] Hall of Fame sorts rarity descending with deterministic ties.
- [x] Year options derive from encounterDate and include All years.
- [x] Selecting a year shows only encounters completed during that calendar year.
- [x] Current year is the default only when it contains encounters; otherwise All years is selected.
- [x] Undo encounter removes Hall of Fame state without deleting the organism.
- [x] IUCN status and owner rarity score remain distinct fields.

## Blocked by

- 02 - Deliver the Animalia atlas tracer bullet.
- 03 - Migrate all four legacy CozyMuseum workbooks.

## Verification

- Catalog encounter completion/undo and automatic-date tests.
- Hall of Fame ranking and year-filter API tests.
- Browser completion and ranking smoke.

## Comments
