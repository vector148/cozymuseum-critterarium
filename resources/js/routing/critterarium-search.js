export function critterariumSearchHref(searchTerm) {
  const term = String(searchTerm || "").trim();
  if (!term) return "/critterarium";
  const params = new URLSearchParams({ search: term });
  return `/critterarium?${params.toString()}`;
}

export function critterariumSearchTerm(search = "") {
  return new URLSearchParams(String(search || "")).get("search")?.trim() || "";
}
