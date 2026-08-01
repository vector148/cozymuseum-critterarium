import { encounterEnabledForRealm, localizedLabel, realmLabel, REALMS } from "./taxonomy.js";

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
    displayPhylum: localizedLabel("phylum", key(row.phylum) || "other", resolvedLocale),
    displayClass: localizedLabel("className", key(row.className) || "all", resolvedLocale),
    displayDescription: localValue("description"),
    displayHabitat: localValue("habitat"),
    displayDistribution: localValue("distribution"),
    displayDiet: localValue("diet"),
  };
}

function matchesAtlasMode(row, atlasMode) {
  if (atlasMode === "retired") return key(row.lifeState) === "extinct";
  if (atlasMode === "hall_of_fame") return encounterEnabledForRealm(row.realmId) && truthy(row.encountered);
  return key(row.lifeState) === "extant";
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
    metadata({ locale = "en", realmId = "all", atlasMode = "living" } = {}) {
      const resolvedLocale = selectedLocale(locale);
      const allRows = store.read() ?? [];
      const modeRows = allRows.filter((row) => matchesAtlasMode(row, atlasMode));
      const activeRows = modeRows.filter((row) => realmId === "all" || key(row.realmId) === key(realmId));
      const encounterYears = [...new Set(activeRows
        .filter((row) => truthy(row.encountered))
        .map((row) => clean(row.encounterDate).slice(0, 4))
        .filter((year) => /^\d{4}$/.test(year)))]
        .sort((left, right) => Number(right) - Number(left));

      return {
        locale: resolvedLocale,
        encounterYears,
        realms: REALMS.map((realm) => {
          const realmRows = modeRows.filter((row) => key(row.realmId) === realm.id);
          const phylumIds = [...new Set(realmRows.map((row) => key(row.phylum) || "other"))];
          return {
            ...realm,
            label: realmLabel(realm, resolvedLocale),
            count: realmRows.length,
            phyla: phylumIds.map((phylumId) => {
              const phylumRows = realmRows.filter((row) => key(row.phylum) === phylumId);
              const classNames = [...new Map(phylumRows.map((row) => [key(row.className) || "all", clean(row.className)])).entries()];
              return {
                id: phylumId,
                label: localizedLabel("phylum", phylumId, resolvedLocale),
                count: phylumRows.length,
                classes: classNames.map(([classId, canonicalClassName]) => ({
                  id: classId,
                  label: localizedLabel("className", classId, resolvedLocale) || canonicalClassName,
                  count: phylumRows.filter((row) => key(row.className) === classId).length,
                })),
              };
            }),
          };
        }),
      };
    },

    list({
      realmId = "all", phylumId = "all", classId = "all", atlasMode = "living",
      lifeState = "all", encounterYear = "all", query = "", locale = "en",
    } = {}) {
      const resolvedLocale = selectedLocale(locale);
      const items = (store.read() ?? [])
        .filter((row) => realmId === "all" || key(row.realmId) === key(realmId))
        .filter((row) => phylumId === "all" || key(row.phylum) === key(phylumId))
        .filter((row) => classId === "all" || key(row.className) === key(classId))
        .filter((row) => matchesAtlasMode(row, atlasMode))
        .filter((row) => lifeState === "all" || key(row.lifeState) === key(lifeState))
        .filter((row) => atlasMode !== "hall_of_fame" || encounterYear === "all" || clean(row.encounterDate).startsWith(`${encounterYear}-`))
        .filter((row) => matchesQuery(row, query))
        .map((row) => localized(structuredClone(row), resolvedLocale))
        .sort((left, right) => {
          if (atlasMode === "hall_of_fame") {
            const rarity = (Number(right.rarityScore) || 0) - (Number(left.rarityScore) || 0);
            if (rarity) return rarity;
            const date = clean(right.encounterDate).localeCompare(clean(left.encounterDate));
            if (date) return date;
          }
          return left.displayName.localeCompare(right.displayName, resolvedLocale);
        });

      return {
        items,
        total: items.length,
        locale: resolvedLocale,
        filters: { realmId, phylumId, classId, atlasMode, encounterYear, query },
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
