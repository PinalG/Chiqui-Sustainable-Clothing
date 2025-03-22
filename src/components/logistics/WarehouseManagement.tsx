
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Warehouse, Search, Filter, Clock, RefreshCw, Loader2, 
  SortAsc, SortDesc, CheckCircle, AlertTriangle, XCircle, 
  WifiOff
} from "lucide-react";
import { WarehouseItem, getWarehouseInventory } from "@/services/logisticsService";
import { motion } from "framer-motion";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import LiveInventoryUpdates from "./LiveInventoryUpdates";

const warehouseLocations = [
  { id: "warehouse-1", name: "Los Angeles Warehouse", location: "Los Angeles, CA" },
  { id: "warehouse-2", name: "Dallas Distribution Center", location: "Dallas, TX" },
  { id: "warehouse-3", name: "New York Fulfillment Center", location: "New York, NY" }
];

const WarehouseManagement = () => {
  const [inventory, setInventory] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WarehouseItem['status'] | "all">("all");
  const [sortField, setSortField] = useState<"productId" | "quantity" | "lastUpdated">("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { isConnected, subscribe } = useWebSocketContext();

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const warehouseId = selectedWarehouse === "all" ? undefined : selectedWarehouse;
        const data = await getWarehouseInventory(warehouseId);
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [selectedWarehouse]);

  // Subscribe to real-time inventory updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe<WarehouseItem>('inventory_update', (update) => {
      setInventory(prev => {
        // Find if the item already exists in our inventory
        const itemIndex = prev.findIndex(item => 
          item.productId === update.productId && 
          item.warehouseId === update.warehouseId
        );

        // Create a copy of the previous inventory
        const newInventory = [...prev];

        if (itemIndex >= 0) {
          // Update existing item with new quantity, status, etc.
          newInventory[itemIndex] = {
            ...newInventory[itemIndex],
            quantity: update.quantity,
            status: update.status,
            lastUpdated: update.lastUpdated
          };
        } else {
          // Add the new item if it's not filtered out by warehouse
          if (selectedWarehouse === "all" || selectedWarehouse === update.warehouseId) {
            newInventory.push(update);
          }
        }

        return newInventory;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe, selectedWarehouse]);

  const refreshInventory = async () => {
    setLoading(true);
    try {
      const warehouseId = selectedWarehouse === "all" ? undefined : selectedWarehouse;
      const data = await getWarehouseInventory(warehouseId);
      setInventory(data);
    } catch (error) {
      console.error("Error refreshing inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  const handleSort = (field: "productId" | "quantity" | "lastUpdated") => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusIcon = (status: WarehouseItem['status']) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "reserved":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "shipped":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: WarehouseItem['status']) => {
    switch (status) {
      case "available":
        return "Available";
      case "reserved":
        return "Reserved";
      case "shipped":
        return "Shipped";
      default:
        return status;
    }
  };

  const getStatusColor = (status: WarehouseItem['status']) => {
    switch (status) {
      case "available":
        return "text-green-500 bg-green-50 border-green-200";
      case "reserved":
        return "text-amber-500 bg-amber-50 border-amber-200";
      case "shipped":
        return "text-red-500 bg-red-50 border-red-200";
      default:
        return "";
    }
  };

  // Apply filters and sort
  const filteredInventory = inventory
    .filter(item => {
      // Apply status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery && !item.productId.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "lastUpdated") {
        return sortDirection === "asc"
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else if (sortField === "quantity") {
        return sortDirection === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      } else {
        // Sort by productId
        return sortDirection === "asc"
          ? a.productId.localeCompare(b.productId)
          : b.productId.localeCompare(a.productId);
      }
    });

  const warehouseStats = warehouseLocations.map(warehouse => {
    const warehouseItems = inventory.filter(item => item.warehouseId === warehouse.id);
    const totalItems = warehouseItems.reduce((sum, item) => sum + item.quantity, 0);
    const availableItems = warehouseItems
      .filter(item => item.status === "available")
      .reduce((sum, item) => sum + item.quantity, 0);
    
    return { 
      ...warehouse, 
      totalItems, 
      availableItems,
      utilizationRate: totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Real-time connection indicator */}
      {!isConnected && (
        <div className="flex items-center justify-between p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-700">Real-time updates unavailable</p>
          </div>
          <Button variant="outline" size="sm">Reconnect</Button>
        </div>
      )}

      {/* Live updates component */}
      <LiveInventoryUpdates />

      <Tabs defaultValue="inventory">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="warehouses" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            <span>Warehouses</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedWarehouse}
                onValueChange={setSelectedWarehouse}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouseLocations.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as WarehouseItem['status'] | "all")}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="relative w-full sm:w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={refreshInventory}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium flex items-center gap-1 px-0"
                      onClick={() => handleSort("productId")}
                    >
                      Product ID
                      {sortField === "productId" && getSortIcon()}
                    </Button>
                  </TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium flex items-center gap-1 px-0"
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity
                      {sortField === "quantity" && getSortIcon()}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium flex items-center gap-1 px-0"
                      onClick={() => handleSort("lastUpdated")}
                    >
                      Last Updated
                      {sortField === "lastUpdated" && getSortIcon()}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p>Loading inventory data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No inventory items match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item, index) => {
                    const warehouse = warehouseLocations.find(w => w.id === item.warehouseId);
                    
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">{item.productId}</TableCell>
                        <TableCell>{warehouse?.name || item.warehouseId}</TableCell>
                        <TableCell>{item.locationCode}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1 ${getStatusColor(item.status)}`}
                          >
                            {getStatusIcon(item.status)}
                            {getStatusText(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="warehouses">
          <div className="grid gap-4 md:grid-cols-3">
            {warehouseStats.map((warehouse, index) => (
              <motion.div
                key={warehouse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <CardDescription>{warehouse.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Items:</span>
                        <span className="font-medium">{warehouse.totalItems}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Available Items:</span>
                        <span className="font-medium text-green-600">{warehouse.availableItems}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Utilization Rate:</span>
                        <span className="font-medium">{warehouse.utilizationRate}%</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-soft-pink h-2.5 rounded-full" 
                          style={{ width: `${warehouse.utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedWarehouse(warehouse.id)}
                    >
                      View Inventory
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseManagement;
