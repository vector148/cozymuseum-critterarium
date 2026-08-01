# 14 - Use taxon-level Extant and Extinct language

Status: ready-for-human

Progress: implemented (5/5 acceptance criteria verified)

## Parent

CozyMuseum Rebuild PRD

## What to build

Replace individual-sounding Living/Còn sống labels with the taxon-level concept Extant/Hiện sinh. Scientific detail uses Extant/Hiện sinh and Extinct/Tuyệt chủng, while Retired/Đã nghỉ hưu may remain the playful extinct-collection navigation label.

## Acceptance criteria

- [x] The extant navigation label is `Extant` in EN and `Hiện sinh` in VI.
- [x] Detail life state is `Extant`/`Hiện sinh` or `Extinct`/`Tuyệt chủng`.
- [x] Empty-state copy uses taxon-level terminology.
- [x] Stored values remain stable as `extant` and `extinct`.
- [x] Tests/build/browser smoke pass in both locales.

## Verification

- i18n and detail tests or build smoke.
- Browser EN/VI detail comparison.

## Comments

- 2026-08-01: IUCN usage confirms `Extant` as the non-extinct taxon concept. Browser QA verified EN `Extant`, VI `Hiện sinh`, and unchanged stored values.
