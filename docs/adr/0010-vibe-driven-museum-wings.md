# ADR-0010 - Vibe-Driven Museum Wings (Science Backend, Cozy Frontend)

## Status

Accepted on 2026-08-01 by explicit owner direction.

## Context

CozyMuseum's user interface historically mirrored its backend database structure, exposing scientific concepts like "Realms" (Animalia, Plantae) and "Phyla" (Chordata, Arthropoda) directly as top-level navigation filters. This was overly academic and worked against the intended "cozy, relaxing" vibe of the application (similar to games like Animal Crossing). Furthermore, aquatic animals were mixed with terrestrial animals, and extinct dinosaurs were mixed with living fauna, making browsing less intuitive.

## Decision

- **Database Integrity (The Brains):** The local Excel workbooks and backend API continue to store and operate on strict scientific taxonomy (`realmId`, `phylum`, `className`, `lifeState`).
- **UI Decoupling (The Beauty):** The frontend navigation completely decouples from Realms. It now uses 4 experiential "Wings" (Fauna, Flora, Aquarium, Fossils).
- **Phylum Elimination:** The "Phylum" filter row is permanently removed from the UI.
- **Flat Category View:** The "Class" filter row is renamed to "Category" (Nhóm). It displays a flat list of friendly names (e.g., "Fishes", "Mammals", "Birds") mapped from the scientific classes, hiding the academic hierarchy.
- **Dynamic Routing:** A new `matchesWing` policy in the catalog adapter translates UI Wing selections into complex database queries (e.g., Aquarium filters for Animalia + specific aquatic classes).
- **Hidden Databases:** SAR and Microverse organisms are preserved locally for completeness and potential future research but are explicitly removed from `git tracking` (via `.gitignore`) and completely hidden from the CozyMuseum UI.

## Consequences

- The user experience is significantly more intuitive, relaxing, and game-like.
- The UI codebase uses `wingId` instead of `realmId` for primary navigation.
- A hardcoded list of `AQUATIC_CLASSES` must be maintained in the catalog adapter to correctly route organisms into the Aquarium wing.
- SAR and Microverse data is fully decoupled from the public product experience.

## Verification

- `catalog intersects wing, atlas mode, class, localized query, and locale` test passes and enforces the correct routing logic.
- `catalog metadata exposes categories and derives counts from records` test ensures the metadata flattens classes properly.
- All backend unit tests execute successfully.

## Review trigger

Review if new taxonomic classes are added that need to be categorized into the Aquarium, or if a completely new thematic Wing is introduced.
