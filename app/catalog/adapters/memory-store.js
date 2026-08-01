export function createMemoryStore(seed = []) {
  if (!Array.isArray(seed)) throw new TypeError("Memory store seed must be an array");
  let rows = structuredClone(seed);

  return Object.freeze({
    read() {
      return structuredClone(rows);
    },

    write(nextRows) {
      if (!Array.isArray(nextRows)) throw new TypeError("Catalog rows must be an array");
      rows = structuredClone(nextRows);
      return structuredClone(rows);
    },
  });
}
