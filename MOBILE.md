# CoranProFree — Android & iOS (Capacitor 8)

- App ID: `com.coranprofree.app` · Nom: `CoranProFree` · Version 1.0.0 (Android versionCode 1, iOS build 1)
- Le site web est inchangé (`vite.config.ts`). L'app mobile embarque un build statique séparé (`vite.mobile.config.ts` → `dist-mobile/`).
- En natif uniquement, le relais audio utilise `VITE_PUBLIC_API_ORIGIN` (`.env.mobile`, URL publique non secrète). Sur le web, URLs relatives.
- Le site doit être **publié** : l'app télécharge l'audio via `https://coran-pro-setup.lovable.app/api/public/quran-audio` (CORS limité à `capacitor://localhost` et `https://localhost`).
- Permissions : Android `INTERNET` uniquement ; iOS aucune.

## Prérequis
Node 22+, bun, Android Studio (JDK 21, SDK 36), Xcode 16+ sur Mac (iOS 15+).

## Commandes
```bash
bun install                      # 1. installer
bun run build:mobile             # 2. build web mobile + contrôle URLs/secrets
bunx cap sync                    # 3. synchroniser Android/iOS  (ou: bun run cap:sync)
bunx cap open android            # 4. Android Studio
bunx cap open ios                # 5. Xcode
cd android && ./gradlew assembleDebug     # 6. APK de test  → app/build/outputs/apk/debug/
cd android && ./gradlew bundleRelease     # 7. AAB production → app/build/outputs/bundle/release/
# 8. iOS : Xcode → schéma App → Any iOS Device → Product > Archive → Distribute App
bun run test && bunx tsgo --noEmit        # 9. tests
bun run cap:assets               # régénérer icônes/splash depuis resources/
```

## Signature Android
```bash
keytool -genkey -v -keystore coranprofree-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias coranprofree
```
Créer `android/keystore.properties` (jamais commité) :
```
storeFile=/chemin/coranprofree-release.jks
storePassword=...
keyAlias=coranprofree
keyPassword=...
```
Garde le keystore en lieu sûr (ou utilise Play App Signing) : sans lui, aucune mise à jour possible.

## Versions (à chaque mise à jour)
- `package.json` version + Android `versionName` (`android/app/build.gradle`) + iOS `MARKETING_VERSION` (Xcode) : 1.0.0 → 1.0.1 / 1.1.0.
- Android `versionCode` : +1 à chaque envoi (2, 3, …). iOS `CURRENT_PROJECT_VERSION` : +1 à chaque archive.

## Icônes / splash
Sources dans `resources/` (icon-only.png 1024², icon-foreground/background.png, splash.png 2732²). Remplace-les puis `bun run cap:assets`.

## Audio en arrière-plan (iOS)

`UIBackgroundModes` = `audio` est activé dans `ios/App/App/Info.plist` : la lecture continue écran verrouillé ou app en arrière-plan, avec les commandes de lecture sur l'écran verrouillé (Media Session). À déclarer comme tel dans App Store Connect si demandé.

## Publication
**Google Play** : compte développeur (25 $) → créer l'app → fiche (captures, description, icône 512, image 1024×500) → Règles de confidentialité (URL) → Sécurité des données (aucune donnée collectée) → classification du contenu → envoyer l'AAB en test interne → production.

**App Store** : Apple Developer (99 $/an) → App Store Connect : nouvelle app, Bundle ID `com.coranprofree.app` → Xcode : Team + signature automatique → Archive → Upload → TestFlight → fiche (captures 6.7"/6.5"/iPad, confidentialité « aucune donnée collectée ») → soumettre à l'examen.
