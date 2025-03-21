
export type DidDocument = {
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod?: string[];
  created: string;
  updated: string;
};

export type VerificationMethod = {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase?: string;
  publicKeyJwk?: {
    kty: string;
    crv: string;
    x: string;
    y?: string;
  };
};

export type DidResolutionResult = {
  didDocument: DidDocument | null;
  didResolutionMetadata: {
    contentType?: string;
    error?: string;
  };
  didDocumentMetadata: {
    created?: string;
    updated?: string;
    deactivated?: boolean;
  };
};

export interface DidAuthState {
  did: string | null;
  didDocument: DidDocument | null;
  isAuthenticated: boolean;
  authToken: string | null;
  loading: boolean;
  error: string | null;
}
