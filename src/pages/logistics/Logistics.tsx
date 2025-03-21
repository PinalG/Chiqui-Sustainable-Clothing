
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, Package, Warehouse, Users, History, 
  BarChart2, Map, Settings, Filter 
} from "lucide-react";
import ShippingBidSystem from "@/components/logistics/ShippingBidSystem";
import WarehouseManagement from "@/components/logistics/WarehouseManagement";
import LogisticsPartners from "@/components/logistics/LogisticsPartners";
import ShipmentTracking from "@/components/logistics/ShipmentTracking";

const Logistics = () => {
  const [activeTab, setActiveTab] = useState("shipping");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logistics & Supply Chain</h1>
        <p className="text-muted-foreground">
          Manage shipping bids, warehouse inventory, and logistics partners in one place.
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Logistics Management</CardTitle>
          <CardDescription>
            Optimize your supply chain with AI-driven bidding and real-time tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shipping" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden md:inline">Shipping Bids</span>
              </TabsTrigger>
              <TabsTrigger value="warehouse" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                <span className="hidden md:inline">Warehouse</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden md:inline">Tracking</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="shipping" className="mt-6">
              <ShippingBidSystem />
            </TabsContent>
            
            <TabsContent value="warehouse" className="mt-6">
              <WarehouseManagement />
            </TabsContent>
            
            <TabsContent value="partners" className="mt-6">
              <LogisticsPartners />
            </TabsContent>
            
            <TabsContent value="tracking" className="mt-6">
              <ShipmentTracking />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logistics;
