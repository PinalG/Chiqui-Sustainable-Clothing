
import { useState } from "react";
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { UserData, UserRole, MOCK_USERS, UserPreferences } from "@/types/AuthTypes";
import { createMockUser } from "@/utils/AuthUtils";

export function useAuthMethods() {
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
        
        // Create mock user data with default consent and preference settings
        const mockUserData: UserData = {
          uid: mockUser.uid,
          email: email,
          displayName: name,
          photoURL: null,
          role: role,
          createdAt: Date.now(),
          sustainabilityScore: 0,
          rewardsPoints: role === "consumer" ? 100 : 0,
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
            screenReader: false
          },
          ...additionalData
        };
        
        toast.success("Account created successfully");
        return { user: mockUser, userData: mockUserData };
      }
      
      // In production, use real Firebase auth with stronger password policy
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        throw new Error("Password must be at least 8 characters long");
      }
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user profile with display name
      await updateProfile(result.user, { displayName: name });
      
      // Create user document in Firestore with default consent and preference settings
      const userData: UserData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: null,
        role: role,
        createdAt: Date.now(),
        sustainabilityScore: 0,
        rewardsPoints: role === "consumer" ? 100 : 0, // Give consumers some initial rewards points
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
          screenReader: false
        },
        ...additionalData
      };
      
      await setDoc(doc(db, "users", result.user.uid), userData);
      toast.success("Account created successfully");
      return { user: result.user, userData };
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
        
        toast.success("Signed in successfully");
        return { user, userData };
      }
      
      // In production, use real Firebase auth
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully");
      return { user: result.user, userData: null }; // userData will be fetched separately
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
        
        toast.success("Signed in with Google successfully");
        return { user: mockUser, userData };
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
        toast.success("Signed in with Google successfully");
        return { user: result.user, userData };
      }
      
      toast.success("Signed in with Google successfully");
      return { user: result.user, userData: userDoc.data() as UserData };
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development mode, just clear the user state
        toast.success("Signed out successfully");
        return true;
      }
      
      // In production, use real Firebase auth
      await signOut(auth);
      toast.success("Signed out successfully");
      return true;
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
        return true;
      }
      
      // In production, use real Firebase auth
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  const updateUserPreferences = async (
    user: User | null, 
    userData: UserData | null, 
    preferences: Partial<UserPreferences>
  ) => {
    if (!user || !userData) {
      toast.error("You must be logged in to update preferences");
      throw new Error("User not logged in");
    }

    try {
      const updatedPreferences = {
        ...userData.preferences,
        ...preferences
      };

      if (process.env.NODE_ENV === 'development') {
        // In development, just return the updated preferences
        toast.success("Preferences updated successfully");
        return updatedPreferences as UserPreferences;
      }

      // In production, update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { preferences: updatedPreferences }, { merge: true });
      
      toast.success("Preferences updated successfully");
      return updatedPreferences as UserPreferences;
    } catch (error: any) {
      toast.error(error.message || "Failed to update preferences");
      throw error;
    }
  };

  const updateConsentSettings = async (
    user: User | null, 
    userData: UserData | null, 
    settings: Partial<UserData['consentSettings']>
  ) => {
    if (!user || !userData) {
      toast.error("You must be logged in to update consent settings");
      throw new Error("User not logged in");
    }

    try {
      const updatedSettings = {
        ...userData.consentSettings,
        ...settings,
        lastUpdated: Date.now()
      };

      if (process.env.NODE_ENV === 'development') {
        // In development, just return the updated settings
        toast.success("Consent settings updated successfully");
        return updatedSettings;
      }

      // In production, update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { consentSettings: updatedSettings }, { merge: true });
      
      toast.success("Consent settings updated successfully");
      return updatedSettings;
    } catch (error: any) {
      toast.error(error.message || "Failed to update consent settings");
      throw error;
    }
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserPreferences,
    updateConsentSettings
  };
}
