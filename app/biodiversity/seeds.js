export function syncSeedOrganisms({ store, seeds = [] } = {}) {
  if (!store || typeof store.read !== "function" || typeof store.write !== "function") throw new TypeError("Seed sync requires a store");
  const rows = store.read() ?? [];
  const summary = { inserted: 0, unchanged: 0 };
  for (const seed of seeds) {
    if (rows.some((row) => row.organismId === seed.organismId)) {
      summary.unchanged += 1;
      continue;
    }
    rows.push(structuredClone(seed));
    summary.inserted += 1;
  }
  if (summary.inserted) store.write(rows);
  return summary;
}
