export const REALMS = [
  { id: "animalia", icon: "◇", en: "Animalia", vi: "Động vật" },
  { id: "plantae_fungi", icon: "△", en: "Plants & Fungi", vi: "Thực vật & Nấm" },
  { id: "sar", icon: "◈", en: "SAR", vi: "SAR" },
  { id: "microverse", icon: "✣", en: "Microverse", vi: "Siêu vi" },
];

const COPY = {
  en: {
    living: "Extant", retired: "Retired", hall_of_fame: "Hall of Fame",
    search: "Search organisms...", phylum: "Phylum", className: "Class",
    allPhyla: "All phyla", allClasses: "All classes",
    selectPhylumFirst: "Choose a phylum to reveal its classes", allYears: "All years",
    loading: "Loading the atlas...",
    emptyLiving: "No extant taxa match these filters.",
    emptyRetired: "No retired organisms match these filters yet.",
    emptyHall: "Complete a real-world encounter to begin your Hall of Fame.",
    rarity: "Rarity", encountered: "Encountered", markEncountered: "Mark encountered",
    undoEncounter: "Undo encounter", confirmEncounter: "Complete encounter",
    rarityPrompt: "Rarity score 0–10", invalidRarity: "Enter a rarity score from 0 to 10.",
    habitat: "Habitat", distribution: "Distribution", diet: "Diet / role",
    lifeState: "Life state", conservation: "Conservation", order: "Order", family: "Family",
    extantStatus: "Extant", extinctStatus: "Extinct",
    size: "Size", lifespan: "Lifespan", period: "Geological period", source: "Sources",
    video: "Life in the wild · HD/4K preferred", watchYoutube: "Watch on YouTube",
    noVideo: "No reliable natural-history video is available yet.", close: "Close",
    rankTitle: "HALL OF FAME", rankedCount: "scored encounters",
    saved: "Encounter saved with today's date.", undone: "Encounter removed from Hall of Fame.",
    requestFailed: "Could not update this organism.",
    museumInvite: "Choose the museum you want to build",
    museumCtaTitle: "Your own museum",
    museumCtaAction: "Create CozyMuseum",
    mediaMuseumCtaTitle: "Movie & game museum",
    mediaMuseumCtaAction: "Explore FourRealm OS v2",
    loadMore: "Load more",
  },
  vi: {
    living: "Hiện sinh", retired: "Đã nghỉ hưu", hall_of_fame: "Hall of Fame",
    search: "Tìm sinh vật...", phylum: "Ngành", className: "Lớp",
    allPhyla: "Tất cả ngành", allClasses: "Tất cả lớp",
    selectPhylumFirst: "Chọn một ngành để hiện các lớp trực thuộc", allYears: "Tất cả năm",
    loading: "Đang mở bách khoa...",
    emptyLiving: "Không có đơn vị phân loại hiện sinh nào khớp bộ lọc.",
    emptyRetired: "Chưa có sinh vật đã nghỉ hưu nào khớp bộ lọc.",
    emptyHall: "Hãy hoàn thành một lần gặp ngoài đời để mở Bảng phong thần.",
    rarity: "Độ hiếm", encountered: "Ngày gặp", markEncountered: "Đánh dấu đã gặp",
    undoEncounter: "Hủy hoàn thành", confirmEncounter: "Hoàn thành lần gặp",
    rarityPrompt: "Điểm hiếm 0–10", invalidRarity: "Nhập điểm độ hiếm từ 0 đến 10.",
    habitat: "Sinh cảnh", distribution: "Phân bố", diet: "Thức ăn / vai trò",
    lifeState: "Trạng thái", conservation: "Bảo tồn", order: "Bộ", family: "Họ",
    extantStatus: "Hiện sinh", extinctStatus: "Tuyệt chủng",
    size: "Kích thước", lifespan: "Tuổi thọ", period: "Kỷ địa chất", source: "Nguồn",
    video: "Đời sống tự nhiên · ưu tiên HD/4K", watchYoutube: "Xem trên YouTube",
    noVideo: "Chưa có video đời sống tự nhiên đủ tin cậy.", close: "Đóng",
    rankTitle: "BẢNG PHONG THẦN", rankedCount: "loài đã chấm điểm",
    saved: "Đã lưu lần gặp với ngày hôm nay.", undone: "Đã gỡ khỏi Bảng phong thần.",
    requestFailed: "Không cập nhật được sinh vật này.",
    museumInvite: "Chọn bảo tàng bạn muốn xây dựng",
    museumCtaTitle: "Bảo tàng của riêng bạn",
    museumCtaAction: "Tạo CozyMuseum",
    mediaMuseumCtaTitle: "Bảo tàng phim & game",
    mediaMuseumCtaAction: "Khám phá FourRealm OS v2",
    loadMore: "Hiển thị thêm",
  },
};

export function t(locale, key) {
  return COPY[locale === "vi" ? "vi" : "en"][key] ?? key;
}

export function availableAtlasModes(encounterEnabled) {
  return encounterEnabled ? ["living", "retired", "hall_of_fame"] : ["living", "retired"];
}

export function realmName(realm, locale) {
  return realm?.[locale === "vi" ? "vi" : "en"] || realm?.en || realm?.id;
}
