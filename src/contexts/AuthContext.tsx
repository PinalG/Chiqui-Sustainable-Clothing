
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export type UserRole = "consumer" | "retailer" | "admin" | "logistics";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: number;
  organizationName?: string; // For retailers and logistics partners
  taxId?: string; // For retailers
  sustainabilityScore?: number; // For all users
  rewardsPoints?: number; // For consumers
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole, additionalData?: Partial<UserData>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    email: "consumer@example.com",
    password: "password123",
    name: "Sarah Consumer",
    role: "consumer" as UserRole,
    rewardsPoints: 250,
    sustainabilityScore: 75
  },
  {
    email: "retailer@example.com",
    password: "password123",
    name: "John Retailer",
    role: "retailer" as UserRole,
    organizationName: "EcoFashion Inc.",
    taxId: "TX-12345678",
    sustainabilityScore: 85
  },
  {
    email: "logistics@example.com",
    password: "password123",
    name: "Mike Logistics",
    role: "logistics" as UserRole,
    organizationName: "FastShip Logistics",
    sustainabilityScore: 70
  },
  {
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole,
    sustainabilityScore: 95
  }
];

// Create a mock user for development
const createMockUser = (email: string, displayName: string): User => {
  return {
    uid: `mock-${Date.now()}`,
    email,
    emailVerified: true,
    displayName,
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
      claims: { role: "user" },
      authTime: new Date().toISOString(),
    }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    providerId: "password",
  } as unknown as User;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Log mock users to console for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Mock users for development:", MOCK_USERS);
    }
  }, []);

  useEffect(() => {
    // Use real Firebase Auth if not in development
    if (process.env.NODE_ENV !== 'development') {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData);
            } else {
              // If user document doesn't exist yet (first login)
              const newUserData: UserData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role: "consumer", // Default role
                createdAt: Date.now(),
                sustainabilityScore: 0,
                rewardsPoints: 0
              };
              await setDoc(userDocRef, newUserData);
              setUserData(newUserData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          setUserData(null);
        }
        
        setIsLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      // In development, initialize with no user
      setUser(null);
      setUserData(null);
      setIsLoading(false);
    }
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = "consumer",
    additionalData?: Partial<UserData>
  ) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, create a mock user without Firebase
        const mockUser = createMockUser(email, name);
        setUser(mockUser);
        
        // Create mock user data
        const mockUserData: UserData = {
          uid: mockUser.uid,
          email: email,
          displayName: name,
          photoURL: null,
          role: role,
          createdAt: Date.now(),
          sustainabilityScore: 0,
          rewardsPoints: role === "consumer" ? 100 : 0,
          ...additionalData
        };
        
        setUserData(mockUserData);
        toast.success("Account created successfully");
        return;
      }
      
      // In production, use real Firebase auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user profile with display name
      await updateProfile(result.user, { displayName: name });
      
      // Create user document in Firestore
      const userData: UserData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: null,
        role: role,
        createdAt: Date.now(),
        sustainabilityScore: 0,
        rewardsPoints: role === "consumer" ? 100 : 0, // Give consumers some initial rewards points
        ...additionalData
      };
      
      await setDoc(doc(db, "users", result.user.uid), userData);
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, find the mock user
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!mockUser) {
          toast.error("Invalid email or password");
          throw new Error("Invalid email or password");
        }
        
        // Create a mock Firebase user
        const user = createMockUser(mockUser.email, mockUser.name);
        setUser(user);
        
        // Create user data
        const userData: UserData = {
          uid: user.uid,
          email: mockUser.email,
          displayName: mockUser.name,
          photoURL: null,
          role: mockUser.role,
          createdAt: Date.now(),
          sustainabilityScore: mockUser.sustainabilityScore,
          rewardsPoints: mockUser.rewardsPoints || 0,
          organizationName: mockUser.organizationName,
          taxId: mockUser.taxId
        };
        
        setUserData(userData);
        toast.success("Signed in successfully");
        return;
      }
      
      // In production, use real Firebase auth
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signInWithGoogle = async (role: UserRole = "consumer") => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, create a mock Google user
        const mockUser = createMockUser("google@example.com", "Google User");
        setUser(mockUser);
        
        const userData: UserData = {
          uid: mockUser.uid,
          email: "google@example.com",
          displayName: "Google User",
          photoURL: "https://lh3.googleusercontent.com/a/default-user",
          role: role,
          createdAt: Date.now(),
          sustainabilityScore: 50,
          rewardsPoints: role === "consumer" ? 100 : 0
        };
        
        setUserData(userData);
        toast.success("Signed in with Google successfully");
        return;
      }
      
      // In production, use real Firebase auth
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a first-time login with Google
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document with the specified role
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: role,
          createdAt: Date.now(),
          sustainabilityScore: 0,
          rewardsPoints: role === "consumer" ? 100 : 0
        };
        await setDoc(userDocRef, userData);
      }
      
      toast.success("Signed in with Google successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, just clear the user state
        setUser(null);
        setUserData(null);
        toast.success("Signed out successfully");
        return;
      }
      
      // In production, use real Firebase auth
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, just show a success message
        toast.success("Password reset email sent (mock)");
        return;
      }
      
      // In production, use real Firebase auth
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  const value = {
    user,
    userData,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
