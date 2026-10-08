import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart } from "lucide-react";
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
  const items = [...favs.map((k) => ({ k, fav: true })), ...bms.filter((k) => !favs.includes(k)).map((k) => ({ k, fav: false }))]
    .sort((a, b) => { const [as = 0, aa = 0] = a.k.split(":").map(Number); const [bs = 0, ba = 0] = b.k.split(":").map(Number); return as - bs || aa - ba; });
  return (
    <div>
      <PageHeader title={t("favorites")} />
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
