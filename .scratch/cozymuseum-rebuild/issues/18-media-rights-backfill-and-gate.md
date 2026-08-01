# Issue 18 - Media rights backfill and release gate

Status: complete

## Outcome

Convert the 2026-08-01 audit into an enforceable zero-attribution media gate and purge every non-CC0/non-Public-Domain image.

## Acceptance criteria

- [x] Preserve only CC0/Public Domain covers with canonical File URL, normalized license, license URL, rights status, and retrieval date.
- [x] Remove all CC BY, CC BY-SA, GFDL, unknown, and unverifiable covers from live workbooks, seed data, and local storage.
- [x] Reject new remote/local covers without exact CC0/Public Domain proof.
- [x] Keep the detail UI free of attribution controls because accepted images carry no attribution requirement.
- [x] Keep YouTube link/embed-only and video/audio download impossible.
- [x] Add regression tests and a repeatable full-catalog rights report through `bio doctor` and the dated audit.
