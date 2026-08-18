const REALM_ID_PREFIXES = Object.freeze({
  animalia: "A",
  plantae_fungi: "P",
  sar: "S",
  microverse: "M",
});

export function isSupportedRealm(realmId) {
  return Boolean(REALM_ID_PREFIXES[realmId]);
}

export function allocateOrganismId(rows = [], realmId) {
  const prefix = REALM_ID_PREFIXES[realmId];
  if (!prefix) throw new Error("A valid Realm is required");
  const highest = rows.reduce((maximum, row) => {
    const match = String(row.organismId || "").match(new RegExp(`^${prefix}(\\d{5})$`));
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);
  return `${prefix}${String(highest + 1).padStart(5, "0")}`;
}
