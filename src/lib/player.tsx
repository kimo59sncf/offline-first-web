import { useEffect, useRef, useState, type ReactNode } from "react";
import { getState, playlistReciter, setState } from "./store";
import { cachedAudioUrl, surahTracks } from "./downloads";
import { playlistStart, followingSurah, randomSurah } from "./playback";
import { PlayerCtx, type PlayerContextValue, type Track, type Repeat } from "./player-context";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [repeat, setRepeat] = useState<Repeat>("off");
  const [progress, setProgress] = useState(0);
  const [reciter, setReciter] = useState<string | null>(null);
  const request = useRef(0);
  const blobUrl = useRef<string | null>(null);
  const st = useRef({ queue, index, repeat, speed });
  st.current = { queue, index, repeat, speed };

  useEffect(() => {
    const el = new Audio();
    audio.current = el;
    el.onplay = () => setPlaying(true);
    el.onpause = () => setPlaying(false);
    el.onerror = () => { setError(true); setPlaying(false); };
    el.ontimeupdate = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    el.onended = () => {
      const { queue, index, repeat } = st.current;
      if (repeat === "ayah") { void load(index, queue); return; }
      if (index + 1 < queue.length) { void load(index + 1, queue); return; }
      if (repeat === "surah") { void load(0, queue); return; }
      const preferences = getState();
      const next = followingSurah(queue[index]?.s ?? 114, preferences.playlist, preferences.autoAdvance, preferences.playlistShuffle);
      if (next) { void playNext(next); return; }
      setPlaying(false);
    };
    return () => { request.current++; el.pause(); if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (audio.current) audio.current.playbackRate = speed; }, [speed]);

  async function load(i: number, q: Track[]) {
    const el = audio.current; const tr = q[i];
    if (!el || !tr) return;
    const id = ++request.current;
    el.pause(); setIndex(i); setError(false); setProgress(0);
    st.current = { ...st.current, queue: q, index: i };
    let url: string;
    try { url = await cachedAudioUrl(tr.url); } catch { url = tr.url; }
    if (id !== request.current) { if (url.startsWith("blob:")) URL.revokeObjectURL(url); return; }
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = url.startsWith("blob:") ? url : null;
    el.src = url; el.playbackRate = st.current.speed;
    el.play().catch(() => { if (id === request.current) setError(true); });
    setState(() => ({ lastListen: { s: tr.s, a: tr.a } }));
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: `Surah ${tr.s} · ${tr.a}`, artist: "CoranProFree" });
      navigator.mediaSession.setActionHandler("nexttrack", () => load(Math.min(st.current.index + 1, st.current.queue.length - 1), st.current.queue));
      navigator.mediaSession.setActionHandler("previoustrack", () => load(Math.max(st.current.index - 1, 0), st.current.queue));
    }
  }

  /** Playlist surahs keep the reciter chosen when they were added. */
  function playNext(n: number) {
    const s = getState();
    return playSurah(n, s.playlist.includes(n) ? playlistReciter(s, n) : undefined);
  }

  async function playSurah(n: number, withReciter?: string) {
    const id = ++request.current;
    audio.current?.pause(); setError(false);
    const preferences = getState();
    const r = withReciter ?? preferences.reciter;
    try {
      const tracks = await surahTracks(n, preferences.lang, r);
      if (id !== request.current) return;
      setReciter(r); setQueue(tracks); await load(0, tracks);
    } catch { if (id === request.current) { setError(true); setPlaying(false); } }
  }

  async function playRandomSurah() {
    // Always draw from the full Quran (never restricted to the playlist), and
    // skip the surah currently playing so repeated taps always change.
    await playSurah(randomSurah(st.current.queue[st.current.index]?.s));
  }

  const value: PlayerContextValue = {
    queue, index, playing, error, speed, repeat, progress,
    playSurah, reciter,
    playRandomSurah,
    playPlaylist: () => { const s = getState(); const n = playlistStart(s.playlist, s.playlistShuffle); if (n) void playNext(n); },
    nextSurah: () => {
      const preferences = getState();
      const n = followingSurah(queue[index]?.s ?? 114, preferences.playlist, true, preferences.playlistShuffle);
      if (n) void playNext(n);
    },
    playQueue: (q, start) => { setQueue(q); load(start, q); },
    toggle: () => {
      const el = audio.current; if (!el) return;
      if (error) { void load(index, queue); return; }
      el.paused ? el.play().catch(() => setError(true)) : el.pause();
    },
    next: () => load(Math.min(index + 1, queue.length - 1), queue),
    prev: () => load(Math.max(index - 1, 0), queue),
    setSpeed, setRepeat,
    seek: (delta) => { const el = audio.current; if (el && el.duration) el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + delta)); },
    stop: () => { request.current++; audio.current?.pause(); setQueue([]); },
  };
  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}
