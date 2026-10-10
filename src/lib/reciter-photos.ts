import alafasy from "@/assets/reciters/alafasy.webp.asset.json";
import husary from "@/assets/reciters/husary.webp.asset.json";
import minshawi from "@/assets/reciters/minshawi.webp.asset.json";
import abdulbasit from "@/assets/reciters/abdulbasit.webp.asset.json";
import sudais from "@/assets/reciters/sudais.webp.asset.json";
import muaiqly from "@/assets/reciters/muaiqly.webp.asset.json";
import shuraym from "@/assets/reciters/shuraym.webp.asset.json";
import ajmy from "@/assets/reciters/ajmy.webp.asset.json";
import basfar from "@/assets/reciters/basfar.webp.asset.json";
import ayyoub from "@/assets/reciters/ayyoub.webp.asset.json";
import jibreel from "@/assets/reciters/jibreel.webp.asset.json";

// Identity verified against the named profile links on fr.assabile.com/quran.
// Source portraits: /media/portraits/{id}-200.webp. Reuse licensing not confirmed.
export const RECITER_PHOTOS: Record<string, string> = {
  "ar.alafasy": alafasy.url,
  "ar.husary": husary.url,
  "ar.minshawi": minshawi.url,
  "ar.abdulbasitmurattal": abdulbasit.url,
  "ar.abdurrahmaansudais": sudais.url,
  "ar.mahermuaiqly": muaiqly.url,
  "ar.saoodshuraym": shuraym.url,
  "ar.ahmedajamy": ajmy.url,
  "ar.abdullahbasfar": basfar.url,
  "ar.muhammadayyoub": ayyoub.url,
  "ar.muhammadjibreel": jibreel.url,
};