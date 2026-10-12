import { useEffect, useState } from "react";
import { ChevronDown, ListMusic, Pause, Play, Repeat, RotateCcw, RotateCw, Shuffle, SkipBack, SkipForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurahActions } from "@/components/LibraryControls";
import { ReciterPortrait } from "@/components/ReciterPortrait";
import { useDownload } from "@/lib/downloads";
import { useT } from "@/lib/i18n";
import { usePlayer } from "@/lib/player-context";
import { RECITERS, surah, surahName } from "@/lib/quran";
import { RECITER_PHOTOS } from "@/lib/reciter-photos";
import { useStore } from "@/lib/store";

function useNowPlaying() {
  const p = usePlayer();
  const { lang } = useT();
  const reciterId = useStore((s) => s.reciter);
  const tr = p.queue[p.index];
  const r = RECITERS.find((x) => x.id === reciterId);
  return { p, tr, reciterId, photo: RECITER_PHOTOS[reciterId], reciterName: (lang === "ar" ? r?.ar : r?.name) ?? reciterId };
}

/** Blurred reciter portrait behind a deep emerald gradient. */
function Backdrop({ photo }: { photo?: string }) {
  return <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {photo && <img src={photo} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl" />}
    <div className="bg-player absolute inset-0" />
  </div>;
}

export function MiniPlayer() {
  const { p, tr, photo, reciterName, reciterId } = useNowPlaying();
  const { t, num, lang } = useT();
  const [open, setOpen] = useState(false);
  if (!tr) return null;
  const s = surah(tr.s);
  return <>
    <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-20 px-3">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Backdrop photo={photo} />
        <div className="relative flex items-center gap-3 p-2.5">
          <button onClick={() => setOpen(true)} aria-label={t("openPlayer")} className="flex min-w-0 flex-1 items-center gap-3 text-start">
            <span className="scale-75 -m-2"><ReciterPortrait src={photo} name={reciterName} selected={false} /></span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{surahName(s, lang)}</span>
              <span className="block truncate text-xs text-muted-foreground">{reciterName} · {t("ayah")} {num(tr.a)}{p.error && ` · ${t("error")}`}</span>
            </span>
          </button>
          <Button size="icon" variant="ghost" aria-label={t("prev")} onClick={p.prev}><SkipBack className="rtl:rotate-180" /></Button>
          <button aria-label={p.error ? t("retry") : p.playing ? t("pause") : t("play")} onClick={p.toggle} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground shadow-gold transition-transform active:scale-95">
            {p.error ? <RotateCw className="h-5 w-5" /> : p.playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 translate-x-px" fill="currentColor" />}
          </button>
          <Button size="icon" variant="ghost" aria-label={t("next")} onClick={p.next}><SkipForward className="rtl:rotate-180" /></Button>
          <Button size="icon" variant="ghost" aria-label={t("close")} onClick={p.stop} className="hidden sm:inline-flex"><X /></Button>
        </div>
        <div className="relative h-1 bg-foreground/10"><div className="h-full bg-gold transition-[width]" style={{ width: `${p.progress * 100}%` }} /></div>
      </div>
    </div>
    {open && <FullPlayer onClose={() => setOpen(false)} key={reciterId} />}
  </>;
}

function FullPlayer({ onClose }: { onClose: () => void }) {
  const { p, tr, photo, reciterName, reciterId } = useNowPlaying();
  const { t, num, lang } = useT();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  const playlistCount = useStore((s) => s.playlist.length);
  useDownload(tr?.s ?? 1, lang, reciterId);
  if (!tr) return null;
  const s = surah(tr.s);
  const order = ["off", "ayah", "surah"] as const;
  const repeatLabel = t(p.repeat === "off" ? "repeatOff" : p.repeat === "ayah" ? "repeatAyah" : "repeatSurah");
  const speeds = [0.75, 1, 1.25, 1.5];
  return <div role="dialog" aria-modal="true" aria-label={t("nowPlaying")} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background animate-in fade-in slide-in-from-bottom-8 duration-300">
    <Backdrop photo={photo} />
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <Button size="icon" variant="ghost" aria-label={t("close")} onClick={onClose}><ChevronDown className="h-6 w-6" /></Button>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{t("nowPlaying")}</span>
        <Button size="icon" variant="ghost" aria-label={t("close")} onClick={() => { p.stop(); onClose(); }}><X /></Button>
      </div>

      <div className="mt-8 grid place-items-center">
        <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-[2rem] border border-gold/30 bg-card shadow-gold">
          {photo ? <img src={photo} alt={reciterName} className="h-full w-full object-cover" /> : <div className="bg-hero h-full w-full" />}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4 text-center">
            <p dir="rtl" className="font-quran text-3xl text-gold">{s.ar}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-3xl font-semibold">{surahName(s, lang)}</h2>
          <p className="truncate text-muted-foreground">{reciterName}</p>
        </div>
        <SurahActions n={tr.s} />
      </div>

      <div className="mt-6">
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/15"><div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${p.progress * 100}%` }} /></div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{t("ayah")} {num(tr.a)}</span><span>{num(p.index + 1)} / {num(p.queue.length)}</span></div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button size="icon" variant="ghost" aria-label={t("back15")} onClick={() => p.seek(-15)}><RotateCcw className="h-5 w-5" /></Button>
        <Button size="icon" variant="ghost" aria-label={t("prev")} onClick={p.prev} className="h-12 w-12"><SkipBack className="h-6 w-6 rtl:rotate-180" fill="currentColor" /></Button>
        <button aria-label={p.error ? t("retry") : p.playing ? t("pause") : t("play")} onClick={p.toggle} className="grid h-20 w-20 place-items-center rounded-full bg-gold text-gold-foreground shadow-gold transition-transform active:scale-95">
          {p.error ? <RotateCw className="h-8 w-8" /> : p.playing ? <Pause className="h-8 w-8" fill="currentColor" /> : <Play className="h-8 w-8 translate-x-0.5" fill="currentColor" />}
        </button>
        <Button size="icon" variant="ghost" aria-label={t("next")} onClick={p.next} className="h-12 w-12"><SkipForward className="h-6 w-6 rtl:rotate-180" fill="currentColor" /></Button>
        <Button size="icon" variant="ghost" aria-label={t("fwd15")} onClick={() => p.seek(15)}><RotateCw className="h-5 w-5" /></Button>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border bg-card/60 p-2 backdrop-blur">
        <Button variant="ghost" size="sm" aria-label={t("speed")} onClick={() => p.setSpeed(speeds[(speeds.indexOf(p.speed) + 1) % speeds.length] ?? 1)} className="font-semibold">{p.speed}×</Button>
        <Button variant="ghost" size="icon" aria-label={`${t("repeat")}: ${repeatLabel}`} title={repeatLabel} aria-pressed={p.repeat !== "off"} className={p.repeat !== "off" ? "text-gold" : ""} onClick={() => p.setRepeat(order[(order.indexOf(p.repeat) + 1) % 3] ?? "off")}><Repeat /></Button>
        <Button variant="ghost" size="icon" aria-label={t("shuffle")} onClick={() => void p.playRandomSurah()}><Shuffle /></Button>
        <Button variant="ghost" size="icon" aria-label={t("nextSurah")} disabled={tr.s === 114 && !playlistCount} onClick={p.nextSurah}><ListMusic /></Button>
      </div>
    </div>
  </div>;
}
