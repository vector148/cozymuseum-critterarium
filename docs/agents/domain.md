# Domain docs

This repo uses a single-context domain docs layout.

## Layout

- Root context: `CONTEXT.md`
- ADR directory: `docs/adr/`

## Consumer rules

- Skills that need domain language should read `CONTEXT.md` first.
- Skills that need architectural history should inspect `docs/adr/`.
- Add new ADRs under `docs/adr/` when a design decision affects module boundaries, infrastructure, data flow, or long-term maintainability.
