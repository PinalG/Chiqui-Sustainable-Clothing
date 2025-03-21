
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Wind, Battery, Clock, ShoppingBag, TrendingUp, Recycle, Globe, Sun, Cloud, Target, Users } from "lucide-react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import analytics from "@/lib/analytics";

export const ImpactDashboard = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("6m");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for charts
  const pieData = [
    { name: "Clothing", value: 45 },
    { name: "Accessories", value: 25 },
    { name: "Shoes", value: 20 },
    { name: "Home", value: 10 },
  ];
  
  const [barData, setBarData] = useState([
    { name: "Jan", kg: 18 },
    { name: "Feb", kg: 24 },
    { name: "Mar", kg: 35 },
    { name: "Apr", kg: 29 },
    { name: "May", kg: 42 },
    { name: "Jun", kg: 38 },
  ]);
  
  const [lineData, setLineData] = useState([
    { month: "Jan", carbon: 25, water: 30 },
    { month: "Feb", carbon: 35, water: 25 },
    { month: "Mar", carbon: 45, water: 40 },
    { month: "Apr", carbon: 40, water: 35 },
    { month: "May", carbon: 55, water: 50 },
    { month: "Jun", carbon: 60, water: 45 },
  ]);
  
  const [resourceData, setResourceData] = useState([
    { month: "Jan", water: 1250, energy: 320, trees: 2.1 },
    { month: "Feb", water: 1450, energy: 350, trees: 2.5 },
    { month: "Mar", water: 1800, energy: 410, trees: 3.2 },
    { month: "Apr", water: 1650, energy: 380, trees: 2.8 },
    { month: "May", water: 2100, energy: 450, trees: 3.5 },
    { month: "Jun", water: 2300, energy: 490, trees: 4.1 },
  ]);
  
  const [comparisonData, setComparisonData] = useState([
    { month: "Jan", actual: 18, projected: 15 },
    { month: "Feb", actual: 24, projected: 20 },
    { month: "Mar", actual: 35, projected: 28 },
    { month: "Apr", actual: 29, projected: 32 },
    { month: "May", actual: 42, projected: 38 },
    { month: "Jun", actual: 38, projected: 42 },
  ]);
  
  const COLORS = ["#FFC0CB", "#B0B0B0", "#A7D8FF", "#FFD1A3"];
  
  const impactStats = [
    { 
      icon: Leaf, 
      value: "128", 
      unit: "kg", 
      title: "CO₂ Emissions Saved", 
      description: "Equivalent to planting 6 trees"
    },
    { 
      icon: Droplet, 
      value: "5,280", 
      unit: "L", 
      title: "Water Saved", 
      description: "Equivalent to 88 showers"
    },
    { 
      icon: Battery, 
      value: "410", 
      unit: "kWh", 
      title: "Energy Saved", 
      description: "Could power a home for 14 days"
    },
    { 
      icon: ShoppingBag, 
      value: "24", 
      unit: "", 
      title: "Items Recycled", 
      description: "Kept out of landfills"
    },
  ];
  
  useEffect(() => {
    // Track page view for analytics
    analytics.trackPageView({
      path: "/rewards/impact-dashboard",
      title: "Sustainability Impact Dashboard"
    });
    
    // Simulate loading real-time data
    fetchImpactData();
  }, []);
  
  const fetchImpactData = async (period = "6m") => {
    setIsLoading(true);
    // In a real app, this would be an API call to fetch real-time data
    // For demo, we'll simulate loading with timeout
    setTimeout(() => {
      setIsLoading(false);
      
      // Track analytics event
      analytics.trackEvent({
        category: "Sustainability",
        action: "Fetch Impact Data",
        label: `Period: ${period}`
      });
      
      if (period === "1y") {
        // Provide more data for 1-year view
        setBarData([
          { name: "Jan", kg: 18 }, { name: "Feb", kg: 24 }, { name: "Mar", kg: 35 },
          { name: "Apr", kg: 29 }, { name: "May", kg: 42 }, { name: "Jun", kg: 38 },
          { name: "Jul", kg: 45 }, { name: "Aug", kg: 52 }, { name: "Sep", kg: 48 },
          { name: "Oct", kg: 56 }, { name: "Nov", kg: 61 }, { name: "Dec", kg: 68 }
        ]);
        
        setLineData([
          { month: "Jan", carbon: 25, water: 30 }, { month: "Feb", carbon: 35, water: 25 },
          { month: "Mar", carbon: 45, water: 40 }, { month: "Apr", carbon: 40, water: 35 },
          { month: "May", carbon: 55, water: 50 }, { month: "Jun", carbon: 60, water: 45 },
          { month: "Jul", carbon: 65, water: 55 }, { month: "Aug", carbon: 72, water: 60 },
          { month: "Sep", carbon: 68, water: 58 }, { month: "Oct", carbon: 78, water: 65 },
          { month: "Nov", carbon: 85, water: 70 }, { month: "Dec", carbon: 92, water: 75 }
        ]);
        
        toast({
          title: "Data Updated",
          description: "Showing 12-month sustainability impact"
        });
      } else {
        // Default 6-month view
        setBarData([
          { name: "Jan", kg: 18 }, { name: "Feb", kg: 24 }, { name: "Mar", kg: 35 },
          { name: "Apr", kg: 29 }, { name: "May", kg: 42 }, { name: "Jun", kg: 38 }
        ]);
        
        setLineData([
          { month: "Jan", carbon: 25, water: 30 }, { month: "Feb", carbon: 35, water: 25 },
          { month: "Mar", carbon: 45, water: 40 }, { month: "Apr", carbon: 40, water: 35 },
          { month: "May", carbon: 55, water: 50 }, { month: "Jun", carbon: 60, water: 45 }
        ]);
        
        toast({
          title: "Data Updated",
          description: "Showing 6-month sustainability impact"
        });
      }
    }, 1000);
  };
  
  const handleTimeframeChange = (period) => {
    setTimeframe(period);
    fetchImpactData(period);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Sustainability Impact</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeframe === "6m" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange("6m")}
            disabled={isLoading}
          >
            6 Months
          </Button>
          <Button
            variant={timeframe === "1y" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange("1y")}
            disabled={isLoading}
          >
            1 Year
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass-card hover-lift h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-full bg-soft-pink/20 p-3">
                      <Icon className="h-6 w-6 text-soft-pink" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-end justify-end">
                        {stat.value}
                        <span className="text-muted-foreground text-base ml-1">{stat.unit}</span>
                      </h3>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm md:text-base">{stat.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="carbon" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Leaf className="mr-2 h-4 w-4" />
            Carbon Footprint
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Droplet className="mr-2 h-4 w-4" />
            Resource Savings
          </TabsTrigger>
          <TabsTrigger value="projected" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Target className="mr-2 h-4 w-4" />
            Projections
          </TabsTrigger>
          <TabsTrigger value="global" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Globe className="mr-2 h-4 w-4" />
            Global Impact
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4 text-soft-pink" />
                    Donation Categories
                  </CardTitle>
                  <CardDescription>Distribution of your donated items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Leaf className="mr-2 h-4 w-4 text-soft-pink" />
                    CO₂ Saved Monthly
                  </CardTitle>
                  <CardDescription>Your carbon savings over time</CardDescription>
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
            </div>
          </TabsContent>
          
          <TabsContent value="carbon" className="mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-soft-pink" />
                  Carbon Footprint Reduction
                </CardTitle>
                <CardDescription>Your impact on reducing carbon emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="carbon" stroke="#FFC0CB" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-soft-pink/5 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Leaf className="mr-2 h-4 w-4 text-green-500" />
                    Understanding Your Impact
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    For every item you donate or purchase second-hand, you help reduce approximately 5.3kg of CO₂ emissions that would have been produced in manufacturing new clothing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Droplet className="mr-2 h-4 w-4 text-soft-pink" />
                  Resource Conservation
                </CardTitle>
                <CardDescription>Water and energy saved through your sustainable choices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={resourceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#A7D8FF" />
                      <YAxis yAxisId="right" orientation="right" stroke="#FFC0CB" />
                      <Tooltip />
                      <Area type="monotone" dataKey="water" yAxisId="left" fill="#A7D8FF" stroke="#A7D8FF" fillOpacity={0.3} name="Water (L)" />
                      <Bar dataKey="energy" yAxisId="right" fill="#FFC0CB" name="Energy (kWh)" />
                      <Line type="monotone" dataKey="trees" yAxisId="right" stroke="#B0B0B0" strokeWidth={2} name="Trees Equivalent" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                      Water Saved
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your donations have saved approximately 5,280 liters of water, enough for 88 showers.
                    </p>
                  </div>
                  <div className="p-4 bg-soft-pink/5 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Battery className="mr-2 h-4 w-4 text-soft-pink" />
                      Energy Conserved
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You've helped save 410 kWh of energy, enough to power a home for 14 days.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Recycle className="mr-2 h-4 w-4 text-green-500" />
                      Textile Waste Reduced
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your actions have prevented 24 items from entering landfills, extending their lifecycle.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projected" className="mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Target className="mr-2 h-4 w-4 text-soft-pink" />
                  Impact Projections
                </CardTitle>
                <CardDescription>Projected vs. actual environmental impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="projected" fill="#B0B0B0" stroke="#B0B0B0" fillOpacity={0.3} name="Projected CO₂ Savings (kg)" />
                      <Line type="monotone" dataKey="actual" stroke="#FFC0CB" strokeWidth={2} dot={{ r: 4 }} name="Actual CO₂ Savings (kg)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-soft-pink/5 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-soft-pink" />
                    Your Projection Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your current donation patterns, we project you will save approximately 265 kg of CO₂ in the next 6 months, which is 15% above the average user.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-soft-pink hover:bg-soft-pink/90">
                      Set Environmental Goals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="global" className="mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-soft-pink" />
                  Community Impact
                </CardTitle>
                <CardDescription>How your contributions compare to the global community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-soft-pink/5 rounded-lg text-center">
                    <div className="text-4xl font-bold mb-2">Top 15%</div>
                    <p className="text-sm text-muted-foreground">
                      Your sustainability impact ranks in the top 15% of all users on our platform
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-soft-pink/5 rounded-lg text-center">
                    <div className="text-4xl font-bold mb-2">42,850 kg</div>
                    <p className="text-sm text-muted-foreground">
                      Total CO₂ emissions saved by our community this year
                    </p>
                  </div>
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Global Avg", value: 75 },
                        { name: "Country Avg", value: 92 },
                        { name: "Your Impact", value: 128 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kg`, 'CO₂ Saved']} />
                      <Bar dataKey="value" fill="#FFC0CB" radius={[4, 4, 0, 0]}>
                        <Cell fill="#B0B0B0" />
                        <Cell fill="#B0B0B0" />
                        <Cell fill="#FFC0CB" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-green-500" />
                    Join Our Community Challenges
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participate in monthly sustainability challenges to increase your impact and earn special rewards.
                  </p>
                  <Button variant="outline" className="w-full">
                    View Active Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};
