const environment = import.meta.env || {};
const supabaseUrl = environment.VITE_SUPABASE_URL?.trim();
const supabaseKey = (
  environment.VITE_SUPABASE_PUBLISHABLE_KEY
  || environment.VITE_SUPABASE_ANON_KEY
)?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const READING_ROOM_MEDIA_BUCKET = "reading_room_media";

export function normalizeStoragePath(value) {
  const path = String(value || "").trim();
  if (!path || path.split("/").includes("..")) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return "";
  return path;
}

export function buildPublicStorageUrl(baseUrl, storagePath, bucket = READING_ROOM_MEDIA_BUCKET) {
  const path = normalizeStoragePath(storagePath);
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!baseUrl) return "";
  const [objectPath, query = ""] = path.split("?", 2);
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const querySuffix = query ? `?${query}` : "";
  return `${String(baseUrl).replace(/\/$/, "")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}${querySuffix}`;
}

export function publicStorageUrl(storagePath, overrideBucket = null) {
  let bucket = overrideBucket || READING_ROOM_MEDIA_BUCKET;
  let path = storagePath;
  if (!overrideBucket && storagePath?.startsWith("curatale/")) {
    bucket = "curatale";
    path = storagePath.replace(/^curatale\//, "");
  }
  return buildPublicStorageUrl(supabaseUrl, path, bucket);
}

export class SupabaseDataApi {
  constructor({ url, key, fetchImpl = globalThis.fetch }) {
    this.url = String(url || "").replace(/\/$/, "");
    this.key = key;
    this.fetchImpl = fetchImpl.bind(globalThis);
  }

  async select(table, query) {
    const url = new URL(`${this.url}/rest/v1/${table}`);
    for (const [name, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      const parameterValue = name === "select" && typeof value === "string"
        ? value.replace(/\s+/g, "")
        : value;
      url.searchParams.set(name, parameterValue);
    }

    const response = await this.fetchImpl(url, {
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase Data API ${response.status}: ${detail.slice(0, 240)}`);
    }
    return response.json();
  }
}

export const supabase = supabaseConfigured
  ? new SupabaseDataApi({ url: supabaseUrl, key: supabaseKey })
  : null;
