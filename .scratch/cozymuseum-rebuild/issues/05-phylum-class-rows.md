# 05 - Build dependent Phylum and Class control rows

Status: ready-for-human

Progress: implemented (5/5 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Render Phylum on the first row under search and Class on the second. Class is strictly dependent on the selected Phylum: selecting another Phylum replaces the available Class chips and resets the active Class to All. Living/Retired remain sidebar modes and are not taxonomy chips.

## Acceptance criteria

- [x] Phylum chips occupy the first taxonomy row.
- [x] Class chips occupy the second taxonomy row.
- [x] Changing Phylum immediately regenerates Class options from that Phylum only.
- [x] Changing Phylum resets active Class to All and preserves sidebar mode/query.
- [x] Results intersect Realm, sidebar mode, Phylum, Class, and query.

## Blocked by

- 02 - Deliver the Animalia atlas tracer bullet.
- 03 - Migrate all four legacy CozyMuseum workbooks.

## Verification

- Catalog intersection tests.
- UI control-state and Phylum-to-Class dependency tests.
- Browser smoke proving stale Class chips disappear after a Phylum change.

## Comments
