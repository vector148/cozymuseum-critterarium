# ADR-0002 - Four Flat Single-Sheet Realm Workbooks

## Status

Accepted on 2026-08-01.

## Context

CozyMuseum has four top-level data owners—Animalia, Plantae & Fungi, SAR, and Microverse. A flat local architecture keeps one core workbook per Realm, exactly one `Library` worksheet per workbook, and classification or encounter state as columns rather than duplicated sheets.

Hall of Fame, Extant, Retired, Phylum, Class, and encounter year are views over organism rows. Giving any of them a separate workbook or sheet would duplicate identities and create synchronization risk.

## Decision

- Store the four Realms in exactly four workbooks: `animalia.xlsx`, `plantae-fungi.xlsx`, `sar.xlsx`, and `microverse.xlsx`.
- Each workbook contains exactly one worksheet named `Library`.
- Every organism belongs to exactly one workbook through its `realmId`.
- Keep `lifeState`, `encountered`, `encounterDate`, and `rarityScore` on the organism row.
- `encountered` is a boolean. Completing an encounter sets it to `TRUE`, stamps the current local date in `encounterDate`, and stores the 0–10 rarity score. Undo resets those three fields on the same row.
- Do not create Hall of Fame, Extant, Retired, year, Phylum, or Class workbooks/sheets.
- Present all four workbooks through one storage adapter and one deep catalog interface; UI, HTTP, and CLI never choose filenames.
- Continue to use local Excel only. No SQL/NoSQL system is introduced.

## Consequences

### Positive

- Keeps storage flat, predictable, and easy to inspect manually.
- Realm ownership is physically obvious while application behavior stays unified.
- Encounter and taxonomy filters cannot drift from a copied Hall of Fame dataset.
- Each file remains small and AI/tool friendly.

### Tradeoffs

- A cross-Realm list reads four small files into memory.
- A full catalog rewrite touches four files; this remains acceptable for a private single-user system.

## Verification

- Store tests assert exactly four workbook filenames and one `Library` sheet each.
- Encounter tests inspect the owning Realm workbook and assert no Hall of Fame workbook exists.
- Diagnostics assert every row has a known Realm owner and a boolean encounter value.

## Review trigger

Review only if the product requires concurrent writers, hosted storage, or a Realm workbook grows beyond practical in-memory operation.
