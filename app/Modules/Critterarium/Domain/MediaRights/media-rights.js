function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export const RIGHTS_FREE_LICENSES = Object.freeze(["CC0", "Public Domain", "Unsplash License"]);

export function normalizeRightsFreeLicense(value) {
  const normalized = clean(value).toLowerCase();
  if (/^cc0(?:\s|$)|creative commons zero/.test(normalized)) return "CC0";
  if (/^public domain(?:\s|$)|^public domain mark(?:\s|$)/.test(normalized)) return "Public Domain";
  if (/^unsplash(?:\s|$)/.test(normalized)) return "Unsplash License";
  return "";
}

export function isRightsFreeLicense(value) {
  return Boolean(normalizeRightsFreeLicense(value));
}

export function imageRightsFailures(row = {}) {
  if (!clean(row.coverUrl) && !clean(row.localCover)) return [];
  const failures = [];
  if (clean(row.localCover)) failures.push("local catalog media is forbidden");
  if (!clean(row.imageSourceUrl)) failures.push("missing exact image source");
  if (!isRightsFreeLicense(row.imageLicense)) failures.push("image license is not CC0, Public Domain, or Unsplash License");
  if (!clean(row.imageLicenseUrl)) failures.push("missing image license URL");
  if (clean(row.imageRightsStatus).toLowerCase() !== "rights-free") failures.push("image rights status is not rights-free");
  if (!/^\d{4}-\d{2}-\d{2}/.test(clean(row.imageRetrievedAt))) failures.push("missing image rights retrieval date");
  return failures;
}

export function hasRightsFreeImage(row = {}) {
  return Boolean(clean(row.coverUrl) && imageRightsFailures(row).length === 0);
}
