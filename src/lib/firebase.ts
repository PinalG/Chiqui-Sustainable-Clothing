
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration for development (will be replaced in production)
const firebaseConfig = {
  apiKey: "demo-key-for-development",
  authDomain: "acdrp-platform.firebaseapp.com",
  projectId: "acdrp-platform",
  storageBucket: "acdrp-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// In development mode, connect to Firebase emulators
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

export { auth, db, storage };
