
import React, { useState } from "react";
import { useDidAuth } from "@/contexts/DidAuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const DidInfoCard = () => {
  const { didAuth, refreshDid } = useDidAuth();
  const [showDetails, setShowDetails] = useState(false);

  const handleRefreshDid = async () => {
    try {
      await refreshDid();
      toast.success("Identity credentials refreshed successfully");
    } catch (error) {
      // Error is already handled in the context
    }
  };

  // Format DID for display (truncate middle)
  const formatDid = (did: string) => {
    if (!did) return '';
    if (did.length <= 20) return did;
    return `${did.substring(0, 10)}...${did.substring(did.length - 10)}`;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          {didAuth.isAuthenticated ? (
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
          )}
          Identity Credentials
        </CardTitle>
        <CardDescription>
          Your decentralized identity provides enhanced security and privacy
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {didAuth.loading ? (
          <div className="flex justify-center my-4">
            <Loader2 className="h-8 w-8 animate-spin text-soft-pink" />
          </div>
        ) : (
          <>
            <div className="space-y-2 text-sm">
              {didAuth.did ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">
                      {didAuth.isAuthenticated ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DID:</span>
                    <span className="font-medium">{formatDid(didAuth.did)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">
                      {didAuth.didDocument?.updated
                        ? new Date(didAuth.didDocument.updated).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-2">
                  {didAuth.error || "No identity credentials found"}
                </p>
              )}
            </div>
            
            {didAuth.did && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setShowDetails(true)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Decentralized Identity Details</DialogTitle>
                    <DialogDescription>
                      Technical information about your secure identity credentials
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold block">DID:</span>
                      <span className="text-muted-foreground break-all">
                        {didAuth.did}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block">Controller:</span>
                      <span className="text-muted-foreground break-all">
                        {didAuth.didDocument?.controller || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block">Created:</span>
                      <span className="text-muted-foreground">
                        {didAuth.didDocument?.created
                          ? new Date(didAuth.didDocument.created).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block">Verification Method:</span>
                      <span className="text-muted-foreground break-all">
                        {didAuth.didDocument?.verificationMethod?.[0]?.id || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block">Public Key:</span>
                      <span className="text-muted-foreground break-all">
                        {didAuth.didDocument?.verificationMethod?.[0]?.publicKeyMultibase || "N/A"}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </CardContent>
      {didAuth.did && (
        <CardFooter className="pt-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleRefreshDid}
            disabled={didAuth.loading}
          >
            {didAuth.loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Identity
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DidInfoCard;
