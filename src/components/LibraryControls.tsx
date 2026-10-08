import { CloudDownload, CloudCheck, Heart, ListPlus, ListChecks, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { setState, toggleIn, toggleSurah, useStore } from "@/lib/store";
import { downloadSurah, removeDownload, useDownload } from "@/lib/downloads";
import { RECITERS } from "@/lib/quran";

export function SurahActions({ n }: { n: number }) {
  const { t, lang } = useT();
  const reciter = useStore((s) => s.reciter);
  const favorite = useStore((s) => s.favoriteSurahs.includes(n));
  const inPlaylist = useStore((s) => s.playlist.includes(n));
  const { saved, busy } = useDownload(n, lang, reciter);
  const downloadLabel = t(busy ? "saving" : saved ? "removeDownload" : "download");
  return <div className="flex shrink-0 items-center">
    <Button size="icon" variant="ghost" title={downloadLabel} aria-label={downloadLabel} aria-pressed={saved} disabled={busy}
      className={saved ? "text-success" : "text-muted-foreground"}
      onClick={async () => { try { if (saved) await removeDownload(n, lang, reciter); else { await downloadSurah(n, lang, reciter); toast.success(t("downloadDone")); } } catch { toast.error(t("error")); } }}>
      {busy ? <LoaderCircle className="animate-spin" /> : saved ? <CloudCheck /> : <CloudDownload />}
    </Button>
    <Button size="icon" variant="ghost" title={t(favorite ? "removeFavorite" : "addFavorite")} aria-label={t(favorite ? "removeFavorite" : "addFavorite")} aria-pressed={favorite}
      className={favorite ? "text-favorite" : "text-muted-foreground"} onClick={() => setState((s) => ({ favoriteSurahs: toggleSurah(s.favoriteSurahs, n) }))}>
      <Heart fill={favorite ? "currentColor" : "none"} />
    </Button>
    <Button size="icon" variant="ghost" title={t(inPlaylist ? "removePlaylist" : "addPlaylist")} aria-label={t(inPlaylist ? "removePlaylist" : "addPlaylist")} aria-pressed={inPlaylist}
      className={inPlaylist ? "text-primary" : "text-muted-foreground"} onClick={() => setState((s) => ({ playlist: toggleSurah(s.playlist, n) }))}>
      {inPlaylist ? <ListChecks /> : <ListPlus />}
    </Button>
  </div>;
}

export function ReciterPicker({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const { t, lang } = useT();
  const selected = useStore((s) => s.reciter);
  const favorites = useStore((s) => s.favoriteReciters);
  const list = [...RECITERS].filter((r) => !favoritesOnly || favorites.includes(r.id)).sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
  return <div className="flex flex-wrap gap-2">
    {list.map((r) => {
      const favorite = favorites.includes(r.id);
      return <div key={r.id} className="flex max-w-full items-center gap-1">
        <Button variant={selected === r.id ? "default" : "outline"} aria-pressed={selected === r.id} className="h-auto whitespace-normal text-start" onClick={() => setState(() => ({ reciter: r.id }))}>{lang === "ar" ? r.ar : r.name}</Button>
        <Button variant="ghost" size="icon" aria-label={`${t(favorite ? "removeFavorite" : "addFavorite")} · ${lang === "ar" ? r.ar : r.name}`} title={t(favorite ? "removeFavorite" : "addFavorite")} aria-pressed={favorite} className={favorite ? "text-favorite" : "text-muted-foreground"} onClick={() => setState((s) => ({ favoriteReciters: toggleIn(s.favoriteReciters, r.id) }))}><Heart fill={favorite ? "currentColor" : "none"} /></Button>
      </div>;
    })}
  </div>;
}