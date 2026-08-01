# 10 - Finish visual parity and release hardening

Status: ready-for-human

Progress: implemented (6/6 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Validate CozyMuseum against its approved desktop/mobile geometry, remove remaining prototype artifacts, harden accessibility/error states, document local operation, and prepare one clean daily commit.

## Acceptance criteria

- [x] Sidebar has exactly three modes and the four-Realm grid.
- [x] Search, Phylum row, Class row, 4/3/2-column grid, cards, and modal match the approved CozyMuseum geometry.
- [x] No stale Class survives a Phylum change.
- [x] Hall of Fame completion and rarity score are understandable in EN/VI.
- [x] Focus order, semantics, alt text, modal close, and reduced motion are acceptable.
- [x] Full verification passes and Git contains one consolidated commit for the day.

## Blocked by

- 02 through 09.

## Verification

- npm run verify.
- Desktop/mobile browser screenshots and interaction smoke.
- Git status, log, and remote audit.

## Comments

## Pixel-parity turbo backlog

- [x] Fix sidebar width at 280px on the 1920x1080 reference viewport.
- [x] Fix main padding at 32px 40px 60px and align controls/grid at x=320px.
- [x] Fix the search height, control radius/padding, chip geometry, and compact vertical rhythm while retaining two dependent taxonomy rows.
- [x] Fix the grid gap at 18px, four-column card width, 20px card radius, square cover, and compact metadata footer.
- [x] Give Animalia, Plantae & Fungi, SAR, and Microverse unmistakable blue, green, yellow, and red page/sidebar/control themes.
- [x] Record CozyMuseum's rendered DOM measurements at 1920x1080 as the release baseline.
- [x] Verify 3-column and 2-column responsive states, mobile sidebar behavior, focus, console, and overflow.
- [x] Clear the temporary Lion encounter after Hall of Fame/year QA.
- [x] Run the complete verification suite and create one consolidated initial commit dated today.

## Verification evidence

- CozyMuseum measurements at 1920x1080: sidebar 280px, main padding 32px 40px 60px, search 40.8px, grid gap 18px, card width 372.7px, radius 20px.
- Browser QA: four columns at 1920px, three at 1280px, two at 390px; no horizontal overflow; Escape closes the modal and restores focus to its card.
- Hall smoke: Lion completed at rarity 8.7 with automatic date 2026-08-01, appeared under default year 2026, then was undone; catalog doctor reports zero encounters.
- `npm test`, `npm run verify`, production build, doctor, child/parent remote audit, and legacy deletion audit completed on 2026-08-01.
