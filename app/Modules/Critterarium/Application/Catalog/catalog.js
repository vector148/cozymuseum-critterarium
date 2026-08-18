import { encounterEnabledForRealm, localizedLabel, getCozyCategory, REALMS, COZY_CATEGORY_ORDER, WING_CATEGORIES } from "../../Domain/taxonomy.js";

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function key(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function searchable(value) {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLocaleLowerCase("vi");
}

function selectedLocale(locale) {
  return locale === "vi" ? "vi" : "en";
}

function truthy(value) {
  return value === true || String(value).toLowerCase() === "true" || Number(value) === 1;
}

function localDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localized(row, locale) {
  const resolvedLocale = selectedLocale(locale);
  const displayName = resolvedLocale === "vi"
    ? clean(row.commonNameVi) || clean(row.commonNameEn) || clean(row.scientificName)
    : clean(row.commonNameEn) || clean(row.commonNameVi) || clean(row.scientificName);
  const localValue = (field) => resolvedLocale === "vi"
    ? clean(row[`${field}Vi`]) || clean(row[`${field}En`])
    : clean(row[`${field}En`]) || clean(row[`${field}Vi`]);

  return {
    ...row,
    encounterEnabled: encounterEnabledForRealm(row.realmId),
    displayName,
    displayKingdom: localizedLabel("kingdom", key(row.realmId) || "other", resolvedLocale),
    displayPhylum: localizedLabel("phylum", key(row.phylum) || "other", resolvedLocale),
    displayClass: localizedLabel("className", key(row.className) || "all", resolvedLocale),
    displayDescription: localValue("description"),
    displayHabitat: localValue("habitat"),
    displayDistribution: localValue("distribution"),
    displayDiet: localValue("diet"),
  };
}

function matchesAtlasMode(row, atlasMode) {
  if (atlasMode === "retired") return key(row.lifeState) === "extinct"; // Keep for backwards compatibility with tests/api
  if (atlasMode === "hall_of_fame") {
    // Only show organisms that have been explicitly scored > 0
    // score="" or score=0 means "encountered but not yet rated" → hide from Hall of Fame
    const score = Number(row.rarityScore);
    return encounterEnabledForRealm(row.realmId)
      && truthy(row.encountered)
      && Number.isFinite(score)
      && score > 0;
  }
  return true;
}

const PHYLUM_EVOLUTION_ORDER = [
  // Animals (high to low)
  "chordata",
  "echinodermata",
  "arthropoda",
  "mollusca",
  "annelida",
  "nematoda",
  "platyhelminthes",
  "cnidaria",
  "ctenophora",
  "porifera",
  // Plants & Fungi (high to low)
  "tracheophyta",
  "bryophyta",
  "marchantiophyta",
  "anthocerotophyta",
  "chlorophyta",
  "rhodophyta",
  "basidiomycota",
  "ascomycota",
  "zygomycota",
  "chytridiomycota",
  // SAR
  "ciliophora",
  "myzozoa",
  "ochrophyta",
  // Microverse
  "halobacteriota",
  "proteobacteria",
  "firmicutes",
  "pisuviricota",
  "negarnaviricota",
  "uroviricota"
];

function getPhylumRank(phylum) {
  const p = key(phylum);
  const index = PHYLUM_EVOLUTION_ORDER.indexOf(p);
  return index === -1 ? 999 : index;
}

const AQUATIC_CLASSES = [
  "actinopterygii", "actinopteri", "teleostei", "carangiformes", "perciformes", "siluriformes", "cypriniformes", "syngnathiformes",
  "chondrichthyes", "elasmobranchii", "myliobatiformes", "carcharhiniformes", "lamniformes",
  "anthozoa", "scyphozoa", "hydrozoa", "cubozoa", "ascidiacea",
  "cephalopoda", "gastropoda", "bivalvia",
  "malacostraca", "maxillopoda",
  "holothuroidea", "asteroidea", "echinoidea"
];

const AQUATIC_ORDERS = ["cetacea", "sirenia"];
const AQUATIC_FAMILIES = ["cheloniidae", "dermochelyidae", "laticaudidae"];
const TERRESTRIAL_ORDERS = ["stylommatophora"];

function isAquatic(row) {
  if (TERRESTRIAL_ORDERS.includes(key(row.order))) return false;
  return AQUATIC_CLASSES.includes(key(row.className))
      || AQUATIC_ORDERS.includes(key(row.order))
      || AQUATIC_FAMILIES.includes(key(row.family));
}

function matchesWing(row, wingId) {
  if (wingId === "fauna") return key(row.realmId) === "animalia" && key(row.lifeState) === "extant" && !isAquatic(row);
  if (wingId === "flora") return key(row.realmId) === "plantae_fungi" && key(row.lifeState) === "extant";
  if (wingId === "aquarium") return key(row.realmId) === "animalia" && key(row.lifeState) === "extant" && isAquatic(row);
  if (wingId === "fossils") return key(row.lifeState) === "extinct";
  return true;
}

function matchesQuery(row, query) {
  const needle = searchable(query);
  if (!needle) return true;
  const haystack = [
    row.commonNameEn, row.commonNameVi, row.scientificName, row.alternateNames,
    row.phylum, row.className, row.order, row.family,
    row.descriptionEn, row.descriptionVi, row.habitatEn, row.habitatVi,
  ].map(searchable).join(" ");
  return haystack.includes(needle);
}

export function createBiodiversityCatalog({ store, clock = () => new Date() } = {}) {
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") {
    throw new TypeError("Biodiversity catalog requires a store with read and write");
  }

  return Object.freeze({
    metadata({ locale = "en", wingId = "fauna", atlasMode = "living", encounterYear = "all" } = {}) {
      const resolvedLocale = selectedLocale(locale);
      const allRows = store.read() ?? [];
      const modeRows = allRows.filter((row) => matchesAtlasMode(row, atlasMode));
      const activeRows = modeRows.filter((row) => wingId === "all" || matchesWing(row, wingId));
      const encounterYears = [...new Set(activeRows
        .filter((row) => truthy(row.encountered))
        .map((row) => clean(row.encounterDate).slice(0, 4))
        .filter((year) => /^\d{4}$/.test(year)))]
        .sort((left, right) => Number(right) - Number(left));

      const yearFilteredRows = (atlasMode === "hall_of_fame" && encounterYear !== "all")
        ? activeRows.filter((row) => clean(row.encounterDate).startsWith(`${encounterYear}-`))
        : activeRows;

      const baseCategories = WING_CATEGORIES[wingId] || [];
      const categories = baseCategories.map((classId) => ({
        id: classId,
        label: localizedLabel("cozyCategory", classId, resolvedLocale),
        count: yearFilteredRows.filter((row) => getCozyCategory(row, wingId) === classId).length,
      }));

      return {
        locale: resolvedLocale,
        encounterYears,
        categories,
      };
    },

    list({
      wingId = "fauna", classId = "all", atlasMode = "living",
      lifeState = "all", encounterYear = "all", query = "", locale = "en",
    } = {}) {
      const resolvedLocale = selectedLocale(locale);
      const items = (store.read() ?? [])
        .filter((row) => wingId === "all" || matchesWing(row, wingId))
        .filter((row) => classId === "all" || getCozyCategory(row, wingId) === classId)
        .filter((row) => matchesAtlasMode(row, atlasMode))
        .filter((row) => lifeState === "all" || key(row.lifeState) === key(lifeState))
        .filter((row) => atlasMode !== "hall_of_fame" || encounterYear === "all" || clean(row.encounterDate).startsWith(`${encounterYear}-`))
        .filter((row) => matchesQuery(row, query))
        .map((row) => {
          const item = localized(structuredClone(row), resolvedLocale);
          const cozyId = getCozyCategory(row, wingId);
          item.displayClass = localizedLabel("cozyCategory", cozyId, resolvedLocale);
          return item;
        })
        .sort((left, right) => {
          if (atlasMode === "hall_of_fame") {
            const rarity = (Number(right.rarityScore) || 0) - (Number(left.rarityScore) || 0);
            if (rarity) return rarity;
            const date = clean(right.encounterDate).localeCompare(clean(left.encounterDate));
            if (date) return date;
          }
          const pLeft = getPhylumRank(left.phylum);
          const pRight = getPhylumRank(right.phylum);
          if (pLeft !== pRight) return pLeft - pRight;
          
          const className = (left.className || "").localeCompare(right.className || "", "en");
          if (className !== 0) return className;

          const order = (left.order || "").localeCompare(right.order || "", "en");
          if (order !== 0) return order;
          const family = (left.family || "").localeCompare(right.family || "", "en");
          if (family !== 0) return family;
          const genus = (left.genus || "").localeCompare(right.genus || "", "en");
          if (genus !== 0) return genus;
          return (left.scientificName || "").localeCompare(right.scientificName || "", "en");
        });

      return {
        items,
        total: items.length,
        locale: resolvedLocale,
        filters: { wingId, classId, atlasMode, encounterYear, query },
        generatedAt: new Date().toISOString(),
      };
    },

    get(organismId, { locale = "en" } = {}) {
      const row = (store.read() ?? []).find((item) => clean(item.organismId) === clean(organismId));
      return row ? localized(structuredClone(row), selectedLocale(locale)) : null;
    },

    completeEncounter(organismId, { rarityScore } = {}) {
      const score = Number(rarityScore);
      if (!Number.isFinite(score) || score < 0 || score > 10) {
        throw new RangeError("Rarity score must be between 0 and 10");
      }
      const rows = store.read() ?? [];
      const index = rows.findIndex((item) => clean(item.organismId) === clean(organismId));
      if (index < 0) throw new Error("Organism not found");
      if (key(rows[index].lifeState) !== "extant") throw new Error("Only extant organisms can be encountered");
      if (!encounterEnabledForRealm(rows[index].realmId)) throw new Error("Encounters are not supported for this Realm");
      rows[index] = {
        ...rows[index], encountered: true, encounterDate: localDate(clock()), rarityScore: score,
      };
      store.write(rows);
      return structuredClone(rows[index]);
    },

    create(input = {}) {
      const rows = store.read() ?? [];
      const realmId = key(input.realmId) || "animalia";
      const scientificName = clean(input.scientificName);
      const commonNameEn = clean(input.commonNameEn) || scientificName;
      const className = clean(input.className);
      const lifeState = clean(input.lifeState || "extant").toLowerCase();
      if (!scientificName) throw new Error("Scientific name is required");

      const prefix = { animalia: "A", plantae_fungi: "P", sar: "S", microverse: "M" }[realmId] || "A";
      const highest = rows.reduce((max, row) => {
        const match = String(row.organismId || "").match(new RegExp(`^${prefix}(\\d{5})$`));
        return match ? Math.max(max, Number(match[1])) : max;
      }, 0);
      const organismId = `${prefix}${String(highest + 1).padStart(5, "0")}`;

      const score = Number(input.score);
      const hasScore = Number.isFinite(score) && score > 0;

      const record = {
        organismId,
        realmId,
        commonNameEn,
        commonNameVi: clean(input.commonNameVi),
        scientificName,
        phylum: clean(input.phylum),
        className,
        lifeState,
        coverUrl: clean(input.coverUrl),
        encountered: hasScore,
        encounterDate: hasScore ? localDate(clock()) : "",
        rarityScore: hasScore ? score : "",
      };

      store.write([...rows, record]);
      return structuredClone(record);
    },

    update(organismId, input = {}) {
      const rows = store.read() ?? [];
      const index = rows.findIndex((row) => clean(row.organismId) === clean(organismId));
      if (index < 0) throw new Error("Organism not found");
      const current = rows[index];
      rows[index] = {
        ...current,
        ...input,
        organismId: current.organismId,
      };
      store.write(rows);
      return structuredClone(rows[index]);
    },

    remove(organismId) {
      const rows = store.read() ?? [];
      const next = rows.filter((row) => clean(row.organismId) !== clean(organismId));
      if (next.length === rows.length) throw new Error("Organism not found");
      store.write(next);
    },

    undoEncounter(organismId) {
      const rows = store.read() ?? [];
      const index = rows.findIndex((item) => clean(item.organismId) === clean(organismId));
      if (index < 0) throw new Error("Organism not found");
      rows[index] = { ...rows[index], encountered: false, encounterDate: "", rarityScore: "" };
      store.write(rows);
      return structuredClone(rows[index]);
    },
  });
}
