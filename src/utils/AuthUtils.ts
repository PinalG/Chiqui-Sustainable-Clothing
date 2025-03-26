
import { User } from "firebase/auth";
import { UserData, UserRole, MOCK_USERS } from "@/types/AuthTypes";

// Create a mock user for development
export const createMockUser = (email: string, displayName: string): User => {
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

// Create mock user data
export const createMockUserData = (
  user: User, 
  role: UserRole,
  additionalData: Partial<UserData> = {}
): UserData => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: role,
    createdAt: Date.now(),
    sustainabilityScore: additionalData.sustainabilityScore || 0,
    rewardsPoints: role === "consumer" ? (additionalData.rewardsPoints || 100) : 0,
    organizationName: additionalData.organizationName,
    taxId: additionalData.taxId,
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
};

// Generate mock user data for a specific mock user
export const getMockUserData = (email: string): UserData | null => {
  const mockUser = MOCK_USERS.find(u => u.email === email);
  if (!mockUser) return null;
  
  const user = createMockUser(mockUser.email, mockUser.name);
  return createMockUserData(user, mockUser.role, {
    sustainabilityScore: mockUser.sustainabilityScore,
    rewardsPoints: mockUser.rewardsPoints,
    organizationName: mockUser.organizationName,
    taxId: mockUser.taxId
  });
};
