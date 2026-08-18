const DESTINATIONS = Object.freeze([
  Object.freeze({ id: "living", icon: "galleries", labelKey: "living" }),
  Object.freeze({ id: "hall_of_fame", icon: "fame", labelKey: "hall_of_fame", requiresEncounter: true }),
]);

export function shellNavigation({ encounterEnabled = false } = {}) {
  return DESTINATIONS.filter((item) => !item.requiresEncounter || encounterEnabled);
}
