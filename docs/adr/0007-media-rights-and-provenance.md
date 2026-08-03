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

- `CC0` / `CC0 1.0`;
- `Public Domain`, including an explicit Public Domain Mark or an equivalent rights statement from the authoritative provider; or
- `Unsplash License` (Free for commercial and non-commercial use, no attribution required).

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

---

## Programmatic QA Methodology (added 2026-08-02)

Beyond the license gate, CozyMuseum enforces a second layer of **content-context QA** to ensure images are also visually appropriate for a natural history museum: real wildlife photographs, not illustrations, market goods, zoo exhibits, or unrenderable file formats.

### How Agents Detect Bad Images Without Seeing Them

Agents operating on this codebase cannot directly "see" images as a human would. Instead, they exploit a key property of **Wikimedia Commons file naming**: Commons file names are derived from the original description or provenance of the image. This means:

- A file named `..._pencil_drawing_-_water_colour.jpeg` literally contains the words "pencil drawing" and "water colour" — it IS a drawing.
- A file named `Three_children_riding_an_elephant_at_New_York_Zoological_Park...tif` tells you it was taken at a zoo AND is a .tif format that browsers cannot render.
- A file ending in `.pdf` is a document, not an image — it will never display as a card cover.
- A file named `..._Siebold_Collection_-_Kawahara_Keiga_-_1823...` is an 18th-century naturalist illustration, not a photograph.

**The QA mechanism is text pattern matching on the `coverUrl` and `imageSourceUrl` fields.**

### Programmatic QA Check Layers

Run these checks in order. Each layer catches a different class of bad image:

#### Layer 1 – Unrenderable formats
```js
// Remove organisms whose coverUrl points to a PDF or TIF file
const isBad = url.endsWith('.pdf') || url.includes('.pdf?') || url.endsWith('.tif');
```
PDFs are legal/scientific documents grabbed by mistake. TIF files are not supported by browsers.

#### Layer 2 – Non-natural context keywords in URL/filename
```js
const badContextPatterns = [
  'zoo', 'zoological_park', 'aquarium_tank', 'captive',
  'market', 'stall', 'food', 'cooked', 'dried', 'spice',
  'dead', 'cage', 'pet_shop'
];
```
These words appearing in the Wikimedia filename indicate the subject was photographed in an inappropriate context (market, cage, kitchen, etc.) rather than in nature.

#### Layer 3 – Illustration/artwork filenames
```js
const artPatterns = [
  'pencil', 'watercolour', 'water_colour', 'drawing', 'engraving',
  'lithograph', 'illustration', 'painting', 'etching', 'woodcut',
  'siebold', 'keiga', 'temminck', 'schlegel',  // known naturalist artist names
  'rmnh.art', 'artwork', 'iconograph', 'tavola', 'tafel', 'abbildung',
  'audubon', 'gould_', '_gould', 'naturalis_biodiversity'
];
```
These patterns identify old naturalist illustration collections. Acceptable for **extinct** species (no photographs exist), but **not acceptable** for extant species — they should have real wildlife photos.

#### Layer 4 – Old-era publication filenames (extant species only)
```js
// Year pattern 1600s-1920s in filename = almost certainly a book illustration
const oldYearPattern = /_(1[678]\d{2}|19[012]\d)[\._\-]/;
if (row.lifeState !== 'extinct' && oldYearPattern.test(url)) { /* flag */ }
```

#### Layer 5 – Non-standard image hosts
```js
// All images must come from Wikimedia (upload.wikimedia.org)
const isApproved = url.includes('upload.wikimedia.org');
if (!isApproved) { /* flag for manual review */ }
```

### When to Use the Browser Subagent

Programmatic QA catches URL/filename-provable issues, but some bad images have perfectly fine filenames. For example, a photo of an animal in a market stall might be named `Anabas_testudineus.jpg` with no contextual clue in the URL.

For this, use the **`browser_subagent`** tool, which simulates real mouse and keyboard input on a live browser window:

```
browser_subagent task:
  1. Navigate to http://localhost:5173
  2. Scroll through each tab (Aquarium, Wildlife, Botany, Fossils)
  3. Report any card whose image looks like: illustration, market animal,
     food product, zoo exhibit, captive specimen, or is broken/empty
```

The browser subagent can actually **see** the rendered images via DOM inspection and screenshot. It is subject to API rate limits (429 errors) and should be used after programmatic layers have reduced the problem set.

### QA Decision Matrix

| Finding | Action |
|---|---|
| `.pdf` or `.tif` coverUrl | Delete organism from Excel → Sổ Nợ |
| Zoo/market/captive keyword in URL | Delete organism from Excel → Sổ Nợ |
| Illustration/artwork keyword, extant species | Delete organism from Excel → Sổ Nợ |
| Illustration/artwork keyword, extinct species | **Keep** — no real photos exist for extinct taxa |
| Old-year filename, extant species | Delete organism from Excel → Sổ Nợ |
| Old-year filename, extinct species | **Keep** — paleontology illustrations are standard |
| Visual QA (browser): image looks wrong | Delete organism from Excel → Sổ Nợ |
| No image at all (`coverUrl` blank) | **Keep** — blank card is acceptable per ADR-0007 |

### Mandatory Sequence After Removals

```
1. node remove_bad_organisms.mjs   # removes from Excel workbooks
2. npm run bio:sync                # regenerates catalog.json from Excel
3. update tests/biodiversity/doctor.test.js snapshot counts
4. npm run verify                  # must pass 60/60
5. git add . ; git commit --amend --no-edit ; git push -f
6. record removals in .scratch/sổ_nợ.md
```
