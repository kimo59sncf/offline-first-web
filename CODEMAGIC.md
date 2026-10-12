# CoranProFree — iOS via Codemagic (depuis Windows)

Projet Xcode : `ios/App/App.xcodeproj` (Capacitor 8 + Swift Package Manager : pas de `.xcworkspace`, pas de CocoaPods). Scheme partagé : `App`. Bundle ID : `com.coranprofree.app`. Workflow : `ios-appstore` dans `codemagic.yaml`, déclenché par un push sur la branche `Mobile`.

## 1. Apple
1. Compte Apple Developer actif (99 $/an).
2. developer.apple.com → Identifiers → créer l'App ID `com.coranprofree.app` (aucune capacité spéciale ; l'audio arrière-plan n'en demande pas).
3. App Store Connect → Mes apps → **+** → Nouvelle app, Bundle ID `com.coranprofree.app`, nom CoranProFree. Noter l'**Apple ID** numérique de l'app (Informations sur l'app).
4. App Store Connect → Utilisateurs et accès → Intégrations → Clés API App Store Connect → générer une clé rôle **App Manager**. Noter Issuer ID, Key ID, télécharger le `.p8` (une seule fois possible).

## 2. Codemagic
1. Se connecter sur codemagic.io avec GitHub, ajouter le dépôt, choisir « codemagic.yaml ».
2. Team settings → Integrations → Developer Portal → **Connect** : nom exact `CoranProFree ASC`, Issuer ID, Key ID, fichier `.p8`.
3. App settings → Environment variables : `APP_STORE_APPLE_ID` = Apple ID numérique de l'app (non secret).
4. Certificat : laisser Codemagic le créer (`--create`) ou, dans Code signing identities, en importer/générer un de type Apple Distribution. Ne jamais commiter de `.p12` / `.p8`.
5. Lancer un build sur la branche `Mobile` → l'IPA est envoyée sur TestFlight.

## 3. Avant soumission
- Captures 6.9"/6.7" et iPad 13", description, mots-clés, URL support, URL confidentialité `https://coran-pro-setup.lovable.app/privacy`.
- Confidentialité : « aucune donnée collectée ».
- Mode audio arrière-plan : justifier « lecture continue de récitations audio ».
- Chiffrement : `ITSAppUsesNonExemptEncryption = false` déjà déclaré (HTTPS standard uniquement).
- Le site doit être publié (relais audio).
