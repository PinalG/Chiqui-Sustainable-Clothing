
import { useState, useEffect } from "react";
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
  PackageCheck
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

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
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-all">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
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
                AI Verified
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1.5">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
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
          <Button variant="ghost" size="icon" className="shrink-0">
            <Heart className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [activeTab, setActiveTab] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);
  
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
      
      // Apply active tab filter
      if (activeTab !== "all") {
        if (activeTab === "trending") {
          return matchesSearch && matchesCategory && matchesCondition && matchesPrice && product.sustainabilityScore > 80;
        } else if (activeTab === "new-arrivals") {
          return matchesSearch && matchesCategory && matchesCondition && matchesPrice && product.conditionScore > 0.8;
        }
        return false;
      }
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
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
  };
  
  return (
    <div className="space-y-6 animate-enter">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and purchase high-quality AI-verified donated clothing.
          </p>
        </div>
        
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-soft-pink text-white text-xs flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>AI-Verified Products</CardTitle>
              <CardDescription>
                Shop sustainable items verified by AI for quality and authenticity
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
                
                <Button variant="outline" size="icon">
                  <Sliders className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pb-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1.5" />
                    <span>{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
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
              
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    <span>{conditionFilter === "all" ? "All Conditions" : conditionFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">New with Tags</SelectItem>
                  <SelectItem value="like new">Like New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                    <span>Price Range</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to100">$50 to $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <PackageCheck className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No products found</h3>
                <p className="text-center text-muted-foreground">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;
