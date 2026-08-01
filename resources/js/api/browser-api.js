import catalogSeed from "../../../database/seeds/catalog.json";
import { createBiodiversityCatalog } from "../../../app/biodiversity/catalog.js";
import { createEncounterOverlayStore } from "../data/encounter-overlay-store.js";

let catalog;

function browserCatalog() {
  if (!catalog) {
    catalog = createBiodiversityCatalog({
      store: createEncounterOverlayStore(catalogSeed),
    });
  }
  return catalog;
}

export const browserApi = Object.freeze({
  getMetadata: (filters) => browserCatalog().metadata(filters),
  getOrganisms: (filters) => browserCatalog().list(filters),
  getOrganism: (organismId, locale) => browserCatalog().get(organismId, { locale }),
  completeEncounter: (organismId, rarityScore) => browserCatalog().completeEncounter(organismId, { rarityScore }),
  undoEncounter: (organismId) => browserCatalog().undoEncounter(organismId),
});

