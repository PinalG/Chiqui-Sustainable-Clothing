
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  ShieldCheck, 
  BarChart4, 
  BoxIcon, 
  TruckIcon,
  Receipt,
  DollarSign,
  RefreshCcwIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  HelpCircle,
  PackageIcon
} from "lucide-react";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useToast } from "@/components/ui/use-toast";
import SustainabilityReports from "@/components/analytics/SustainabilityReports";
import ComplianceDashboard from "@/components/analytics/ComplianceDashboard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Line } from "recharts";
import { 
  useInventoryStats,
  useBidStats,
  useTaxStats,
  useSalesStats
} from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COLORS = ["#FFC0CB", "#B0B0B0", "#FFD580", "#90EE90", "#ADD8E6"];

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { trackEvent } = usePerformance();
  const { toast } = useToast();
  
  // Fetch real-time data
  const { 
    data: inventoryStats, 
    isLoading: isInventoryLoading,
    refetch: refetchInventory
  } = useInventoryStats();
  
  const { 
    data: bidStats, 
    isLoading: isBidsLoading,
    refetch: refetchBids
  } = useBidStats();
  
  const { 
    data: taxStats, 
    isLoading: isTaxLoading,
    refetch: refetchTax
  } = useTaxStats();
  
  const { 
    data: salesStats, 
    isLoading: isSalesLoading,
    refetch: refetchSales
  } = useSalesStats();
  
  // Track tab changes for analytics
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent('analytics', 'tab_change', tab);
  };
  
  const handleRefreshData = () => {
    const promises = [];
    
    switch (activeTab) {
      case 'inventory':
        promises.push(refetchInventory());
        break;
      case 'bids':
        promises.push(refetchBids());
        break;
      case 'tax':
        promises.push(refetchTax());
        break;
      case 'sales':
        promises.push(refetchSales());
        break;
      case 'sustainability':
      case 'compliance':
        // These tabs handle their own data refresh
        break;
      default:
        promises.push(refetchInventory());
        promises.push(refetchBids());
        promises.push(refetchTax());
        promises.push(refetchSales());
    }
    
    toast({
      title: "Refreshing data",
      description: "Fetching the latest analytics data..."
    });
    
    Promise.all(promises).then(() => {
      toast({
        title: "Data refreshed",
        description: "Analytics dashboard has been updated with the latest data."
      });
    });
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Real-time insights for inventory, bids, tax benefits, and sales
          </p>
        </div>
        
        <Button onClick={handleRefreshData} variant="outline" className="flex items-center gap-2">
          <RefreshCcwIcon className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BoxIcon className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="bids" className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4" />
            <span>Bids</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>Tax Benefits</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Sales</span>
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Sustainability</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Inventory Analytics */}
        <TabsContent value="inventory" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Items"
                value={inventoryStats?.totalItems}
                isLoading={isInventoryLoading}
                icon={<BoxIcon className="h-5 w-5 text-soft-pink" />}
                description="Total inventory items"
                isPositive={true}
              />
              
              <MetricCard 
                title="Available Items"
                value={inventoryStats?.availableItems}
                isLoading={isInventoryLoading}
                icon={<PackageIcon className="h-5 w-5 text-soft-pink" />}
                description={`${inventoryStats?.availableItems && inventoryStats.totalItems ? 
                  ((inventoryStats.availableItems / inventoryStats.totalItems) * 100).toFixed(1) : 0}% of total`}
                isPositive={true}
              />
              
              <MetricCard 
                title="Pending Items"
                value={inventoryStats?.pendingItems}
                isLoading={isInventoryLoading}
                icon={<RefreshCcwIcon className="h-5 w-5 text-soft-pink" />}
                description="In processing or transit"
                isPositive={true}
              />
              
              <MetricCard 
                title="Low Stock Items"
                value={inventoryStats?.lowStockItems}
                isLoading={isInventoryLoading}
                icon={<ArrowDownRightIcon className="h-5 w-5 text-red-500" />}
                description="Items that need attention"
                isPositive={false}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Inventory by Category</CardTitle>
                  <CardDescription>
                    Distribution of items by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isInventoryLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={inventoryStats?.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {inventoryStats?.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Inventory Trends</CardTitle>
                  <CardDescription>
                    Monthly inventory levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isInventoryLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={inventoryStats?.monthlyCounts}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} items`, 'Inventory']} />
                        <Bar dataKey="count" fill="#FFC0CB" name="Items" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Bids Analytics */}
        <TabsContent value="bids" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Bids"
                value={bidStats?.totalBids}
                isLoading={isBidsLoading}
                icon={<TruckIcon className="h-5 w-5 text-soft-pink" />}
                description="Shipping bids received"
                isPositive={true}
              />
              
              <MetricCard 
                title="Avg Bid Amount"
                value={`$${bidStats?.averageBidAmount.toFixed(2)}`}
                isLoading={isBidsLoading}
                icon={<DollarSign className="h-5 w-5 text-soft-pink" />}
                description="Average shipping cost"
                isPositive={true}
              />
              
              <MetricCard 
                title="Winning %"
                value={`${bidStats?.winningBidsPercentage}%`}
                isLoading={isBidsLoading}
                icon={<ArrowUpRightIcon className="h-5 w-5 text-green-500" />}
                description="Bids that won"
                isPositive={true}
              />
              
              <MetricCard 
                title="Carbon Saved"
                value={`${bidStats?.carbonSaved.toFixed(1)} kg`}
                isLoading={isBidsLoading}
                icon={<LineChart className="h-5 w-5 text-green-500" />}
                description="CO₂ emissions saved"
                isPositive={true}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Bids by Carrier</CardTitle>
                  <CardDescription>
                    Distribution of shipping bids by carrier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isBidsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={bidStats?.bidsByCarrier}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="carrier"
                          label={({ carrier, percentage }) => `${carrier} ${percentage.toFixed(0)}%`}
                        >
                          {bidStats?.bidsByCarrier.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} bids (${props.payload.percentage.toFixed(1)}%)`, props.payload.carrier]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Bid Trends</CardTitle>
                  <CardDescription>
                    Monthly bid counts and average amounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isBidsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={bidStats?.bidTrends}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="count" fill="#FFC0CB" name="Bids" />
                        <Bar yAxisId="right" dataKey="averageAmount" fill="#B0B0B0" name="Avg Amount ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tax Benefits Analytics */}
        <TabsContent value="tax" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Tax Benefits"
                value={`$${taxStats?.totalTaxBenefits.toLocaleString()}`}
                isLoading={isTaxLoading}
                icon={<Receipt className="h-5 w-5 text-soft-pink" />}
                description="Total tax savings"
                isPositive={true}
              />
              
              <MetricCard 
                title="Inventory Benefits"
                value={`$${taxStats?.inventoryBenefits.toLocaleString()}`}
                isLoading={isTaxLoading}
                icon={<BoxIcon className="h-5 w-5 text-soft-pink" />}
                description="From donated goods"
                isPositive={true}
              />
              
              <MetricCard 
                title="Storage Benefits"
                value={`$${taxStats?.storageBenefits.toLocaleString()}`}
                isLoading={isTaxLoading}
                icon={<PackageIcon className="h-5 w-5 text-soft-pink" />}
                description="From donated space"
                isPositive={true}
              />
              
              <MetricCard 
                title="Projected Annual"
                value={`$${taxStats?.projectedAnnualBenefits.toLocaleString()}`}
                isLoading={isTaxLoading}
                icon={<ArrowUpRightIcon className="h-5 w-5 text-green-500" />}
                description="Projected benefits for year"
                isPositive={true}
              />
            </div>
            
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Monthly Tax Benefits</CardTitle>
                <CardDescription>
                  Tax benefits accrued monthly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTaxLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={taxStats?.monthlyBenefits}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Tax Benefits']} />
                      <Bar dataKey="amount" fill="#FFC0CB" name="Tax Benefits" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sales Analytics */}
        <TabsContent value="sales" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Sales"
                value={salesStats?.totalSales}
                isLoading={isSalesLoading}
                icon={<DollarSign className="h-5 w-5 text-soft-pink" />}
                description="Orders completed"
                isPositive={true}
              />
              
              <MetricCard 
                title="Revenue"
                value={`$${salesStats?.revenueGenerated.toLocaleString()}`}
                isLoading={isSalesLoading}
                icon={<ArrowUpRightIcon className="h-5 w-5 text-green-500" />}
                description="Total revenue generated"
                isPositive={true}
              />
              
              <MetricCard 
                title="Avg Order Value"
                value={`$${salesStats?.averageOrderValue.toFixed(2)}`}
                isLoading={isSalesLoading}
                icon={<Receipt className="h-5 w-5 text-soft-pink" />}
                description="Average value per order"
                isPositive={true}
              />
              
              <MetricCard 
                title="Conversion Rate"
                value={`${salesStats?.conversionRate}%`}
                isLoading={isSalesLoading}
                icon={<RefreshCcwIcon className="h-5 w-5 text-soft-pink" />}
                description="Visitors who purchase"
                isPositive={true}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                  <CardDescription>
                    Sales data by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSalesLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={salesStats?.monthlySales}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="count" fill="#FFC0CB" name="Orders" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#B0B0B0" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Top Selling Categories</CardTitle>
                  <CardDescription>
                    Sales distribution by product category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSalesLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={salesStats?.topSellingCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="sales"
                          nameKey="category"
                          label={({ category, percentage }) => `${category} ${percentage.toFixed(0)}%`}
                        >
                          {salesStats?.topSellingCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} sales (${props.payload.percentage.toFixed(1)}%)`, props.payload.category]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityReports />
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <ComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  description: string;
  isLoading: boolean;
  isPositive: boolean;
}

const MetricCard = ({ title, value, icon, description, isLoading, isPositive }: MetricCardProps) => {
  return (
    <TooltipProvider>
      <Card className="glass-morphism">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="bg-background/60 p-2 rounded-full">
              {icon}
            </div>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{title}: {description}</p>
              </TooltipContent>
            </TooltipUI>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">{value}</h3>
            )}
            <div className="flex items-center">
              <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {description}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AnalyticsDashboard;
