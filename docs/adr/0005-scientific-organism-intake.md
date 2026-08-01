# ADR-0005 - Scientific organism intake through a single verified command

## Status

Accepted on 2026-08-01.

## Context

CozyMuseum already enriches existing catalog rows but has no repeatable, safe path for adding a new organism from its name. Copying FourRealm’s media-oriented helper scripts would duplicate storage access, mix entertainment sources with biology, and permit weak taxonomy to enter a personal scientific catalog.

## Decision

Add one `bio add` command over a deep `organism-intake` module. GBIF resolves biological identity and taxonomy first. Wikipedia/Wikimedia may fill bilingual descriptive text and image provenance. YouTube is used only for a watch link after oEmbed liveness verification, ranked toward long-form HD/4K natural-history results. The service previews by default and writes only ready, confident rows when explicitly applied.

The intake service remains above the existing enrichment/store seams: it creates records, validates the policy, detects duplicates, and inserts rows; the store alone still chooses one of the existing four Realm workbooks. Catalog images remain remote-only under ADR-0007.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Manually copy V2’s add-item scripts | Violates CozyMuseum module ownership and carries unsuitable media-specific assumptions. |
| Let an LLM create rows directly | Cannot prove taxonomy, image quality, video liveness, or duplicate safety. |
| Write an HTTP mutation endpoint | Adds UI/API attack surface for a private local workflow without helping the operator. |
| Auto-apply incomplete results | Creates quiet scientific and UX debt. |

## Consequences

### Positive

- One invocation gives operators a reproducible scientific trail and a truthful report.
- Four-workbook ownership and encounter invariants remain intact.
- The Codex skill becomes thin guidance over a tested public interface.

### Tradeoffs

- A taxon with no acceptable image or video stays a visible rejected/incomplete result until a human supplies better data.
- Third-party free endpoints/search responses may be unavailable; provider failures are normal reported states.

## Verification

- Fixture tests assert preview/apply, duplicate safety, confidence/taxonomy/media gates, and batch isolation.
- Existing catalog and storage tests prove the four-workbook invariant.
- `npm run verify` and `npm run bio -- doctor` remain green.
