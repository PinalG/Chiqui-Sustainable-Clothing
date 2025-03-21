
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration for development (will be replaced in production)
const firebaseConfig = {
  apiKey: "demo-key-for-development",
  authDomain: "chiqui-platform.firebaseapp.com",
  projectId: "chiqui-platform",
  storageBucket: "chiqui-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// For development mode, we'll use mock authentication and emulators
if (process.env.NODE_ENV === 'development') {
  // Set up auth emulator
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Connected to Auth emulator");
  } catch (e) {
    console.log("Using mock authentication in development mode");
  }
  
  // Uncommment these when you set up the corresponding emulators
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

// Gemini API key - this would normally be secured in a backend environment
// For development purposes, we use a mock key
const GEMINI_API_KEY = process.env.NODE_ENV === 'development' 
  ? "GEMINI_MOCK_KEY_FOR_DEVELOPMENT" 
  : ""; // In production, this would be fetched securely

export { auth, db, storage, GEMINI_API_KEY };
