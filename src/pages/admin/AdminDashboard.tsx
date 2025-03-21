
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

// Mock data for charts
const donationData = [
  { month: "Jan", donations: 120 },
  { month: "Feb", donations: 150 },
  { month: "Mar", donations: 200 },
  { month: "Apr", donations: 180 },
  { month: "May", donations: 220 },
  { month: "Jun", donations: 250 },
];

const taxBenefitData = [
  { month: "Jan", value: 5000 },
  { month: "Feb", value: 7500 },
  { month: "Mar", value: 12000 },
  { month: "Apr", value: 10000 },
  { month: "May", value: 15000 },
  { month: "Jun", value: 18500 },
];

const userTypeData = [
  { name: "Consumers", value: 65, color: "#FFC0CB" },
  { name: "Retailers", value: 25, color: "#B0B0B0" },
  { name: "Logistics", value: 10, color: "#F8C3CD" },
];

const sustainabilityData = [
  { name: "Carbon Saved", value: 75 },
  { name: "Textile Waste Reduced", value: 65 },
  { name: "Water Saved", value: 82 },
];

const COLORS = ["#FFC0CB", "#B0B0B0", "#F8C3CD", "#F0EAD6"];

// Chart configurations
const donationChartConfig = {
  donations: { 
    label: "Donations",
    color: "#FFC0CB" 
  }
};

const taxBenefitChartConfig = {
  value: { 
    label: "Tax Benefits",
    color: "#FFC0CB" 
  }
};

const userDistributionChartConfig = {
  Consumers: { 
    label: "Consumers",
    color: "#FFC0CB" 
  },
  Retailers: { 
    label: "Retailers",
    color: "#B0B0B0" 
  },
  Logistics: { 
    label: "Logistics",
    color: "#F8C3CD" 
  }
};

const AdminDashboard = () => {
  const [period, setPeriod] = useState("monthly");
  
  const totalDonations = donationData.reduce((sum, item) => sum + item.donations, 0);
  const totalTaxBenefits = taxBenefitData.reduce((sum, item) => sum + item.value, 0);
  const totalUsers = 450; // Mock total users
  const totalRetailers = 35; // Mock total retailers
  
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Donations"
          value={totalDonations}
          description="Items donated"
          trend={12.5}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          title="Tax Benefits"
          value={`$${(totalTaxBenefits / 1000).toFixed(1)}k`}
          description="Total value"
          trend={9.2}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Users"
          value={totalUsers}
          description="Total users"
          trend={5.1}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Retailers"
          value={totalRetailers}
          description="Participating retailers"
          trend={3.2}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue={period} onValueChange={setPeriod} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <TabsList className="bg-soft-pink/10">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={period} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Number of items donated over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-72" config={donationChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={donationData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Bar dataKey="donations" fill="#FFC0CB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Tax Benefits</CardTitle>
                <CardDescription>Cumulative tax benefits generated</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-72" config={taxBenefitChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taxBenefitData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#FFC0CB" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "#FFC0CB", strokeWidth: 2, stroke: "#FFF" }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-72" config={userDistributionChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={800}
                        animationBegin={200}
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {userTypeData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Sustainability Metrics</CardTitle>
                <CardDescription>Environmental impact measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sustainabilityData.map((item, index) => (
                    <SustainabilityMetric
                      key={index}
                      name={item.name}
                      value={item.value}
                      color={COLORS[index]}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, description, trend, icon }: MetricCardProps) => {
  const isTrendPositive = trend > 0;
  
  return (
    <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-soft-pink/10 flex items-center justify-center text-soft-pink">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <span className={isTrendPositive ? "text-green-500" : "text-red-500"}>
            {isTrendPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          </span>
          <span className={isTrendPositive ? "text-green-500" : "text-red-500"}>
            {trend}%
          </span>
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface SustainabilityMetricProps {
  name: string;
  value: number;
  color: string;
}

const SustainabilityMetric = ({ name, value, color }: SustainabilityMetricProps) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div 
          className="h-2 rounded-full transition-all duration-500 animate-fade-in"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
