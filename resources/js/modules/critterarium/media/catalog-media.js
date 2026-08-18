export function catalogMediaPath(organismId) {
  return /^([APSM]\d{5})$/.test(String(organismId || ""))
    ? `catalog/${organismId}/card.jpg`
    : "";
}

export function catalogMediaFor(organismId, fallbackSrc) {
  const localSrc = /^([APSM]\d{5})$/.test(String(organismId || ""))
    ? `/images/catalog/${organismId}/card.jpg`
    : "";
  return {
    src: localSrc || fallbackSrc || "",
    fallbackSrc: localSrc && fallbackSrc && localSrc !== fallbackSrc ? fallbackSrc : "",
  };
}
