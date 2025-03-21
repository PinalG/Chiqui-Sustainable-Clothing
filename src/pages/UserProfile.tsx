
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, Shield, ClipboardList, Building2, Truck, TrendingUp, Award, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

  // Role-based icons
  const getRoleIcon = () => {
    switch (userData.role) {
      case "retailer":
        return <Building2 className="mr-2 h-4 w-4" />;
      case "logistics":
        return <Truck className="mr-2 h-4 w-4" />;
      case "admin":
        return <Shield className="mr-2 h-4 w-4" />;
      default:
        return <User className="mr-2 h-4 w-4" />;
    }
  };

  // Role-based tabs
  const renderRoleTabs = () => {
    switch (userData.role) {
      case "retailer":
        return (
          <>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="donations">Paper Donations</TabsTrigger>
            <TabsTrigger value="tax">Tax Benefits</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </>
        );
      case "logistics":
        return (
          <>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </>
        );
      case "consumer":
        return (
          <>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability Impact</TabsTrigger>
          </>
        );
      case "admin":
        return (
          <>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </>
        );
      default:
        return (
          <>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </>
        );
    }
  };

  // Role-based content
  const renderRoleContent = () => {
    switch (userData.role) {
      case "retailer":
        return (
          <>
            <TabsContent value="profile">
              <RetailerProfileInfo userData={userData} user={user} />
            </TabsContent>
            <TabsContent value="donations">
              <RetailerDonations />
            </TabsContent>
            <TabsContent value="tax">
              <RetailerTaxBenefits />
            </TabsContent>
            <TabsContent value="sustainability">
              <SustainabilityImpact userData={userData} />
            </TabsContent>
          </>
        );
      case "logistics":
        return (
          <>
            <TabsContent value="profile">
              <LogisticsProfileInfo userData={userData} user={user} />
            </TabsContent>
            <TabsContent value="shipments">
              <LogisticsShipments />
            </TabsContent>
            <TabsContent value="performance">
              <LogisticsPerformance />
            </TabsContent>
            <TabsContent value="sustainability">
              <SustainabilityImpact userData={userData} />
            </TabsContent>
          </>
        );
      case "consumer":
        return (
          <>
            <TabsContent value="profile">
              <ConsumerProfileInfo userData={userData} user={user} />
            </TabsContent>
            <TabsContent value="rewards">
              <ConsumerRewards userData={userData} />
            </TabsContent>
            <TabsContent value="purchases">
              <ConsumerPurchases />
            </TabsContent>
            <TabsContent value="sustainability">
              <SustainabilityImpact userData={userData} />
            </TabsContent>
          </>
        );
      case "admin":
        return (
          <>
            <TabsContent value="profile">
              <AdminProfileInfo userData={userData} user={user} />
            </TabsContent>
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
            <TabsContent value="reports">
              <AdminReports />
            </TabsContent>
            <TabsContent value="system">
              <AdminSystem />
            </TabsContent>
          </>
        );
      default:
        return (
          <>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your basic account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Standard profile content</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Preference settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        );
    }
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
                  {getRoleIcon()}
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>
              {userData.organizationName && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Organization: {userData.organizationName}
                </div>
              )}
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
            <TabsList className="mb-4 flex flex-wrap">
              {renderRoleTabs()}
            </TabsList>
            
            {renderRoleContent()}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Role-specific components
const RetailerProfileInfo = ({ userData, user }: { userData: any, user: any }) => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
      <CardDescription>Manage your retailer account</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Company Name</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {userData.organizationName || "Not set"}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Tax ID</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {userData.taxId || "Not set"}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Contact Person</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {user.displayName}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {user.email}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RetailerDonations = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Paper Donations</CardTitle>
      <CardDescription>Track your company's paper donations</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Total Donations</h4>
            <p className="text-2xl font-bold">4,287 items</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Estimated Value</h4>
            <p className="text-2xl font-bold">$102,450</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Items Sold</h4>
            <p className="text-2xl font-bold">2,841 (66%)</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Donations</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between">
                <div>
                  <div className="font-medium">Batch #{200 + i}</div>
                  <div className="text-sm text-muted-foreground">500 items • April {i + 10}, 2023</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-soft-pink">$12,500</div>
                  <div className="text-sm text-muted-foreground">Tax benefit: $3,750</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RetailerTaxBenefits = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Tax Benefits</CardTitle>
      <CardDescription>Track tax advantages from paper donations</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">YTD Inventory Tax Benefit</h4>
            <p className="text-2xl font-bold">$28,750</p>
          </div>
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">YTD Storage Space Benefit</h4>
            <p className="text-2xl font-bold">$15,200</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Quarterly Benefits</h4>
          <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Tax benefit chart will appear here</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Tax Documentation</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                <div>
                  <div className="font-medium">Q{i} 2023 Tax Report</div>
                  <div className="text-sm text-muted-foreground">Generated on May {i * 5}, 2023</div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LogisticsProfileInfo = ({ userData, user }: { userData: any, user: any }) => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
      <CardDescription>Manage your logistics partner account</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Company Name</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {userData.organizationName || "Not set"}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Partnership Level</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            Premium Partner
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Contact Person</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {user.displayName}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {user.email}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LogisticsShipments = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Active Shipments</CardTitle>
      <CardDescription>Monitor and manage active deliveries</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Active Shipments</h4>
            <p className="text-2xl font-bold">187</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">On-Time Rate</h4>
            <p className="text-2xl font-bold">98.3%</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Avg. Delivery Time</h4>
            <p className="text-2xl font-bold">2.1 days</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Shipments</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between">
                <div>
                  <div className="font-medium">Order #34678{i}</div>
                  <div className="text-sm text-muted-foreground">
                    From: EcoFashion Inc. • To: Sarah C.
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">In Transit</div>
                  <div className="text-sm text-muted-foreground">Est. delivery: Apr {i + 15}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LogisticsPerformance = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Performance Metrics</CardTitle>
      <CardDescription>Track your delivery performance and efficiency</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-md">
            <h4 className="text-sm font-medium mb-1">Successful Deliveries</h4>
            <p className="text-2xl font-bold">4,832</p>
            <p className="text-sm text-green-600">↑ 12% from last month</p>
          </div>
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">Carbon Footprint Reduction</h4>
            <p className="text-2xl font-bold">28.5 tons CO₂</p>
            <p className="text-sm text-soft-pink">↑ 8% from last month</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Delivery Efficiency</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">On-Time Delivery</span>
                <span className="text-sm font-medium">98.3%</span>
              </div>
              <Progress value={98.3} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Route Optimization</span>
                <span className="text-sm font-medium">87.5%</span>
              </div>
              <Progress value={87.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">94.7%</span>
              </div>
              <Progress value={94.7} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ConsumerProfileInfo = ({ userData, user }: { userData: any, user: any }) => (
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
);

const ConsumerRewards = ({ userData }: { userData: any }) => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Rewards Program</CardTitle>
      <CardDescription>Track your sustainability rewards</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="bg-soft-pink/10 p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="font-medium">Current Points</h3>
            <p className="text-3xl font-bold">{userData.rewardsPoints || 250}</p>
          </div>
          <Button>Redeem Points</Button>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Rewards Tier</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-soft-pink text-white">
                  Silver
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-soft-pink">
                  {userData.rewardsPoints || 250}/500 to Gold
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-soft-pink/20">
              <div style={{ width: `${Math.min(((userData.rewardsPoints || 250) / 500) * 100, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-soft-pink"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-md border flex justify-between">
              <div>
                <div className="font-medium">Sustainable Purchase</div>
                <div className="text-sm text-muted-foreground">Eco-friendly T-shirt</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">+25 points</div>
                <div className="text-sm text-muted-foreground">April 12, 2023</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md border flex justify-between">
              <div>
                <div className="font-medium">Clothing Donation</div>
                <div className="text-sm text-muted-foreground">3 items donated</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">+45 points</div>
                <div className="text-sm text-muted-foreground">April 5, 2023</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md border flex justify-between">
              <div>
                <div className="font-medium">Referral Bonus</div>
                <div className="text-sm text-muted-foreground">Friend signup: Emma S.</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">+50 points</div>
                <div className="text-sm text-muted-foreground">March 28, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ConsumerPurchases = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Purchase History</CardTitle>
      <CardDescription>Track your sustainable fashion purchases</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Total Purchases</h4>
            <p className="text-2xl font-bold">12 items</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Amount Saved</h4>
            <p className="text-2xl font-bold">$345</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Carbon Saved</h4>
            <p className="text-2xl font-bold">24kg CO₂</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Purchases</h4>
          <div className="space-y-2">
            {[
              { name: "Organic Cotton T-Shirt", company: "EcoFashion Inc.", date: "April 12, 2023", price: "$32.99", status: "Delivered" },
              { name: "Recycled Denim Jeans", company: "GreenThreads Co.", date: "March 28, 2023", price: "$78.50", status: "Delivered" },
              { name: "Sustainable Wool Sweater", company: "EcoFashion Inc.", date: "March 15, 2023", price: "$64.99", status: "Delivered" }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">From: {item.company}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.price}</div>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SustainabilityImpact = ({ userData }: { userData: any }) => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Sustainability Impact</CardTitle>
      <CardDescription>Your environmental contribution</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex items-center mb-3">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-medium">Sustainability Score</h3>
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-green-600">{userData.sustainabilityScore || 75}</p>
            <p className="text-sm text-green-600 pb-1">/100</p>
          </div>
          <Progress value={userData.sustainabilityScore || 75} className="h-2 mt-2 bg-green-200" />
          <p className="text-sm mt-2 text-green-700">
            Your sustainability impact is higher than 82% of platform users!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <div className="text-3xl font-bold">{userData.role === "retailer" ? "2,841" : userData.role === "logistics" ? "4,832" : "12"}</div>
            <div className="text-sm text-muted-foreground">
              {userData.role === "retailer" ? "Items Resold" : userData.role === "logistics" ? "Deliveries" : "Items Purchased"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <div className="text-3xl font-bold">{userData.role === "retailer" ? "1.2K" : userData.role === "logistics" ? "28.5" : "24"}</div>
            <div className="text-sm text-muted-foreground">
              {userData.role === "retailer" ? "kg CO₂ Saved" : userData.role === "logistics" ? "Tons CO₂ Reduced" : "kg CO₂ Saved"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <div className="text-3xl font-bold">{userData.role === "retailer" ? "4,287" : userData.role === "logistics" ? "212" : "3"}</div>
            <div className="text-sm text-muted-foreground">
              {userData.role === "retailer" ? "Items Donated" : userData.role === "logistics" ? "Eco Routes" : "Items Donated"}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Impact Over Time</h4>
          <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Sustainability impact chart will appear here</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Admin specific components
const AdminProfileInfo = ({ userData, user }: { userData: any, user: any }) => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>Admin Profile</CardTitle>
      <CardDescription>System administration account</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Admin Name</label>
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
          <label className="text-sm font-medium">Access Level</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            Full Administrator
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Last Login</label>
          <div className="mt-1 p-2 bg-gray-50 rounded border">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminUsers = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>User Management</CardTitle>
      <CardDescription>Manage platform users</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Total Users</h4>
            <p className="text-2xl font-bold">547</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Consumers</h4>
            <p className="text-2xl font-bold">412</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Retailers</h4>
            <p className="text-2xl font-bold">85</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Logistics</h4>
            <p className="text-2xl font-bold">50</p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Recent Users</h4>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Sarah Consumer", email: "consumer@example.com", role: "Consumer", date: "April 15, 2023" },
              { name: "John Retailer", email: "retailer@example.com", role: "Retailer", date: "April 12, 2023" },
              { name: "Mike Logistics", email: "logistics@example.com", role: "Logistics", date: "April 10, 2023" }
            ].map((user, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-soft-pink/10 px-2.5 py-0.5 text-xs font-medium text-soft-pink mr-3">
                    {user.role}
                  </span>
                  <div className="text-xs text-muted-foreground">{user.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminReports = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>System Reports</CardTitle>
      <CardDescription>System performance and analytics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">Platform Health</h4>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-lg font-medium">Excellent</p>
            </div>
          </div>
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">Active Sessions</h4>
            <p className="text-2xl font-bold">128</p>
          </div>
          <div className="p-4 bg-soft-pink/10 rounded-md">
            <h4 className="text-sm font-medium mb-1">Response Time</h4>
            <p className="text-2xl font-bold">126ms</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">System Reports</h4>
          <div className="space-y-2">
            {[
              "Monthly User Activity Report",
              "Transactions & Payment Processing Report",
              "Security & Compliance Audit Report",
              "Environmental Impact Analysis"
            ].map((report, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                <div className="font-medium">{report}</div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminSystem = () => (
  <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
    <CardHeader>
      <CardTitle>System Configuration</CardTitle>
      <CardDescription>Manage platform settings</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">System Modules</h4>
          <div className="space-y-2">
            {[
              { name: "User Authentication", status: "Active", version: "v2.1.0" },
              { name: "AI Image Recognition", status: "Active", version: "v1.8.3" },
              { name: "Payment Processing", status: "Active", version: "v3.0.2" },
              { name: "Logistics & Shipping", status: "Active", version: "v2.4.1" },
              { name: "Blockchain Authentication", status: "In Testing", version: "v0.9.7" }
            ].map((module, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                <div>
                  <div className="font-medium">{module.name}</div>
                  <div className="text-xs text-muted-foreground">{module.version}</div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    module.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  } mr-3`}>
                    {module.status}
                  </span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default UserProfile;
