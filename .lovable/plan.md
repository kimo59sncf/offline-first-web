# CoranProFree → Android + iOS (Capacitor)

## A. Audit (état actuel)
- TanStack Start v1 (React 19, Vite 7), rendu serveur sur Cloudflare Workers, gestionnaire **bun**.
- Routes : accueil, sourates, sourate/$id, recherche, favoris, réglages + relais audio serveur `/api/public/quran-audio`.
- Données utilisateur : localStorage (store versionné) ; audio hors-ligne : Cache API + blob URLs ; service worker désactivé hors site publié.
- Aucune authentification, aucun paiement, aucune notification, aucune permission native requise.
- Lovable Cloud activé mais non utilisé par l'app ; seule la clé publique (publishable) est dans le frontend — aucun secret exposé.

### Bloquants identifiés
1. **Pas de build statique** : l'app est rendue côté serveur ; Capacitor exige un dossier web embarqué (`webDir`).
2. **Relais audio relatif** (`/api/public/...`) : dans l'app native, il doit viser l'URL publiée HTTPS (coran-pro-setup.lovable.app) + CORS autorisant les origines Capacitor (`capacitor://localhost`, `https://localhost`).
3. Service worker : à désactiver dans l'app native (inutile, Cache API suffit).
4. Bouton retour Android, barre d'état, zones sûres (encoche) et liens externes non gérés.

## B. Modifications prévues
- **Build mobile séparé** : `vite.mobile.config.ts` produisant un SPA statique (`dist-mobile/`, shell `index.html`, prerender/SPA mode TanStack), sans toucher au build web.
- **Base API** : `VITE_PUBLIC_API_ORIGIN` utilisé uniquement en natif pour le relais audio ; ajout des en-têtes CORS restreints sur la route relais.
- **Capacitor 7 (stable)** : `@capacitor/core`, `cli`, `android`, `ios`, `app`, `status-bar`, `splash-screen`, `browser`.
- `capacitor.config.ts` : appId `com.mynichepilot.app`, appName `CoranProFree`, webDir `dist-mobile`, aucun `server.url` (pas de dépendance à un serveur de dev).
- Module `src/lib/native.ts` (chargé dans un `useEffect`) : retour Android → historique sinon minimiser l'app, couleur barre d'état, masquage splash, liens externes via navigateur système.
- CSS : `viewport-fit=cover` + `env(safe-area-inset-top)` sur l'en-tête, cibles tactiles ≥ 44px vérifiées sur toutes les pages, portrait + paysage.
- Icône + splash générés depuis l'icône actuelle via `@capacitor/assets` (sources dans `resources/`, remplaçables).
- Génération des dossiers `android/` et `ios/` ; versions 1.0.0 / build 1 ; minSdk 23, targetSdk 35 ; iOS 14+ ; orientation portrait+paysage ; aucune permission ajoutée.
- Scripts : `build:mobile`, `cap:sync`, `cap:android`, `cap:ios`.
- `MOBILE.md` : commandes exactes (bun), APK/AAB, archive Xcode, TestFlight, publication, incrément des versions.

## C. Vérifications
Tests existants, lint, typecheck, build web inchangé, build mobile, `cap sync`, absence de localhost en production, scan sécurité.

## Limites (action de ta part)
- Compilation APK/AAB et archive iOS impossibles ici (Android Studio / Xcode sur Mac requis).
- Comptes Google Play (25 $) et Apple Developer (99 $/an), keystore de signature, certificats Apple.
- Exporter le projet vers GitHub pour le récupérer en local.
- Publier le site (le relais audio de l'app mobile en dépend).
