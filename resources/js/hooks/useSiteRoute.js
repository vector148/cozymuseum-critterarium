import { useCallback, useEffect, useState } from "react";

import { adminAuthCallbackType } from "../modules/identity-access/admin-auth-redirect.js";
import { parseSiteRoute, siteHref } from "../routing/site-route.js";

function currentRoute() {
  return parseSiteRoute(`${window.location.pathname}${window.location.hash}`);
}

function canonicalizeLocation(route) {
  if (route.mode === "not_found") return;
  if (adminAuthCallbackType(window.location)) return;
  const canonicalHref = siteHref(route);
  const currentHref = `${window.location.pathname}${window.location.hash}`;
  if (canonicalHref !== currentHref) window.history.replaceState({}, "", canonicalHref);
}

export function useSiteRoute() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    canonicalizeLocation(route);
  }, []);


  useEffect(() => {
    function handlePopState() {
      const nextRoute = currentRoute();
      canonicalizeLocation(nextRoute);
      setRoute(nextRoute);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((nextRoute) => {
    const href = siteHref(nextRoute);
    if (href !== `${window.location.pathname}${window.location.hash}`) window.history.pushState({}, "", href);
    setRoute(parseSiteRoute(href));
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return { route, navigate };
}
