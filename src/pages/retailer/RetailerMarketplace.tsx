
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Sliders, 
  Tag, 
  Edit,
  Monitor,
  CircleCheck,
  Leaf,
  AlertCircle,
  Settings,
  PackageCheck,
  FileEdit
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Mock data representing retailer's donated items in marketplace
const mockRetailerItems = [
  {
    id: "P001",
    name: "Classic White Shirt",
    category: "clothing",
    price: 35.99,
    originalPrice: 89.99,
    donationDate: "2023-09-12",
    condition: "Like New",
    conditionScore: 0.85,
    sustainabilityScore: 88,
    description: "Versatile piece that can be styled in multiple ways",
    tags: ["casual", "cotton", "business"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop",
    aiVerified: true,
    marketStatus: "active",
    views: 124,
    clicks: 32,
  },
  {
    id: "P002",
    name: "Vintage Leather Jacket",
    category: "outerwear",
    price: 129.50,
    originalPrice: 350.00,
    donationDate: "2023-10-05",
    condition: "Good",
    conditionScore: 0.65,
    sustainabilityScore: 72,
    description: "Classic design with timeless appeal and durable construction",
    tags: ["vintage", "leather", "fall"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
    aiVerified: true,
    marketStatus: "active",
    views: 89,
    clicks: 18,
  },
  {
    id: "P003",
    name: "Designer Handbag",
    category: "accessories",
    price: 78.25,
    originalPrice: 195.00,
    donationDate: "2023-11-20",
    condition: "Excellent",
    conditionScore: 0.75,
    sustainabilityScore: 82,
    description: "Stylish accessory that complements many outfits",
    tags: ["designer", "elegant", "practical"],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
    aiVerified: true,
    marketStatus: "active",
    views: 156,
    clicks: 45,
  },
  {
    id: "P004",
    name: "Running Shoes",
    category: "footwear",
    price: 49.99,
    originalPrice: 120.00,
    donationDate: "2023-12-03",
    condition: "Good",
    conditionScore: 0.65,
    sustainabilityScore: 75,
    description: "Performance footwear with good tread and support",
    tags: ["sports", "running", "comfortable"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1770&auto=format&fit=crop",
    aiVerified: false,
    marketStatus: "pending",
    views: 0,
    clicks: 0,
  },
  {
    id: "P005",
    name: "Silk Evening Dress",
    category: "formalwear",
    price: 89.00,
    originalPrice: 225.00,
    donationDate: "2024-01-15",
    condition: "Excellent",
    conditionScore: 0.80,
    sustainabilityScore: 90,
    description: "Elegant piece suitable for professional settings",
    tags: ["formal", "silk", "evening"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1908&auto=format&fit=crop",
    aiVerified: true,
    marketStatus: "active",
    views: 67,
    clicks: 15,
  },
];

interface RetailerItemCardProps {
  item: typeof mockRetailerItems[0];
  onEdit: (itemId: string) => void;
  onReview: (itemId: string) => void;
}

const RetailerItemCard = ({ item, onEdit, onReview }: RetailerItemCardProps) => {
  const discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-all">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-soft-pink text-white">
              {discountPercentage}% OFF
            </Badge>
          </div>
          {item.marketStatus === "pending" && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-yellow-500/70 text-white backdrop-blur-sm">
                Pending
              </Badge>
            </div>
          )}
          {item.aiVerified && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
                AI Verified
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1.5">
            <Badge variant="outline" className="mb-2">
              {item.category}
            </Badge>
            <h3 className="font-medium line-clamp-1">
              {item.name}
            </h3>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center">
                <span className="font-bold text-soft-pink">${item.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CircleCheck className="h-3.5 w-3.5 mr-1" />
                {item.condition}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 my-2 flex-wrap">
            {item.tags.map((tag, index) => (
              <span key={index} className="px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs">
            <div className="flex items-center gap-0.5">
              <Leaf className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-600">Sustainability: {item.sustainabilityScore}/100</span>
            </div>
          </div>
          
          {item.marketStatus === "active" && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex flex-col">
                <span>Views: {item.views}</span>
              </div>
              <div className="flex flex-col">
                <span>Clicks: {item.clicks}</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex gap-2">
          <Button 
            className="w-1/2" 
            size="sm"
            variant="outline"
            onClick={() => onEdit(item.id)}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit Details
          </Button>
          <Button 
            className="w-1/2" 
            size="sm"
            onClick={() => onReview(item.id)}
          >
            <Monitor className="h-4 w-4 mr-1.5" />
            Review
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const EditItemDetails = ({ item, onClose }) => {
  const [itemData, setItemData] = useState({
    name: item.name,
    description: item.description,
    condition: item.condition,
    tags: item.tags.join(", "),
    category: item.category
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    toast(`Item updated`, {
      description: "Item details have been updated successfully"
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">Item Name</label>
        <Input 
          id="name" 
          name="name" 
          value={itemData.name}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Input 
          id="description" 
          name="description" 
          value={itemData.description}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <Select 
          value={itemData.category} 
          onValueChange={(value) => setItemData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="footwear">Footwear</SelectItem>
            <SelectItem value="outerwear">Outerwear</SelectItem>
            <SelectItem value="sportswear">Sportswear</SelectItem>
            <SelectItem value="formalwear">Formalwear</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
        <Input 
          id="tags" 
          name="tags" 
          value={itemData.tags}
          onChange={handleChange}
        />
      </div>

      <div className="pb-2">
        <h4 className="text-sm font-medium mb-2">AI-Generated Information (Read-Only)</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AI-Suggested Price:</span>
            <span className="font-medium">${item.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Condition Score:</span>
            <span className="font-medium">{(item.conditionScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sustainability Score:</span>
            <span className="font-medium">{item.sustainabilityScore}/100</span>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </DialogFooter>
    </div>
  );
};

const ItemDetailsReview = ({ item, onClose }) => {
  const handleOverrideToast = (message) => {
    toast(message);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <img 
            src={item.image} 
            alt={item.name} 
            className="rounded-md object-cover aspect-square w-full"
          />
        </div>
        <div className="space-y-3">
          <h3 className="font-medium">{item.name}</h3>
          <Badge>{item.category}</Badge>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Condition:</span>
            <span className="text-sm font-medium">{item.condition}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Original Price:</span>
            <span className="text-sm font-medium">${item.originalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Price:</span>
            <span className="text-sm font-bold text-soft-pink">${item.price.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Discount:</span>
            <span className="text-sm font-medium">
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Donation Date:</span>
            <span className="text-sm font-medium">{item.donationDate}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Condition Score:</span>
            <span className="font-medium">{(item.conditionScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sustainability Score:</span>
            <span className="font-medium">{item.sustainabilityScore}/100</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AI Verified:</span>
            <span className="font-medium">{item.aiVerified ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
      
      {item.marketStatus === "active" && (
        <>
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Marketplace Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Views:</span>
                <span className="font-medium">{item.views}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Clicks:</span>
                <span className="font-medium">{item.clicks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Click-Through Rate:</span>
                <span className="font-medium">
                  {item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-1.5" />
              Manual Override
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Manual Override Options</SheetTitle>
              <SheetDescription>
                These options allow limited manual adjustments to marketplace settings
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Marketplace Visibility</h4>
                <Select defaultValue={item.marketStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visibility status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Request AI Re-Analysis</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast("Re-analysis requested", {
                        description: "The item will be re-analyzed by our AI system"
                      });
                    }}
                  >
                    Request
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Request a new AI analysis if you believe the current assessment is incorrect
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Price Override Request</h4>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Suggested price" 
                    defaultValue={item.price}
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast("Price override requested", {
                        description: "Your request will be reviewed by an administrator"
                      });
                    }}
                  >
                    Request
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Request a price adjustment. This will be reviewed by an administrator.
                </p>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    toast("Removal requested", {
                      description: "Your request to remove this item has been submitted"
                    });
                  }}
                >
                  Request Removal from Marketplace
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

const RetailerMarketplace = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Check if user has retailer role
  const isRetailer = userData?.role === "retailer" || userData?.role === "admin";

  // Filter products based on user selection
  const filterItems = () => {
    return mockRetailerItems.filter(item => {
      // Apply search query filter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply category filter
      const matchesCategory = categoryFilter === "all" ? true : item.category === categoryFilter;
      
      // Apply status filter based on active tab
      if (activeTab === "active") {
        return matchesSearch && matchesCategory && item.marketStatus === "active";
      } else if (activeTab === "pending") {
        return matchesSearch && matchesCategory && item.marketStatus === "pending";
      }
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
        case "oldest":
          return new Date(a.donationDate).getTime() - new Date(b.donationDate).getTime();
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });
  };

  const filteredItems = filterItems();
  
  const handleEditItem = (itemId) => {
    const item = mockRetailerItems.find(item => item.id === itemId);
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };
  
  const handleReviewItem = (itemId) => {
    const item = mockRetailerItems.find(item => item.id === itemId);
    setSelectedItem(item);
    setIsReviewDialogOpen(true);
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
                <BreadcrumbLink href="/retailer/marketplace">Retailer Marketplace</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-3xl font-bold tracking-tight">Retailer Marketplace</h1>
          <p className="text-muted-foreground">
            Monitor and manage your donated items in the marketplace
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/retail-donations")}
            variant="outline"
          >
            <FileEdit className="h-4 w-4 mr-1.5" />
            Donate Items
          </Button>
        </div>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Your Marketplace Items</CardTitle>
              <CardDescription>
                View and manage your donated items and their marketplace performance
              </CardDescription>
            </div>
            
            <div className="flex-1 max-w-sm ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your items..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2 justify-end">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <Tag className="h-3.5 w-3.5 mr-1.5" />
                      <span>Category</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="sportswear">Sportswear</SelectItem>
                    <SelectItem value="formalwear">Formalwear</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center">
                      <Sliders className="h-3.5 w-3.5 mr-1.5" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredItems.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <RetailerItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onReview={handleReviewItem}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <PackageCheck className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No items found</h3>
                <p className="text-center text-muted-foreground">
                  Try adjusting your filters or donate some items to see them here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item Details</DialogTitle>
            <DialogDescription>
              Update item information. AI-set pricing cannot be modified directly.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <EditItemDetails 
              item={selectedItem} 
              onClose={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Review Item Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              Review item details and marketplace performance
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <ItemDetailsReview 
              item={selectedItem} 
              onClose={() => setIsReviewDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RetailerMarketplace;
