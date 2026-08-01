# Repository safety

- Code may use only the configured CozyMuseum remote: `vector148/cozymuseum`.
- Do not access or mutate repositories outside the current CozyMuseum workspace without explicit owner authorization.
- Commit only the four rights-reviewed public source workbooks named by ADR-0009. Never commit personal workbook state, downloaded images, caches, credentials, backups, or generated scraper reports.
- Keep API credentials in ignored environment variables.
- Keep image/video provenance even when the underlying biological facts are public.
- Treat the legacy CozyMuseum directory as read-only import input.
- Only trusted local workbooks may be imported. The current `xlsx` package has unresolved upstream advisories, so untrusted spreadsheets are outside the supported threat model.
