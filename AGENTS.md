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
