
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration
// In development, we use a placeholder API key
// In production, we use the real API key from environment variables
const firebaseConfig = {
  apiKey: process.env.NODE_ENV === 'development' 
    ? "mock-api-key-for-development" 
    : (import.meta.env.VITE_FIREBASE_API_KEY || ""),
  authDomain: "chiqui-platform.firebaseapp.com",
  projectId: "chiqui-platform",
  storageBucket: "chiqui-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Only initialize Firebase if API key is available or if we're in development mode
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // For development mode, we'll use mock authentication
  if (process.env.NODE_ENV === 'development') {
    try {
      // Try to connect to emulators if they are running
      connectAuthEmulator(auth, "http://localhost:9099");
      console.log("Connected to Auth emulator");
      // Uncomment when you set up the corresponding emulators
      // connectFirestoreEmulator(db, 'localhost', 8080);
      // connectStorageEmulator(storage, 'localhost', 9199);
    } catch (e) {
      console.log("Using mock authentication in development mode");
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create mock instances for development if initialization fails
  if (process.env.NODE_ENV === 'development') {
    console.log("Using mock Firebase services in development mode");
    // These will not actually be used, mock functions will be used instead
    auth = {} as any;
    db = {} as any;
    storage = {} as any;
  } else {
    // In production, we should log this error and provide fallbacks
    console.error("Firebase initialization failed in production. Some features may not work.");
  }
}

// Gemini API key - this would normally be secured in a backend environment
// For development purposes, we use a mock key
export const GEMINI_API_KEY = process.env.NODE_ENV === 'development' 
  ? "GEMINI_MOCK_KEY_FOR_DEVELOPMENT" 
  : (import.meta.env.VITE_GEMINI_API_KEY || ""); 

// Gemini API endpoint - using the latest Gemini 2.0 pro vision version
export const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

export { auth, db, storage };
