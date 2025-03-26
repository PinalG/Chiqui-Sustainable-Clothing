
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserInteractions } from "@/hooks/use-user-interactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend 
} from "recharts";
import { Download, Calendar, BarChart2, Droplets, Wind } from "lucide-react";
import { toast } from "sonner";

// Mock data for sustainability impact visualization
const waterSavedData = [
  { month: "Jan", value: 250 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 420 },
  { month: "Apr", value: 380 },
  { month: "May", value: 450 },
  { month: "Jun", value: 520 },
];

const co2ReducedData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 150 },
  { month: "Mar", value: 200 },
  { month: "Apr", value: 180 },
  { month: "May", value: 220 },
  { month: "Jun", value: 280 },
];

const wasteReducedData = [
  { month: "Jan", value: 75 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 110 },
  { month: "Apr", value: 100 },
  { month: "May", value: 130 },
  { month: "Jun", value: 160 },
];

// Chart configurations
const chartConfig = {
  waterSaved: { 
    label: "Water Saved (gallons)",
    color: "#00BFFF" 
  },
  co2Reduced: { 
    label: "CO2 Reduced (lbs)",
    color: "#FFC0CB" 
  },
  wasteReduced: { 
    label: "Waste Reduced (lbs)",
    color: "#32CD32" 
  }
};

const SustainabilityReports = () => {
  const { userData } = useAuth();
  const { userInteractions, isLoadingInteractions } = useUserInteractions();
  const [activeTab, setActiveTab] = useState("waterSaved");
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    to: new Date()
  });
  const [totalImpact, setTotalImpact] = useState({
    waterSaved: 0,
    co2Reduced: 0,
    wasteReduced: 0
  });
  
  // Calculate total sustainability impact from user donations
  useEffect(() => {
    if (!isLoadingInteractions && userInteractions?.donations) {
      const impact = userInteractions.donations.reduce((acc, donation) => {
        return {
          waterSaved: acc.waterSaved + (donation.sustainabilityImpact?.waterSaved || 0),
          co2Reduced: acc.co2Reduced + (donation.sustainabilityImpact?.co2Reduced || 0),
          wasteReduced: acc.wasteReduced + (donation.sustainabilityImpact?.wasteReduced || 0)
        };
      }, {
        waterSaved: 0,
        co2Reduced: 0,
        wasteReduced: 0
      });
      
      setTotalImpact(impact);
    }
  }, [userInteractions, isLoadingInteractions]);
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };
  
  const handleDownloadReport = () => {
    toast.success("Sustainability report downloaded successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Sustainability Impact</h2>
          <p className="text-muted-foreground">
            Track and visualize your environmental contributions through clothing donations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Water Saved</CardTitle>
            <CardDescription>Total gallons of water conserved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {totalImpact.waterSaved.toLocaleString()}
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Equivalent to {Math.round(totalImpact.waterSaved / 660)} loads of laundry
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">CO₂ Reduced</CardTitle>
            <CardDescription>Total pounds of carbon emissions prevented</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {totalImpact.co2Reduced.toLocaleString()}
              </div>
              <div className="bg-soft-pink/20 p-2 rounded-full">
                <Wind className="h-6 w-6 text-soft-pink" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Equivalent to {Math.round(totalImpact.co2Reduced / 22)} miles not driven
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Waste Reduced</CardTitle>
            <CardDescription>Total pounds of textile waste diverted from landfills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {totalImpact.wasteReduced.toLocaleString()}
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <BarChart2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Equivalent to {Math.round(totalImpact.wasteReduced / 5)} clothing items
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Environmental Impact Over Time</CardTitle>
          <CardDescription>
            View how your sustainability contributions have grown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="waterSaved">Water Saved</TabsTrigger>
              <TabsTrigger value="co2Reduced">CO₂ Reduced</TabsTrigger>
              <TabsTrigger value="wasteReduced">Waste Reduced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="waterSaved" className="pt-4">
              <ChartContainer className="h-80" config={{ value: chartConfig.waterSaved }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={waterSavedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="waterSavedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00BFFF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#00BFFF" 
                      fillOpacity={1}
                      fill="url(#waterSavedGradient)" 
                      name="Water Saved (gallons)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="co2Reduced" className="pt-4">
              <ChartContainer className="h-80" config={{ value: chartConfig.co2Reduced }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={co2ReducedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="co2ReducedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFC0CB" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FFC0CB" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FFC0CB" 
                      fillOpacity={1}
                      fill="url(#co2ReducedGradient)" 
                      name="CO₂ Reduced (lbs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="wasteReduced" className="pt-4">
              <ChartContainer className="h-80" config={{ value: chartConfig.wasteReduced }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={wasteReducedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="wasteReducedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#32CD32" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#32CD32" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#32CD32" 
                      fillOpacity={1}
                      fill="url(#wasteReducedGradient)" 
                      name="Waste Reduced (lbs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityReports;
