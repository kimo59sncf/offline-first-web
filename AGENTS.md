<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Quran text, translations and audio come from api.alquran.cloud (Tanzil text); never generate or edit Quran text. Why: religious integrity and verifiable sources.
- User data (favorites, progress, settings) lives in a single versioned localStorage store (src/lib/store.ts). Why: privacy-first, local by default.
- All UI strings go through src/lib/i18n.ts (fr/en/ar, ar sets dir=rtl). Why: required trilingual + RTL support.
- Download status is derived from verified metadata and every audio file in the shared Cache API cache, never from favorites. Why: incomplete downloads and browser eviction must not display false saved states.
- Cached audio is played through revocable blob URLs with request ordering guards. Why: offline playback must work without a service worker and avoid media range-request failures or stale async playback.
- The playback continuation rule lives in a browser-safe pure module; playlist order takes precedence over numeric surah progression. Why: keep next-surah behavior consistent and independently testable.
- Keep the player context and hook in a non-component module, with the provider exporting only its component. Why: Fast Refresh must not replace the context identity independently of mounted consumers.
