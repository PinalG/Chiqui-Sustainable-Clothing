
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DidAuthState, DidDocument } from "@/types/DidTypes";
import { useAuth } from "@/contexts/AuthContext";
import { createDidForUser, resolveUserDid, generateDidAuthToken, verifyDidAuthToken } from "@/services/didService";
import { toast } from "sonner";

// Create the context with a default value
const DidAuthContext = createContext<{
  didAuth: DidAuthState;
  initializeDid: () => Promise<void>;
  refreshDid: () => Promise<void>;
  logoutDid: () => void;
} | undefined>(undefined);

// Provider component
export const DidAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, userData } = useAuth();
  const [didAuth, setDidAuth] = useState<DidAuthState>({
    did: null,
    didDocument: null,
    isAuthenticated: false,
    authToken: null,
    loading: false,
    error: null,
  });

  // Initialize DID when user logs in
  const initializeDid = async (): Promise<void> => {
    if (!user || !userData) return;

    try {
      setDidAuth(prev => ({ ...prev, loading: true, error: null }));
      
      // Try to retrieve from localStorage first (for persistence)
      const storedDid = localStorage.getItem(`did:${user.uid}`);
      let did: string;
      let didDocument: DidDocument;
      
      if (storedDid) {
        did = storedDid;
        const result = await resolveUserDid(did);
        
        if (result.didDocument) {
          didDocument = result.didDocument;
        } else {
          // If stored DID can't be resolved, create a new one
          didDocument = await createDidForUser(user.uid);
          did = didDocument.id;
          localStorage.setItem(`did:${user.uid}`, did);
        }
      } else {
        // Create new DID if none exists
        didDocument = await createDidForUser(user.uid);
        did = didDocument.id;
        localStorage.setItem(`did:${user.uid}`, did);
      }
      
      // Generate auth token
      const authToken = await generateDidAuthToken(did);
      
      setDidAuth({
        did,
        didDocument,
        isAuthenticated: true,
        authToken,
        loading: false,
        error: null,
      });
      
      console.log("Decentralized identity initialized:", did);
    } catch (error: any) {
      console.error("Failed to initialize DID:", error);
      setDidAuth(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to initialize secure identity",
      }));
      toast.error("Failed to initialize secure identity");
    }
  };

  // Refresh DID authentication
  const refreshDid = async (): Promise<void> => {
    if (!didAuth.did) return;
    
    try {
      setDidAuth(prev => ({ ...prev, loading: true, error: null }));
      
      // Re-resolve the DID document
      const result = await resolveUserDid(didAuth.did);
      
      if (!result.didDocument) {
        throw new Error("Identity document not found");
      }
      
      // Generate a fresh auth token
      const authToken = await generateDidAuthToken(didAuth.did);
      
      setDidAuth({
        ...didAuth,
        didDocument: result.didDocument,
        authToken,
        loading: false,
      });
      
      console.log("DID authentication refreshed");
    } catch (error: any) {
      console.error("Failed to refresh DID:", error);
      setDidAuth(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to refresh secure identity",
      }));
      toast.error("Failed to refresh secure identity");
    }
  };

  // Clear DID on logout
  const logoutDid = (): void => {
    if (user) {
      // We don't actually delete the DID, just remove it from state
      localStorage.removeItem(`did:${user.uid}`);
    }
    
    setDidAuth({
      did: null,
      didDocument: null,
      isAuthenticated: false,
      authToken: null,
      loading: false,
      error: null,
    });
  };

  // Effect for automatic initialization when user changes
  useEffect(() => {
    if (user && userData && !didAuth.did && !didAuth.loading) {
      initializeDid();
    } else if (!user && didAuth.did) {
      logoutDid();
    }
  }, [user, userData]);

  return (
    <DidAuthContext.Provider value={{ didAuth, initializeDid, refreshDid, logoutDid }}>
      {children}
    </DidAuthContext.Provider>
  );
};

// Custom hook to use the DID Auth context
export const useDidAuth = () => {
  const context = useContext(DidAuthContext);
  if (context === undefined) {
    throw new Error("useDidAuth must be used within a DidAuthProvider");
  }
  return context;
};
