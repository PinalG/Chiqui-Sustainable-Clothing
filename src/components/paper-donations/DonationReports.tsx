
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Download, Filter, FileBarChart, Package, Truck, ShoppingBag, Leaf, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data for reports
const categoryData = [
  { name: "Clothing", value: 42, color: "#FFC0CB" },
  { name: "Accessories", value: 18, color: "#FF9E99" },
  { name: "Footwear", value: 15, color: "#FFB88C" },
  { name: "Outerwear", value: 12, color: "#80CBC4" },
  { name: "Sportswear", value: 8, color: "#90CAF9" },
  { name: "Formalwear", value: 5, color: "#BCAAA4" },
];

const monthlyData = [
  { name: "Jan", donations: 65, sales: 45, value: 2850 },
  { name: "Feb", donations: 78, sales: 52, value: 3250 },
  { name: "Mar", donations: 92, sales: 71, value: 4250 },
  { name: "Apr", donations: 120, sales: 85, value: 5100 },
  { name: "May", donations: 165, sales: 110, value: 6500 },
  { name: "Jun", donations: 135, sales: 98, value: 5850 },
];

const impactData = [
  { name: "CO₂ Reduction", value: 2.5, unit: "tons" },
  { name: "Water Saved", value: 15000, unit: "gallons" },
  { name: "Landfill Diversion", value: 1.2, unit: "tons" },
  { name: "Energy Saved", value: 4500, unit: "kWh" },
];

const statusData = [
  { name: "Available", value: 42, color: "#4CAF50" },
  { name: "Sold", value: 30, color: "#FFC0CB" },
  { name: "Shipping", value: 15, color: "#2196F3" },
  { name: "Pending", value: 13, color: "#FFC107" },
];

const DonationReports = () => {
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() });
  const [reportType, setReportType] = useState("all");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="donations">Donations Only</SelectItem>
              <SelectItem value="sales">Sales Only</SelectItem>
              <SelectItem value="impact">Impact Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Impact
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-morphism">
              <CardContent className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-soft-pink" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                  <p className="text-2xl font-bold">655</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism">
              <CardContent className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
                  <ShoppingBag className="h-5 w-5 text-soft-pink" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">461</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism">
              <CardContent className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-soft-pink" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">$27,800</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism">
              <CardContent className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
                  <Leaf className="h-5 w-5 text-soft-pink" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CO₂ Reduction</p>
                  <p className="text-2xl font-bold">2.5 tons</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Monthly Donation Activity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donations" name="Donations" fill="#FFC0CB" />
                    <Bar dataKey="sales" name="Sales" fill="#B0B0B0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Donation Status</h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Donation Timeline</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="donations" name="Total Items" fill="#FFC0CB" />
                    <Bar dataKey="value" name="Value ($)" fill="#B0B0B0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Recent Donation Batches</h3>
              <div className="space-y-3">
                {[
                  { id: "BATCH1234", name: "Spring Collection 2023", date: "June 15, 2023", items: 42, value: 1250.50, status: "Available" },
                  { id: "BATCH1235", name: "Summer Accessories", date: "June 10, 2023", items: 68, value: 2340.75, status: "Available" },
                  { id: "BATCH1236", name: "Winter Outerwear", date: "May 28, 2023", items: 23, value: 4320.30, status: "Sold" },
                  { id: "BATCH1237", name: "Formal Collection", date: "May 22, 2023", items: 36, value: 5670.80, status: "Shipping" },
                  { id: "BATCH1238", name: "Athletic Wear", date: "May 15, 2023", items: 54, value: 1890.40, status: "Sold" },
                ].map((batch, index) => (
                  <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded-md border">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{batch.name}</h4>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200">{batch.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {batch.date}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="text-right mr-4">
                        <p className="text-sm">{batch.items} items</p>
                        <p className="text-sm font-medium">${batch.value.toFixed(2)}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        batch.status === "Available" ? "bg-green-100 text-green-800" :
                        batch.status === "Shipping" ? "bg-blue-100 text-blue-800" :
                        "bg-soft-pink/10 text-soft-pink"
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Sales Performance</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" name="Items Sold" fill="#FFC0CB" />
                    <Bar dataKey="value" name="Revenue ($)" fill="#B0B0B0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Sales Conversion Rate</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donations" name="Total Donations" fill="#B0B0B0" />
                    <Bar dataKey="sales" name="Items Sold" fill="#FFC0CB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Recent Sales</h3>
              <div className="space-y-3">
                {[
                  { id: "ORDER4321", batch: "Winter Outerwear", date: "June 12, 2023", items: 23, value: 4320.30, buyer: "EcoFashion Inc." },
                  { id: "ORDER4322", batch: "Formal Collection", date: "June 8, 2023", items: 36, value: 5670.80, buyer: "Green Retail Co." },
                  { id: "ORDER4323", batch: "Athletic Wear", date: "June 3, 2023", items: 54, value: 1890.40, buyer: "Sustainable Threads" },
                  { id: "ORDER4324", batch: "Designer Shoes", date: "May 27, 2023", items: 29, value: 3450.60, buyer: "EcoFashion Inc." },
                  { id: "ORDER4325", batch: "Summer Dresses", date: "May 20, 2023", items: 42, value: 2850.25, buyer: "Green Retail Co." },
                ].map((sale, index) => (
                  <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded-md border">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{sale.batch}</h4>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200">{sale.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {sale.date}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center mt-2 md:mt-0">
                      <p className="text-sm text-right md:mr-4">
                        Buyer: <span className="font-medium">{sale.buyer}</span>
                      </p>
                      <div className="text-right">
                        <p className="text-sm">{sale.items} items</p>
                        <p className="text-sm font-medium">${sale.value.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactData.map((item, index) => (
              <Card key={index} className="glass-morphism">
                <CardContent className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
                    <Leaf className="h-5 w-5 text-soft-pink" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                    <p className="text-2xl font-bold">
                      {item.value.toLocaleString()} {item.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md p-4">
            <h3 className="text-lg font-medium mb-4">Environmental Impact Timeline</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="donations" name="Items Donated" fill="#FFC0CB" />
                  <Bar dataKey="sales" name="CO₂ Saved (kg)" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Community Contribution</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-medium">At-Risk Youth Program Support</h4>
                  <p className="text-sm my-2">Your donations have contributed to funding after-school programs for 25 at-risk youth in the local community.</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contribution: $2,500</span>
                    <span className="text-soft-pink font-medium">Impact: High</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-medium">Workforce Development</h4>
                  <p className="text-sm my-2">Your paper donations have created 3 jobs in sustainable fashion and logistics in underserved communities.</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jobs Created: 3</span>
                    <span className="text-soft-pink font-medium">Impact: Medium</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-medium">Local Economic Support</h4>
                  <p className="text-sm my-2">Revenues from your donations have been reinvested in local businesses and community initiatives.</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Local Investment: $5,750</span>
                    <span className="text-soft-pink font-medium">Impact: High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationReports;
