# CozyMuseum Rebuild

Status: implemented; pending final local verification and commit
Owner: Vector148
Date: 2026-08-01
Related: ADR-0001

## 1. Executive summary

Build a clean, independent CozyMuseum repository: a bilingual biological atlas with compact glass navigation, vivid square organism cards, scientific taxonomy, and local-first ownership. The product begins with the 62 legacy CozyMuseum records across four Realms, then enriches them through scientific APIs, public knowledge sources, vivid imagery, and high-quality YouTube natural-history videos.

Success means the owner can switch among four Realms, browse Extant and Retired taxa, and use Hall of Fame only in directly observable Animalia and Plants & Fungi. The active collection is filtered through a first horizontal Phylum row and a dependent second Class row under search. The owner can browse in English or Vietnamese, open a square organism card, complete an eligible direct encounter with an automatically stamped date, score its rarity in nature, filter Hall of Fame by encounter year, and read a coherent biological detail panel with canonical taxonomy, sourced imagery, and relevant HD/4K video.

## 2. Context and problem

The legacy prototype contains useful biological seed data but also has duplicated Realm routes, unrelated tracker fields, incomplete Class maps, English-only records, no extinct collection, no video links, and only 27 local images. Its task notes claim more data than the actual workbooks contain, so the new system must measure reality.

The approved CozyMuseum product language uses a compact glass UI, square full-bleed cards, a responsive grid, a fixed navigation sidebar, a focused detail modal, a local Excel adapter, a unified ingestion surface, and a reproducible verification workflow. Biological seed data is imported only through explicit CozyMuseum archives with provenance.

## 3. Strategic fit

- Turns the CozyMuseum prototype into a coherent atlas.
- Keeps a familiar interaction model, reducing relearning.
- Makes biological enrichment repeatable instead of a pile of one-off scripts.
- Creates a public-code repository while keeping local data and downloaded media out of Git.
- Establishes deep modules that future agents can navigate and test safely.

## 4. Scope and boundary

### In scope

- Independent nested repository with new Git history and dedicated origin.
- Four top-level Realms backed by legacy CozyMuseum data.
- Eligible Realms expose three sidebar modes: Extant, Retired, and Hall of Fame. SAR and Microverse expose only Extant and Retired because they do not support direct encounters.
- Two taxonomy rows below search: Phylum first, Class second.
- Extant maps to taxa with existing individuals; Retired maps to extinct taxa.
- Hall of Fame contains only organisms the owner has directly encountered, ranks them by a 0–10 rarity score, and filters them by automatic completion year.
- EN/VI switch in the sidebar with deterministic fallback.
- Compact square cards and responsive 4/3/2-column grid.
- Rich biological detail modal with YouTube embed/watch link.
- Unified catalog HTTP surface and Excel adapter.
- Legacy workbook and CozyMuseum-image migration.
- Universal enrichment CLI using API first, web sources second, AI manifest fallback last.
- Provenance, confidence, dry-run, idempotency, overwrite policy, diagnostics, tests, and browser QA.

### Out of scope

- Accessing or modifying unrelated repositories.
- Importing unapproved external private data or media.
- Authentication, payments, social profiles, or multi-user collaboration.
- Genomic sequence storage and laboratory analysis.
- A guarantee that YouTube playback always selects 1080p; CozyMuseum can select videos advertised as HD/4K, but player resolution remains controlled by YouTube and network conditions.
- Automatic publication or Git push in this phase.

### Deferred

- Offline video downloads.
- Native mobile application.
- Graph/phylogenetic tree visualization.
- PostgreSQL or hosted deployment.
- Community editing and moderation.

## 5. Users and operators

- Primary user: Sếp, browsing and maintaining a personal biological atlas.
- Operator: local developer/agent running migration, enrichment, validation, and Git workflows.
- Downstream consumers: React UI, Express HTTP layer, CLI, automated tests.
- Failure impact: misleading taxonomy, broken media, lost workbook changes, or confusing locale state.

## 6. User stories

1. As the owner, I want CozyMuseum to use a compact and consistent interaction language, so that the atlas remains instantly navigable.
2. As the owner, I want four Realm buttons, so that the original collection model remains intact.
3. As the owner, I want each Realm to show only its own organisms, so that biological groups never leak across tabs.
4. As the owner, I want Extant and Retired everywhere, plus Hall of Fame only where direct encounters are meaningful, so that area navigation stays simple and truthful.
5. As the owner, I want Phylum chips on the first row under search, so that I can choose an Ngành without leaving the collection.
6. As the owner, I want Class chips on the second row, so that Lớp remains visibly subordinate to the chosen Ngành.
7. As the owner, I want Extant/Hiện sinh to show taxa with existing individuals, so that the wording is taxonomically precise and everyday browsing excludes extinct taxa.
8. As the owner, I want Retired to show extinct organisms through the same Phylum/Class controls, so that the extinct atlas feels equally complete.
9. As the owner, I want Hall of Fame to show only organisms I have directly encountered, so that it represents lived experience rather than taxonomy.
10. As the owner, I want four square cards per desktop row, so that the atlas remains dense without becoming noisy.
11. As the owner, I want vivid full-bleed organism imagery, so that cards feel alive.
12. As the owner, I want common and scientific names on every card, so that casual and formal identification coexist.
13. As the owner, I want a Class pill and conservation/extinction marker, so that important metadata is scannable.
14. As the owner, I want EN/VI in the sidebar, so that language can change without leaving the collection.
15. As the owner, I want the selected language to persist locally, so that reopening the atlas respects my choice.
16. As the owner, I want missing Vietnamese text to fall back to English, so that records never become blank.
17. As the owner, I want scientific names to remain unchanged across locales, so that identity is stable.
18. As the owner, I want clicking a card to open a focused detail panel, so that interaction remains consistent.
19. As the owner, I want habitat, distribution, diet/trophic role, taxonomy, conservation, size, and lifespan fields, so that details are biologically useful.
20. As the owner, I want a relevant YouTube natural-history video, so that I can observe behavior and ecology.
21. As the owner, I want a direct YouTube link when embedding fails, so that the resource remains reachable.
22. As the operator, I want legacy records normalized without mutating the source directory, so that migration is reversible.
23. As the operator, I want a dry-run enrichment preview, so that bad matches are visible before writes.
24. As the operator, I want stable IDs and idempotent apply, so that rerunning the scraper cannot duplicate species.
25. As the operator, I want API-first providers, so that taxonomy is more reliable than ad-hoc search.
26. As the operator, I want every enriched field to retain source, timestamp, and confidence, so that claims are auditable.
27. As the operator, I want catalog imagery delivered by rights-verified remote links, so that deployment never copies or exposes local media.
28. As the operator, I want diagnostics for missing translations, media, video, taxonomy, and provenance, so that backlog is measurable.
29. As a maintainer, I want one catalog interface rather than four copied implementations, so that fixes have locality.
30. As a maintainer, I want tests at the catalog, HTTP, CLI, and browser seams, so that refactoring cannot silently break behavior.
31. As the owner, I want marking an organism encountered to be one quick, obvious action.
32. As the owner, I want the encounter date filled automatically when I press complete, so that completion stays one quick action.
33. As the owner, I want to score natural rarity from 0–10, so that Hall of Fame ranks the hardest species I personally found.
34. As the owner, I want a Hall of Fame year dropdown, so that selecting a year shows only organisms completed in that year.

## 7. Functional requirements

### 7.1 Navigation

- Realm selection is always visible in a two-by-two grid at the bottom of the sidebar.
- Animalia and Plants & Fungi show Extant, Retired, and Hall of Fame. SAR and Microverse show only Extant and Retired.
- Locale control sits between the three modes and Realm selection, uses EN and VI labels, and is keyboard accessible.
- Changing Realm preserves an eligible sidebar mode, resets Phylum and Class to All, and keeps locale and search. A Hall-to-SAR/Microverse change falls back to Extant.
- Changing Phylum immediately regenerates the entire Class row from that Phylum, resets Class to All, and preserves locale/search. Class is dependent on Phylum, never an independent peer filter.

### 7.2 Filtering

- Query matches localized common name, alternate common name, scientific name, order, family, habitat, and description.
- Search occupies the first control line.
- The next control line contains Phylum chips only.
- The following control line contains Class chips only. Its complete option set derives exclusively from the selected Phylum; stale Classes from the previous Phylum disappear immediately.
- Extant applies lifeState=extant; Retired applies lifeState=extinct; Hall of Fame applies encountered=true and is valid only for Animalia and Plants & Fungi.
- Realm, sidebar mode, Phylum, Class, and query intersect.
- Unknown life state appears in diagnostics and in no normal mode until corrected.
- Empty/loading/error states retain the same compact spatial rhythm as the loaded atlas.
- Filters are represented in the URL only after core behavior is stable; local state is sufficient for the first slice.

### 7.3 Cards

- Card dimensions, radius, glass treatment, hover, image ratio, typography, and grid breakpoints follow the approved CozyMuseum design tokens.
- Image is full-bleed 1:1 with object-fit cover.
- Fallback uses scientific-name initials on a realm-colored gradient.
- Primary text is localized common name; secondary text is scientific name.
- Pill shows localized Class; right-side compact value shows rarity score for encountered records, EX for extinct records, IUCN code when known, or an em dash.
- Friendly Class labels on chips/cards map one-to-one to canonical scientific `className` values; a broad vernacular group never becomes stored taxonomy.
- Card opens detail with mouse or keyboard.

### 7.4 Detail

- Header shows localized common name and italic scientific name.
- Information grid supports Realm, Phylum, Class, Order, Family, conservation/life state, habitat, distribution, diet/trophic role, size, lifespan, geological period/extinction date, and sources.
- Taxonomic rank cells use canonical scientific names independent of locale. Unresolved ranks are omitted rather than replaced with a friendly but false taxon.
- Only available values render; missing fields do not create meaningless empty cells.
- Image and YouTube video are separate media regions.
- Video stores watch URL and derived privacy-enhanced embed URL.
- Source links open in a new tab with safe rel attributes.
- Extant Animalia and Plants & Fungi details expose a compact completion action that records a direct encounter. SAR and Microverse never expose or accept encounter scoring.
- Scientific life-state detail renders `Extant`/`Hiện sinh` and `Extinct`/`Tuyệt chủng`; it never uses individual-level Living/Còn sống wording.
- Completing an encounter requires a rarity score from 0–10 and automatically stores the current local date; it does not request location or notes.
- Undoing an encounter removes it from Hall of Fame but does not delete the organism.
- Hall of Fame exposes an All years option plus years derived from encounter dates. Selecting a year filters strictly by the encounterDate year.
- The year selector defaults to the current year when that year has encounters; otherwise it defaults to All years.

### 7.5 Localization

- UI copy is dictionary-driven, not duplicated components.
- Records store EN and VI common names and descriptions separately.
- Fallback order is selected locale, English, scientific name.
- Locale persists via localStorage and is validated on load.
- Document language and accessible labels update with locale.

### 7.6 Catalog and HTTP interface

- List accepts realm, atlasMode, phylum, class, query, locale, and optional encounterYear; the catalog maps atlasMode to life/encounter predicates.
- Get uses stable organism ID.
- Encounter update preserves organism identity and validates rarity score.
- Import normalizes legacy rows and reports inserted/updated/skipped/failed counts.
- Update preserves stable identity.
- HTTP exposes health, realms metadata, organism list, organism detail, and controlled update/import endpoints.
- Controllers contain no taxonomy or workbook logic.

### 7.7 Legacy migration

- Source workbooks are read from an explicit input directory.
- Migration maps title to English common name, original_title to scientific name, subcategory to English description, rights-cleared remote cover, source, phylum, class, and video fields.
- Realm derives from the source workbook, never from guessed names.
- Legacy status active maps to Extant unless scientific enrichment proves Extinct.
- Original source files remain unchanged.
- Migration output is exactly four CozyMuseum workbooks—one per Realm—with a shared stable schema and an import report. Each workbook has one `Library` sheet.
- Extant, Retired, eligible Hall of Fame, Phylum, Class, year, and completion are column-backed views; none creates another workbook or worksheet.

### 7.8 Enrichment

- One command supports target scope, provider selection, preview by default, apply flag, download-media flag, overwrite policy, confidence threshold, and JSON output.
- Provider order: GBIF/Wikidata or equivalent taxonomy APIs; Wikipedia/Wikimedia and iNaturalist for descriptions/media; YouTube search for natural-history video; web/image search fallback; AI-needed manifest last.
- Candidate scoring uses scientific name, exact common-name aliases, expected Realm, and taxonomy consistency.
- Low-confidence or ambiguous candidates never auto-apply.
- Media download validates MIME type, size, dimensions where available, and writes collision-safe filenames.
- Apply writes atomically and is safe to rerun.

## 8. Non-functional requirements

- Desktop reference viewport is 1920×1080; responsive breakpoints retain 4/3/2 columns.
- Interactive controls meet keyboard and visible-focus expectations.
- Initial catalog load for 1,000 local records should complete within one second on the owner’s machine excluding image network time.
- No remote credentials are required for core browsing.
- Network failures produce per-provider diagnostics without corrupting the catalog.
- Local workbook and images are ignored by Git.
- UTF-8 Vietnamese must render without mojibake.
- The build and tests run on Windows PowerShell and Node.js 20+.

## 9. Data model and contract

Stable identity: `organismId` is deterministic from authoritative taxon ID when available, otherwise from Realm plus normalized scientific name.

Required fields:

- organismId, realmId, commonNameEn, scientificName, phylum, className, lifeState.

Localized fields:

- commonNameVi, descriptionEn, descriptionVi, habitatEn, habitatVi, distributionEn, distributionVi, dietEn, dietVi.

Taxonomy fields:

- domain, kingdom, phylum, className, order, family, genus, species, rank, authoritativeTaxonId.

Temporal/conservation fields:

- lifeState, extinctionYear, geologicalPeriod, iucnStatus, populationTrend.

Media fields:

- coverUrl, imageSourceUrl, imageLicense, youtubeUrl, youtubeId, videoTitle, videoQualityHint.

Operational fields:

- sourceUrls, provider, fetchedAt, confidence, importBatch, schemaVersion.

Encounter fields:

- encountered, encounterDate, rarityScore.
- These fields stay on the organism row in its owning Realm workbook. `encountered` is boolean; no Hall of Fame workbook/sheet is allowed.

List response:

- items, filters, total, locale, generatedAt.

Error response:

- error code, human message, optional field/provider context; no internal stack in production.

## 10. UX/UI requirements

- Use CozyMuseum's approved sidebar width, background treatment, controls container, chip geometry, card shell, hover motion, and modal glass.
- Do not add a dashboard hero above the collection.
- Avoid circular avatar treatment; organism imagery fills the square.
- Preserve breathing room and four-column desktop density.
- Realm active colors may differ, but layout does not.
- Locale switch is compact and visually subordinate to biological navigation.
- Sidebar modes use a fixed compact footprint and never contain taxonomy chips.
- The controls glass contains search, then a Phylum row, then a Class row.
- Extinct cards use a restrained fossil/amber marker, not a completely different card component.
- Hall of Fame reuses the same cards and displays the rarity score prominently.
- Hall of Fame includes a compact year selector whose options derive from actual encounter dates.
- Long taxonomy labels truncate without expanding card height.
- Modal remains scrollable, closes on backdrop/Escape, traps focus in a later accessibility slice, and restores focus to the source card.

## 11. Dependencies and ownership

- Catalog owner: app biodiversity module.
- Storage adapter: local Excel.
- Delivery adapters: Express HTTP and CLI.
- UI owner: React atlas surface.
- External dependencies: GBIF, Wikidata/Wikipedia/Wikimedia, iNaturalist, YouTube search.
- Legacy input: consumed from the read-only sibling, verified, archived under `database/seeds/`, then deleted on 2026-08-01 by explicit owner instruction.

## 12. Issue breakdown

| Slice | Title | Dependency | Acceptance summary | Verification |
| --- | --- | --- | --- | --- |
| 01 | Foundation and catalog seam | None | clean repo, schema, adapters, health/list | catalog/API tests |
| 02 | Animalia atlas tracer bullet | 01 | approved CozyMuseum UI through real API | browser + build |
| 03 | Four-Realm migration | 01 | 62 legacy rows normalized without source mutation | migration test/report |
| 04 | Bilingual atlas | 02,03 | EN/VI UI and record fallback | locale tests/browser |
| 05 | Two-row Phylum and Class controls | 02,03 | Ngành first row, Lớp second row, intersected results | catalog/UI tests |
| 06 | Encounter completion and Hall of Fame | 02,03 | auto-date encounter, rarity score, year ranking/filter | catalog/API/browser |
| 07 | Rich detail and video | 03,04,06 | biological metadata, encounter action, YouTube fallback | API/browser |
| 08 | Universal enrichment CLI | 01,03 | preview/apply/idempotency/provenance | replay tests |
| 09 | Retired extinct collection | 05,08 | sourced extinct records using the same taxonomy controls | doctor + browser |
| 10 | Visual parity and release hardening | 02-09 | responsive/accessibility/verify | full verify |
| 11 | Curate archived observation candidates | 08 | bounded review of 384 unique raw identities | preview/apply/doctor |
| 12 | Canonical scientific Classes | 05,08 | canonical data plus friendly one-to-one labels | audit/tests/browser |
| 13 | Realm-gated encounters | 06 | Hall and rarity only for Animalia/Plants & Fungi | catalog/API/browser |
| 14 | Extant life-state language | 04,09 | Extant/Hiện sinh and Extinct/Tuyệt chủng detail | i18n/build/browser |
| 15 | Control-panel luminance | 10 | translucent blurred scrim without background/geometry drift | CSS test/browser |

## 13. Acceptance criteria

- New repository has no inherited commits and only the CozyMuseum origin.
- Repository history begins with one CozyMuseum-only root snapshot and uses only the CozyMuseum origin.
- All 62 legacy records import with stable identity and Realm ownership.
- The catalog persists to exactly four flat Realm workbooks with one `Library` sheet each.
- Completing an encounter mutates only the organism row's boolean/date/rarity columns and creates no secondary Hall of Fame storage.
- UI exposes four Realms; all have Extant and Retired, while only Animalia and Plants & Fungi expose Hall of Fame.
- Under search, Phylum renders on row one and Class on row two.
- Selecting a new Phylum replaces the Class row and resets Class to All without preserving an incompatible Class selection.
- Hall of Fame contains only directly encountered organisms and ranks valid 0–10 rarity scores.
- Encounter completion automatically stamps today; Hall of Fame’s year dropdown filters by that timestamp.
- EN/VI switch persists and never hides a record due to missing translation.
- Cards and controls match the approved CozyMuseum geometry at the reference viewport.
- Every detail view handles image, metadata, source, and missing/available video states.
- Enrichment defaults to dry-run, records provenance/confidence, and is idempotent.
- Diagnostics report exact missing counts.
- Targeted tests, build, doctor, and browser smoke pass.

## 14. Test and verification plan

- Catalog contract test with in-memory and Excel adapters.
- Migration fixture test proving row count, field mapping, and source immutability.
- Filter tests for Realm + Atlas mode + Phylum + Class + query intersection.
- Dependency test proving a Phylum change regenerates and resets the available Class row.
- Encounter completion/undo, automatic-date, rarity ranking, and year-filter tests.
- Locale tests for persistence and EN fallback.
- HTTP smoke for health, metadata, list, detail, and update errors.
- CLI replay fixtures for provider candidates, threshold, dry-run, apply, and idempotency.
- Remote-media tests for rights evidence, HTTPS delivery, and missing-image fallback.
- Browser comparison at desktop and mobile widths for geometry, keyboard navigation, modal, and locale.
- Full command: `npm run verify`.

## 15. Risks and decisions

- Legacy taxonomy is incomplete and sometimes scientifically broad; preserve source values, then enrich with confidence rather than silently rewriting.
- “Siêu vi” mixes viruses, bacteria, archaea, and fungi; preserve the Realm for product continuity while storing formal taxonomy separately.
- Image vividness is subjective; use deterministic resolution/aspect scoring and provenance before AI fallback.
- YouTube cannot guarantee playback resolution; select HD/4K-labeled sources and expose a direct link.
- Public biological facts do not eliminate image/video licensing; keep provenance and do not commit downloaded media.
- Excel is acceptable for local single-user operation but requires atomic writes and serialized apply.
- Rarity score is explicitly the owner’s field observation, not an authoritative conservation assessment; IUCN status remains separate.

## 16. Handoff notes

- Read this PRD, ADR-0001, and CONTEXT before editing.
- Do not introduce unrelated generic tracker field names into the public catalog interface.
- Do not recreate or depend on the deleted legacy sibling; use the versioned raw archive or an explicit backup path.
- Implement one vertical slice at a time and keep verification green.

## Comments

- 2026-08-01: The legacy sibling was fully consumed before deletion: 62 curated records, 27 hash-verified media files, and a byte-identical raw observation archive yielding 452 candidates (384 unique organism identities).
- 2026-08-01: Issue 11 classified all 384 unique archived identities in digest-locked 20-row batches. It promoted 301 exact accepted GBIF proposals, quarantined 59 ambiguous candidates, and produced a doctor-clean 375-row versioned catalog seed.

- 2026-08-01: Sếp explicitly requested autonomous implementation; issue granularity is treated as approved without an additional quiz.
- 2026-08-01: Sếp replaced the navigation model: Phylum/Class moved into two rows under search; the sidebar uses Extant/Retired and an encounter-based Hall of Fame gated to observable Realms.
- 2026-08-01: Sếp required canonical scientific Class values in details while retaining friendly one-to-one labels on chips/cards, and selected Extant/Hiện sinh as the taxon-level life-state concept.
- 2026-08-01: Sếp fixed the storage invariant: one single-sheet workbook per top-level Realm and all completion/classification views represented by columns, never extra sheets/databases.
