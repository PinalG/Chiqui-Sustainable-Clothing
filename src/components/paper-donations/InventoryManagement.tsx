
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  PackageCheck, 
  Package, 
  Filter, 
  ArrowUpDown, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Truck,
  Square,
  DollarSign,
  MapPin
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data for inventory items
const mockInventory = [
  {
    id: "INV00123",
    batchName: "Spring Collection 2023",
    category: "clothing",
    items: 42,
    value: 1250.50,
    location: "Main Warehouse - Section A",
    space: 120,
    status: "available",
    createdAt: "2023-04-15T10:30:00Z",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "INV00124",
    batchName: "Summer Accessories",
    category: "accessories",
    items: 68,
    value: 2340.75,
    location: "Main Warehouse - Section B",
    space: 85,
    status: "available",
    createdAt: "2023-04-16T14:45:00Z",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: "INV00125",
    batchName: "Winter Outerwear",
    category: "outerwear",
    items: 23,
    value: 4320.30,
    location: "Secondary Warehouse",
    space: 200,
    status: "available",
    createdAt: "2023-04-10T09:15:00Z",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
  },
  {
    id: "INV00126",
    batchName: "Formal Collection",
    category: "formalwear",
    items: 36,
    value: 5670.80,
    location: "Main Warehouse - Section C",
    space: 150,
    status: "pending",
    createdAt: "2023-04-18T16:20:00Z",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "INV00127",
    batchName: "Athletic Wear",
    category: "sportswear",
    items: 54,
    value: 1890.40,
    location: "Main Warehouse - Section A",
    space: 110,
    status: "sold",
    createdAt: "2023-04-05T11:10:00Z",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1970&auto=format&fit=crop",
  },
  {
    id: "INV00128",
    batchName: "Designer Shoes",
    category: "footwear",
    items: 29,
    value: 3450.60,
    location: "Secondary Warehouse",
    space: 75,
    status: "shipping",
    createdAt: "2023-04-12T13:25:00Z",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1964&auto=format&fit=crop",
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "available":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Available
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          <Clock className="h-3 w-3 mr-1" /> Pending Verification
        </Badge>
      );
    case "shipping":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          <Truck className="h-3 w-3 mr-1" /> Shipping
        </Badge>
      );
    case "sold":
      return (
        <Badge variant="outline" className="bg-soft-pink/10 text-soft-pink border-soft-pink/20">
          <CheckCircle className="h-3 w-3 mr-1" /> Sold
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Unknown
        </Badge>
      );
  }
};

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  // Filter and sort inventory items
  const filteredInventory = mockInventory
    .filter(item => {
      const matchesSearch = item.batchName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "value-high":
          return b.value - a.value;
        case "value-low":
          return a.value - b.value;
        case "items-high":
          return b.items - a.items;
        case "items-low":
          return a.items - b.items;
        default:
          return 0;
      }
    });
  
  const totalItems = filteredInventory.reduce((sum, item) => sum + item.items, 0);
  const totalValue = filteredInventory.reduce((sum, item) => sum + item.value, 0);
  const totalSpace = filteredInventory.reduce((sum, item) => sum + item.space, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-soft-pink" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
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
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center mr-3">
              <Square className="h-5 w-5 text-soft-pink" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage Space</p>
              <p className="text-2xl font-bold">{totalSpace} sq ft</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch name or ID..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{categoryFilter ? `Category: ${categoryFilter}` : "All Categories"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="sportswear">Sportswear</SelectItem>
              <SelectItem value="formalwear">Formalwear</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{statusFilter ? `Status: ${statusFilter}` : "All Status"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="value-high">Highest Value</SelectItem>
              <SelectItem value="value-low">Lowest Value</SelectItem>
              <SelectItem value="items-high">Most Items</SelectItem>
              <SelectItem value="items-low">Least Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.batchName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium line-clamp-1">{item.batchName}</h3>
                    <p className="text-sm text-muted-foreground">{item.id}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-3 text-sm">
                  <div className="flex items-center">
                    <Package className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>{item.items} items</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>${item.value.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>{item.space} sq ft</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm">Generate QR</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-md border border-dashed">
            <PackageCheck className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No inventory items match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
