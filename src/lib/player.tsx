import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { setState } from "./store";

type Track = { s: number; a: number; url: string };
type Repeat = "off" | "ayah" | "surah";
type Ctx = {
  queue: Track[]; index: number; playing: boolean; error: boolean;
  speed: number; repeat: Repeat; progress: number;
  playQueue: (q: Track[], start: number) => void;
  toggle: () => void; next: () => void; prev: () => void;
  setSpeed: (n: number) => void; setRepeat: (r: Repeat) => void; stop: () => void;
};
const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => useContext(PlayerCtx)!;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [repeat, setRepeat] = useState<Repeat>("off");
  const [progress, setProgress] = useState(0);
  const st = useRef({ queue, index, repeat });
  st.current = { queue, index, repeat };

  useEffect(() => {
    const el = new Audio();
    audio.current = el;
    el.onplay = () => setPlaying(true);
    el.onpause = () => setPlaying(false);
    el.onerror = () => { setError(true); setPlaying(false); };
    el.ontimeupdate = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    el.onended = () => {
      const { queue, index, repeat } = st.current;
      if (repeat === "ayah") return load(index, queue);
      if (index + 1 < queue.length) return load(index + 1, queue);
      if (repeat === "surah") return load(0, queue);
      setPlaying(false);
    };
    return () => { el.pause(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (audio.current) audio.current.playbackRate = speed; }, [speed]);

  function load(i: number, q: Track[]) {
    const el = audio.current; const tr = q[i];
    if (!el || !tr) return;
    setIndex(i); setError(false);
    el.src = tr.url; el.playbackRate = speed;
    el.play().catch(() => setError(true));
    setState(() => ({ lastListen: { s: tr.s, a: tr.a } }));
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: `Surah ${tr.s} · ${tr.a}`, artist: "CoranProFree" });
      navigator.mediaSession.setActionHandler("nexttrack", () => load(Math.min(st.current.index + 1, st.current.queue.length - 1), st.current.queue));
      navigator.mediaSession.setActionHandler("previoustrack", () => load(Math.max(st.current.index - 1, 0), st.current.queue));
    }
  }

  const value: Ctx = {
    queue, index, playing, error, speed, repeat, progress,
    playQueue: (q, start) => { setQueue(q); load(start, q); },
    toggle: () => {
      const el = audio.current; if (!el) return;
      if (error) return load(index, queue);
      el.paused ? el.play().catch(() => setError(true)) : el.pause();
    },
    next: () => load(Math.min(index + 1, queue.length - 1), queue),
    prev: () => load(Math.max(index - 1, 0), queue),
    setSpeed, setRepeat,
    stop: () => { audio.current?.pause(); setQueue([]); },
  };
  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}
