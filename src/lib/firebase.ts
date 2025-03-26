
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration
// In development, we use a placeholder API key
// In production, we use the real API key from environment variables
const firebaseConfig = {
  apiKey: process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('lovableproject.com')
    ? "mock-api-key-for-development" 
    : (import.meta.env.VITE_FIREBASE_API_KEY || ""),
  authDomain: "chiqui-platform.firebaseapp.com",
  projectId: "chiqui-platform",
  storageBucket: "chiqui-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Determine if we're in a development-like environment (includes Lovable preview links)
const isDevelopmentLike = process.env.NODE_ENV === 'development' || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

// For debugging purposes
console.log(`Firebase initialization - Environment: ${process.env.NODE_ENV}, Hostname: ${window.location.hostname}`);
console.log(`Firebase initialization - Using development mode: ${isDevelopmentLike}`);

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Create a mock auth object for development
const createMockAuth = () => {
  console.log("Using mock Firebase auth in development mode");
  // Return a mock auth object with the methods needed by the application
  return {
    onAuthStateChanged: (callback) => {
      // Immediately invoke callback with null (not authenticated)
      callback(null);
      // Return unsubscribe function
      return () => {};
    },
    signInWithEmailAndPassword: async () => {
      console.log("Mock sign in");
      return { user: null };
    },
    createUserWithEmailAndPassword: async () => {
      console.log("Mock create user");
      return { user: null };
    },
    signOut: async () => {
      console.log("Mock sign out");
    },
    sendPasswordResetEmail: async () => {
      console.log("Mock password reset");
    },
    currentUser: null,
    settings: {} // Add mock settings object to prevent "Cannot read properties of undefined (reading 'settings')" error
  };
};

// Only initialize Firebase if API key is available or if we're in development mode
try {
  console.log("Attempting to initialize Firebase");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Ensure the auth.settings exists to prevent the error
  if (!auth.settings) {
    auth.settings = {};
  }
  db = getFirestore(app);
  storage = getStorage(app);

  // For development or preview environments, we'll use mock authentication if emulators aren't available
  if (isDevelopmentLike) {
    console.log("Development-like environment detected, setting up mock auth if needed");
    try {
      // Try to connect to emulators if they are running
      connectAuthEmulator(auth, "http://localhost:9099");
      console.log("Connected to Auth emulator");
      // Uncomment when you set up the corresponding emulators
      // connectFirestoreEmulator(db, 'localhost', 8080);
      // connectStorageEmulator(storage, 'localhost', 9199);
    } catch (e) {
      console.log("Error connecting to emulators:", e);
      console.log("Using mock authentication in development mode");
      // Create and use mock auth if emulator connection fails
      auth = createMockAuth();
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create mock instances for development if initialization fails
  if (isDevelopmentLike) {
    console.log("Using mock Firebase services in development mode");
    // Create mock auth object that implements needed methods
    auth = createMockAuth();
    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => {}
        }),
        where: () => ({
          get: async () => ({ docs: [] })
        }),
        add: async () => ({})
      })
    };
    storage = {
      ref: () => ({
        put: async () => {},
        getDownloadURL: async () => "https://placeholder.com/image.jpg"
      })
    };
  } else {
    // In production, we should log this error and provide fallbacks
    console.error("Firebase initialization failed in production. Some features may not work.");
    // Create minimal mock to prevent crashes
    auth = createMockAuth();
    db = {} as any;
    storage = {} as any;
  }
}

// Gemini API key - this would normally be secured in a backend environment
// For development purposes, we use a mock key
export const GEMINI_API_KEY = isDevelopmentLike
  ? "GEMINI_MOCK_KEY_FOR_DEVELOPMENT" 
  : (import.meta.env.VITE_GEMINI_API_KEY || ""); 

// Gemini API endpoint - using the latest Gemini 2.0 pro vision version
export const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

export { auth, db, storage, isDevelopmentLike };
