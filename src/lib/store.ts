import { useSyncExternalStore } from "react";

export type Lang = "fr" | "en" | "ar";
export type AppState = {
  v: 1;
  lang: Lang;
  reciter: string;
  showTranslation: boolean;
  fontSize: number;
  favorites: string[]; // "surah:ayah"
  favoriteSurahs: number[];
  favoriteReciters: string[];
  playlist: number[];
  autoAdvance: boolean;
  bookmarks: string[];
  lastRead: { s: number; a: number } | null;
  lastListen: { s: number; a: number } | null;
  searchHistory: string[];
  stats: { sessions: number; surahsOpened: number[] };
};

const KEY = "cpf.state";
export const defaultState: AppState = {
  v: 1,
  lang: "fr",
  reciter: "ar.alafasy",
  showTranslation: true,
  fontSize: 30,
  favorites: [],
  favoriteSurahs: [],
  favoriteReciters: [],
  playlist: [],
  autoAdvance: true,
  bookmarks: [],
  lastRead: null,
  lastListen: null,
  searchHistory: [],
  stats: { sessions: 0, surahsOpened: [] },
};

let state: AppState = defaultState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...defaultState, ...JSON.parse(raw), v: 1 };
  } catch {
    /* corrupted storage: keep defaults */
  }
  state = { ...state, stats: { ...state.stats, sessions: state.stats.sessions + 1 } };
  persist();
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
}

export function setState(fn: (s: AppState) => Partial<AppState>) {
  load();
  state = { ...state, ...fn(state) };
  persist();
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => sel(state),
    () => sel(defaultState),
  );
}

export const toggleIn = (list: string[], k: string) =>
  list.includes(k) ? list.filter((x) => x !== k) : [...list, k];

export const toggleSurah = (list: number[], n: number) =>
  list.includes(n) ? list.filter((x) => x !== n) : [...list, n];

export const getState = () => { load(); return state; };
