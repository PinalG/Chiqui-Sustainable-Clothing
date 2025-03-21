
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Wind, Battery, Clock, ShoppingBag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

export const ImpactDashboard = () => {
  // Mock data for charts
  const pieData = [
    { name: "Clothing", value: 45 },
    { name: "Accessories", value: 25 },
    { name: "Shoes", value: 20 },
    { name: "Home", value: 10 },
  ];
  
  const barData = [
    { name: "Jan", kg: 18 },
    { name: "Feb", kg: 24 },
    { name: "Mar", kg: 35 },
    { name: "Apr", kg: 29 },
    { name: "May", kg: 42 },
    { name: "Jun", kg: 38 },
  ];
  
  const lineData = [
    { month: "Jan", carbon: 25, water: 30 },
    { month: "Feb", carbon: 35, water: 25 },
    { month: "Mar", carbon: 45, water: 40 },
    { month: "Apr", carbon: 40, water: 35 },
    { month: "May", carbon: 55, water: 50 },
    { month: "Jun", carbon: 60, water: 45 },
  ];
  
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

  return (
    <div className="space-y-6">
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
        <TabsList className="w-full grid grid-cols-3 mb-6">
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
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="water" stroke="#A7D8FF" strokeWidth={2} dot={{ r: 4 }} name="Water (L)" />
                      <Line type="monotone" dataKey="carbon" stroke="#FFC0CB" strokeWidth={2} dot={{ r: 4 }} name="Energy (kWh)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-soft-pink/5 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                    Water Conservation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The fashion industry is the second-largest consumer of water. By participating in circular fashion, you've helped save approximately 5,280 liters of water.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};
