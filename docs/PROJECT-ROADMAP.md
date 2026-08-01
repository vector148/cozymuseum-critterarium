# CozyMuseum Project Roadmap

Updated: 2026-08-01

This is the human-facing index for the CozyMuseum atlas. Working PRDs and issues remain in `.scratch/`; durable architecture decisions remain in `docs/adr/`.

## Planning sources

- Master PRD: [CozyMuseum rebuild PRD](../.scratch/cozymuseum-rebuild/PRD.md)
- Turbo queue: [CozyMuseum TODO](../.scratch/cozymuseum-rebuild/TODO.md)
- Issue directory: [Implementation issues](../.scratch/cozymuseum-rebuild/issues/)
- Architecture decisions: [ADR directory](adr/)

## Active battlefront

| Priority | Issue | Outcome | Status |
| --- | --- | --- | --- |
| P0 | [12](../.scratch/cozymuseum-rebuild/issues/12-canonical-scientific-classes.md) | Canonical scientific Classes with friendly one-to-one labels | Ready for human |
| P0 | [13](../.scratch/cozymuseum-rebuild/issues/13-realm-encounter-eligibility.md) | No encounter, rarity, or Hall of Fame for SAR/Microverse | Ready for human |
| P0 | [14](../.scratch/cozymuseum-rebuild/issues/14-extant-life-state-language.md) | Use Extant / Hiện sinh opposite Extinct / Tuyệt chủng | Ready for human |
| P0 | [15](../.scratch/cozymuseum-rebuild/issues/15-control-panel-luminance.md) | Use blurred translucent glass without changing Realm backgrounds | Ready for human |
| P1 | [11](../.scratch/cozymuseum-rebuild/issues/11-curate-legacy-observation-candidates.md) | Curate the archived legacy candidate pool in bounded verified batches | Ready for human |
| P0 | [16](../.scratch/cozymuseum-rebuild/issues/16-commitlint-source-governance.md) | Conventional Commit policy and CI gate | In progress |
| P0 | [17](../.scratch/cozymuseum-rebuild/issues/17-media-rights-policy.md) | Rights/provenance policy for images, local copies, data, and YouTube | Ready for human |
| P0 | [18](../.scratch/cozymuseum-rebuild/issues/18-media-rights-backfill-and-gate.md) | Backfill 101 covers and enforce attribution/release gates | Ready for agent |

## Completed foundations

Issues 01–11 implemented the shared catalog seam, four Realm workbooks, the atlas UI, bilingual display, dependent Phylum/Class rows, encounter flow, detail media, enrichment CLI, extinct collection, pixel-parity QA, legacy-data extraction, safe deletion of the old CozyMuseum folder, and verified promotion of 301 archived candidates.

## Durable decisions

- [ADR-0001: Deep biological catalog](adr/0001-deep-biological-catalog.md)
- [ADR-0002: Four flat single-sheet Realm workbooks](adr/0002-four-realm-single-sheet-workbooks.md)
- [ADR-0003: Canonical taxonomy with friendly collection labels](adr/0003-canonical-taxonomy-friendly-labels.md)
- [ADR-0004: Realm-gated observable encounters](adr/0004-realm-gated-observable-encounters.md)
- [ADR-0005: Scientific organism intake](adr/0005-scientific-organism-intake.md)
- [ADR-0006: Conventional Commit source governance](adr/0006-conventional-commit-source-governance.md)
- [ADR-0007: Media rights, provenance, and local copies](adr/0007-media-rights-and-provenance.md)
- [Media-rights audit: 2026-08-01](audits/2026-08-01-media-rights-audit.md)

## Release gate

The P0 issues passed targeted tests, catalog doctor, and browser smoke. Issue 11 classified all 384 unique archived identities, produced a 375-row reproducible catalog seed, and left 59 ambiguous candidates isolated for human review. The next autonomous front is filling measured translation/media/provenance gaps; no automatic second push is part of this gate.
