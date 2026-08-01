# 02 - Add Organism skill and documentation

Status: completed

## Scope

Create the English `add-organism` skill, adapting the useful duplicate/research/media/insert loop from V2 for scientific taxon data and the new CozyMuseum command.

## Acceptance criteria

- The skill processes every supplied organism and uses the CLI preview before apply.
- It does not claim uncertain taxonomy, invent media, or overwrite existing organisms/encounters.
- Documentation explains one-item and JSON-batch use.

## Verification

Inspect skill instructions against the CLI help and run its stated command smoke path.

## Comments

- 2026-08-01: Created the local `add-organism` Codex skill and README examples. The skill delegates all writes to the tested public command and requires preview before apply.
