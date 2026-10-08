export function followingSurah(n: number, playlist: number[], autoAdvance: boolean): number | null {
  const index = playlist.indexOf(n);
  if (index >= 0) return playlist[index + 1] ?? null;
  return autoAdvance && n < 114 ? n + 1 : null;
}