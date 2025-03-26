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
  Filter, 
  Sliders, 
  Tag, 
  DollarSign, 
  Sparkles, 
  ShoppingCart,
  Star, 
  Heart, 
  Leaf, 
  ArrowUpDown,
  CircleCheck,
  PackageCheck,
  X,
  ChevronDown,
  ChevronUp,
  Store
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock product data with AI-generated details
const mockProducts = [
  {
    id: "P001",
    name: "Classic White Shirt",
    category: "clothing",
    price: 35.99,
    originalPrice: 89.99,
    condition: "Like New",
    conditionScore: 0.85,
    sustainabilityScore: 88,
    description: "Versatile piece that can be styled in multiple ways",
    tags: ["casual", "cotton", "business"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop",
    aiVerified: true,
  },
  {
    id: "P002",
    name: "Vintage Leather Jacket",
    category: "outerwear",
    price: 129.50,
    originalPrice: 350.00,
    condition: "Good",
    conditionScore: 0.65,
    sustainabilityScore: 72,
    description: "Classic design with timeless appeal and durable construction",
    tags: ["vintage", "leather", "fall"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
    aiVerified: true,
  },
  {
    id: "P003",
    name: "Designer Handbag",
    category: "accessories",
    price: 78.25,
    originalPrice: 195.00,
    condition: "Excellent",
    conditionScore: 0.75,
    sustainabilityScore: 82,
    description: "Stylish accessory that complements many outfits",
    tags: ["designer", "elegant", "practical"],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
    aiVerified: true,
  },
  {
    id: "P004",
    name: "Running Shoes",
    category: "footwear",
    price: 49.99,
    originalPrice: 120.00,
    condition: "Good",
    conditionScore: 0.65,
    sustainabilityScore: 75,
    description: "Performance footwear with good tread and support",
    tags: ["sports", "running", "comfortable"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1770&auto=format&fit=crop",
    aiVerified: true,
  },
  {
    id: "P005",
    name: "Silk Evening Dress",
    category: "formalwear",
    price: 89.00,
    originalPrice: 225.00,
    condition: "Excellent",
    conditionScore: 0.80,
    sustainabilityScore: 90,
    description: "Elegant piece suitable for professional settings",
    tags: ["formal", "silk", "evening"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1908&auto=format&fit=crop",
    aiVerified: true,
  },
  {
    id: "P006",
    name: "Athletic Performance Shirt",
    category: "sportswear",
    price: 25.50,
    originalPrice: 65.00,
    condition: "Like New",
    conditionScore: 0.85,
    sustainabilityScore: 78,
    description: "Performance wear with moisture-wicking properties",
    tags: ["athletic", "performance", "breathable"],
    image: "https://images.unsplash.com/photo-1565693413579-8a3c9944d5d7?q=80&w=1773&auto=format&fit=crop",
    aiVerified: true,
  },
];

interface ProductCardProps {
  product: typeof mockProducts[0];
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  wishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  wishlisted,
  onToggleWishlist
}: ProductCardProps) => {
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-all">
        <div 
          className="relative cursor-pointer"
          onClick={() => onViewDetails(product.id)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-soft-pink text-white">
              {discountPercentage}% OFF
            </Badge>
          </div>
          {product.aiVerified && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1 text-soft-pink" />
                Verified
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1.5">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h3 
              className="font-medium line-clamp-1 hover:text-soft-pink cursor-pointer"
              onClick={() => onViewDetails(product.id)}
            >
              {product.name}
            </h3>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center">
                <span className="font-bold text-soft-pink">${product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CircleCheck className="h-3.5 w-3.5 mr-1" />
                {product.condition}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 my-2 flex-wrap">
            {product.tags.map((tag, index) => (
              <span key={index} className="px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs">
            <div className="flex items-center gap-0.5">
              <Leaf className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-600">Sustainability: {product.sustainabilityScore}/100</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 gap-2">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => onAddToCart(product.id)}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Add to Cart
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={() => onToggleWishlist(product.id)}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-soft-pink text-soft-pink" : "text-muted-foreground"}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const FilterSidebar = ({ 
  isOpen, 
  onClose,
  categoryFilter,
  setCategoryFilter,
  conditionFilter,
  setConditionFilter,
  priceRange,
  setPriceRange,
  sustainabilityFilter,
  setSustainabilityFilter
}) => {
  const [priceValues, setPriceValues] = useState([0, 350]);
  const [sustainabilityValues, setSustainabilityValues] = useState([0, 100]);
  
  useEffect(() => {
    if (priceRange === "under50") {
      setPriceValues([0, 50]);
    } else if (priceRange === "50to100") {
      setPriceValues([50, 100]);
    } else if (priceRange === "over100") {
      setPriceValues([100, 350]);
    } else {
      setPriceValues([0, 350]);
    }
  }, [priceRange]);
  
  useEffect(() => {
    if (sustainabilityFilter === "high") {
      setSustainabilityValues([80, 100]);
    } else if (sustainabilityFilter === "medium") {
      setSustainabilityValues([50, 80]);
    } else if (sustainabilityFilter === "low") {
      setSustainabilityValues([0, 50]);
    } else {
      setSustainabilityValues([0, 100]);
    }
  }, [sustainabilityFilter]);
  
  const handlePriceChange = (values) => {
    setPriceValues(values);
    if (values[0] === 0 && values[1] === 350) {
      setPriceRange("all");
    } else if (values[1] <= 50) {
      setPriceRange("under50");
    } else if (values[0] >= 50 && values[1] <= 100) {
      setPriceRange("50to100");
    } else {
      setPriceRange("over100");
    }
  };
  
  const handleSustainabilityChange = (values) => {
    setSustainabilityValues(values);
    if (values[0] >= 80) {
      setSustainabilityFilter("high");
    } else if (values[0] >= 50) {
      setSustainabilityFilter("medium");
    } else {
      setSustainabilityFilter("low");
    }
  };
  
  const handleReset = () => {
    setCategoryFilter("all");
    setConditionFilter("all");
    setPriceRange("all");
    setPriceValues([0, 350]);
    setSustainabilityFilter("all");
    setSustainabilityValues([0, 100]);
  };
  
  return (
    <motion.div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Filter Products</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-6 flex-grow overflow-y-auto">
          <div>
            <h4 className="font-medium mb-3">Categories</h4>
            <div className="space-y-2">
              {["all", "clothing", "accessories", "footwear", "outerwear", "sportswear", "formalwear"].map((category) => (
                <div 
                  key={category}
                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${categoryFilter === category ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  <span className="capitalize">{category === "all" ? "All Categories" : category}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Condition</h4>
            <div className="space-y-2">
              {["all", "new", "like new", "excellent", "good", "fair"].map((condition) => (
                <div 
                  key={condition}
                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${conditionFilter === condition ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                  onClick={() => setConditionFilter(condition)}
                >
                  <span className="capitalize">{condition === "all" ? "All Conditions" : condition}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="px-2">
              <Slider
                defaultValue={[0, 350]}
                max={350}
                step={10}
                value={priceValues}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm">
                <span>${priceValues[0]}</span>
                <span>${priceValues[1]}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${priceRange === "under50" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setPriceRange("under50")}
              >
                Under $50
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${priceRange === "50to100" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setPriceRange("50to100")}
              >
                $50 - $100
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${priceRange === "over100" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setPriceRange("over100")}
              >
                Over $100
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${priceRange === "all" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setPriceRange("all")}
              >
                All Prices
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Sustainability Score</h4>
            <div className="px-2">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={5}
                value={sustainabilityValues}
                onValueChange={handleSustainabilityChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm">
                <span>{sustainabilityValues[0]}</span>
                <span>{sustainabilityValues[1]}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${sustainabilityFilter === "high" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setSustainabilityFilter("high")}
              >
                High (80+)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${sustainabilityFilter === "medium" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setSustainabilityFilter("medium")}
              >
                Medium (50-80)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${sustainabilityFilter === "low" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setSustainabilityFilter("low")}
              >
                Low (0-50)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${sustainabilityFilter === "all" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => setSustainabilityFilter("all")}
              >
                All Scores
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleReset}
          >
            Reset All Filters
          </Button>
          <Button 
            className="w-full mt-2"
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sustainabilityFilter, setSustainabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [activeTab, setActiveTab] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState(true);
  
  // Check if user has retailer role
  const isRetailer = userData?.role === "retailer" || userData?.role === "admin";
  
  // Filter products based on user selection
  const filterProducts = () => {
    return mockProducts.filter(product => {
      // Apply search query filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply category filter
      const matchesCategory = categoryFilter === "all" ? true : product.category === categoryFilter;
      
      // Apply condition filter
      const matchesCondition = conditionFilter === "all" ? true : 
        product.condition.toLowerCase().includes(conditionFilter.toLowerCase());
      
      // Apply price range filter
      let matchesPrice = true;
      if (priceRange === "under50") {
        matchesPrice = product.price < 50;
      } else if (priceRange === "50to100") {
        matchesPrice = product.price >= 50 && product.price <= 100;
      } else if (priceRange === "over100") {
        matchesPrice = product.price > 100;
      }
      
      // Apply sustainability filter
      let matchesSustainability = true;
      if (sustainabilityFilter === "high") {
        matchesSustainability = product.sustainabilityScore >= 80;
      } else if (sustainabilityFilter === "medium") {
        matchesSustainability = product.sustainabilityScore >= 50 && product.sustainabilityScore < 80;
      } else if (sustainabilityFilter === "low") {
        matchesSustainability = product.sustainabilityScore < 50;
      }
      
      // Apply active tab filter
      if (activeTab !== "all") {
        if (activeTab === "trending") {
          return matchesSearch && matchesCategory && matchesCondition && matchesPrice && 
                 matchesSustainability && product.sustainabilityScore > 80;
        } else if (activeTab === "new-arrivals") {
          return matchesSearch && matchesCategory && matchesCondition && matchesPrice && 
                 matchesSustainability && product.conditionScore > 0.8;
        }
        return false;
      }
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesSustainability;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return a.id > b.id ? -1 : 1;
        case "rating":
          return b.sustainabilityScore - a.sustainabilityScore;
        default:
          return 0;
      }
    });
  };
  
  const filteredProducts = filterProducts();
  
  const handleAddToCart = (productId: string) => {
    setCartItems(prev => [...prev, productId]);
    toast.success("Item added to cart", {
      action: {
        label: "View Cart",
        onClick: () => navigate("/checkout"),
      },
    });
  };
  
  const handleToggleWishlist = (productId: string) => {
    if (wishlistedItems.includes(productId)) {
      setWishlistedItems(prev => prev.filter(id => id !== productId));
      toast("Removed from wishlist");
    } else {
      setWishlistedItems(prev => [...prev, productId]);
      toast("Added to wishlist");
    }
  };
  
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const handleToggleShowFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="space-y-6 animate-enter">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and purchase high-quality verified donated clothing.
          </p>
        </div>
        
        <div className="flex gap-2">
          {isRetailer && (
            <Button 
              variant="outline"
              onClick={() => navigate("/retailer/marketplace")}
              className="flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Retailer View
            </Button>
          )}
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-soft-pink text-white text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {isRetailer && (
        <Alert className="bg-soft-pink/10 border-soft-pink">
          <Store className="h-4 w-4" />
          <AlertTitle>Retailer Account Detected</AlertTitle>
          <AlertDescription>
            You are viewing the consumer marketplace. Click "Retailer View" to manage your donated items.
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2 text-soft-pink"
              onClick={() => navigate("/retailer/marketplace")}
            >
              Go to Retailer Marketplace
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Verified Products</CardTitle>
              <CardDescription>
                Shop sustainable items verified for quality and authenticity
              </CardDescription>
            </div>
            
            <div className="flex-1 max-w-sm ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="trending">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Sustainable
                  </TabsTrigger>
                  <TabsTrigger value="new-arrivals">
                    <Star className="h-3.5 w-3.5 mr-1.5" />
                    Best Condition
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2 justify-end flex-wrap">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant={showFilters ? "default" : "outline"} 
                  size="icon"
                  onClick={handleToggleShowFilters}
                  className={showFilters ? "bg-soft-pink text-white" : ""}
                >
                  <Sliders className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Filters for Large Screens */}
              <div className="hidden lg:block">
                <Card className="sticky top-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <CardDescription>Refine your search</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div 
                        className="flex items-center justify-between cursor-pointer py-1"
                        onClick={() => setExpandedCategories(!expandedCategories)}
                      >
                        <h4 className="font-medium">Categories</h4>
                        {expandedCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      
                      <AnimatePresence>
                        {expandedCategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 mt-2">
                              {["all", "clothing", "accessories", "footwear", "outerwear", "sportswear", "formalwear"].map((category) => (
                                <div 
                                  key={category}
                                  className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${categoryFilter === category ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                                  onClick={() => setCategoryFilter(category)}
                                >
                                  <span className="capitalize">{category === "all" ? "All Categories" : category}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Condition</h4>
                      <div className="space-y-1">
                        {["all", "new", "like new", "excellent", "good", "fair"].map((condition) => (
                          <div 
                            key={condition}
                            className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${conditionFilter === condition ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                            onClick={() => setConditionFilter(condition)}
                          >
                            <span className="capitalize">{condition === "all" ? "All Conditions" : condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <div className="space-y-1">
                        {[
                          { value: "all", label: "All Prices" },
                          { value: "under50", label: "Under $50" },
                          { value: "50to100", label: "$50 to $100" },
                          { value: "over100", label: "Over $100" }
                        ].map((option) => (
                          <div 
                            key={option.value}
                            className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${priceRange === option.value ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                            onClick={() => setPriceRange(option.value)}
                          >
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Sustainability</h4>
                      <div className="space-y-1">
