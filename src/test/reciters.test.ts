import { describe, expect, it } from "vitest";
import { RECITERS } from "@/lib/quran";
import { everyAyahUrl } from "@/lib/downloads";

describe("Expanded verified reciter catalogue", () => {
  it.each([
    ["ar.ahmedajamy", "Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com"],
    ["ar.abdullahbasfar", "Abdullah_Basfar_192kbps"],
    ["ar.muhammadayyoub", "Muhammad_Ayyoub_128kbps"],
    ["ar.muhammadjibreel", "Muhammad_Jibreel_64kbps"],
  ])("offers %s with its verified verse download directory", (id, directory) => {
    expect(RECITERS.some((reciter) => reciter.id === id)).toBe(true);
    expect(everyAyahUrl(id, 1, 1)).toBe(`https://everyayah.com/data/${directory}/001001.mp3`);
  });
});