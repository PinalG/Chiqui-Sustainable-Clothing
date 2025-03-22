
import { User } from "firebase/auth";

export type UserRole = "admin" | "consumer" | "retailer" | "logistics";

export interface UserPreferences {
  language: string;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: number;
  sustainabilityScore: number;
  rewardsPoints: number;
  consentSettings: {
    marketing: boolean;
    cookies: boolean;
    dataSharing: boolean;
    lastUpdated: number;
  };
  preferences: UserPreferences;
  organizationName?: string;
  taxId?: string;
}

export interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: UserRole,
    additionalData?: Partial<UserData>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateConsentSettings: (settings: Partial<UserData['consentSettings']>) => Promise<void>;
}

// Mock users for development
export const MOCK_USERS = [
  {
    email: "consumer@example.com",
    password: "password123",
    name: "Sarah Consumer",
    role: "consumer" as UserRole
  },
  {
    email: "retailer@example.com",
    password: "password123",
    name: "John Retailer",
    role: "retailer" as UserRole
  },
  {
    email: "logistics@example.com",
    password: "password123",
    name: "Mike Logistics",
    role: "logistics" as UserRole
  },
  {
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole
  }
];
