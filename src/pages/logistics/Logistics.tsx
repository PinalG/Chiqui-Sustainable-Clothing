
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, BarChart2, Warehouse, History, Map } from "lucide-react";
import ShippingBidSystem from "@/components/logistics/ShippingBidSystem";
import ShipmentTracking from "@/components/logistics/ShipmentTracking";
import LogisticsPartners from "@/components/logistics/LogisticsPartners";
import WarehouseManagement from "@/components/logistics/WarehouseManagement";

const Logistics = () => {
  const [activeTab, setActiveTab] = useState("bidding");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logistics Management</h1>
        <p className="text-muted-foreground">
          AI-optimized logistics solutions for sustainable and efficient shipping
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Logistics & Shipping Center</CardTitle>
          <CardDescription>
            Manage shipping, warehouse space, and optimize your supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              <TabsTrigger value="bidding" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden md:inline">AI Bidding</span>
                <span className="inline md:hidden">Bidding</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden md:inline">Tracking</span>
                <span className="inline md:hidden">Track</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden md:inline">History</span>
                <span className="inline md:hidden">History</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden md:inline">Partners</span>
                <span className="inline md:hidden">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="warehouse" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                <span className="hidden md:inline">Warehouse</span>
                <span className="inline md:hidden">Storage</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bidding" className="mt-6">
              <ShippingBidSystem />
            </TabsContent>
            
            <TabsContent value="tracking" className="mt-6">
              <ShipmentTracking />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <div className="p-8 text-center">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Shipment History</h3>
                <p className="text-muted-foreground">
                  View your shipment history and performance metrics. This feature is coming soon.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="partners" className="mt-6">
              <LogisticsPartners />
            </TabsContent>
            
            <TabsContent value="warehouse" className="mt-6">
              <WarehouseManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logistics;
