# ADR-0004 - Realm-Gated Observable Encounters

## Status

Accepted on 2026-08-01 by explicit owner direction.

## Context

Hall of Fame records a direct, unaided real-world encounter with an organism card. Applying the same completion and rarity mechanic to microscopic or non-directly-observable catalog domains creates a false claim: a SAR or Microverse taxon cannot normally be recognized as one concrete organism by the owner during an everyday encounter.

## Decision

- Encounter and rarity mechanics are enabled only for the `animalia` and `plantae_fungi` Realms.
- The `sar` and `microverse` Realms expose neither Hall of Fame navigation nor encounter controls.
- Switching from an eligible Realm's Hall of Fame into an ineligible Realm automatically returns to the extant atlas mode.
- The catalog is the authority: attempting to complete an encounter for SAR or Microverse is rejected even if a client bypasses the UI.
- Realm metadata exposes encounter eligibility so clients do not duplicate the policy.
- No new workbook, sheet, or eligibility column is introduced; eligibility derives deterministically from `realmId`.

## Consequences

- Hall of Fame remains a truthful record of directly observable life.
- Animal, plant, and macroscopic-fungus encounters retain the familiar completion interaction.
- Existing four-workbook and same-row encounter storage remain unchanged.

## Verification

- Catalog tests reject SAR/Microverse completion and allow Animalia/Plants & Fungi.
- Metadata tests expose the eligibility flag.
- UI tests/build prove Hall and scoring controls are absent for ineligible Realms.
- Browser smoke proves a Hall-to-SAR switch falls back to Extant.
