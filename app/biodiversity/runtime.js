import { createBiodiversityCatalog } from "./catalog.js";
import { createOrganismExcelStore } from "./store.js";

export const organismStore = createOrganismExcelStore();
export const biodiversityCatalog = createBiodiversityCatalog({ store: organismStore });
