# AGENTS.md

## Working style

- Address the owner as **Sếp** and refer to yourself as **em**.
- Work autonomously; ask only when a missing decision would materially change the product.
- Prefer scientific APIs, then web search, then AI-generated media as the final fallback.
- Catalog media is remote-only. Never download, cache, commit, or serve organism images from this repository.
- Excel access belongs in `app/catalog/adapters/excel-store.js`.

## Safety and Git

- This is the independent CozyMuseum repository.
- Its only allowed remote is `https://github.com/vector148/cozymuseum.git`.
- Do not read from or write to repositories outside this workspace unless the owner explicitly expands the task boundary.
- The four rights-reviewed source workbooks under `database/` are versioned public product data. Personal state, downloaded species images, caches, backups, and scraper output must remain ignored.
- Use one consolidated local commit per calendar day.

## Architecture

- React UI lives in `resources/js/`; styles live in `resources/css/`.
- Express delivery code lives in `server/` and `app/Http/`.
- Biological catalog, taxonomy, localization, ingestion, and diagnostics live in `app/`.
- Controllers and routes are thin adapters over deep modules.
- Product plans and issues live under `.scratch/`; durable decisions live under `docs/adr/`.

## Workflow

- Before non-trivial work, read the startup checklist, inspect Git status, and preserve unrelated work.
- Use Blackfire before architecture, UX, scraper, data, or repository-history changes.
- Use Greenline/TDD one observable vertical slice at a time.
- Full verification is `npm run verify`.
