const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizePathname(pathname) {
  const value = String(pathname || "/").split(/[?#]/, 1)[0] || "/";
  if (value === "/") return value;
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

export function parseSiteRoute(pathname) {
  const raw = String(pathname || "/");
  const normalized = normalizePathname(raw);
  const search = raw.includes("?")
    ? new URLSearchParams(raw.slice(raw.indexOf("?") + 1).split("#", 1)[0]).get("search")?.trim() || ""
    : "";
  const hash = raw.includes("#") ? raw.slice(raw.indexOf("#") + 1) : "";
  const anchor = hash === "reading_room" ? "reading_room" : "";
  if (normalized === "/") return anchor ? { mode: "great_hall", anchor } : { mode: "great_hall" };
  if (normalized === "/reading_room" || normalized === "/reading-room") return { mode: "reading_room" };
  if (normalized === "/critterarium" || normalized === "/galleries") {
    return search ? { mode: "critterarium", search } : { mode: "critterarium" };
  }
  if (normalized === "/hall-of-fame") return { mode: "fame" };
  if (normalized === "/curatale" || normalized === "/memory-cabinet") return { mode: "curatale" };
  if (normalized === "/admin" || normalized.startsWith("/admin/")) return { mode: "admin" };

  const match = normalized.match(/^\/(?:reading-room|reading_room)\/([^/]+)$/);
  if (match && articleSlugPattern.test(match[1])) {
    return { mode: "article", slug: match[1] };
  }

  return { mode: "not_found" };
}

export function siteHref(route) {
  if (route?.mode === "great_hall") return route.anchor ? `/#${route.anchor}` : "/";
  if (route?.mode === "critterarium") {
    return route.search ? `/critterarium?${new URLSearchParams({ search: route.search }).toString()}` : "/critterarium";
  }
  if (route?.mode === "fame") return "/hall-of-fame";
  if (route?.mode === "curatale") return "/curatale";
  if (route?.mode === "admin") return "/admin";
  if (route?.mode === "reading_room") return "/reading-room";
  if (route?.mode === "article" && articleSlugPattern.test(route.slug || "")) {
    return `/reading-room/${route.slug}`;
  }
  throw new Error("A valid article slug or known site mode is required");
}
