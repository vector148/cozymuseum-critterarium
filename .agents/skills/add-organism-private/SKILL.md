---
name: add-organism-private
description: (Internal) Research and add organisms with STRICT aesthetic media requirements for the personal CozyMuseum atlas. Use when adding organisms internally and preserving high visual standards.
---

# Add Organism (Private)

Use the public `npm run bio -- add` command. Do not write directly to Excel, invent taxonomy, or reuse FourRealm media scripts.

## Workflow

1. Identify every requested organism. For an image, list only species that can be identified confidently; ask the user to name ambiguous organisms rather than guessing.
2. Prefer a scientific name. For a single item, run a write-free preview:

   ```powershell
   npm run bio -- add --name "Panthera leo" --realm animalia --strict-media
   ```

3. For multiple items, create a Git-ignored `backup/add-organisms.json` array. Each item may contain `name`, `scientificName`, `commonNameEn`, `commonNameVi`, `realmId`, and `lifeState`.

   ```json
   [
     { "name": "Panthera leo", "realmId": "animalia", "lifeState": "extant" },
     { "name": "Acanthostega gunnari", "realmId": "animalia", "lifeState": "extinct" }
   ]
   ```

   Preview the whole batch:

   ```powershell
   npm run bio -- add --input backup/add-organisms.json --strict-media
   ```

4. Inspect every result. A `ready` item has an authoritative GBIF identity at or above the confidence threshold, a canonical scientific Class, a provenance-linked Full HD/4K Wikimedia image, and an oEmbed-verified HD/4K natural-history YouTube URL. `duplicate`, `rejected`, and `failed` are valid outcomes and must not be disguised as success.
5. Only apply items reported `ready`:

   ```powershell
   npm run bio -- add --input backup/add-organisms.json --apply --strict-media
   npm run bio -- doctor
   ```

## Invariants

- Let the command check duplicates before remote calls and again after GBIF resolution. Never overwrite an existing record or its encounter history.
- Keep `className` canonical (`Mammalia`, `Actinopterygii`, `Chondrichthyes`), not presentation groups such as `Fish`.
- Accept only `animalia`, `plantae_fungi`, `sar`, or `microverse` as explicit Realm IDs; let GBIF infer one only when its kingdom is unambiguous.
- Import every record with `encountered: false`. Hall of Fame remains an in-app real-world encounter action only for Animalia and Plantae & Fungi.
- Keep catalog images remote-only. Every displayed cover requires exact CC0/Public Domain proof; never download, cache, or serve catalog media locally.
- Use GBIF for authority, Wikipedia/Wikimedia for public prose/media provenance, and YouTube only as a verified watch link. Preserve source fields; biological facts being public does not erase media provenance.

## Recovery

If a result is rejected for weak taxonomy or inadequate media, report the exact reason and leave the workbook unchanged. Do not lower the default `0.8` confidence threshold or use AI-generated imagery as a silent substitute. The owner may provide a better scientific name or intentionally use a separate manual import path.

## Image Filtering & "Sổ Nợ" (Debt Stash)

The Wikimedia Commons scraper in `app/biodiversity/enrichment.js` has two automatic image-rejection layers:

**Layer 1 — Search-time negative keywords** (sent to Wikimedia API):
Searches already exclude: `aquarium`, `zoo`, `market`, `captive`, `illustration`, `drawing`, `pencil`, `watercolour`, `engraving`, `lithograph`, old naturalist names (`Siebold`, `Audubon`, `Gould`, `Brehm`, `Kawahara`, `Temminck`), `specimen`, `herbarium`, `taxidermy`, `skeleton`, `museum`, `dead`, `food`, `dish`, `trap`, `fishing`, etc.

**Layer 2 — URL post-filter** (`isImageUrlAcceptable`):
Even if a bad image leaks through the search, it is rejected at intake if its filename URL contains any of the bad-context patterns (`.pdf`, `.tif`, `_zoo_`, `_aquarium`, `_drawing`, `_pencil`, `rmnh.art`, etc.).

**CRITICAL: STRICT MEDIA ENFORCEMENT (1% Difference)**
Because we are using `--strict-media`, the scraper will absolutely reject academic, specimen, or "pulled ashore" photos for the Aquarium. Furthermore, you MUST MANUALLY visually inspect the images (if possible) or strictly ensure that they are NOT:
- Black and white / grayscale images
- Desaturated or lacking vibrant colors
- Night vision, infrared, or extremely dark images
- Photos of signs, text, or non-animal subjects
- Images where the subject is too far away, barely visible, or just a tiny speck in the background

**What this means for you:**
- If the scraper returns no image for a species, it is likely because only bad images were available. **Do not lower the threshold or manually insert a bad URL.** Just leave the field blank — blank is acceptable per ADR-0007.
- **For Aquarium:** Do not manually bypass the strict rules.
- The filter intentionally passes illustrations for **extinct species** (`lifeState: extinct`) because no wild photographs exist. Do not remove old-book images for fossils.
- **RECORD IT IN THE DEBT STASH**: If the image fails the strict aesthetic criteria, write the organism's name into `.scratch/qa_backlog.md` (the "sổ nợ"). Tell the user it failed the aesthetic test.

## Manual Unsplash Overrides (Strict)

When the user manually provides an Unsplash URL or ID (e.g., via `--unsplash-id`), you MUST visually verify the image before running the `apply` command.
1. Extract the image URL using the Unsplash API or page structure.
2. Download the image temporarily using `run_command` (e.g., `curl -o .scratch/temp_check.jpg <URL>`).
3. Use the `view_file` tool on the downloaded image to visually inspect it.
4. **STRICT ENFORCEMENT**: ONLY proceed with the `add` command if your visual inspection confirms the image correctly depicts the target organism AND meets all aesthetic masterpiece criteria (vibrant, well-framed). Otherwise, reject the link, push it to `.scratch/qa_backlog.md`, and inform the user.
