import { useEffect } from "react";

function absoluteUrl(value, baseUrl) {
  return new URL(value || window.location.pathname, baseUrl).href;
}

function normalizeJsonLdUrls(value, baseUrl, key = "") {
  if (Array.isArray(value)) return value.map((item) => normalizeJsonLdUrls(item, baseUrl));
  if (!value || typeof value !== "object") {
    return ["url", "@id", "item", "image", "logo", "mainEntityOfPage"].includes(key)
      && typeof value === "string" && value.startsWith("/")
      ? absoluteUrl(value, baseUrl)
      : value;
  }
  return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [
    entryKey,
    normalizeJsonLdUrls(entryValue, baseUrl, entryKey),
  ]));
}

export function useSEO({ title, description, url, jsonLd, locale, robots } = {}) {
  useEffect(() => {
    const defaultTitle = "CozyMuseum - A Private, Aesthetic Museum for Your Memories";
    const defaultDescription = "A quiet, personal museum for the creatures, culture, and memories you want to keep.";
    const canonicalElement = document.querySelector('link[rel="canonical"]');
    const baseUrl = canonicalElement?.getAttribute("href") || window.location.origin;
    const canonicalUrl = absoluteUrl(url, baseUrl);

    document.title = title || defaultTitle;
    document.documentElement.lang = locale === "vi" ? "vi" : "en";

    const setMeta = (name, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const resolvedDescription = description || defaultDescription;
    setMeta("description", resolvedDescription);
    setMeta("og:title", document.title);
    setMeta("og:description", resolvedDescription);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", resolvedDescription);
    setMeta("robots", robots || "index,follow,max-image-preview:large");

    if (canonicalElement) canonicalElement.setAttribute("href", canonicalUrl);

    if (jsonLd) {
      let script = document.getElementById("seo-jsonld");
      if (!script) {
        script = document.createElement("script");
        script.id = "seo-jsonld";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(normalizeJsonLdUrls(jsonLd, baseUrl));
    } else {
      document.getElementById("seo-jsonld")?.remove();
    }
  }, [title, description, url, jsonLd, locale, robots]);
}