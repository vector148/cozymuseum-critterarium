export const WINGS = [
  { id: "aquarium", icon: "🐠", en: "Aquarium", vi: "Thủy cung" },
  { id: "flora", icon: "🌿", en: "Botany", vi: "Thực vật" },
  { id: "fossils", icon: "🦴", en: "Fossils", vi: "Hóa thạch" },
  { id: "fauna", icon: "🐾", en: "Wildlife", vi: "Hoang dã" },
];

export const CURATALE_WINGS = [
  { id: "games", en: "Games" },
  { id: "film", en: "Film" },
  { id: "social", en: "Social" },
  { id: "music", en: "Music" },
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
    edit: "Edit", editOrganism: "Edit organism", addOrganism: "Add organism",
    createEyebrow: "NEW SPECIMEN", editEyebrow: "EDIT SPECIMEN",
    createHint: "This record stays on your computer.", editHint: "Review the record, then save your changes.",
    cover: "Cover", coverHint: "URL or local path", processingCover: "Compressing image...", browseImage: "Browse image",
    realm: "Realm", scientificName: "Scientific name", commonName: "English name", commonNameVi: "Vietnamese name",
    score: "Hall of Fame score", livePreview: "Live preview", cardPreview: "Card preview",
    unknownSpecies: "Unknown species", noCommonName: "No common name", cancel: "Cancel", saving: "Saving...",
    processingImage: "Processing image...", addToMuseum: "Add to museum", saveChanges: "Save changes",
    descriptionEn: "English description", descriptionVi: "Vietnamese description", rank: "Taxon rank",
    iucnStatus: "IUCN status", geologicalPeriod: "Geological period", extinctionYear: "Extinction year",
    habitatEn: "English habitat", habitatVi: "Vietnamese habitat", distributionEn: "English distribution",
    distributionVi: "Vietnamese distribution", dietEn: "English diet / role", dietVi: "Vietnamese diet / role",
    imageSourceUrl: "Image source", imageLicense: "Image license", imageLicenseUrl: "License URL",
    imageRightsStatus: "Rights status", youtubeUrl: "YouTube URL", videoTitle: "Video title",
    sourceUrls: "Record sources", authoritativeTaxonId: "Taxon ID", dangerous: "Potentially dangerous",
    editSaved: "Organism updated.", createSaved: "Organism added.", delete: "Delete",
    confirmDelete: "Delete this organism permanently?", deleteSaved: "Organism deleted.",
  },
  vi: {
    living: "Trưng bày", retired: "Đã lưu", hall_of_fame: "Lưu danh",
    search: "Tìm sinh vật...", category: "Nhóm", allCategories: "Tất cả", allYears: "Mọi năm",
    loading: "Đang mở...", emptyLiving: "Không có sinh vật phù hợp.", emptyRetired: "Chưa có sinh vật đã lưu.",
    emptyHall: "Hãy ghi nhận một lần gặp để bắt đầu.", rarity: "Độ hiếm", encountered: "Ngày gặp",
    markEncountered: "Đã gặp", undoEncounter: "Hoàn tác", confirmEncounter: "Xác nhận",
    rarityPrompt: "Điểm 0-10", invalidRarity: "Nhập điểm từ 0 đến 10.", habitat: "Sinh cảnh",
    distribution: "Phân bố", diet: "Thức ăn / vai trò", lifeState: "Trạng thái", conservation: "Bảo tồn",
    order: "Bộ", family: "Họ", genus: "Chi", species: "Loài", extantStatus: "Hiện sinh",
    extinctStatus: "Tuyệt chủng", size: "Kích thước", lifespan: "Tuổi thọ", period: "Kỷ địa chất",
    source: "Nguồn", kingdom: "Giới", phylum: "Ngành", className: "Lớp", video: "Video tự nhiên",
    watchYoutube: "Xem YouTube", noVideo: "Chưa có video phù hợp.", close: "Đóng", rankTitle: "TỦ KÝ ỨC",
    rankedCount: "lần gặp", personalDisclaimer: "Điểm và thứ hạng dựa trên trải nghiệm cá nhân, không phải dữ kiện khoa học.",
    saved: "Đã lưu lần gặp.", undone: "Đã hoàn tác.", requestFailed: "Không thể cập nhật sinh vật.",
    museumInvite: "Chọn bảo tàng", museumCtaTitle: "Tải Critterarium", museumCtaAction: "Tạo CozyMuseum",
    mediaMuseumCtaTitle: "Mua Curatale", mediaMuseumCtaAction: "Khám phá Curatale", loadMore: "Xem thêm",
    curatale: "Curatale", critterarium: "Critterarium", curataleTagline: "Tủ ký ức thế giới.",
    curataleComingSoon: "Sắp có trên Curatale", edit: "Sửa", editOrganism: "Sửa sinh vật", addOrganism: "Thêm sinh vật",
    createEyebrow: "MẪU MỚI", editEyebrow: "SỬA MẪU", createHint: "Bản ghi được lưu trên máy của bạn.",
    editHint: "Kiểm tra rồi lưu thay đổi.", cover: "Ảnh bìa", coverHint: "URL hoặc đường dẫn", processingCover: "Đang nén ảnh...",
    browseImage: "Chọn ảnh", realm: "Giới", scientificName: "Tên khoa học", commonName: "Tên tiếng Anh",
    commonNameVi: "Tên tiếng Việt", score: "Điểm lưu danh", livePreview: "Xem trước", cardPreview: "Xem trước thẻ",
    unknownSpecies: "Chưa có tên", noCommonName: "Chưa có tên thường", cancel: "Hủy", saving: "Đang lưu...",
    processingImage: "Đang xử lý ảnh...", addToMuseum: "Thêm vào bảo tàng", saveChanges: "Lưu thay đổi",
    descriptionEn: "Mô tả tiếng Anh", descriptionVi: "Mô tả tiếng Việt", rank: "Bậc phân loại",
    iucnStatus: "Mức IUCN", geologicalPeriod: "Kỷ địa chất", extinctionYear: "Năm tuyệt chủng",
    habitatEn: "Sinh cảnh tiếng Anh", habitatVi: "Sinh cảnh tiếng Việt", distributionEn: "Phân bố tiếng Anh",
    distributionVi: "Phân bố tiếng Việt", dietEn: "Thức ăn tiếng Anh", dietVi: "Thức ăn tiếng Việt",
    imageSourceUrl: "Nguồn ảnh", imageLicense: "Giấy phép ảnh", imageLicenseUrl: "URL giấy phép",
    imageRightsStatus: "Quyền ảnh", youtubeUrl: "URL YouTube", videoTitle: "Tên video", sourceUrls: "Nguồn dữ liệu",
    authoritativeTaxonId: "Mã phân loại", dangerous: "Có thể nguy hiểm", editSaved: "Đã cập nhật sinh vật.",
    createSaved: "Đã thêm sinh vật.", delete: "Xóa", confirmDelete: "Xóa vĩnh viễn sinh vật này?",
    deleteSaved: "Đã xóa sinh vật.",
  },
};

export function t(locale, key) {
  return COPY[locale === "vi" ? "vi" : "en"][key] ?? COPY.en[key] ?? key;
}

export function availableCritterariumModes(encounterEnabled) {
  return encounterEnabled ? ["living", "hall_of_fame"] : ["living"];
}

export const availableAtlasModes = availableCritterariumModes;

export function wingName(wing, locale) {
  return wing?.[locale === "vi" ? "vi" : "en"] || wing?.en || wing?.id;
}
