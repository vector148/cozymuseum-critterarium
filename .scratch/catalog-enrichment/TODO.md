# Full-catalog enrichment queue

Updated: 2026-08-01

Current state: **Paused before apply.** A separate IDE owns the full-catalog crawl. The Codex run completed only a five-record preview; do not start a bulk apply until the external run is handed back and reconciled.

- [x] Audit current completeness and identify copied/mismatched prose.
- [x] Define the rights-safe provider and failure contract.
- [ ] Replace provider extracts with authored bilingual taxonomy summaries.
- [ ] Add selected-field overwrite support for safe description replacement.
- [x] Run a bounded live preview and inspect provider outcomes.
- [ ] Enrich all 404 records in batches without lowering confidence.
- [ ] Regenerate the public showroom snapshot.
- [ ] Publish the four sanitized Excel source workbooks under ADR-0009.
- [ ] Run copyright audit, doctor, full verification, and report residual gaps.
