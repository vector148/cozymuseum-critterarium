# ADR-0009 - Versioned public source workbooks

## Status

Accepted on 2026-08-01. This decision narrows the workbook exclusions in ADR-0006 and ADR-0008.

## Context

CozyMuseum is both a public showroom and a clonable biological catalog. The four Excel workbooks contain the product's clean organism dataset and demonstrate the complete single-sheet database contract. Treating every workbook as private and Git-ignored leaves a clone without its editable source database even though the public seed already exposes the same approved catalog facts.

The workbook schema also contains `encountered`, `encounterDate`, and `rarityScore`, but those fields do not make the catalog inherently personal. A release workbook can ship with those fields blank while each visitor's runtime encounter state remains isolated in browser localStorage.

## Decision

- Commit exactly four source workbooks: `animalia.xlsx`, `plantae-fungi.xlsx`, `sar.xlsx`, and `microverse.xlsx`.
- Each workbook remains a flat, single-sheet `Library` database governed by ADR-0002.
- Public release workbooks contain the full rights-reviewed organism catalog but must have no non-empty encounter, date, rarity, location, account, credential, or other personal-state values.
- `database/state/`, backups, scraper reports, caches, and user-created imports remain ignored.
- The workbooks are downloadable from the GitHub source repository and serve as the editable source for clones.
- Vercel continues to deploy the reviewed `database/seeds/catalog.json` snapshot rather than raw `.xlsx` files. This keeps the hosted runtime static and read-only while avoiding duplicate deployment payloads.
- The snapshot and the four workbooks must contain the same organism IDs and approved catalog content at release time.
- Every image/video field in a workbook remains subject to ADR-0007; committing a workbook does not relax media rights.

## Consequences

- A clone starts with a complete, inspectable Excel database instead of an empty shell.
- Git history intentionally contains the approved biological dataset.
- Workbook diffs are less reviewable than text, so release tests and the JSON snapshot provide an auditable comparison surface.
- Personal Hall of Fame activity still belongs to the visitor's local overlay unless the owner deliberately edits a private local copy outside the public release flow.

## Verification

- Repository tests assert all four workbook files exist and are not Git-ignored.
- Every public workbook has one `Library` sheet and zero non-empty encounter-state fields.
- Workbook and snapshot organism ID sets match.
- `bio doctor` and the rights audit pass before the same-day release commit is amended and pushed.
