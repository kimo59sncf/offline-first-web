import { createContext, useContext } from "react";

export type Track = { s: number; a: number; url: string };
export type Repeat = "off" | "ayah" | "surah";
export type PlayerContextValue = {
  queue: Track[]; index: number; playing: boolean; error: boolean;
  speed: number; repeat: Repeat; progress: number;
  playQueue: (q: Track[], start: number) => void;
  toggle: () => void; next: () => void; prev: () => void;
  nextSurah: () => void;
  playSurah: (n: number, reciter?: string) => Promise<void>;
  playPlaylist: () => void;
  reciter: string | null;
  playRandomSurah: () => Promise<void>;
  seek: (delta: number) => void; setSpeed: (n: number) => void; setRepeat: (r: Repeat) => void; stop: () => void;
};

// Keep context identity independent of the provider's Fast Refresh boundary.
export const PlayerCtx = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const context = useContext(PlayerCtx);
  if (!context) throw new Error("PlayerProvider required");
  return context;
}