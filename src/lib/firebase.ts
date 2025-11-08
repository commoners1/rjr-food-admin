
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-7720194480-860f6",
  "appId": "1:46571814147:web:9cf5da19106bf3e7f87d36",
  "storageBucket": "studio-7720194480-860f6.firebasestorage.app",
  "apiKey": "AIzaSyChWW5G32AtuVKPk9-hgRpRRtV3mzmOkKY",
  "authDomain": "studio-7720194480-860f6.firebaseapp.com",
  "messagingSenderId": "46571814147"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
