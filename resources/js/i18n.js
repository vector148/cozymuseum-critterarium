export const WINGS = [
  { id: "aquarium", icon: "AQ", en: "Aquarium", vi: "Thủy cung" },
  { id: "flora", icon: "FL", en: "Botany", vi: "Vườn bách thảo" },
  { id: "fossils", icon: "FS", en: "Fossils", vi: "Khu khảo cổ" },
  { id: "fauna", icon: "WL", en: "Wildlife", vi: "Động vật hoang dã" },
];

const COPY = {
  en: {
    living: "Atlas", hall_of_fame: "Hall of Fame", search: "Search organisms...", allCategories: "All categories", allYears: "All years",
    loading: "Loading the atlas...", emptyLiving: "No extant taxa match these filters.", emptyRetired: "No extinct organisms match these filters yet.",
    emptyHall: "Complete a real-world encounter to begin your Hall of Fame.", rarity: "Rarity", encountered: "Encountered",
    markEncountered: "Mark encountered", undoEncounter: "Undo encounter", confirmEncounter: "Complete encounter", rarityPrompt: "Rarity score 0-10",
    invalidRarity: "Enter a rarity score from 0 to 10.", habitat: "Habitat", distribution: "Distribution", diet: "Diet / role",
    lifeState: "Life state", conservation: "Conservation", phylum: "Phylum", className: "Class", order: "Order", family: "Family",
    extantStatus: "Extant", extinctStatus: "Extinct", size: "Size", lifespan: "Lifespan", period: "Geological period", source: "Sources",
    video: "Life in the wild - HD/4K preferred", watchYoutube: "Watch on YouTube", noVideo: "No reliable natural-history video is available yet.",
    close: "Close", rankTitle: "HALL OF FAME", rankedCount: "scored encounters", saved: "Encounter saved with today's date.",
    undone: "Encounter removed from Hall of Fame.", requestFailed: "Could not update this organism.", loadMore: "Load more",
  },
  vi: {
    living: "Bách khoa", hall_of_fame: "Hall of Fame", search: "Tìm sinh vật...", allCategories: "Tất cả nhóm", allYears: "Tất cả năm",
    loading: "Đang mở bách khoa...", emptyLiving: "Không có đơn vị phân loại hiện sinh nào khớp bộ lọc.", emptyRetired: "Chưa có sinh vật tuyệt chủng nào khớp bộ lọc.",
    emptyHall: "Hãy hoàn thành một lần gặp ngoài đời để mở Bảng phong thần.", rarity: "Độ hiếm", encountered: "Ngày gặp",
    markEncountered: "Đánh dấu đã gặp", undoEncounter: "Hủy hoàn thành", confirmEncounter: "Hoàn thành lần gặp", rarityPrompt: "Điểm hiếm 0-10",
    invalidRarity: "Nhập điểm độ hiếm từ 0 đến 10.", habitat: "Sinh cảnh", distribution: "Phân bố", diet: "Thức ăn / vai trò",
    lifeState: "Trạng thái", conservation: "Bảo tồn", phylum: "Ngành", className: "Lớp", order: "Bộ", family: "Họ",
    extantStatus: "Hiện sinh", extinctStatus: "Tuyệt chủng", size: "Kích thước", lifespan: "Tuổi thọ", period: "Kỷ địa chất", source: "Nguồn",
    video: "Đời sống tự nhiên - ưu tiên HD/4K", watchYoutube: "Xem trên YouTube", noVideo: "Chưa có video đời sống tự nhiên đủ tin cậy.",
    close: "Đóng", rankTitle: "BẢNG PHONG THẦN", rankedCount: "loài đã chấm điểm", saved: "Đã lưu lần gặp với ngày hôm nay.",
    undone: "Đã gỡ khỏi Bảng phong thần.", requestFailed: "Không cập nhật được sinh vật này.", loadMore: "Hiển thị thêm",
  },
};

export function t(locale, key) {
  return COPY[locale === "vi" ? "vi" : "en"][key] ?? key;
}

export function availableAtlasModes(encounterEnabled) {
  return encounterEnabled ? ["living", "hall_of_fame"] : ["living"];
}

export function wingName(wing, locale) {
  return wing?.[locale === "vi" ? "vi" : "en"] || wing?.en || wing?.id;
}
