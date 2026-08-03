# ADR-0008 - Static CozyMuseum showcase and image optimization on Vercel

## Status

Accepted on 2026-08-01.

## Context

The local application intentionally uses four versioned, rights-reviewed Excel workbooks and an Express adapter. A Vercel public deployment must not rely on writable local files or assume a continuously running server. The public experience also needs a canonical CozyMuseum identity and crawlable, truthful search metadata.

## Decision

### Dual delivery, one domain model

- Local development keeps the Express HTTP adapter and four Excel workbooks.
- Production uses the same biodiversity catalog against a committed, reviewed snapshot containing the full approved content of all four workbooks and a per-visitor browser encounter overlay.
- The browser persists only encounter state in localStorage. Clearing browser data resets that personal overlay; it does not mutate the shared catalog.
- UI code calls one API facade, which selects HTTP locally and the in-browser adapter in production.

### Deployment boundary

- Vercel receives the Vite `dist` output only.
- Raw workbooks, reports, backup data, local media, scratch files, and private skills are deployment-denied. The same approved catalog is compiled into the production seed; source workbooks remain downloadable from GitHub under ADR-0009.
- SPA routes fall back to `index.html`; actual built files retain filesystem priority.
- Canonical host data comes from deployment configuration and is reused for HTML, robots, and sitemap output.

### Frontend Image Optimization

- To maintain a lightweight repository while ensuring fast, SEO-friendly page loads, production deployments leverage Vercel's Edge Image Optimization API (`/_vercel/image`).
- Remote CC0 URLs are rewritten at the component level (`OptimizedImage.jsx`) into Vercel requests when `import.meta.env.PROD` is true. Vercel automatically fetches the external image, compresses it to WebP, and serves it from the canonical CozyMuseum domain cache.
- Local Express development continues to serve the raw unoptimized URLs directly to avoid heavy local dependencies (e.g., `sharp`).

### Search boundary

- `/` is the only canonical indexable page in this release.
- Title, description, Open Graph data, manifest, and JSON-LD use CozyMuseum and make only observable claims.
- Structured data describes a `WebApplication`/`WebSite`; it never invents ratings, reviews, prices, or FAQs.
- `robots.txt` permits the public surface and links to the canonical sitemap. A sitemap is a discovery hint, not an indexing promise.

## Consequences

- The hosted application works without a database account or server write permission.
- Public users own their encounter overlay in their browser; there is no cross-device sync in this release.
- Excel remains the editable source and the four sanitized workbooks ship in the GitHub repository for clone users. Vercel consumes the equivalent reviewed, read-only snapshot rather than raw workbooks.
- Future hosted accounts or sync require a new ADR covering identity, privacy, authorization, and storage migration.

## Verification

- Production mode makes zero `/api` requests during initial browse and encounter mutation.
- Reload restores the browser overlay.
- Deployment ignore rules exclude all private/local artifacts.
- Built HTML and generated search files share the same canonical URL.
- The complete local verification suite remains green.
