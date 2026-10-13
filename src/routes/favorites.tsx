import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, CloudCheck, Heart, ListMusic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurahRow } from "@/components/AppShell";
import { ReciterPicker } from "@/components/LibraryControls";
import { useDownloadedSurahs } from "@/lib/downloads";
import { usePlayer } from "@/lib/player-context";
import { useT } from "@/lib/i18n";
import { favoriteSurahsOf, useStore } from "@/lib/store";
import { surah } from "@/lib/quran";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Mes favoris — CoranProFree" },
      { name: "description", content: "Vos versets favoris et marque-pages, enregistrés sur votre appareil." },
      { property: "og:title", content: "Mes favoris — CoranProFree" },
      { property: "og:description", content: "Vos versets favoris et marque-pages." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { t, num } = useT();
  const favs = useStore((s) => s.favorites);
  const bms = useStore((s) => s.bookmarks);
  const favoriteSurahs = [...new Set(useStore((s) => favoriteSurahsOf(s, s.reciter)))].sort((a, b) => a - b);
  const playlist = useStore((s) => s.playlist);
  const favoriteReciters = useStore((s) => s.favoriteReciters);
  const { lang } = useT();
  const reciter = useStore((s) => s.reciter);
  const downloads = useDownloadedSurahs(lang, reciter);
  const player = usePlayer();
  const items = [...favs.map((k) => ({ k, fav: true })), ...bms.filter((k) => !favs.includes(k)).map((k) => ({ k, fav: false }))]
    .sort((a, b) => { const [as = 0, aa = 0] = a.k.split(":").map(Number); const [bs = 0, ba = 0] = b.k.split(":").map(Number); return as - bs || aa - ba; });
  return (
    <div>
      <PageHeader title={t("favorites")} />
      <section className="mb-6 px-3">
        <h2 className="px-2 pb-2 text-xl font-semibold">{t("reciter")}</h2>
        <ReciterPicker />
      </section>
      <Section icon={<Heart className="h-5 w-5 text-favorite" fill="currentColor" />} title={t("favoriteSurahs")} count={num(favoriteSurahs.length)} list={favoriteSurahs} empty={t("noResults")} />
      <Section icon={<CloudCheck className="h-5 w-5 text-success" fill="currentColor" />} title={t("offlineAvailable")} count={num(downloads.length)} list={downloads} empty={t("noResults")} />
      <Section icon={<ListMusic className="h-5 w-5 text-gold" />} title={t("playlist")} count={num(playlist.length)} list={playlist} empty={t("emptyPlaylist")}
        action={<Button variant="outline" size="sm" disabled={!playlist.length} onClick={() => { const n = playlist[0]; if (n) void player.playSurah(n); }}><Play />{t("playPlaylist")}</Button>} />
      <section className="mb-6 px-5"><h2 className="pb-3 text-xl font-semibold">{t("favoriteReciters")}</h2><ReciterPicker favoritesOnly />{!favoriteReciters.length && <p className="text-sm text-muted-foreground">{t("noResults")}</p>}</section>
      <h2 className="px-5 pb-2 text-xl font-semibold">{t("ayahs")}</h2>
      {!items.length ? (
        <div className="mx-5 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          <Heart className="mx-auto mb-3 h-8 w-8" />{t("emptyFav")}
        </div>
      ) : (
        <ul className="px-3">
          {items.map(({ k }) => {
            const [s = 1, a = 1] = k.split(":").map(Number);
            return (
              <li key={k}>
                <Link to="/surah/$id" params={{ id: String(s) }} hash={`a${a}`} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-card">
                  <span className="flex-1 font-semibold">{surah(s).tr} <span className="font-normal text-muted-foreground">· {t("ayah")} {num(a)}</span></span>
                  {favs.includes(k) && <Heart className="h-4 w-4 text-favorite" fill="currentColor" aria-label={t("favorite")} />}
                  {bms.includes(k) && <Bookmark className="h-4 w-4 text-gold" fill="currentColor" aria-label={t("bookmark")} />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Section({ icon, title, count, list, empty, action }: { icon: React.ReactNode; title: string; count: string; list: number[]; empty: string; action?: React.ReactNode }) {
  return (
    <section className="mx-3 mb-5 overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        {icon}<h2 className="flex-1 text-xl font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{count}</span>{action}
      </div>
      {list.map((n) => <SurahRow n={n} key={n} />)}
      {!list.length && <p className="px-4 py-4 text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}
