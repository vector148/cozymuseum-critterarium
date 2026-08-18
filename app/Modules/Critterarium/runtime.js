import { createBiodiversityCatalog } from "./Application/Catalog/catalog.js";
import { createOrganismExcelStore } from "./Infrastructure/Catalog/organism-store.js";

export const organismStore = createOrganismExcelStore();
organismStore.initialize();
export const critterariumCatalog = createBiodiversityCatalog({ store: organismStore });

// Backward-compat alias for legacy callers during migration
export const biodiversityCatalog = critterariumCatalog;
