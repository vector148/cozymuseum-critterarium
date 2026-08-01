export const REALMS = Object.freeze([
  { id: "animalia", labelEn: "Animalia", labelVi: "Động vật", icon: "◇", color: "blue", encounterEnabled: true },
  { id: "plantae_fungi", labelEn: "Plantae & Fungi", labelVi: "Thực vật & Nấm", icon: "△", color: "green", encounterEnabled: true },
  { id: "sar", labelEn: "SAR", labelVi: "SAR", icon: "◈", color: "yellow", encounterEnabled: false },
  { id: "microverse", labelEn: "Microverse", labelVi: "Siêu vi", icon: "✣", color: "red", encounterEnabled: false },
]);

export const PROHIBITED_CLASS_KEYS = Object.freeze(new Set([
  "all", "unknown", "unresolved", "unresolved_class",
  "fish", "fishes", "pisces", "ca",
  "crustacea", "crustaceans", "giap_xac",
  "chua_xac_dinh_lop",
]));

const LABELS = Object.freeze({
  phylum: {
    chordata: ["Chordata", "Dây sống"], arthropoda: ["Arthropoda", "Chân khớp"],
    mollusca: ["Mollusca", "Thân mềm"], cnidaria: ["Cnidaria", "Ruột khoang"],
    angiosperms: ["Flowering plants", "Thực vật hạt kín"],
    gymnosperms: ["Gymnosperms", "Thực vật hạt trần"], ferns: ["Ferns", "Dương xỉ"],
    fungi: ["Fungi", "Nấm"], stramenopiles: ["Stramenopiles", "Stramenopiles"],
    alveolata: ["Alveolata", "Alveolata"], rhizaria: ["Rhizaria", "Rhizaria"],
    rna_virus: ["RNA viruses", "Virus RNA"], dna_virus: ["DNA viruses", "Virus DNA"],
    bacteria: ["Bacteria", "Vi khuẩn"], archaea: ["Archaea", "Cổ khuẩn"],
    other: ["Other groups", "Nhóm khác"],
  },
  className: {
    mammalia: ["Mammals", "Thú"], aves: ["Birds", "Chim"], reptilia: ["Reptiles", "Bò sát"],
    amphibia: ["Amphibians", "Lưỡng cư"],
    actinopterygii: ["Ray-finned fishes", "Cá vây tia"],
    chondrichthyes: ["Cartilaginous fishes", "Cá sụn"],
    insecta: ["Insects", "Côn trùng"], arachnida: ["Arachnids", "Hình nhện"],
    malacostraca: ["Malacostracans", "Giáp xác bậc cao"], myriapoda: ["Myriapods", "Nhiều chân"],
    cephalopoda: ["Cephalopods", "Động vật chân đầu"], scyphozoa: ["True jellyfish", "Sứa thật"],
    hydrozoa: ["Hydrozoans", "Thủy tức"], dinocaridida: ["Dinocaridids", "Dinocaridida"],
    trilobita: ["Trilobites", "Bọ ba thùy"], magnoliopsida: ["Flowering dicots", "Thực vật hai lá mầm"],
    pinopsida: ["Conifers", "Thông"], ginkgoopsida: ["Ginkgoes", "Bạch quả"],
    polypodiopsida: ["Ferns", "Dương xỉ"], agaricomycetes: ["Mushroom-forming fungi", "Nấm đảm"],
    lycopodiopsida: ["Lycophytes", "Thạch tùng"], glossopteridopsida: ["Glossopterids", "Dương xỉ hạt Glossopteris"],
    phaeophyceae: ["Brown algae", "Tảo nâu"], bacillariophyceae: ["Diatoms", "Tảo cát"],
    oligohymenophorea: ["Oligohymenophoreans", "Trùng lông Oligohymenophorea"],
    aconoidasida: ["Aconoidasidans", "Aconoidasida"], pisoniviricetes: ["Pisoniviricetes", "Pisoniviricetes"],
    insthoviricetes: ["Insthoviricetes", "Insthoviricetes"], caudoviricetes: ["Tailed bacteriophages", "Thể thực khuẩn có đuôi"],
    papovaviricetes: ["Papovaviricetes", "Papovaviricetes"], gammaproteobacteria: ["Gammaproteobacteria", "Gammaproteobacteria"],
    bacilli: ["Bacilli", "Bacilli"], saccharomycetes: ["Saccharomycetes", "Nấm men Saccharomycetes"],
    eurotiomycetes: ["Eurotiomycetes", "Eurotiomycetes"], halobacteria: ["Halobacteria", "Halobacteria"],
    thermococci: ["Thermococci", "Thermococci"],
    all: ["Unresolved class", "Chưa xác định lớp"],
  },
});

function humanize(value) {
  return String(value || "unknown").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function localizedLabel(kind, id, locale = "en") {
  const pair = LABELS[kind]?.[id];
  return pair ? (locale === "vi" ? pair[1] : pair[0]) : humanize(id);
}

export function taxonomyKey(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function isCanonicalScientificClass(value) {
  const className = String(value ?? "").trim();
  if (!className) return true;
  return !PROHIBITED_CLASS_KEYS.has(taxonomyKey(className)) && /^[A-Z][A-Za-z-]+$/.test(className);
}

export function encounterEnabledForRealm(realmId) {
  return REALMS.find((realm) => realm.id === taxonomyKey(realmId))?.encounterEnabled === true;
}

export function realmLabel(realm, locale = "en") {
  return locale === "vi" ? realm.labelVi : realm.labelEn;
}
