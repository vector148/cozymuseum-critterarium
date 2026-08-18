export const REALMS = Object.freeze([
  { id: "animalia", labelEn: "Animalia", labelVi: "Động vật", icon: "◇", color: "blue", encounterEnabled: true },
  { id: "plantae_fungi", labelEn: "Plantae & Fungi", labelVi: "Thực vật & Nấm", icon: "△", color: "green", encounterEnabled: true },
  { id: "sar", labelEn: "SAR", labelVi: "SAR", icon: "◈", color: "yellow", encounterEnabled: false },
  { id: "microverse", labelEn: "Microverse", labelVi: "Siêu vi", icon: "✣", color: "red", encounterEnabled: false },
]);

export const COZY_CATEGORY_ORDER = Object.freeze([
  "mammals", "birds", "reptiles", "amphibians", "insects", "arachnids", "other_animals",
  "fishes", "sharks_rays", "corals_jellyfish", "mollusks", "crustaceans", "echinoderms", "marine_life",
  "flowering_plants", "conifers", "ferns_mosses", "fungi", "other_plants"
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
    actinopterygii: ["Fishes", "Cá"],
    chondrichthyes: ["Cartilaginous fishes", "Cá sụn"],
    insecta: ["Insects", "Côn trùng"], arachnida: ["Arachnids", "Hình nhện"],
    malacostraca: ["Crabs & Shrimp", "Cua & Tôm"], myriapoda: ["Centipedes", "Rết & Cuốn chiếu"],
    cephalopoda: ["Squids & Octopuses", "Mực & Bạch tuộc"], scyphozoa: ["Jellyfishes", "Sứa"],
    hydrozoa: ["Hydrozoans", "Thủy tức"], dinocaridida: ["Dinocaridids", "Sinh vật kỳ dị"],
    trilobita: ["Trilobites", "Bọ ba thùy"], magnoliopsida: ["Trees & Flowers", "Cây thân gỗ & Hoa"],
    pinopsida: ["Conifers", "Thông & Tùng"], ginkgoopsida: ["Ginkgoes", "Bạch quả"],
    polypodiopsida: ["Ferns", "Dương xỉ"], agaricomycetes: ["Mushrooms", "Nấm"],
    lycopodiopsida: ["Mosses", "Rêu & Thạch tùng"], glossopteridopsida: ["Ancient Ferns", "Dương xỉ cổ đại"],
    phaeophyceae: ["Kelp & Seaweed", "Tảo biển"], bacillariophyceae: ["Diatoms", "Tảo cát"],
    oligohymenophorea: ["Oligohymenophoreans", "Trùng lông Oligohymenophorea"],
    aconoidasida: ["Aconoidasidans", "Aconoidasida"], pisoniviricetes: ["Pisoniviricetes", "Pisoniviricetes"],
    insthoviricetes: ["Insthoviricetes", "Insthoviricetes"], caudoviricetes: ["Tailed bacteriophages", "Thể thực khuẩn có đuôi"],
    papovaviricetes: ["Papovaviricetes", "Papovaviricetes"], gammaproteobacteria: ["Gammaproteobacteria", "Gammaproteobacteria"],
    bacilli: ["Bacilli", "Bacilli"], saccharomycetes: ["Saccharomycetes", "Nấm men Saccharomycetes"],
    eurotiomycetes: ["Eurotiomycetes", "Eurotiomycetes"], halobacteria: ["Halobacteria", "Halobacteria"],
    thermococci: ["Thermococci", "Thermococci"],
    all: ["All Categories", "Tất cả các nhóm"],
  },
  cozyCategory: {
    fishes: ["Fishes", "Cá"],
    sharks_rays: ["Sharks", "Cá mập"],
    corals_jellyfish: ["Corals & Jellyfish", "San hô & Sứa"],
    mollusks: ["Mollusks", "Thân mềm"],
    crustaceans: ["Crustaceans", "Giáp xác"],
    echinoderms: ["Echinoderms", "Da gai"],
    marine_life: ["Other Marine Life", "Sinh vật biển khác"],
    
    mammals: ["Mammals", "Thú"],
    birds: ["Birds", "Chim"],
    reptiles: ["Reptiles", "Bò sát"],
    amphibians: ["Amphibians", "Lưỡng cư"],
    insects: ["Insects", "Côn trùng"],
    arachnids: ["Arachnids", "Hình nhện"],
    other_animals: ["Other Animals", "Động vật khác"],
    
    flowering_plants: ["Flowering Plants", "Thực vật có hoa"],
    conifers: ["Conifers", "Cây lá kim"],
    ferns_mosses: ["Ferns & Mosses", "Dương xỉ & Rêu"],
    fungi: ["Fungi", "Nấm"],
    other_plants: ["Other Plants", "Thực vật khác"],

    all: ["All Categories", "Tất cả các nhóm"],
  }
});

export function getCozyCategory(className, wingId) {
  const k = taxonomyKey(className);
  
  if (wingId === "aquarium") {
    if (["actinopterygii", "teleostei", "carangiformes", "perciformes", "siluriformes", "cypriniformes", "syngnathiformes"].includes(k)) return "fishes";
    if (["chondrichthyes", "elasmobranchii", "myliobatiformes", "carcharhiniformes", "lamniformes"].includes(k)) return "sharks_rays";
    if (["anthozoa", "scyphozoa", "hydrozoa", "cubozoa", "ascidiacea"].includes(k)) return "corals_jellyfish";
    if (["cephalopoda", "gastropoda", "bivalvia"].includes(k)) return "mollusks";
    if (["malacostraca", "maxillopoda"].includes(k)) return "crustaceans";
    if (["holothuroidea", "asteroidea", "echinoidea"].includes(k)) return "echinoderms";
    return "marine_life";
  }
  
  if (wingId === "fauna" || wingId === "fossils") { 
    if (["mammalia"].includes(k)) return "mammals";
    if (["aves"].includes(k)) return "birds";
    if (["reptilia", "testudines", "squamata", "crocodilia"].includes(k)) return "reptiles";
    if (["amphibia", "anura", "caudata"].includes(k)) return "amphibians";
    if (["insecta", "lepidoptera", "hymenoptera", "coleoptera", "diptera"].includes(k)) return "insects";
    if (["arachnida"].includes(k)) return "arachnids";
    if (["dinocaridida", "trilobita"].includes(k)) return "other_animals";
    if (wingId === "fauna") return "other_animals";
  }

  if (["magnoliopsida", "liliopsida"].includes(k)) return "flowering_plants";
  if (["pinopsida", "ginkgoopsida", "cycadopsida"].includes(k)) return "conifers";
  if (["polypodiopsida", "lycopodiopsida", "glossopteridopsida"].includes(k)) return "ferns_mosses";
  if (["agaricomycetes", "saccharomycetes", "eurotiomycetes"].includes(k)) return "fungi";
  if (wingId === "flora") return "other_plants";
  
  return "other_animals";
}

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
