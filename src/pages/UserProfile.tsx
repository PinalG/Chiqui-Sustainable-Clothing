
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, Shield, ClipboardList } from "lucide-react";

const UserProfile = () => {
  const { user, userData, logout } = useAuth();
  
  if (!user || !userData) {
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md h-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                  <AvatarFallback className="bg-soft-pink text-white text-xl">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.displayName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-soft-pink/10 px-3 py-1 text-sm font-medium text-soft-pink">
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Activity
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80 hover:bg-destructive/10 mt-4" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="sustainability">Sustainability Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        {user.displayName || "Not set"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">User Role</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Preference settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sustainability">
              <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                <CardHeader>
                  <CardTitle>Sustainability Impact</CardTitle>
                  <CardDescription>Track your environmental contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Your sustainability dashboard will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
