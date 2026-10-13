import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Headphones, ListMusic, Play, Shuffle } from "lucide-react";
import { useT } from "@/lib/i18n";
import { favoriteSurahsOf, setState, useStore } from "@/lib/store";
import { useDownloadedSurahs } from "@/lib/downloads";
import { RECITERS, SURAHS, surah, surahName } from "@/lib/quran";
import { SurahRow } from "@/components/AppShell";
import { ReciterPicker } from "@/components/LibraryControls";
import { usePlayer } from "@/lib/player-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoranProFree — Lire et écouter le Coran gratuitement" },
      { name: "description", content: "Application Coran gratuite et respectueuse de la vie privée : 114 sourates, récitations audio, recherche et favoris." },
      { property: "og:title", content: "CoranProFree" },
      { property: "og:description", content: "Lire et écouter le Coran, gratuitement et sans pistage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, num, lang } = useT();
  const last = useStore((s) => s.lastRead);
  const listen = useStore((s) => s.lastListen);
  const opened = useStore((s) => s.stats.surahsOpened.length);
  const reciter = useStore((s) => s.reciter);
  const player = usePlayer();
  const favs = useStore((s) => favoriteSurahsOf(s, reciter));
  const playlist = useStore((s) => s.playlist);
  const playlistReciters = useStore((s) => s.playlistReciters);
  const shuffle = useStore((s) => s.playlistShuffle);
  const downloads = useDownloadedSurahs(lang, reciter);
  const [filter, setFilter] = useState<"all" | "favorites" | "offline">("all");
  const listRef = useRef<HTMLDivElement>(null);
  const r = RECITERS.find((x) => x.id === reciter);
  const reciterName = r ? (lang === "ar" ? r.ar : r.name) : "";
  const list = filter === "all" ? SURAHS.map((s) => s.n) : [...new Set(filter === "favorites" ? favs : downloads)].sort((a, b) => a - b);
  const [date, setDate] = useState<{ g: string; h: string; morning: boolean } | null>(null);
  useEffect(() => {
    const d = new Date();
    const loc = lang === "ar" ? "ar" : lang;
    setDate({
      g: d.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" }),
      h: d.toLocaleDateString(`${loc}-u-ca-islamic`, { day: "numeric", month: "long", year: "numeric" }),
      morning: d.getHours() < 17,
    });
  }, [lang]);

  return (
    <div>
      <section className="bg-hero relative m-3 overflow-hidden rounded-3xl px-6 pb-8 pt-10 text-primary-foreground">
        <p className="text-xs uppercase tracking-widest opacity-75">{date ? `${date.g} · ${date.h}` : "\u00a0"}</p>
        <h1 className="mt-3 text-4xl font-semibold">{date ? t(date.morning ? "morning" : "evening") : "\u00a0"}</h1>
        <p className="mt-1 opacity-80">{t("tagline")}</p>
        <p dir="rtl" className="font-quran mt-6 text-3xl text-gold">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => void player.playRandomSurah()} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-lg transition-transform hover:scale-[1.03]">
            <Shuffle className="h-4 w-4" /> {t("surpriseMe")}
          </button>
          <Link to="/surahs" className="inline-flex items-center gap-2 rounded-full bg-foreground/15 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-foreground/25">
            <BookOpen className="h-4 w-4" /> {t("surahs")}
          </Link>
        </div>
      </section>

      <div className="grid gap-3 px-3 sm:grid-cols-2">
        <ContinueCard icon={<BookOpen className="h-5 w-5" />} label={last ? t("continueReading") : t("start")} pos={last ?? { s: 1, a: 1 }} />
        {listen && <ContinueCard icon={<Headphones className="h-5 w-5" />} label={t("continueListening")} pos={listen} />}
      </div>

      {opened > 0 && (
        <p className="px-6 pt-4 text-sm text-muted-foreground">
          {num(opened)} / {num(114)} {t("opened")}
        </p>
      )}

      <section className="mx-3 mt-6 overflow-hidden rounded-3xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 px-5 pb-3 pt-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary"><ListMusic className="h-5 w-5" /></span>
          <h2 className="flex-1 text-2xl font-semibold">{t("myPlaylist")}</h2>
          <button aria-label={t("shufflePlaylist")} title={t("shufflePlaylist")} aria-pressed={shuffle} onClick={() => setState((s) => ({ playlistShuffle: !s.playlistShuffle }))}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${shuffle ? "border-gold text-gold" : "text-muted-foreground"}`}><Shuffle className="h-4 w-4" /></button>
          <button disabled={!playlist.length} onClick={() => player.playPlaylist()}
            aria-label={t("playPlaylist")} className="grid h-11 w-11 place-items-center rounded-full bg-gold text-gold-foreground shadow-gold transition-transform active:scale-95 disabled:opacity-40">
            <Play className="h-5 w-5 translate-x-px" fill="currentColor" />
          </button>
        </div>
        {playlist.length ? (
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-5">
            {playlist.map((n, i) => (
              <button key={n} onClick={() => void player.playSurah(n, playlistReciters[n] ?? reciter)} className="bg-hero relative flex h-32 w-40 shrink-0 flex-col justify-end rounded-2xl border border-gold/20 p-3 text-start transition-transform active:scale-95">
                <span className="absolute start-3 top-3 text-xs font-semibold text-gold">{num(i + 1)}</span>
                <span dir="rtl" className="font-quran absolute end-3 top-2 text-lg text-gold/80">{surah(n).ar.replace("سُورَةُ ", "")}</span>
                <span className="truncate font-semibold">{surahName(surah(n), lang)}</span>
                <span className="truncate text-xs text-muted-foreground">{(() => { const pr = RECITERS.find((x) => x.id === (playlistReciters[n] ?? reciter)); return pr ? (lang === "ar" ? pr.ar : pr.name) : ""; })()}</span>
              </button>
            ))}
          </div>
        ) : <p className="px-5 pb-5 text-sm text-muted-foreground">{t("emptyPlaylist")}</p>}
      </section>

      <h2 className="px-6 pb-2 pt-8 text-2xl font-semibold">{t("reciters")}</h2>
      <div className="px-5 pb-2"><ReciterPicker onSelect={() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} /></div>

      <div ref={listRef} className="scroll-mt-4 px-6 pb-2 pt-6">
        <h2 className="text-2xl font-semibold">{t("surahsOf")} <span className="text-gold">{reciterName}</span></h2>
        <div role="tablist" className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {(["all", "favorites", "offline"] as const).map((k) => (
            <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${filter === k ? "border-gold bg-gold text-gold-foreground" : "bg-card text-muted-foreground"}`}>
              {t(k === "offline" ? "offlineAvailable" : k)} · {num(k === "all" ? 114 : k === "favorites" ? favs.length : downloads.length)}
            </button>
          ))}
        </div>
      </div>
      <div className="px-1">
        {list.map((n) => <SurahRow key={n} n={n} />)}
        {!list.length && <p className="p-8 text-center text-muted-foreground">{t("noResults")}</p>}
      </div>
    </div>
  );
}

function ContinueCard({ icon, label, pos }: { icon: React.ReactNode; label: string; pos: { s: number; a: number } }) {
  const { t, num, lang } = useT();
  const s = surah(pos.s);
  return (
    <Link to="/surah/$id" params={{ id: String(pos.s) }} hash={`a${pos.a}`} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">{icon}</span>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-semibold">{surahName(s, lang)} · {t("ayah")} {num(pos.a)}</div>
      </div>
    </Link>
  );
}
