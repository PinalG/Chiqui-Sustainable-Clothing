
import { User } from "firebase/auth";

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
