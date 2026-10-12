import type { CapacitorConfig } from "@capacitor/cli";

// Production config: the app runs from the embedded web build (dist-mobile), never a dev server.
const config: CapacitorConfig = {
  appId: "com.coranprofree.app",
  appName: "CoranProFree",
  webDir: "dist-mobile",
  backgroundColor: "#F7F3EA",
  android: { allowMixedContent: false },
  ios: { contentInset: "never", backgroundColor: "#F7F3EA" },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, launchAutoHide: false, backgroundColor: "#3E6B58", showSpinner: false },
    StatusBar: { style: "DARK", backgroundColor: "#3E6B58", overlaysWebView: false },
  },
};

export default config;
