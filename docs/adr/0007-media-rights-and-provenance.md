# ADR-0007 - Zero-attribution media policy

## Status

Accepted on 2026-08-01. Supersedes the earlier conditional-attribution policy from the same date.

This is an engineering policy, not legal advice.

## Context

Biological facts and scientific names are not a blanket license for photographs, illustrations, prose, or videos. The first full-catalog audit resolved 101 Wikimedia Commons covers: only 22 were Public Domain or CC0, while 79 were copyrighted works under CC BY, CC BY-SA, or GFDL. Open licensing can permit reuse, but those licenses create attribution, share-alike, or review obligations that do not fit CozyMuseum's deliberately simple media model.

Downloading an image to `images/species/` is still copying. A local-only or Git-ignored file is not exempt from copyright requirements.

## Decision

### Absolute image allowlist

CozyMuseum accepts an image only when exact file-level metadata identifies it as one of:

- `CC0` / `CC0 1.0`; or
- `Public Domain`, including an explicit Public Domain Mark or an equivalent rights statement from the authoritative provider.

Every other license or status is denied, including CC BY, CC BY-SA, GFDL, CC NC, CC ND, fair use, provider terms without a file-level dedication, missing metadata, ambiguous metadata, and user assertions that cannot be verified.

This gate applies equally to remote display URLs, downloaded local copies, imported workbooks, seed data, migration code, scraper results, and generated derivatives. Cropping, resizing, caching, private use, or Git-ignore never converts a denied work into an allowed one.

### Internal proof, no visible credit burden

Accepted rows retain machine-readable audit evidence internally:

- `coverUrl`: canonical direct media URL;
- `imageSourceUrl`: exact file-description or provider record URL;
- `imageLicense`: normalized `CC0` or `Public Domain`;
- `imageLicenseUrl`: canonical rights statement when supplied;
- `imageRightsStatus`: `rights-free`;
- `imageRetrievedAt`: verification timestamp.

Creator and attribution text are optional because neither CC0 nor Public Domain requires visible credit. The product UI does not render a credit block. Internal source metadata remains mandatory so `bio doctor` can prove why a file passed the gate.

### Remote-only intake and delivery

- Search may inspect any candidate, but selection skips every candidate outside the absolute allowlist.
- Wikipedia article thumbnails are never accepted as a fallback because an article URL does not prove the exact file's rights.
- Catalog media is referenced by an HTTPS `coverUrl`; it is never downloaded, cached, copied into the repository, or served from a local `/images` route.
- A remote URL is a delivery mechanism, not a license. Every displayed URL still requires the same exact CC0/Public Domain evidence.
- Existing `localCover` fields and catalog-media files are migration debt and are removed.
- If no rights-free image is available, the organism remains valid and uses the normal image-missing card state.
- AI-generated media is not an automatic fallback. It requires a separate provenance policy and is outside this decision.
- Bundled layout backgrounds, logos, and icons are UI assets rather than catalog media; they may ship only when first-party or independently rights-cleared.

### Text and biodiversity data

Store scientific facts and short CozyMuseum-authored summaries. Retain scientific source URLs. Never store Wikipedia extracts or other third-party prose verbatim; bilingual descriptions are generated from structured taxonomic facts such as scientific name, life state, Class, Order, and Family. Wikipedia may contribute a page title, entity identity, and source URL, but not reusable prose. GBIF or another dataset license does not automatically license attached media; every image still passes the image gate independently.

### YouTube

CozyMuseum may store a public watch URL, video ID, title, and liveness result, and may use YouTube's official privacy-enhanced embed. It must not download, rehost, extract audio, cache video or thumbnails, bypass restrictions, or obscure YouTube as the source. YouTube links are not treated as CozyMuseum-owned media and do not satisfy the image gate.

## Consequences

- The 79 conditionally licensed remote images and 74 corresponding local copies identified by the first audit are removed rather than attributed.
- The remaining catalog image set is smaller but has no attribution or share-alike burden.
- Missing imagery is an accepted truthful state.
- Enrichment fails closed when license evidence is missing or outside the allowlist, and no downloader exists.
- `bio doctor` treats a displayed image outside `CC0` or `Public Domain`, or any local catalog-media reference, as a release-blocking error.

## Verification

- A full catalog report returns zero denied remote covers and zero denied local copies.
- Every surviving cover has an exact source record, normalized allowed license, `rights-free` status, and retrieval date.
- No `images/species/` tree or `localCover` catalog value exists.
- Tests prove that CC BY, CC BY-SA, GFDL, unknown licenses, and article-thumbnail fallbacks are rejected.
- Tests prove that CC0 and Public Domain remote files may be selected without being downloaded.
- No YouTube video/audio download path exists.

## Authoritative references

- Creative Commons CC0: https://creativecommons.org/public-domain/cc0/
- Creative Commons Public Domain Mark: https://creativecommons.org/public-domain/mark/1.0/
- Wikimedia Commons reuse guide: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en
- Wikimedia Commons license guide: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/licenses/en
- GBIF multimedia publishing: https://techdocs.gbif.org/en/data-publishing/multimedia-publishing
- YouTube embed help: https://support.google.com/youtube/answer/171780
- YouTube API policy guide: https://developers.google.com/youtube/terms/developer-policies-guide
