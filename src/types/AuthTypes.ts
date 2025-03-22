
import { User } from "firebase/auth";
import { AvailableLanguage } from "@/lib/translations";

export type UserRole = "consumer" | "retailer" | "admin" | "logistics";

export interface UserPreferences {
  language: AvailableLanguage | string;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  colorBlindFriendly?: boolean;
  dyslexiaFriendly?: boolean;
}

export interface UserData {
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
  consentSettings?: {
    marketing: boolean;
    cookies: boolean;
    dataSharing: boolean;
    lastUpdated: number;
  };
  preferences?: UserPreferences; // User preferences for accessibility and language
  did?: string; // Decentralized Identifier
}

export interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole, additionalData?: Partial<UserData>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // Changed from Promise<boolean> to Promise<void>
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateConsentSettings: (settings: Partial<UserData['consentSettings']>) => Promise<void>;
}

// Mock user data for development
export const MOCK_USERS = [
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
