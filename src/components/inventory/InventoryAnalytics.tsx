
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample data for charts
const turnoverData = [
  { name: "Jan", turnover: 12 },
  { name: "Feb", turnover: 18 },
  { name: "Mar", turnover: 16 },
  { name: "Apr", turnover: 21 },
  { name: "May", turnover: 26 },
  { name: "Jun", turnover: 24 },
];

const inventoryValueData = [
  { name: "Jan", value: 125000 },
  { name: "Feb", value: 145000 },
  { name: "Mar", value: 165000 },
  { name: "Apr", value: 155000 },
  { name: "May", value: 180000 },
  { name: "Jun", value: 195000 },
];

const categoryData = [
  { name: "Clothing", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Footwear", value: 15 },
  { name: "Outerwear", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = ["#FFC0CB", "#A7D8FF", "#B0B0B0", "#FFD700", "#90EE90"];

const warehouseData = [
  { name: "Warehouse A", items: 1250 },
  { name: "Warehouse B", items: 850 },
  { name: "Warehouse C", items: 540 },
];

const InventoryAnalytics = () => {
  const [timeframe, setTimeframe] = useState("6m");
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your inventory analytics report has been downloaded.",
    });
  };
  
  const handleDateRangeChange = (value: string) => {
    setTimeframe(value);
    toast({
      title: "Timeframe Updated",
      description: `Analytics view updated to ${value === "1m" ? "1 month" : value === "6m" ? "6 months" : "1 year"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Inventory Analytics</CardTitle>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="6m" onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadReport}>
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Turnover</CardTitle>
            <CardDescription>Average turnover rate per month</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} times`, 'Turnover']} />
                  <Bar dataKey="turnover" fill="#FFC0CB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Category Distribution</CardTitle>
            <CardDescription>Percentage of items by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <div
                    className="w-3 h-3 mr-1 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Warehouse Distribution</CardTitle>
            <CardDescription>Items stored per warehouse</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={warehouseData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Bar dataKey="items" fill="#B0B0B0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Inventory Value Over Time</CardTitle>
          <CardDescription>Total value of inventory assets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventoryValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Inventory Value']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#FFC0CB"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$195,000</div>
                    <p className="text-sm text-muted-foreground">+8.3% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Average Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$160,833</div>
                    <p className="text-sm text-muted-foreground">Past 6 months average</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Highest Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$195,000</div>
                    <p className="text-sm text-muted-foreground">Reached in June</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAnalytics;
