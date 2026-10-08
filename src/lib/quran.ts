import { queryOptions } from "@tanstack/react-query";
import surahs from "@/data/surahs.json";
import type { Lang } from "./store";

export type Surah = (typeof surahs)[number];
export const SURAHS: Surah[] = surahs;

// Source: Tanzil Uthmani text + editions served by api.alquran.cloud (Islamic Network).
const API = "https://api.alquran.cloud/v1";
export const TRANSLATIONS: Record<Lang, { id: string; name: string } | null> = {
  fr: { id: "fr.hamidullah", name: "Muhammad Hamidullah (Tanzil)" },
  en: { id: "en.sahih", name: "Saheeh International (Tanzil)" },
  ar: null,
};

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", ar: "مشاري العفاسي" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", ar: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", ar: "محمد صديق المنشاوي" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", ar: "عبد الباسط عبد الصمد" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", ar: "عبدالرحمن السديس" },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly", ar: "ماهر المعيقلي" },
  { id: "ar.saoodshuraym", name: "Saud Ash-Shuraim", ar: "سعود الشريم" },
];

export type Ayah = { n: number; global: number; ar: string; tr?: string; audio: string };

export const surahQuery = (n: number, lang: Lang, reciter: string) =>
  queryOptions({
    queryKey: ["surah", n, lang, reciter],
    staleTime: Infinity,
    queryFn: async (): Promise<Ayah[]> => {
      const tr = TRANSLATIONS[lang];
      const eds = ["quran-uthmani", reciter, ...(tr ? [tr.id] : [])].join(",");
      const res = await fetch(`${API}/surah/${n}/editions/${eds}`);
      if (!res.ok) throw new Error("network");
      const { data } = await res.json();
      const [text, audio, trans] = data;
      return text.ayahs.map((a: { numberInSurah: number; number: number; text: string }, i: number) => ({
        n: a.numberInSurah,
        global: a.number,
        ar: a.text,
        audio: audio.ayahs[i].audio,
        tr: trans?.ayahs[i]?.text,
      }));
    },
  });

export type SearchHit = { s: number; a: number; text: string };

const isArabic = (q: string) => /[\u0600-\u06FF]/.test(q);
// Diacritic/letter-form insensitive normalisation (Arabic + Latin accents).
export const normalize = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase();

type Indexed = { s: number; a: number; text: string; norm: string };
export const editionQuery = (ed: string) =>
  queryOptions({
    queryKey: ["edition", ed],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async (): Promise<Indexed[]> => {
      const res = await fetch(`${API}/quran/${ed}`);
      if (!res.ok) throw new Error("network");
      const { data } = await res.json();
      const out: Indexed[] = [];
      for (const su of data.surahs) for (const a of su.ayahs) out.push({ s: su.number, a: a.numberInSurah, text: a.text, norm: normalize(a.text) });
      return out;
    },
  });

export const searchEdition = (q: string, lang: Lang) =>
  isArabic(q) ? "quran-simple-clean" : TRANSLATIONS[lang]?.id ?? TRANSLATIONS.fr!.id;

export function runSearch(index: Indexed[], q: string): SearchHit[] {
  const n = normalize(q.trim());
  if (n.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const r of index) {
    if (r.norm.includes(n)) { hits.push({ s: r.s, a: r.a, text: r.text }); if (hits.length >= 200) break; }
  }
  return hits;
}

export const surahName = (s: Surah, lang: Lang) => (lang === "ar" ? s.ar : s.tr);
export const surah = (n: number): Surah => SURAHS[Math.min(Math.max(n, 1), 114) - 1]!;
