import { browserApi } from "./browser-api.js";

const BASE = "/api/atlas";

async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || `Request failed: ${response.status}`);
  return body;
}

function queryString(values) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  }
  return `?${params.toString()}`;
}

const httpApi = {
  getMetadata: (filters) => request(`/meta${queryString(filters)}`),
  getOrganisms: (filters) => request(`/organisms${queryString(filters)}`),
  getOrganism: (organismId, locale) => request(`/organisms/${encodeURIComponent(organismId)}?locale=${locale}`),
  completeEncounter: (organismId, rarityScore) => request(
    `/organisms/${encodeURIComponent(organismId)}/encounter`,
    { method: "POST", body: JSON.stringify({ rarityScore }) },
  ),
  undoEncounter: (organismId) => request(
    `/organisms/${encodeURIComponent(organismId)}/encounter`,
    { method: "DELETE" },
  ),
};

const env = import.meta.env || {};
export const api = env.PROD || env.VITE_DATA_MODE === "browser" ? browserApi : httpApi;
