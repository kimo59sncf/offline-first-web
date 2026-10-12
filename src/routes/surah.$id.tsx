import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Copy, Heart, Pause, Play, Share2, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { setState, toggleIn, useStore } from "@/lib/store";
import { useDownload } from "@/lib/downloads";
import { surahQuery, SURAHS, surah, RECITERS, type Ayah } from "@/lib/quran";
import { usePlayer } from "@/lib/player-context";
import { RECITER_PHOTOS } from "@/lib/reciter-photos";
import { Button } from "@/components/ui/button";
import { SurahActions, ReciterPicker } from "@/components/LibraryControls";

export const Route = createFileRoute("/surah/$id")({
  beforeLoad: ({ params }) => {
    const n = Number(params.id);
    if (!Number.isInteger(n) || n < 1 || n > 114) throw notFound();
  },
  head: ({ params }) => {
    const s = SURAHS[Number(params.id) - 1];
    const title = s ? `Sourate ${s.tr} (${s.ar}) — CoranProFree` : "CoranProFree";
    const desc = s ? `Lire et écouter la sourate ${s.tr} — ${s.ayahs} versets.` : "";
    return { meta: [{ property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] };
  },
  component: Reader,
});

function Reader() {
  const n = Number(Route.useParams().id);
  const s = surah(n);
  const { t, num, lang } = useT();
  const reciter = useStore((x) => x.reciter);
  const favorite = useStore((x) => (x.favoriteSurahs[x.reciter] ?? []).includes(n));
  const { saved, busy } = useDownload(n, lang, reciter);
  const showTr = useStore((x) => x.showTranslation);
  const q = useQuery(surahQuery(n, lang, reciter));
  const p = usePlayer();
  const reciterInfo = RECITERS.find((r) => r.id === reciter);
  const reciterLabel = (lang === "ar" ? reciterInfo?.ar : reciterInfo?.name) ?? reciter;
  const portrait = RECITER_PHOTOS[reciter];

  useEffect(() => {
    setState((st) => ({
      lastRead: st.lastRead?.s === n ? st.lastRead : { s: n, a: 1 },
      stats: { ...st.stats, surahsOpened: st.stats.surahsOpened.includes(n) ? st.stats.surahsOpened : [...st.stats.surahsOpened, n] },
    }));
  }, [n]);

  useEffect(() => {
    if (!q.data) return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: "center" });
  }, [q.data]);

  const play = (i: number) => q.data && p.playQueue(q.data.map((a) => ({ s: n, a: a.n, url: a.audio })), i);
  const track = p.queue[p.index];
  const current = track?.s === n ? track.a : null;
  const autoAdvance = useStore((x) => x.autoAdvance);

  return (
    <div>
      <header className="bg-hero-premium relative m-3 overflow-hidden rounded-3xl text-primary-foreground shadow-soft">
        <div className="pattern absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative px-6 py-8 text-center">
          <div className="flex items-center justify-between">
            {n > 1 ? <Link to="/surah/$id" params={{ id: String(n - 1) }} aria-label={t("prev")} className="grid h-9 w-9 place-items-center rounded-full bg-foreground/10 transition-colors hover:bg-foreground/20"><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></Link> : <span className="h-9 w-9" />}
            <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">{t("surah")} {num(n)}</span>
            {n < 114 ? <Link to="/surah/$id" params={{ id: String(n + 1) }} aria-label={t("next")} className="grid h-9 w-9 place-items-center rounded-full bg-foreground/10 transition-colors hover:bg-foreground/20"><ChevronRight className="h-5 w-5 rtl:rotate-180" /></Link> : <span className="h-9 w-9" />}
          </div>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-foreground/10 py-1.5 pe-4 ps-1.5 backdrop-blur-sm">
            <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-gold/70">
              {portrait ? <img src={portrait} alt="" width={40} height={40} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center bg-accent text-sm font-semibold text-accent-foreground">{reciterLabel.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>}
            </span>
            <span className="text-sm font-medium">{reciterLabel}</span>
            {current !== null && p.playing && <span className="flex items-end gap-0.5 text-gold" aria-label={t("nowPlaying")}><span className="eq-bar" /><span className="eq-bar" style={{ animationDelay: "150ms" }} /><span className="eq-bar" style={{ animationDelay: "300ms" }} /></span>}
          </div>

          <p dir="rtl" className="font-quran mt-5 text-4xl text-gold drop-shadow-sm">{s.ar}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{s.tr}</h1>
          <p className="mt-1 text-sm text-foreground/80">{lang === "en" && `${s.en} · `}{num(s.ayahs)} {t("ayahs")} · {t(s.type === "Meccan" ? "meccan" : "medinan")}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => (current !== null ? p.toggle() : play(0))} disabled={!q.data && current === null} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-lg transition-transform hover:scale-[1.03] disabled:opacity-50">
              {current !== null && p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {t("playSurah")}
            </button>
            <button onClick={() => void p.playRandomSurah()} className="inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-foreground/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-foreground/20">
              <Shuffle className="h-4 w-4" /> {t("surpriseMe")}
            </button>
          </div>
        </div>
      </header>

      <section className="space-y-3 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SurahActions n={n} favorite={favorite} saved={saved} busy={busy} />
          <Button variant="outline" disabled={n === 114} onClick={() => p.playSurah(n + 1)}><ChevronRight className="rtl:rotate-180" />{t("nextSurah")}</Button>
        </div>
        <details>
          <summary className="cursor-pointer font-medium text-primary">{t("reciter")}</summary>
          <div className="pt-3"><ReciterPicker /></div>
        </details>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>{t("autoAdvance")}</span><input type="checkbox" checked={autoAdvance} onChange={(e) => setState(() => ({ autoAdvance: e.target.checked }))} className="h-5 w-5 accent-primary" />
        </label>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">{t("speed")}<select aria-label={t("speed")} value={p.speed} onChange={(e) => p.setSpeed(Number(e.target.value))} className="rounded-md border bg-card p-2">{[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => <option key={v} value={v}>{num(v)}×</option>)}</select></label>
          <label className="flex items-center gap-2">{t("repeat")}<select aria-label={t("repeat")} value={p.repeat} onChange={(e) => p.setRepeat(e.target.value as "off" | "ayah" | "surah")} className="rounded-md border bg-card p-2">{(["off", "ayah", "surah"] as const).map((r) => <option key={r} value={r}>{t(r === "off" ? "repeatOff" : r === "ayah" ? "repeatAyah" : "repeatSurah")}</option>)}</select></label>
        </div>
      </section>

      {n !== 1 && n !== 9 && <p dir="rtl" className="font-quran py-4 text-center text-3xl text-primary">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>}

      {q.isPending && <p className="p-10 text-center text-muted-foreground">{t("loading")}</p>}
      {q.isError && (
        <div className="p-10 text-center">
          <p className="text-muted-foreground">{t("error")}</p>
          <button onClick={() => q.refetch()} className="mt-3 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">{t("retry")}</button>
        </div>
      )}
      <div className="divide-y px-3">
        {q.data?.map((a, i) => (
          <AyahCard key={a.n} s={n} a={a} showTr={showTr} active={current === a.n} playing={current === a.n && p.playing}
            onPlay={() => (current === a.n ? p.toggle() : play(i))} />
        ))}
      </div>
    </div>
  );
}

function stripBasmala(s: number, a: Ayah) {
  // The Tanzil text prefixes ayah 1 with the basmala for surahs other than 1 and 9; it is shown separately above.
  if (s === 1 || s === 9 || a.n !== 1) return a.ar;
  const words = a.ar.replace(/^\uFEFF/, "").split(" ");
  return words[0]?.startsWith("بِس") && words.length > 4 ? words.slice(4).join(" ") : a.ar;
}

function AyahCard({ s, a, showTr, active, playing, onPlay }: { s: number; a: Ayah; showTr: boolean; active: boolean; playing: boolean; onPlay: () => void }) {
  const { t, num } = useT();
  const key = `${s}:${a.n}`;
  const fav = useStore((x) => x.favorites.includes(key));
  const bm = useStore((x) => x.bookmarks.includes(key));
  const size = useStore((x) => x.fontSize);
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    const io = new IntersectionObserver((entries) => { const e = entries[0]; if (!e) return;
      if (e.isIntersecting) { setSeen(true); setState((st) => (st.lastRead?.s === s && st.lastRead.a >= a.n ? {} : { lastRead: { s, a: a.n } })); }
    }, { threshold: 0.8 });
    io.observe(el); return () => io.disconnect();
  }, [s, a.n, seen]);
  useEffect(() => { if (active) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [active]);

  const text = `${a.ar}\n${a.tr ?? ""}\n— ${surah(s).tr} ${s}:${a.n}`;
  const btn = "rounded-full p-2 transition-colors hover:bg-muted";
  const off = "text-muted-foreground";
  return (
    <article ref={ref} id={`a${a.n}`} className={`scroll-mt-24 rounded-2xl px-3 py-6 transition-colors ${active ? "bg-accent/60" : ""}`}>
      <div className="mb-4 flex items-center gap-1">
        <span className="me-auto rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{num(s)}:{num(a.n)}</span>
        <button aria-label={playing ? t("pause") : t("play")} onClick={onPlay} className={`${btn} ${active ? "text-primary" : off}`}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button aria-label={t("favorite")} aria-pressed={fav} onClick={() => setState((st) => ({ favorites: toggleIn(st.favorites, key) }))} className={`${btn} ${fav ? "text-favorite" : off}`}>
          <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
        </button>
        <button aria-label={t("bookmark")} aria-pressed={bm} onClick={() => setState((st) => ({ bookmarks: toggleIn(st.bookmarks, key) }))} className={`${btn} ${bm ? "text-gold" : off}`}>
          <Bookmark className="h-4 w-4" fill={bm ? "currentColor" : "none"} />
        </button>
        <button aria-label={t("copy")} onClick={() => navigator.clipboard.writeText(text).then(() => toast.success(t("copied")))} className={`${btn} ${off}`}><Copy className="h-4 w-4" /></button>
        <button aria-label={t("share")} onClick={() => (navigator.share ? navigator.share({ text }).catch(() => {}) : navigator.clipboard.writeText(text).then(() => toast.success(t("copied"))))} className={`${btn} ${off}`}><Share2 className="h-4 w-4" /></button>
      </div>
      <p dir="rtl" lang="ar" className="font-quran text-right leading-[2.2]" style={{ fontSize: size }}>
        {stripBasmala(s, a)} <span className="text-gold">﴿{a.n.toLocaleString("ar-EG")}﴾</span>
      </p>
      {showTr && a.tr && <p className="mt-4 leading-relaxed text-muted-foreground">{a.tr}</p>}
    </article>
  );
}
