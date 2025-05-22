
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
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
  ChevronDown,
  ChevronUp,
  Store,
  ShoppingCart,
  X,
  Sparkles,
  Star
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
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from "@/components/products/ProductCard";
import { useProductFiltering } from "@/hooks/use-product-filtering";
import { Skeleton } from "@/components/ui/skeleton";

const FilterSidebar = ({ 
  isOpen,
  onClose,
  filters,
  updateFilters,
  resetFilters
}) => {
  const [priceValues, setPriceValues] = useState([0, 350]);
  const [sustainabilityValues, setSustainabilityValues] = useState([0, 100]);
  
  useEffect(() => {
    if (filters.priceRange === "under50") {
      setPriceValues([0, 50]);
    } else if (filters.priceRange === "50to100") {
      setPriceValues([50, 100]);
    } else if (filters.priceRange === "over100") {
      setPriceValues([100, 350]);
    } else {
      setPriceValues([0, 350]);
    }
  }, [filters.priceRange]);
  
  useEffect(() => {
    if (filters.sustainabilityFilter === "high") {
      setSustainabilityValues([80, 100]);
    } else if (filters.sustainabilityFilter === "medium") {
      setSustainabilityValues([50, 80]);
    } else if (filters.sustainabilityFilter === "low") {
      setSustainabilityValues([0, 50]);
    } else {
      setSustainabilityValues([0, 100]);
    }
  }, [filters.sustainabilityFilter]);
  
  const handlePriceChange = (values) => {
    setPriceValues(values);
    if (values[0] === 0 && values[1] === 350) {
      updateFilters({ priceRange: "all" });
    } else if (values[1] <= 50) {
      updateFilters({ priceRange: "under50" });
    } else if (values[0] >= 50 && values[1] <= 100) {
      updateFilters({ priceRange: "50to100" });
    } else {
      updateFilters({ priceRange: "over100" });
    }
  };
  
  const handleSustainabilityChange = (values) => {
    setSustainabilityValues(values);
    if (values[0] >= 80) {
      updateFilters({ sustainabilityFilter: "high" });
    } else if (values[0] >= 50) {
      updateFilters({ sustainabilityFilter: "medium" });
    } else {
      updateFilters({ sustainabilityFilter: "low" });
    }
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
                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${filters.category === category ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                  onClick={() => updateFilters({ category })}
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
                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${filters.condition === condition ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                  onClick={() => updateFilters({ condition })}
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
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.priceRange === "under50" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ priceRange: "under50" })}
              >
                Under $50
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.priceRange === "50to100" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ priceRange: "50to100" })}
              >
                $50 - $100
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.priceRange === "over100" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ priceRange: "over100" })}
              >
                Over $100
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.priceRange === "all" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ priceRange: "all" })}
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
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.sustainabilityFilter === "high" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ sustainabilityFilter: "high" })}
              >
                High (80+)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.sustainabilityFilter === "medium" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ sustainabilityFilter: "medium" })}
              >
                Medium (50-80)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.sustainabilityFilter === "low" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ sustainabilityFilter: "low" })}
              >
                Low (0-50)
              </div>
              <div 
                className={`text-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors border ${filters.sustainabilityFilter === "all" ? 'bg-soft-pink/10 border-soft-pink text-soft-pink' : ''}`}
                onClick={() => updateFilters({ sustainabilityFilter: "all" })}
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
            onClick={resetFilters}
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

const ProductsLoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex justify-between pt-3">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      ))}
    </>
  );
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Use our custom hook for product filtering
  const { 
    filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    wishlistedItems,
    toggleWishlistItem,
    cartItems,
    refreshProducts
  } = useProductFiltering();
  
  // Check if user has retailer role
  const isRetailer = userData?.role === "retailer" || userData?.role === "admin";
  
  // Handle tab change to apply special filters
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    if (value === "trending") {
      updateFilters({ sustainabilityFilter: "high" });
    } else if (value === "new-arrivals") {
      updateFilters({ condition: "like new" });
    } else if (value === "all") {
      resetFilters();
    }
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
                  value={filters.searchQuery}
                  onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
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
                <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center">
                      <Sliders className="h-3.5 w-3.5 mr-1.5" />
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
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-soft-pink text-white" : ""}
                >
                  <Filter className="h-4 w-4" />
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
                                  className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${filters.category === category ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                                  onClick={() => updateFilters({ category })}
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
                            className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${filters.condition === condition ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                            onClick={() => updateFilters({ condition })}
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
                            className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${filters.priceRange === option.value ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                            onClick={() => updateFilters({ priceRange: option.value })}
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
                        {[
                          { value: "all", label: "All Scores" },
                          { value: "high", label: "High (80+)" },
                          { value: "medium", label: "Medium (50-80)" },
                          { value: "low", label: "Low (0-50)" }
                        ].map((option) => (
                          <div 
                            key={option.value}
                            className={`flex items-center px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors ${filters.sustainabilityFilter === option.value ? 'bg-soft-pink/10 text-soft-pink' : ''}`}
                            onClick={() => updateFilters({ sustainabilityFilter: option.value })}
                          >
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={resetFilters}
                    >
                      Reset All Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* Mobile Filters */}
              <FilterSidebar 
                isOpen={showFilters} 
                onClose={() => setShowFilters(false)} 
                filters={filters}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
              />
              
              {/* Product Grid */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <ProductsLoadingSkeleton />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-lg">
                    <p className="text-red-500 mb-4">Error loading products: {error}</p>
                    <Button onClick={refreshProducts}>Try again</Button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 bg-muted rounded-lg">
                    <Tag className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our other categories.
                    </p>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        wishlisted={wishlistedItems.includes(product.id)}
                        onToggleWishlist={toggleWishlistItem}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;
