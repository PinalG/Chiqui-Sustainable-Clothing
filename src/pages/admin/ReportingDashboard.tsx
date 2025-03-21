
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for reports
const taxBenefitsByRetailer = [
  { name: "EcoFashion Inc.", value: 15000 },
  { name: "GreenThreads Co.", value: 12000 },
  { name: "Fashion Forward", value: 8500 },
  { name: "Sustainable Styles", value: 7200 },
  { name: "Eco Apparel", value: 6300 },
];

const sustainabilityMetricsByMonth = [
  { 
    month: "Jan", 
    carbonSaved: 20, 
    textileWaste: 15, 
    waterSaved: 25 
  },
  { 
    month: "Feb", 
    carbonSaved: 25, 
    textileWaste: 18, 
    waterSaved: 30 
  },
  { 
    month: "Mar", 
    carbonSaved: 30, 
    textileWaste: 22, 
    waterSaved: 35 
  },
  { 
    month: "Apr", 
    carbonSaved: 35, 
    textileWaste: 28, 
    waterSaved: 40 
  },
  { 
    month: "May", 
    carbonSaved: 45, 
    textileWaste: 35, 
    waterSaved: 50 
  },
  { 
    month: "Jun", 
    carbonSaved: 50, 
    textileWaste: 40, 
    waterSaved: 55 
  },
];

const storageUsage = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 55 },
  { month: "May", value: 60 },
  { month: "Jun", value: 70 },
];

// Chart configurations
const taxBenefitsChartConfig = {
  value: { 
    label: "Tax Benefits",
    color: "#FFC0CB" 
  }
};

const sustainabilityChartConfig = {
  carbonSaved: { 
    label: "Carbon Saved",
    color: "#FFC0CB" 
  },
  textileWaste: { 
    label: "Textile Waste Reduction",
    color: "#B0B0B0" 
  },
  waterSaved: { 
    label: "Water Saved",
    color: "#90CAF9" 
  }
};

const storageChartConfig = {
  value: { 
    label: "Storage Space (m²)",
    color: "#FFC0CB" 
  }
};

const ReportingDashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("taxBenefits");
  
  const handleExport = () => {
    toast.success(`Exported ${reportType} report as CSV`);
  };
  
  return (
    <AdminLayout title="Reporting & Analytics">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View detailed reports on tax benefits and sustainability metrics
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList className="bg-soft-pink/10">
          <TabsTrigger value="taxBenefits">Tax Benefits</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability Metrics</TabsTrigger>
          <TabsTrigger value="storage">Storage Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="taxBenefits" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Tax Benefits by Retailer</CardTitle>
              <CardDescription>
                Total tax benefits claimed through paper donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={taxBenefitsChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taxBenefitsByRetailer}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 120, bottom: 0 }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#FFC0CB"
                      radius={[0, 4, 4, 0]} 
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Key Insights:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• EcoFashion Inc. has claimed the highest tax benefits ($15,000)</li>
                  <li>• Total tax benefits across all retailers: $49,000</li>
                  <li>• Average tax benefit per retailer: $9,800</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sustainability" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Sustainability Impact Metrics</CardTitle>
              <CardDescription>
                Environmental benefits from donation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={sustainabilityChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sustainabilityMetricsByMonth}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Line 
                      type="monotone" 
                      dataKey="carbonSaved" 
                      stroke="#FFC0CB" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#FFC0CB", strokeWidth: 2, stroke: "#FFF" }}
                      activeDot={{ r: 6 }}
                      name="Carbon Saved"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="textileWaste" 
                      stroke="#B0B0B0" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#B0B0B0", strokeWidth: 2, stroke: "#FFF" }}
                      activeDot={{ r: 6 }}
                      name="Textile Waste Reduction"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="waterSaved" 
                      stroke="#90CAF9" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#90CAF9", strokeWidth: 2, stroke: "#FFF" }}
                      activeDot={{ r: 6 }}
                      name="Water Saved"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFC0CB]" />
                  <span className="text-sm">Carbon Saved (tons)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#B0B0B0]" />
                  <span className="text-sm">Textile Waste (tons)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#90CAF9]" />
                  <span className="text-sm">Water Saved (kL)</span>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Environmental Impact Summary:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-soft-pink/10 rounded-lg">
                    <div className="text-2xl font-bold">205</div>
                    <div className="text-sm text-muted-foreground">Total Carbon Saved (tons)</div>
                  </div>
                  <div className="p-3 bg-heather-grey/10 rounded-lg">
                    <div className="text-2xl font-bold">158</div>
                    <div className="text-sm text-muted-foreground">Total Textile Waste Reduced (tons)</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <div className="text-2xl font-bold">235</div>
                    <div className="text-sm text-muted-foreground">Total Water Saved (kL)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="storage" className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Storage Usage Trends</CardTitle>
              <CardDescription>
                Storage space donated and utilized over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={storageChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={storageUsage}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      fill="#FFC0CB" 
                      stroke="#FFC0CB"
                      fillOpacity={0.3}
                      name="Storage Space (m²)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Storage Statistics:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Current total storage donated: 70 m²</li>
                  <li>• Month-over-month growth: 16.7%</li>
                  <li>• Projected storage needs for next quarter: 100 m²</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ReportingDashboard;
