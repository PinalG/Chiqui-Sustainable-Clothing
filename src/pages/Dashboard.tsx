
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, ShoppingBag, TrendingUp, Users, Leaf, Droplet, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Track which cards have their dropdowns expanded
  const [expandedCards, setExpandedCards] = useState({
    donations: false,
    paperDonations: false,
    retailPartners: false,
    revenue: false
  });
  
  // Toggle expansion state for a specific card
  const toggleCardExpansion = (cardKey) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };
  
  // Sample data for sustainability impact
  const impactData = [
    { name: "CO₂", value: 128, unit: "kg" },
    { name: "Water", value: 5280, unit: "L" },
    { name: "Energy", value: 410, unit: "kWh" },
  ];
  
  const barData = [
    { name: "Jan", kg: 18 },
    { name: "Feb", kg: 24 },
    { name: "Mar", kg: 35 },
    { name: "Apr", kg: 29 },
    { name: "May", kg: 42 },
    { name: "Jun", kg: 38 },
  ];
  
  const COLORS = ["#FFC0CB", "#A7D8FF", "#B0B0B0"];
  
  const handleViewImpactDashboard = () => {
    navigate("/rewards", { state: { activeTab: "impact" } });
  };

  // Navigation handlers for each card
  const handleNavigateToDonations = () => {
    navigate("/donations");
  };

  const handleNavigateToPaperDonations = () => {
    // Navigate to retail donations for retailers, regular donations for consumers
    if (userData?.role === 'retailer') {
      navigate("/retail-donations");
    } else {
      navigate("/donations");
    }
  };

  const handleNavigateToRetailPartners = () => {
    // For admins, go to user management, for others to marketplace
    if (userData?.role === 'admin') {
      navigate("/admin/users");
    } else {
      navigate("/marketplace");
    }
  };

  const handleNavigateToRevenue = () => {
    // For retailers/admins, go to analytics, for consumers to rewards
    if (userData?.role === 'retailer' || userData?.role === 'admin') {
      navigate("/analytics");
    } else {
      navigate("/rewards");
    }
  };

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Chiqui platform dashboard{userData?.displayName ? `, ${userData.displayName}` : ""}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Collapsible open={expandedCards.donations} onOpenChange={() => toggleCardExpansion('donations')} className="col-span-1">
          <Card className="glass-morphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-soft-pink hover:bg-soft-pink/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToDonations();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Go to donations</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    {expandedCards.donations ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="p-3 bg-soft-pink/5 rounded-md text-sm">
                  <h4 className="font-medium text-sm mb-1">Donation Breakdown</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Clothing</span>
                      <span>8,543 items</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Shoes</span>
                      <span>2,105 items</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Accessories</span>
                      <span>1,586 items</span>
                    </li>
                  </ul>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-soft-pink p-0 h-auto mt-2" 
                    onClick={handleNavigateToDonations}
                  >
                    View all donations
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        <Collapsible open={expandedCards.paperDonations} onOpenChange={() => toggleCardExpansion('paperDonations')} className="col-span-1">
          <Card className="glass-morphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paper Donations</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-soft-pink hover:bg-soft-pink/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToPaperDonations();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Go to paper donations</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    {expandedCards.paperDonations ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,385</div>
              <p className="text-xs text-muted-foreground">
                +12.3% from last month
              </p>
            </CardContent>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="p-3 bg-soft-pink/5 rounded-md text-sm">
                  <h4 className="font-medium text-sm mb-1">Paper Donation Details</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Tax Benefits</span>
                      <span>$42,580</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Storage Space Donated</span>
                      <span>3,250 sqft</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Logistics Saved</span>
                      <span>1,450 miles</span>
                    </li>
                  </ul>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-soft-pink p-0 h-auto mt-2" 
                    onClick={handleNavigateToPaperDonations}
                  >
                    View all paper donations
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        <Collapsible open={expandedCards.retailPartners} onOpenChange={() => toggleCardExpansion('retailPartners')} className="col-span-1">
          <Card className="glass-morphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Retail Partners</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-soft-pink hover:bg-soft-pink/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToRetailPartners();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Go to retail partners</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    {expandedCards.retailPartners ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +2 new this month
              </p>
            </CardContent>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="p-3 bg-soft-pink/5 rounded-md text-sm">
                  <h4 className="font-medium text-sm mb-1">Partner Details</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Active Partners</span>
                      <span>22</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pending Approval</span>
                      <span>6</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Top Partner</span>
                      <span>Fashion Forward Inc.</span>
                    </li>
                  </ul>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-soft-pink p-0 h-auto mt-2" 
                    onClick={handleNavigateToRetailPartners}
                  >
                    View all partners
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        <Collapsible open={expandedCards.revenue} onOpenChange={() => toggleCardExpansion('revenue')} className="col-span-1">
          <Card className="glass-morphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-soft-pink hover:bg-soft-pink/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToRevenue();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Go to revenue</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    {expandedCards.revenue ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234</div>
              <p className="text-xs text-muted-foreground">
                +18.2% from last month
              </p>
            </CardContent>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="p-3 bg-soft-pink/5 rounded-md text-sm">
                  <h4 className="font-medium text-sm mb-1">Revenue Breakdown</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Marketplace Sales</span>
                      <span>$8,450</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Platform Fees</span>
                      <span>$3,184</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Subscription Revenue</span>
                      <span>$600</span>
                    </li>
                  </ul>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-soft-pink p-0 h-auto mt-2" 
                    onClick={handleNavigateToRevenue}
                  >
                    View full revenue report
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>
              Overview of the most recent donations on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg`, 'CO₂ Saved']} />
                  <Bar dataKey="kg" fill="#FFC0CB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle>Sustainability Impact</CardTitle>
              <CardDescription>
                Environmental impact of donations this month.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewImpactDashboard}
              className="text-soft-pink border-soft-pink hover:bg-soft-pink/10"
            >
              <Leaf className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, unit }) => `${name}: ${value}${unit}`}
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, entry) => [`${value} ${entry.payload.unit}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFC0CB] mr-2"></div>
                <span className="text-xs text-muted-foreground">CO₂ Saved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#A7D8FF] mr-2"></div>
                <span className="text-xs text-muted-foreground">Water Saved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#B0B0B0] mr-2"></div>
                <span className="text-xs text-muted-foreground">Energy Saved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
