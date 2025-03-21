
import React from "react";
import { 
  Shield, 
  LockKeyhole, 
  UserRound, 
  KeyRound, 
  FingerPrint, 
  CircleUserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDidAuth } from "@/contexts/DidAuthContext";
import DidInfoCard from "@/components/auth/DidInfoCard";
import { toast } from "sonner";

const SecurityPage = () => {
  const { user, userData } = useAuth();
  const { didAuth, initializeDid } = useDidAuth();

  const handlePasswordReset = () => {
    if (user?.email) {
      // This would trigger password reset in a real app
      toast.success("Password reset instructions sent to your email");
    }
  };
  
  const handleInitializeDid = async () => {
    if (!didAuth.did) {
      try {
        await initializeDid();
        toast.success("Secure identity initialized successfully");
      } catch (error) {
        // Error already handled in context
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Shield className="h-6 w-6 mr-2 text-soft-pink" />
        <h1 className="text-2xl font-semibold">Security & Privacy</h1>
      </div>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="identity" className="flex items-center">
            <CircleUserRound className="h-4 w-4 mr-2" />
            <span>Identity</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <LockKeyhole className="h-4 w-4 mr-2" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center">
            <FingerPrint className="h-4 w-4 mr-2" />
            <span>Sessions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-6">
          <DidInfoCard />
          
          {!didAuth.did && !didAuth.loading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Initialize Secure Identity</CardTitle>
                <CardDescription>
                  Create decentralized identity credentials for enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleInitializeDid} className="w-full">
                  Create Secure Identity
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identity Verification</CardTitle>
              <CardDescription>
                Verify your identity to increase your account security level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <UserRound className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Verify your email address
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {user?.emailVerified ? "Verified" : "Verify"}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <KeyRound className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "No email set"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed: Never
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePasswordReset}
                >
                  Reset
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Account Recovery</p>
                  <p className="text-sm text-muted-foreground">
                    Set up recovery options
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Current Session</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Device: {navigator.userAgent.indexOf('Mobile') !== -1 ? 'Mobile' : 'Desktop'}</p>
                    <p>IP Address: 192.168.x.x (masked)</p>
                    <p>Last Activity: Just now</p>
                    <p>Location: Unknown</p>
                  </div>
                </div>
                
                <Button variant="destructive" size="sm">
                  Revoke All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;
