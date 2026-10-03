// A short vocabulary for form assistance, not a species database or taxonomic authority.
const GROUPS = Object.freeze({
  mammal: { realmId: "animalia", phylum: "Chordata", className: "Mammalia" },
  bird: { realmId: "animalia", phylum: "Chordata", className: "Aves" },
  reptile: { realmId: "animalia", phylum: "Chordata", className: "Reptilia" },
  amphibian: { realmId: "animalia", phylum: "Chordata", className: "Amphibia" },
  rayFish: { realmId: "animalia", phylum: "Chordata", className: "Actinopterygii" },
  lobeFish: { realmId: "animalia", phylum: "Chordata", className: "Sarcopterygii" },
  cartilageFish: { realmId: "animalia", phylum: "Chordata", className: "Chondrichthyes" },
  insect: { realmId: "animalia", phylum: "Arthropoda", className: "Insecta" },
  spider: { realmId: "animalia", phylum: "Arthropoda", className: "Arachnida" },
});

const TERMS = Object.freeze({
  "cow": ["mammal"], "cattle": ["mammal"],
  "lion": ["mammal"],
  "bird": ["bird"],
  "reptile": ["reptile"],
  "frog": ["amphibian"],
  "ray-finned fish": ["rayFish"],
  "lobe-finned fish": ["lobeFish"],
  "shark": ["cartilageFish"],
  "fish": ["rayFish", "lobeFish", "cartilageFish"],
  "butterfly": ["insect"],
  "spider": ["spider"],
});

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function suggestTaxonomy(commonNameEn) {
  const name = normalize(commonNameEn);
  if (!name) return [];
  const term = Object.keys(TERMS).filter((candidate) => name === candidate || name.startsWith(`${candidate} `))
    .sort((a, b) => b.length - a.length)[0];
  if (term) return TERMS[term].map((group) => ({ ...GROUPS[group] }));
  return [];
}
