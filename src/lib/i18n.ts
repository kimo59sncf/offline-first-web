import { useStore, type Lang } from "./store";

const dict = {
  fr: {
    home: "Accueil", surahs: "Sourates", search: "Recherche", favorites: "Favoris", settings: "Réglages",
    morning: "Bonjour", evening: "Bonsoir", tagline: "Lisez et écoutez le Coran, librement.",
    continueReading: "Reprendre la lecture", continueListening: "Reprendre l'écoute", start: "Commencer par Al-Fatiha",
    ayah: "Verset", ayahs: "versets", meccan: "Mecquoise", medinan: "Médinoise",
    reciters: "Récitateurs", reciter: "Récitateur", play: "Lire", pause: "Pause", next: "Suivant", prev: "Précédent",
    favorite: "Favori", bookmark: "Marque-page", copy: "Copier", share: "Partager", copied: "Copié",
    searchPh: "Rechercher dans la traduction…", searchSurahPh: "Filtrer les sourates…", noResults: "Aucun résultat",
    recent: "Recherches récentes", emptyFav: "Touchez le cœur d'un verset pour l'enregistrer ici.",
    language: "Langue", translation: "Afficher la traduction", fontSize: "Taille du texte arabe",
    speed: "Vitesse", repeat: "Répétition", repeatOff: "Non", repeatAyah: "Verset", repeatSurah: "Sourate",
    sources: "Sources", loading: "Chargement…", error: "Impossible de charger. Vérifiez votre connexion.", retry: "Réessayer",
    stats: "Vos statistiques", sessions: "sessions", opened: "sourates ouvertes", playSurah: "Écouter la sourate",
    clearData: "Effacer mes données locales", privacy: "Vos données restent sur cet appareil.",
  },
  en: {
    home: "Home", surahs: "Surahs", search: "Search", favorites: "Favorites", settings: "Settings",
    morning: "Good morning", evening: "Good evening", tagline: "Read and listen to the Quran, freely.",
    continueReading: "Continue reading", continueListening: "Continue listening", start: "Start with Al-Fatiha",
    ayah: "Ayah", ayahs: "ayahs", meccan: "Meccan", medinan: "Medinan",
    reciters: "Reciters", reciter: "Reciter", play: "Play", pause: "Pause", next: "Next", prev: "Previous",
    favorite: "Favorite", bookmark: "Bookmark", copy: "Copy", share: "Share", copied: "Copied",
    searchPh: "Search the translation…", searchSurahPh: "Filter surahs…", noResults: "No results",
    recent: "Recent searches", emptyFav: "Tap the heart on any ayah to save it here.",
    language: "Language", translation: "Show translation", fontSize: "Arabic text size",
    speed: "Speed", repeat: "Repeat", repeatOff: "Off", repeatAyah: "Ayah", repeatSurah: "Surah",
    sources: "Sources", loading: "Loading…", error: "Couldn't load. Check your connection.", retry: "Retry",
    stats: "Your stats", sessions: "sessions", opened: "surahs opened", playSurah: "Play surah",
    clearData: "Clear my local data", privacy: "Your data stays on this device.",
  },
  ar: {
    home: "الرئيسية", surahs: "السور", search: "بحث", favorites: "المفضلة", settings: "الإعدادات",
    morning: "صباح الخير", evening: "مساء الخير", tagline: "اقرأ القرآن واستمع إليه بحرية.",
    continueReading: "متابعة القراءة", continueListening: "متابعة الاستماع", start: "ابدأ بالفاتحة",
    ayah: "آية", ayahs: "آيات", meccan: "مكية", medinan: "مدنية",
    reciters: "القرّاء", reciter: "القارئ", play: "تشغيل", pause: "إيقاف مؤقت", next: "التالي", prev: "السابق",
    favorite: "مفضلة", bookmark: "علامة", copy: "نسخ", share: "مشاركة", copied: "تم النسخ",
    searchPh: "ابحث في الترجمة…", searchSurahPh: "تصفية السور…", noResults: "لا توجد نتائج",
    recent: "عمليات البحث الأخيرة", emptyFav: "اضغط على القلب في أي آية لحفظها هنا.",
    language: "اللغة", translation: "إظهار الترجمة", fontSize: "حجم الخط العربي",
    speed: "السرعة", repeat: "التكرار", repeatOff: "بدون", repeatAyah: "آية", repeatSurah: "سورة",
    sources: "المصادر", loading: "جارٍ التحميل…", error: "تعذر التحميل. تحقق من الاتصال.", retry: "إعادة المحاولة",
    stats: "إحصاءاتك", sessions: "جلسات", opened: "سور مفتوحة", playSurah: "استمع إلى السورة",
    clearData: "مسح بياناتي المحلية", privacy: "تبقى بياناتك على هذا الجهاز.",
  },
} as const;

export type TKey = keyof typeof dict.en;
export function useT() {
  const lang = useStore((s) => s.lang);
  const t = (k: TKey) => dict[lang][k];
  const num = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : lang);
  return { t, lang, num, dir: lang === "ar" ? "rtl" : "ltr" } as const;
}
export const LANGS: { id: Lang; label: string }[] = [
  { id: "fr", label: "Français" }, { id: "en", label: "English" }, { id: "ar", label: "العربية" },
];
