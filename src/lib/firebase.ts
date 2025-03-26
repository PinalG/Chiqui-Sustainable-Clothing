
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration
// In development, we use a placeholder API key
// In production, we use the real API key from environment variables
const firebaseConfig = {
  apiKey: process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('lovable')
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
                           window.location.hostname.includes('lovable');

// For debugging purposes
console.log(`Firebase initialization - Environment: ${process.env.NODE_ENV}, Hostname: ${window.location.hostname}`);
console.log(`Firebase initialization - Using development mode: ${isDevelopmentLike}`);

// Mock user for preview mode - automatically logged in
const MOCK_AUTHENTICATED_USER = {
  uid: "preview-user-123",
  email: "consumer@example.com",
  displayName: "Preview User",
  emailVerified: true,
  isAnonymous: false,
  photoURL: null,
  providerData: [],
  metadata: {
    creationTime: Date.now().toString(),
    lastSignInTime: Date.now().toString()
  },
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => "mock-token",
  getIdTokenResult: async () => ({
    token: "mock-token",
    signInProvider: "password",
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    issuedAtTime: new Date().toISOString(),
    claims: { role: "consumer" },
    authTime: new Date().toISOString(),
  }),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  providerId: "password",
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Create a mock auth object for development/preview
const createMockAuth = () => {
  console.log("Using mock Firebase auth in development/preview mode");
  // Return a mock auth object with the methods needed by the application
  return {
    onAuthStateChanged: (callback) => {
      // For preview mode, immediately return a mock authenticated user
      if (window.location.hostname.includes('lovable')) {
        console.log("Preview mode detected - using auto-authenticated mock user");
        callback(MOCK_AUTHENTICATED_USER);
      } else {
        // For local development, start not authenticated
        callback(null);
      }
      // Return unsubscribe function
      return () => {};
    },
    signInWithEmailAndPassword: async (email, password) => {
      console.log(`Mock sign in with ${email}`);
      return { user: MOCK_AUTHENTICATED_USER };
    },
    createUserWithEmailAndPassword: async () => {
      console.log("Mock create user");
      return { user: MOCK_AUTHENTICATED_USER };
    },
    signOut: async () => {
      console.log("Mock sign out");
    },
    sendPasswordResetEmail: async () => {
      console.log("Mock password reset");
    },
    currentUser: window.location.hostname.includes('lovable') ? MOCK_AUTHENTICATED_USER : null,
    settings: {} // Add mock settings object to prevent "Cannot read properties of undefined (reading 'settings')" error
  };
};

// Only initialize Firebase if API key is available or if we're in development mode
try {
  console.log("Attempting to initialize Firebase");
  app = initializeApp(firebaseConfig);
  
  if (isDevelopmentLike) {
    console.log("Development/preview environment detected, using mock auth");
    auth = createMockAuth();
    
    // Mock Firestore
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
    
    // Mock Storage
    storage = {
      ref: () => ({
        put: async () => {},
        getDownloadURL: async () => "https://placeholder.com/image.jpg"
      })
    };
  } else {
    // Use real Firebase services in production
    auth = getAuth(app);
    // Ensure the auth.settings exists to prevent the error
    if (!auth.settings) {
      auth.settings = {};
    }
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create mock instances for all environments if initialization fails
  console.log("Using mock Firebase services due to initialization failure");
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
}

// Gemini API key - this would normally be secured in a backend environment
// For development purposes, we use a mock key
export const GEMINI_API_KEY = isDevelopmentLike
  ? "GEMINI_MOCK_KEY_FOR_DEVELOPMENT" 
  : (import.meta.env.VITE_GEMINI_API_KEY || ""); 

// Gemini API endpoint - using the latest Gemini 2.0 pro vision version
export const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

export { auth, db, storage, isDevelopmentLike };
