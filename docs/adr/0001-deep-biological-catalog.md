# ADR-0001 - Deep Biological Catalog With Local Adapters

## Status

Accepted on 2026-08-01.

## Context

The legacy CozyMuseum prototype duplicated routes for four workbooks and leaked taxonomy rules, localization, image handling, and filtering across UI, server, and scripts. The product needs a polished compact atlas while supporting biological identity, extinct taxa, bilingual text, provenance, and multi-source enrichment.

## Decision

Create one deep biological catalog module. Its small interface lists, retrieves, imports, and updates organism records. Realm/taxonomy/life-state normalization lives behind that interface. Excel is the first storage adapter; an in-memory adapter is used in tests. The adapter owns the four Realm workbooks, so callers see one catalog while storage retains one core workbook per top-level Realm.

Create one enrichment module with preview/apply behavior. Providers return normalized candidate patches with provenance and confidence. Preview never writes. Apply is idempotent and updates only fields permitted by the selected overwrite policy.

React and Express consume these module interfaces through one catalog HTTP surface. Four Realms are data values, not four copied route implementations.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Keep four copied Realm routes | Shallow modules repeat behavior and let taxonomy rules drift. |
| Put taxonomy maps only in React | Server, CLI, and tests would disagree with the UI. |
| Replace Excel immediately with a database server | Adds operations cost before the product behavior is proven. |
| Scrape directly from UI | Hides failure/provenance and cannot provide a safe preview/apply workflow. |

## Consequences

### Positive

- One correction fixes all Realms.
- Four Realm workbooks remain independently inspectable without creating four route or catalog implementations.
- UI/API/CLI share stable identity and taxonomy rules.
- Tests exercise behavior through public interfaces.
- Storage can change later without rewriting product behavior.

### Tradeoffs

- Legacy workbooks need a migration normalization step.
- Excel writes remain serialized and unsuitable for concurrent multi-user editing.
- Rich scientific fields flatten into workbook columns until a future storage ADR.

## Verification

- Contract tests run the catalog against in-memory and Excel adapters.
- API smoke tests cover all four Realms through one endpoint.
- Browser checks compare the rendered atlas against approved CozyMuseum geometry at the reference viewport.
- Enrichment replay fixtures prove preview is write-free and apply is idempotent.

## Review date

Review after 1,000 catalog records or when concurrent editing is required.
