import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download, FileText, HelpCircle, Info, TrendingUp, DollarSign, BarChart2, Calendar } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

const monthlyDonationsData = [
  { name: 'Jan', donations: 65, value: 4500 },
  { name: 'Feb', donations: 72, value: 5200 },
  { name: 'Mar', donations: 85, value: 6100 },
  { name: 'Apr', donations: 93, value: 7800 },
  { name: 'May', donations: 102, value: 8200 },
  { name: 'Jun', donations: 120, value: 9500 },
];

const categoryData = [
  { name: 'Clothing', value: 540 },
  { name: 'Accessories', value: 210 },
  { name: 'Footwear', value: 170 },
  { name: 'Outerwear', value: 120 },
  { name: 'Sportswear', value: 160 },
];

const COLORS = ['#FFC0CB', '#B0B0B0', '#FFD580', '#90EE90', '#ADD8E6'];

interface ReportSummary {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  change: string;
  isPositive: boolean;
}

const DonationReports = () => {
  const { userData } = useAuth();
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() });
  const [reports, setReports] = useState<ReportSummary[]>([]);
  
  useEffect(() => {
    setReports([
      {
        title: "Total Donations",
        value: "537",
        icon: <FileText className="h-5 w-5 text-soft-pink" />,
        description: "Total number of retail donations registered",
        change: "+12.5%",
        isPositive: true
      },
      {
        title: "Estimated Value",
        value: "$41,200",
        icon: <DollarSign className="h-5 w-5 text-soft-pink" />,
        description: "Total estimated value of donated items",
        change: "+8.2%",
        isPositive: true
      },
      {
        title: "Tax Benefits",
        value: "$12,360",
        icon: <TrendingUp className="h-5 w-5 text-soft-pink" />,
        description: "Estimated tax benefits from donations",
        change: "+9.7%",
        isPositive: true
      },
      {
        title: "Storage Benefits",
        value: "$5,820",
        icon: <BarChart2 className="h-5 w-5 text-soft-pink" />,
        description: "Estimated tax benefits from donated storage space",
        change: "+15.3%",
        isPositive: true
      },
    ]);
  }, [dateRange]);
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    console.log("Date range changed:", range);
  };
  
  const handleDownloadReport = () => {
    console.log("Downloading report for date range:", dateRange);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Donation Reports</h2>
          <p className="text-muted-foreground">
            View detailed reports and analytics for your retail donations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
          </div>
          
          <Button className="w-full sm:w-auto" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report, index) => (
          <Card key={index} className="glass-morphism">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-background/60 p-2 rounded-full">
                  {report.icon}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>{report.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{report.title}</p>
                <h3 className="text-2xl font-bold">{report.value}</h3>
                <div className="flex items-center">
                  <span className={`text-xs ${report.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {report.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">vs. previous period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Monthly Donations</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Number of donations per month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Total number of retail donations registered monthly
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyDonationsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="donations" fill="#FFC0CB" name="Donations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Donation Value</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Estimated value of donations per month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Estimated value of retail donations in USD
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyDonationsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" fill="#B0B0B0" name="Value (USD)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-morphism col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Category Breakdown</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Distribution of donations by category</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Number of items donated by category
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>
              Your most recent retail donations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-background/60 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-soft-pink" />
                    </div>
                    <div>
                      <h4 className="font-medium">Batch #{Math.floor(1000 + Math.random() * 9000)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {['Clothing', 'Footwear', 'Accessories', 'Sportswear'][Math.floor(Math.random() * 4)]} • 
                        {Math.floor(5 + Math.random() * 20)} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Math.floor(100 + Math.random() * 900)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View All Donations
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your complete donation history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DonationReports;
