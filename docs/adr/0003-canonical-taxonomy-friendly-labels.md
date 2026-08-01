# ADR-0003 - Canonical Taxonomy, Friendly Collection Labels

## Status

Accepted on 2026-08-01 by explicit owner direction.

## Context

Legacy CozyMuseum stored presentation groups such as `pisces`, `crustacea`, and `all` in the scientific `className` field. That made the collection approachable, but it also caused the detail panel to claim that a great white shark belonged to the class “Fishes”. This is scientifically invalid and collapses ray-finned fishes and cartilaginous fishes into one false class.

## Decision

- `className` stores a case-preserving scientific Class name only, for example `Actinopterygii`, `Chondrichthyes`, `Mammalia`, or `Malacostraca`.
- A filter chip or card pill may expose a localized friendly label through `displayClass`, but that label always maps one-to-one to a canonical `className` concept.
- The detail panel renders canonical `className` directly and never renders `displayClass` in the Class cell.
- `classId` remains the normalized key derived from canonical `className`; no parallel Class database or worksheet is introduced.
- `fish`, `fishes`, `pisces`, `crustacea`, `all`, `unknown`, and localized equivalents are prohibited as canonical Class values.
- Unresolved Class is represented as an empty value and omitted from scientific detail. The UI may say “Class unresolved” only as collection guidance, never as a scientific taxon.
- Provider results require an accepted/exact match and confidence of at least 0.8. Curated overrides are allowed where a provider omits the Class, matches a homonym, or exposes a lower rank in its Class field. Every override records a source and rationale.
- Correcting Class mutates only the organism row in its existing Realm workbook.

## Consequences

- Clownfish and great white shark no longer share a fake “Fishes” Class: they resolve to `Actinopterygii` and `Chondrichthyes`.
- Cards remain approachable while the detail panel becomes scientifically strict.
- Existing URLs/filter state derived from `pisces` are intentionally replaced by canonical Class IDs.
- Broad group cards may omit Class until a defensible concept is available.

## Verification

- Catalog tests prove friendly labels derive from canonical classes while detail data remains canonical.
- Taxonomy audit rejects prohibited vernacular/group values in `className`.
- A deterministic correction manifest is previewable, idempotent, provenance-bearing, and applied through the shared four-workbook adapter.
- Browser QA verifies distinct ray-finned/cartilaginous chips and canonical detail cells in EN and VI.

## Review trigger

Review only when CozyMuseum adds explicit subclass/order-level browsing or changes its authoritative taxonomy provider.
