
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, ShoppingBag, TrendingUp, Users, Leaf, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  
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

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Chiqui platform dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <ShoppingBag className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paper Donations</CardTitle>
            <BarChart2 className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,385</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retail Partners</CardTitle>
            <Users className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
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
