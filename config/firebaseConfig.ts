// config/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  type Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from 'expo-constants';

console.log("[firebaseConfig] Starting Firebase initialization...");

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
};

console.log("[firebaseConfig] firebaseConfig:", firebaseConfig);

// 1. Initialize or retrieve existing app
let app;
if (!getApps().length) {
  console.log("[firebaseConfig] Initializing new Firebase app...");
  app = initializeApp(firebaseConfig);
} else {
  console.log("[firebaseConfig] Using existing Firebase app...");
  app = getApp();
}

// 2. Initialize or retrieve existing Auth
let auth: Auth;
try {
  console.log("[firebaseConfig] Initializing Auth...");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If Auth was already initialized, fallback to getAuth()
  console.log("[firebaseConfig] Auth already initialized, using existing Auth.");
  auth = getAuth(app);
}

// 3. Initialize Firestore & Storage (these usually don't cause duplicates)
const db = getFirestore(app);
const storage = getStorage(app);

console.log("[firebaseConfig] Firebase app, Auth, Firestore, and Storage are ready.");

// Collection references
export const collections = {
  users: collection(db, 'users'),
  goals: (userId: string) => collection(db, 'users', userId, 'goals'),
  streaks: (userId: string) => collection(db, 'users', userId, 'streaks'),
  notifications: (userId: string) => collection(db, 'users', userId, 'notifications'),
  partners: (userId: string) => collection(db, 'users', userId, 'partners'),
};

export { app, auth, db, storage };
