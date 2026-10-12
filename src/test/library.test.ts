import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalize, runSearch, searchEdition, surahQuery } from "@/lib/quran";
import { followingSurah } from "@/lib/playback";
import { toggleIn, toggleSurah } from "@/lib/store";
import { downloadSurah, isDownloaded, removeDownload } from "@/lib/downloads";

describe("Arabic search", () => {
  it("matches Arabic text with or without vowel marks", () => {
    const text = "ٱلْفَاتِحَة";
    expect(runSearch([{ s: 1, a: 1, text, norm: normalize(text) }], "الفاتحة")).toHaveLength(1);
    expect(normalize("إِبْرَاهِيم")).toBe(normalize("ابراهيم"));
  });
  it("matches presentation forms and Arabic digits", () => {
    expect(normalize("ﻻ")).toBe(normalize("لا"));
    expect(normalize("١١٤")).toBe("114");
    expect(searchEdition("رحمة", "fr")).toBe("quran-simple-clean");
  });
});

describe("Library rules", () => {
  it("adds then removes a surah favorite", () => {
    expect(toggleSurah([], 1)).toEqual([1]);
    expect(toggleSurah([1, 2], 1)).toEqual([2]);
  });
  it("adds then removes a favorite reciter", () => {
    expect(toggleIn([], "ar.alafasy")).toEqual(["ar.alafasy"]);
    expect(toggleIn(["ar.alafasy"], "ar.alafasy")).toEqual([]);
  });
  it("keeps insertion order in the playlist without duplicates", () => {
    expect(toggleSurah([2], 1)).toEqual([2, 1]);
    expect(toggleSurah([2, 1], 2)).toEqual([1]);
  });
  it("advances a surah and stops after surah 114 or when disabled", () => {
    expect(followingSurah(1, [], true)).toBe(2);
    expect(followingSurah(114, [], true)).toBeNull();
    expect(followingSurah(1, [], false)).toBeNull();
  });
  it("plays the next playlist surah and stops at its end", () => {
    expect(followingSurah(114, [114, 1], true)).toBe(1);
    expect(followingSurah(1, [114, 1], true)).toBeNull();
  });
});

describe("Offline downloads", () => {
  const entries = new Map<string, Response>();
  const metadata = () => new Response(JSON.stringify({ data: [
    { ayahs: [{ numberInSurah: 1, number: 1, text: "verified-fixture" }] },
    { ayahs: [{ audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3" }] },
  ] }));
  beforeEach(() => {
    entries.clear();
    vi.stubGlobal("caches", { open: async () => ({
      match: async (url: string) => entries.get(url)?.clone(),
      put: async (url: string, response: Response) => { entries.set(url, response.clone()); },
      delete: async (url: string) => entries.delete(url),
    }) });
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.startsWith("/api/public/quran-audio?") ? new Response("audio", { headers: { "Content-Type": "audio/mpeg" } }) : metadata()));
  });
  it("colors the download state only after metadata and all audio are saved", async () => {
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(false);
    await downloadSurah(1, "fr", "ar.alafasy");
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(true);
    entries.delete("https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3");
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(false);
  });
  it("removing a favorite does not delete a downloaded surah", async () => {
    await downloadSurah(1, "fr", "ar.alafasy");
    expect(toggleSurah([1], 1)).toEqual([]);
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(true);
    await removeDownload(1, "fr", "ar.alafasy");
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(false);
  });
  it("loads saved verified data without a connection", async () => {
    await downloadSurah(1, "fr", "ar.alafasy");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const options = surahQuery(1, "fr", "ar.alafasy");
    if (typeof options.queryFn !== "function") throw new Error("Missing query function");
    const data = await options.queryFn({ client: {} as never, queryKey: options.queryKey, signal: new AbortController().signal, meta: undefined });
    expect(data?.[0]?.audio).toBe("https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3");
  });
  it("rejects failed audio downloads without marking the surah saved", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.startsWith("/api/") ? new Response("Unavailable", { status: 502 }) : metadata()));
    await expect(downloadSurah(1, "fr", "ar.alafasy")).rejects.toThrow("network");
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(false);
  });
  it("does not cache an empty or non-audio response", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.startsWith("/api/") ? new Response("<html>error</html>", { headers: { "Content-Type": "text/html" } }) : metadata()));
    await expect(downloadSurah(1, "fr", "ar.alafasy")).rejects.toThrow("network");
    expect(await isDownloaded(1, "fr", "ar.alafasy")).toBe(false);
  });
});
import { sanitize as sanitizeState, toggleReciterFavorite, favoritesOf as favOf, defaultState as baseState } from "@/lib/store";
describe("per-reciter favorites", () => {
  it("keeps favorites separate per reciter and never duplicates", () => {
    let s = { ...baseState, ...toggleReciterFavorite(baseState, "ar.alafasy", 2) };
    s = { ...s, ...toggleReciterFavorite(s, "ar.husary", 3) };
    expect(favOf(s, "ar.alafasy")).toEqual([2]);
    expect(favOf(s, "ar.husary")).toEqual([3]);
    const dirty = sanitizeState({ ...s, playlist: [1, 1, 2], favoriteSurahs: [2, 5] });
    expect(dirty.playlist).toEqual([1, 2]);
    expect(favOf(dirty, "ar.alafasy")).toEqual([2, 5]);
  });
});
