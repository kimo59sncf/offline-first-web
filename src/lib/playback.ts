export function followingSurah(n: number, playlist: number[], autoAdvance: boolean, shuffle = false, rand = Math.random): number | null {
  const index = playlist.indexOf(n);
  if (index >= 0 && shuffle && playlist.length > 1) {
    const others = playlist.filter((x) => x !== n);
    return others[Math.floor(rand() * others.length)] ?? null;
  }
  if (index >= 0) return playlist[index + 1] ?? null;
  return autoAdvance && n < 114 ? n + 1 : null;
}

/** A random surah number (1..114), optionally excluding the one currently playing. */
export function randomSurah(exclude?: number): number {
  const pool: number[] = [];
  for (let s = 1; s <= 114; s++) if (s !== exclude) pool.push(s);
  return pool[Math.floor(Math.random() * pool.length)] ?? 1;
}
/** First surah to play when starting the playlist (random pick in shuffle mode). */
export function playlistStart(playlist: number[], shuffle: boolean, rand = Math.random): number | null {
  if (!playlist.length) return null;
  return shuffle ? playlist[Math.floor(rand() * playlist.length)] ?? null : playlist[0] ?? null;
}
