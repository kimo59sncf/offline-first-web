import { useSyncExternalStore } from "react";

export type Lang = "fr" | "en" | "ar";
export type AppState = {
  v: 1;
  lang: Lang;
  reciter: string;
  showTranslation: boolean;
  fontSize: number;
  favorites: string[]; // "surah:ayah"
  favoriteSurahs: Record<string, number[]>; // surah favorites per reciter id
  favoriteReciters: string[];
  playlist: number[];
  playlistReciters: Record<string, string>; // surah -> reciter chosen when added
  playlistShuffle: boolean;
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
  favoriteSurahs: {},
  favoriteReciters: [],
  playlist: [],
  playlistReciters: {},
  playlistShuffle: false,
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
  // Migration: legacy favoriteSurahs was a flat array of global favorites.
  if (Array.isArray(state.favoriteSurahs)) state.favoriteSurahs = { [state.reciter]: state.favoriteSurahs };
  if (state.favoriteSurahs == null) state.favoriteSurahs = {};
  state = dedupe(state);
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

// Stable empty reference so `useStore` selectors never return a fresh array.
const EMPTY_SURAHS: number[] = [];

/** Surah favorites for a given reciter (empty list when none). */
export const favoriteSurahsOf = (s: AppState, reciter: string): number[] =>
  s.favoriteSurahs[reciter] ?? EMPTY_SURAHS;

/** Toggle a surah in the per-reciter favorites map. */
export const toggleFavoriteSurah = (s: AppState, reciter: string, n: number): Partial<AppState> => ({
  favoriteSurahs: { ...s.favoriteSurahs, [reciter]: toggleSurah(favoriteSurahsOf(s, reciter), n) },
});

export const getState = () => { load(); return state; };

const uniq = <T,>(list: T[] | undefined): T[] => Array.from(new Set(Array.isArray(list) ? list : []));

/** Removes duplicates from every user list (favorites, playlist, bookmarks). */
export function dedupe(s: AppState): AppState {
  const fav: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(s.favoriteSurahs ?? {})) fav[k] = uniq(v);
  return { ...s, favoriteSurahs: fav, favorites: uniq(s.favorites), bookmarks: uniq(s.bookmarks), favoriteReciters: uniq(s.favoriteReciters), playlist: uniq(s.playlist) };
}

/** Adds the surah to the playlist with this reciter, re-assigns it, or removes it when already set to this reciter. */
export function togglePlaylist(s: AppState, n: number, reciter: string): Partial<AppState> {
  const map = { ...(s.playlistReciters ?? {}) };
  const inList = s.playlist.includes(n);
  if (inList && map[n] === reciter) { delete map[n]; return { playlist: s.playlist.filter((x) => x !== n), playlistReciters: map }; }
  map[n] = reciter;
  return { playlist: inList ? s.playlist : [...s.playlist, n], playlistReciters: map };
}
export const playlistReciter = (s: AppState, n: number) => s.playlistReciters?.[n] ?? s.reciter;
