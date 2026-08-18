export const WINGS = [
  { id: "aquarium", icon: "🐠", en: "Aquarium", vi: "Thủy cung" },
  { id: "flora", icon: "🌿", en: "Botany", vi: "Vườn bách thảo" },
  { id: "fossils", icon: "🦴", en: "Fossils", vi: "Khu khảo cổ" },
  { id: "fauna", icon: "🐾", en: "Wildlife", vi: "Động vật hoang dã" },
];

export const CURATALE_WINGS = [
  { id: "games", en: "Games", vi: "Trò chơi" },
  { id: "film", en: "Film", vi: "Phim ảnh" },
  { id: "social", en: "Social", vi: "Mạng xã hội" },
  { id: "music", en: "Music", vi: "Âm nhạc" },
];

const COPY = {
  en: {
    living: "Galleries", retired: "Retired", hall_of_fame: "Hall of Fame",
    search: "Search organisms...", category: "Category",
    allCategories: "All categories", allYears: "All years",
    loading: "Opening the galleries...",
    emptyLiving: "No extant taxa match these filters.",
    emptyRetired: "No retired organisms match these filters yet.",
    emptyHall: "Complete a real-world encounter to begin your Hall of Fame.",
    rarity: "Rarity", encountered: "Encountered", markEncountered: "Mark encountered",
    undoEncounter: "Undo encounter", confirmEncounter: "Complete encounter",
    rarityPrompt: "Rarity score 0–10", invalidRarity: "Enter a rarity score from 0 to 10.",
    habitat: "Habitat", distribution: "Distribution", diet: "Diet / role",
    lifeState: "Life state", conservation: "Conservation", order: "Order", family: "Family", genus: "Genus", species: "Species",
    extantStatus: "Extant", extinctStatus: "Extinct",
    size: "Size", lifespan: "Lifespan", period: "Geological period", source: "Sources",
    kingdom: "Kingdom", phylum: "Phylum", className: "Class",
    video: "Life in the wild · HD/4K preferred", watchYoutube: "Watch on YouTube",
    noVideo: "No reliable natural-history video is available yet.", close: "Close",
    rankTitle: "MEMORY CABINET", rankedCount: "scored encounters",
    personalDisclaimer: "Note: Rarity scores and rankings are based on the museum owner's personal experience and are for showcase purposes only, not scientific fact.",
    saved: "Encounter saved with today's date.", undone: "Encounter removed from the Hall of Fame.",
    requestFailed: "Could not update this organism.",
    museumInvite: "Choose your museum",
    museumCtaTitle: "Get Critterarium",
    museumCtaAction: "Create CozyMuseum",
    mediaMuseumCtaTitle: "Buy Curatale",
    mediaMuseumCtaAction: "Explore CozyMuseum Curatale",
    loadMore: "Load more",
    curatale: "Curatale",
    critterarium: "Critterarium",
    curataleTagline: "The memory cabinet of worlds.",
    curataleComingSoon: "Coming soon to CozyMuseum Curatale",
  },
  vi: {
    living: "Khu trưng bày", retired: "Đã nghỉ hưu", hall_of_fame: "Phòng Lưu danh",
    search: "Tìm sinh vật...", category: "Nhóm",
    allCategories: "Tất cả nhóm", allYears: "Tất cả năm",
    loading: "Đang mở Khu trưng bày...",
    emptyLiving: "Không có đơn vị phân loại hiện sinh nào khớp bộ lọc.",
    emptyRetired: "Chưa có sinh vật đã nghỉ hưu nào khớp bộ lọc.",
    emptyHall: "Hãy hoàn thành một lần gặp ngoài đời để bắt đầu Phòng Lưu danh.",
    rarity: "Độ hiếm", encountered: "Ngày gặp", markEncountered: "Đánh dấu đã gặp",
    undoEncounter: "Hủy hoàn thành", confirmEncounter: "Hoàn thành lần gặp",
    rarityPrompt: "Điểm hiếm 0–10", invalidRarity: "Nhập điểm độ hiếm từ 0 đến 10.",
    habitat: "Sinh cảnh", distribution: "Phân bố", diet: "Thức ăn / vai trò",
    lifeState: "Trạng thái", conservation: "Bảo tồn", order: "Bộ", family: "Họ", genus: "Chi", species: "Loài",
    extantStatus: "Hiện sinh", extinctStatus: "Tuyệt chủng",
    size: "Kích thước", lifespan: "Tuổi thọ", period: "Kỷ địa chất", source: "Nguồn",
    kingdom: "Giới", phylum: "Ngành", className: "Lớp",
    video: "Đời sống tự nhiên · ưu tiên HD/4K", watchYoutube: "Xem trên YouTube",
    noVideo: "Chưa có video đời sống tự nhiên đủ tin cậy.", close: "Đóng",
    rankTitle: "PHÒNG LƯU DANH", rankedCount: "loài đã chấm điểm",
    personalDisclaimer: "Lưu ý: Điểm độ hiếm và bảng xếp hạng hoàn toàn dựa trên trải nghiệm cá nhân của chủ web nhằm mục đích trưng bày, không phản ánh thực tế khoa học.",
    saved: "Đã lưu lần gặp với ngày hôm nay.", undone: "Đã gỡ khỏi Phòng Lưu danh.",
    requestFailed: "Không cập nhật được sinh vật này.",
    museumInvite: "Chọn bảo tàng của bạn",
    museumCtaTitle: "Tải Critterarium",
    museumCtaAction: "Tạo CozyMuseum",
    mediaMuseumCtaTitle: "Mua Curatale",
    mediaMuseumCtaAction: "Khám phá CozyMuseum Curatale",
    loadMore: "Tải thêm",
    curatale: "Curatale",
    critterarium: "Khu trưng bày",
    curataleTagline: "Tủ ký ức của những thế giới.",
    curataleComingSoon: "Sắp ra mắt trên CozyMuseum Curatale",
  }
};

export function t(locale, key) {
  return COPY[locale === "vi" ? "vi" : "en"][key] ?? key;
}

export function availableCritterariumModes(encounterEnabled) {
  return encounterEnabled ? ["living", "hall_of_fame"] : ["living"];
}

export const availableAtlasModes = availableCritterariumModes;

export function wingName(wing, locale) {
  return wing?.[locale === "vi" ? "vi" : "en"] || wing?.en || wing?.id;
}
