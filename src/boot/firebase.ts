import { defineBoot } from "#q-app";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore
} from "firebase/firestore";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

/**
 * Quasar only exposes QCLI_* env vars to client code; VITE_* is kept as a
 * fallback so existing .env files keep working if the prefix ever changes.
 */
const env = (key: string): string =>
  import.meta.env[`QCLI_${key}`] ?? import.meta.env[`VITE_${key}`] ?? "";

/**
 * Emulator mode is enabled explicitly via QCLI_USE_FIREBASE_EMULATOR=true
 * or auto-detected when the app is served from the Hosting emulator
 * (localhost/127.0.0.1 on port 5000).
 */
function isEmulatorMode(): boolean {
  if (env("USE_FIREBASE_EMULATOR") === "true") return true;
  return (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    window.location.port === "5000"
  );
}

export default defineBoot(() => {
  const emulator = isEmulatorMode();
  const projectId =
    env("FIREBASE_PROJECT_ID") || (emulator ? "demo-rcr-shop" : "");

  if (!projectId) {
    console.warn(
      "[firebase] QCLI_FIREBASE_PROJECT_ID is not set. " +
        "Running in mock mode (catalog + localStorage only). " +
        "Copy .env.example to .env for a real backend or run " +
        "`pnpm emulate` for the local emulator suite."
    );
    return;
  }

  app = initializeApp({
    apiKey: env("FIREBASE_API_KEY") || (emulator ? "demo-api-key" : ""),
    authDomain:
      env("FIREBASE_AUTH_DOMAIN") ||
      (emulator ? `${projectId}.firebaseapp.com` : ""),
    projectId,
    storageBucket:
      env("FIREBASE_STORAGE_BUCKET") ||
      (emulator ? `${projectId}.appspot.com` : ""),
    messagingSenderId:
      env("FIREBASE_MESSAGING_SENDER_ID") || (emulator ? "0" : ""),
    appId: env("FIREBASE_APP_ID") || (emulator ? "demo-app-id" : "")
  });

  auth = getAuth(app);
  db = getFirestore(app);

  if (emulator) {
    const host = env("EMULATOR_HOST") || "localhost";
    const authPort = env("EMULATOR_AUTH_PORT") || "9098";
    const fsPort = Number(env("EMULATOR_FIRESTORE_PORT") || 8081);
    connectAuthEmulator(auth, `http://${host}:${authPort}`, {
      disableWarnings: true
    });
    connectFirestoreEmulator(db, host, fsPort);
    console.info(
      `[firebase] Connected to local emulators (auth:${authPort}, firestore:${fsPort})`
    );
  }
});

export { app, auth, db };
