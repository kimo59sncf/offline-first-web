import { useStore, type Lang } from "./store";

const dict = {
  fr: {
    download: "Télécharger la sourate", removeDownload: "Supprimer le téléchargement", downloaded: "Téléchargée", removeFavorite: "Retirer des favoris", addFavorite: "Ajouter aux favoris", playlist: "Playlist", addPlaylist: "Ajouter à la playlist", removePlaylist: "Retirer de la playlist", playPlaylist: "Écouter la playlist", nextSurah: "Sourate suivante", autoAdvance: "Enchaîner les sourates", favoriteReciters: "Récitateurs favoris", favoriteSurahs: "Sourates favorites", downloads: "Téléchargements", downloadDone: "Sourate téléchargée", close: "Fermer",
    offline: "Hors ligne", offlineBanner: "Vous êtes hors ligne — les sourates enregistrées restent lisibles.", offlineTitle: "Hors ligne & installation", install: "Installer l'application", installed: "Application installée", installHint: "Sur iPhone : Partager → Sur l'écran d'accueil.", saveAll: "Enregistrer les 114 sourates", saved: "sourates enregistrées", saving: "Enregistrement…", clearOffline: "Supprimer les données hors ligne",
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
    download: "Download surah", removeDownload: "Delete download", downloaded: "Downloaded", removeFavorite: "Remove from favorites", addFavorite: "Add to favorites", playlist: "Playlist", addPlaylist: "Add to playlist", removePlaylist: "Remove from playlist", playPlaylist: "Play playlist", nextSurah: "Next surah", autoAdvance: "Continue to next surah", favoriteReciters: "Favorite reciters", favoriteSurahs: "Favorite surahs", downloads: "Downloads", downloadDone: "Surah downloaded", close: "Close",
    offline: "Offline", offlineBanner: "You are offline — saved surahs remain readable.", offlineTitle: "Offline & install", install: "Install the app", installed: "App installed", installHint: "On iPhone: Share → Add to Home Screen.", saveAll: "Save all 114 surahs", saved: "surahs saved", saving: "Saving…", clearOffline: "Delete offline data",
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
    download: "تنزيل السورة", removeDownload: "حذف التنزيل", downloaded: "تم التنزيل", removeFavorite: "إزالة من المفضلة", addFavorite: "إضافة إلى المفضلة", playlist: "قائمة التشغيل", addPlaylist: "إضافة إلى قائمة التشغيل", removePlaylist: "إزالة من قائمة التشغيل", playPlaylist: "تشغيل القائمة", nextSurah: "السورة التالية", autoAdvance: "متابعة السور", favoriteReciters: "القراء المفضلون", favoriteSurahs: "السور المفضلة", downloads: "التنزيلات", downloadDone: "تم تنزيل السورة", close: "إغلاق",
    offline: "غير متصل", offlineBanner: "أنت غير متصل — السور المحفوظة تبقى متاحة للقراءة.", offlineTitle: "دون اتصال والتثبيت", install: "تثبيت التطبيق", installed: "التطبيق مثبت", installHint: "على آيفون: مشاركة ← إضافة إلى الشاشة الرئيسية.", saveAll: "حفظ السور الـ ١١٤", saved: "سور محفوظة", saving: "جارٍ الحفظ…", clearOffline: "حذف بيانات عدم الاتصال",
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
