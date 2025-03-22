
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { UserData, UserRole, UserPreferences, AuthContextType } from "@/types/AuthTypes";
import { useAuthMethods } from "@/hooks/AuthHooks";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const authMethods = useAuthMethods();

  // Log mock users to console for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Mock users for development:", 
        "consumer@example.com / password123, " +
        "retailer@example.com / password123, " +
        "logistics@example.com / password123, " +
        "admin@example.com / password123"
      );
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
                rewardsPoints: 0,
                consentSettings: {
                  marketing: false,
                  cookies: true,
                  dataSharing: false,
                  lastUpdated: Date.now()
                },
                preferences: {
                  language: 'en',
                  highContrast: false,
                  largeText: false,
                  reducedMotion: false,
                  screenReader: false,
                  colorBlindFriendly: false,
                  dyslexiaFriendly: false
                }
              };
              // Will be created in the firestore by the signUp method
              setUserData(newUserData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load user data. Please refresh the page.");
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
    const result = await authMethods.signUp(email, password, name, role, additionalData);
    setUser(result.user);
    setUserData(result.userData);
  };

  const signIn = async (email: string, password: string) => {
    const result = await authMethods.signIn(email, password);
    setUser(result.user);
    if (result.userData) {
      setUserData(result.userData);
    }
  };

  const signInWithGoogle = async (role: UserRole = "consumer") => {
    const result = await authMethods.signInWithGoogle(role);
    setUser(result.user);
    setUserData(result.userData);
  };

  const logout = async () => {
    await authMethods.logout();
    setUser(null);
    setUserData(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    // Modified to return void instead of boolean
    await authMethods.resetPassword(email);
    // No return value
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    const updatedPreferences = await authMethods.updateUserPreferences(user, userData, preferences);
    if (userData) {
      setUserData({
        ...userData,
        preferences: updatedPreferences
      });
    }
  };

  const updateConsentSettings = async (settings: Partial<UserData['consentSettings']>) => {
    const updatedSettings = await authMethods.updateConsentSettings(user, userData, settings);
    if (userData) {
      setUserData({
        ...userData,
        consentSettings: updatedSettings
      });
    }
  };

  const value = {
    user,
    userData,
    isLoading,
    signUp: authMethods.signUp,
    signIn: authMethods.signIn,
    signInWithGoogle: authMethods.signInWithGoogle,
    logout: authMethods.logout,
    resetPassword: authMethods.resetPassword,
    updateUserPreferences: authMethods.updateUserPreferences,
    updateConsentSettings: authMethods.updateConsentSettings
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

export type { UserRole, UserPreferences };
