import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurahRow } from "@/components/AppShell";
import { ReciterPicker } from "@/components/LibraryControls";
import { useDownloadedSurahs } from "@/lib/downloads";
import { usePlayer } from "@/lib/player";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { SURAHS, surah } from "@/lib/quran";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
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
  const favoriteSurahs = useStore((s) => s.favoriteSurahs);
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
        <h2 className="px-2 pb-2 text-xl font-semibold">{t("favoriteSurahs")}</h2>
        {favoriteSurahs.map((n) => <SurahRow n={n} key={n} />)}
        {!favoriteSurahs.length && <p className="px-2 text-sm text-muted-foreground">{t("noResults")}</p>}
      </section>
      <section className="mb-6 px-3">
        <div className="flex items-center justify-between gap-2 px-2 pb-2"><h2 className="text-xl font-semibold">{t("playlist")}</h2><Button variant="outline" disabled={!playlist.length} onClick={() => { const n = playlist[0]; if (n) void player.playSurah(n); }}><Play />{t("playPlaylist")}</Button></div>
        {playlist.map((n) => <SurahRow n={n} key={n} />)}
        {!playlist.length && <p className="px-2 text-sm text-muted-foreground">{t("noResults")}</p>}
      </section>
      <section className="mb-6 px-3">
        <h2 className="px-2 pb-2 text-xl font-semibold">{t("downloads")}</h2>
        {downloads.map((n) => <SurahRow n={n} key={n} />)}
        {!downloads.length && <p className="px-2 text-sm text-muted-foreground">{t("noResults")}</p>}
      </section>
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
