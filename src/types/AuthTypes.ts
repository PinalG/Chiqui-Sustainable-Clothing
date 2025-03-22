
import { User } from "firebase/auth";

export type UserRole = "admin" | "consumer" | "retailer" | "logistics";

export interface UserPreferences {
  language: string;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  colorBlindFriendly: boolean;
  dyslexiaFriendly: boolean;
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
    role: "consumer" as UserRole,
    sustainabilityScore: 85,
    rewardsPoints: 250,
    organizationName: undefined,
    taxId: undefined
  },
  {
    email: "retailer@example.com",
    password: "password123",
    name: "John Retailer",
    role: "retailer" as UserRole,
    sustainabilityScore: 90,
    rewardsPoints: 0,
    organizationName: "Eco Retail Co.",
    taxId: "RT-123456"
  },
  {
    email: "logistics@example.com",
    password: "password123",
    name: "Mike Logistics",
    role: "logistics" as UserRole,
    sustainabilityScore: 75,
    rewardsPoints: 0,
    organizationName: "Green Logistics Inc.",
    taxId: "LG-654321"
  },
  {
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole,
    sustainabilityScore: 100,
    rewardsPoints: 0,
    organizationName: "ACDRP Admin",
    taxId: "AD-111111"
  }
];
