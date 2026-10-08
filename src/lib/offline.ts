import { useEffect, useState } from "react";
import { TRANSLATIONS, surahUrl } from "./quran";
import type { Lang } from "./store";

// Must match DATA cache name in public/sw.js so the service worker serves these offline.
export const DATA_CACHE = "cpf-data-v1";

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const up = () => setOnline(navigator.onLine);
    up();
    window.addEventListener("online", up);
    window.addEventListener("offline", up);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", up);
    };
  }, []);
  return online;
}

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function useInstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); };
    const onInstalled = () => { setInstalled(true); setEvt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setEvt(null);
  };
  return { canInstall: !!evt && !installed, installed, install };
}

export const offlineSupported = () => typeof window !== "undefined" && "caches" in window;

/** Number of surahs (1..114) whose text is already saved for the given lang/reciter. */
export async function countSavedSurahs(lang: Lang, reciter: string) {
  if (!offlineSupported()) return 0;
  const c = await caches.open(DATA_CACHE);
  let n = 0;
  for (let s = 1; s <= 114; s++) if (await c.match(surahUrl(s, lang, reciter))) n++;
  return n;
}

/** Saves the text (+ translation) of all 114 surahs so they can be read offline. */
export async function saveAllSurahs(lang: Lang, reciter: string, onProgress: (done: number) => void, signal?: AbortSignal) {
  const c = await caches.open(DATA_CACHE);
  let done = 0;
  const queue = Array.from({ length: 114 }, (_, i) => i + 1);
  const worker = async () => {
    while (queue.length && !signal?.aborted) {
      const s = queue.shift();
      if (!s) return;
      const url = surahUrl(s, lang, reciter);
      if (!(await c.match(url))) {
        const res = await fetch(url, { signal: signal ?? null });
        if (!res.ok) throw new Error("network");
        await c.put(url, res);
      }
      onProgress(++done);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
}

export async function clearSavedData() {
  if (offlineSupported()) await caches.delete(DATA_CACHE);
  window.dispatchEvent(new Event("cpf-cache-change"));
}

export const hasTranslation = (lang: Lang) => !!TRANSLATIONS[lang];
