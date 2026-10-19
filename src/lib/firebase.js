import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Without these four values the site still works: it shows the sample
// content from src/data/defaults.js and the admin area explains what is missing.
export const isConfigured = Boolean(
  config.apiKey && config.projectId && config.appId && config.authDomain
);

export const app = isConfigured ? initializeApp(config) : null;

export const db = app ? getFirestore(app) : null;
