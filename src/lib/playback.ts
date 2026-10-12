export function followingSurah(n: number, playlist: number[], autoAdvance: boolean): number | null {
  const index = playlist.indexOf(n);
  if (index >= 0) return playlist[index + 1] ?? null;
  return autoAdvance && n < 114 ? n + 1 : null;
}

/** A random surah number (1..114), optionally excluding the one currently playing. */
export function randomSurah(exclude?: number): number {
  const pool: number[] = [];
  for (let s = 1; s <= 114; s++) if (s !== exclude) pool.push(s);
  return pool[Math.floor(Math.random() * pool.length)] ?? 1;
}