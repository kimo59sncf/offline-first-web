import { useEffect, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { DATA_CACHE, offlineSupported } from "./offline";
import { surahQuery, surahUrl } from "./quran";
import type { Lang } from "./store";

const listeners = new Set<() => void>();
const pending = new Set<string>();
const notify = () => listeners.forEach((fn) => fn());

export async function isDownloaded(n: number, lang: Lang, reciter: string) {
  if (!offlineSupported()) return false;
  const cache = await caches.open(DATA_CACHE);
  const response = await cache.match(surahUrl(n, lang, reciter));
  if (!response) return false;
  const { data } = await response.json();
  const ayahs: { audio: string }[] = data?.[1]?.ayahs ?? [];
  if (!ayahs.length) return false;
  for (const ayah of ayahs) if (!(await cache.match(ayah.audio))) return false;
  return true;
}

export async function downloadSurah(n: number, lang: Lang, reciter: string) {
  if (!offlineSupported()) throw new Error("unsupported");
  const key = surahUrl(n, lang, reciter);
  if (pending.has(key)) return;
  pending.add(key); notify();
  try {
    const cache = await caches.open(DATA_CACHE);
    let response = await cache.match(key);
    if (!response) {
      response = await fetch(key);
      if (!response.ok) throw new Error("network");
      await cache.put(key, response.clone());
    }
    const { data } = await response.json();
    const queue: { audio: string }[] = [...data[1].ayahs];
    const worker = async () => {
      while (queue.length) {
        const ayah = queue.shift();
        if (!ayah) return;
        if (await cache.match(ayah.audio)) continue;
        const audio = await fetch(ayah.audio);
        if (!audio.ok) throw new Error("network");
        await cache.put(ayah.audio, audio);
      }
    };
    // Wait for every worker before clearing the busy state, even on a failed download.
    const results = await Promise.allSettled([worker(), worker(), worker()]);
    if (results.some((r) => r.status === "rejected")) throw new Error("network");
  } finally { pending.delete(key); notify(); }
}

export async function removeDownload(n: number, lang: Lang, reciter: string) {
  const cache = await caches.open(DATA_CACHE);
  const key = surahUrl(n, lang, reciter);
  const response = await cache.match(key);
  if (response) {
    const { data } = await response.json();
    for (const ayah of data[1].ayahs) await cache.delete(ayah.audio);
  }
  await cache.delete(key); notify();
}

export function useDownload(n: number, lang: Lang, reciter: string) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const check = () => {
      setBusy(pending.has(surahUrl(n, lang, reciter)));
      isDownloaded(n, lang, reciter).then((value) => { if (active) setSaved(value); }).catch(() => { if (active) setSaved(false); });
    };
    setSaved(false); check(); listeners.add(check);
    window.addEventListener("cpf-cache-change", check);
    return () => { active = false; listeners.delete(check); window.removeEventListener("cpf-cache-change", check); };
  }, [n, lang, reciter]);
  return { saved, busy };
}

export function useDownloadedSurahs(lang: Lang, reciter: string) {
  const [list, setList] = useState<number[]>([]);
  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!offlineSupported()) return;
      const keys = await (await caches.open(DATA_CACHE)).keys();
      const numbers = new Set<number>();
      for (const key of keys) {
        const match = new URL(key.url).pathname.match(/\/surah\/(\d+)\/editions\//);
        if (match) numbers.add(Number(match[1]));
      }
      const saved: number[] = [];
      for (const n of numbers) if (await isDownloaded(n, lang, reciter)) saved.push(n);
      if (active) setList(saved.sort((a, b) => a - b));
    };
    const refresh = () => { void check().catch(() => {}); };
    setList([]); refresh(); listeners.add(refresh);
    window.addEventListener("cpf-cache-change", refresh);
    return () => { active = false; listeners.delete(refresh); window.removeEventListener("cpf-cache-change", refresh); };
  }, [lang, reciter]);
  return list;
}

export async function cachedAudioUrl(url: string) {
  if (!offlineSupported()) return url;
  const response = await (await caches.open(DATA_CACHE)).match(url);
  return response ? URL.createObjectURL(await response.blob()) : url;
}

export async function surahTracks(n: number, lang: Lang, reciter: string) {
  const ayahs = await new QueryClient().fetchQuery(surahQuery(n, lang, reciter));
  return ayahs.map((a) => ({ s: n, a: a.n, url: a.audio }));
}