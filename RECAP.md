# CoranProFree — Récapitulatif du travail effectué

*Date : 10 octobre 2026*

## 1. Import du projet
- Récupération du dépôt GitHub « pixel-perfect-ui » et migration complète du code dans ce projet Lovable.
- Application Coran complète : les 114 sourates, lecteur audio avec récitateurs, recherche, favoris, mode hors-ligne (PWA), interface trilingue FR/EN/AR (arabe en RTL).
- Lovable Cloud activé pour faire tourner l'application.
- Vérifié : démarrage sans erreur et les 25 tests passent.

## 2. Migration mobile (Android + iOS avec Capacitor 8)
- **Identifiant d'app** : `com.coranprofree.app` · Nom : `CoranProFree` · Version 1.0.0 (build 1).
- **Build mobile séparé** : `vite.mobile.config.ts` → `dist-mobile/` (SPA statique embarquée dans les apps). Le site web reste inchangé (`vite.config.ts`, SSR).
- **Relais audio** : en natif uniquement, les téléchargements audio passent par `https://coran-pro-setup.lovable.app/api/public/quran-audio` (variable `VITE_PUBLIC_API_ORIGIN`, fichier `.env.mobile`). CORS limité aux origines Capacitor (`capacitor://localhost`, `https://localhost`).
- **Pont natif** (`src/lib/native.ts`, chargé seulement en natif) : bouton retour Android, couleur de la barre d'état, masquage du splash, liens externes ouverts dans le navigateur système.
- **Configuration** : `capacitor.config.ts` (aucun serveur de développement embarqué), zones sûres (encoche) gérées en CSS.
- **Icônes et splash** : générés depuis l'icône de l'app vers `android/` et `ios/` via `resources/` (remplaçables puis `bun run cap:assets`).
- **Projets natifs générés** : `android/` (minSdk 23, targetSdk 35) et `ios/` (iOS 15+), version 1.0.0, aucune permission native superflue (Android : `INTERNET` uniquement ; iOS : aucune).
- **Contrôle de build** : `scripts/check-mobile-build.mjs` échoue si le build embarqué contient une URL locale ou un secret.
- **Signature Android** : support d'un keystore non commité via `android/keystore.properties` (voir `MOBILE.md`).

## 3. Documentation
- `MOBILE.md` : toutes les commandes (bun), création de la clé de signature Android, APK/AAB, archive Xcode → TestFlight, publication sur les stores, incrément des versions.

## 4. Ce qu'il reste à faire (de ton côté)
1. Publier le site (le relais audio de l'app mobile en dépend).
2. Créer la clé de signature Android (`keytool`, commande dans `MOBILE.md`).
3. Compiler l'APK/AAB dans Android Studio et l'archive iOS dans Xcode sur un Mac.
4. Comptes : Google Play (25 $) et Apple Developer (99 $/an).
5. Exporter le projet vers GitHub pour le récupérer en local (menu + → GitHub).
