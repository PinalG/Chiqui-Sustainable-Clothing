
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, BarChart2, ClipboardList, AlertCircle, Users } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import WarehouseManagement from "@/components/logistics/WarehouseManagement";
import SupplyChainOverview from "@/components/inventory/SupplyChainOverview";
import InventoryAnalytics from "@/components/inventory/InventoryAnalytics";
import ShipmentTracking from "@/components/logistics/ShipmentTracking";
import LogisticsPartners from "@/components/logistics/LogisticsPartners";
import { toast } from "@/hooks/use-toast";

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Check if user has retailer role
  const isRetailer = userData?.role === "retailer" || userData?.role === "admin";

  const navigateToQRGenerator = () => {
    navigate("/retail-donations", { state: { activeTab: "qrcode" } });
  };

  const handlePrintInventoryReport = () => {
    toast({
      title: "Report Generated",
      description: "Your inventory report has been generated and is ready for download.",
    });
  };

  if (!isRetailer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <AlertCircle className="h-16 w-16 text-soft-pink mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-gray-500 text-center mb-6">This page is only available to retail partners.</p>
        <Button onClick={() => navigate("/")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Monitor, track, and optimize your inventory and supply chain
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintInventoryReport}>
            Generate Report
          </Button>
          <Button onClick={navigateToQRGenerator}>
            Generate QR Codes
          </Button>
        </div>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Inventory & Supply Chain</CardTitle>
          <CardDescription>
            Manage your inventory, track shipments, and optimize your supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="warehouse" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Warehouse</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden md:inline">Tracking</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden md:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <SupplyChainOverview />
            </TabsContent>
            
            <TabsContent value="warehouse" className="mt-6">
              <WarehouseManagement />
            </TabsContent>
            
            <TabsContent value="tracking" className="mt-6">
              <ShipmentTracking />
            </TabsContent>
            
            <TabsContent value="partners" className="mt-6">
              <LogisticsPartners />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <InventoryAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
