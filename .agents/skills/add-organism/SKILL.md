---
name: add-organism
description: Research and add one or more organisms to a local CozyMuseum atlas. Use when the user gives organism names, a list, or an image and asks to add them, enrich their biological metadata, find a high-resolution image, or attach a natural-history YouTube video.
---

# Add Organism

Use the public `npm run bio -- add` command. Do not write directly to Excel, invent taxonomy, or reuse FourRealm media scripts.

## Workflow

1. Identify every requested organism. For an image, list only species that can be identified confidently; ask the user to name ambiguous organisms rather than guessing.
2. Prefer a scientific name. For a single item, run a write-free preview:

   ```powershell
   npm run bio -- add --name "Panthera leo" --realm animalia
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
   npm run bio -- add --input backup/add-organisms.json
   ```

4. Inspect every result. A `ready` item has an authoritative GBIF identity at or above the confidence threshold, a canonical scientific Class, a provenance-linked Full HD/4K Wikimedia image, and an oEmbed-verified HD/4K natural-history YouTube URL. `duplicate`, `rejected`, and `failed` are valid outcomes and must not be disguised as success.
5. Only apply items reported `ready`:

   ```powershell
   npm run bio -- add --input backup/add-organisms.json --apply
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
