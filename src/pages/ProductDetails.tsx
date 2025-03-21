import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Tag, 
  Star, 
  CircleCheck, 
  Leaf, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock product data - this would be replaced with actual API calls
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
    description: "This versatile white shirt is perfect for any occasion. Made from high-quality cotton, it offers both comfort and durability. The classic design can be styled in multiple ways - pair it with jeans for a casual look or with formal pants for a business setting.",
    tags: ["casual", "cotton", "business"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop",
    aiVerified: true,
    additionalImages: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1925&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1471&auto=format&fit=crop"
    ],
    material: "100% Cotton",
    care: "Machine washable at 30°C",
    brand: "EcoFashion",
    size: "Medium",
    dimensions: "Chest: 40in, Length: 28in",
    donatedBy: "Corporate Retailer",
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
    description: "Classic design with timeless appeal and durable construction. This vintage leather jacket has been gently worn and properly maintained. It features multiple pockets, adjustable cuffs, and a warm inner lining, making it perfect for fall and winter seasons.",
    tags: ["vintage", "leather", "fall"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
    aiVerified: true,
    additionalImages: [
      "https://images.unsplash.com/photo-1605908502724-9093a79a1b39?q=80&w=1374&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1663177244197-88b7fe110e2e?q=80&w=1471&auto=format&fit=crop"
    ],
    material: "Genuine Leather",
    care: "Professional leather cleaning only",
    brand: "VintageCraft",
    size: "Large",
    dimensions: "Chest: 44in, Length: 26in",
    donatedBy: "Individual Donor",
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
    additionalImages: [
      "https://images.unsplash.com/photo-1610907479999-ca5149cd4e3b?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621954144741-199b9b938531?q=80&w=1470&auto=format&fit=crop"
    ],
    material: "Leather, Metal",
    care: "Wipe with soft cloth",
    brand: "LuxeCarry",
    size: "Medium",
    dimensions: "Width: 12in, Height: 9in, Depth: 5in",
    donatedBy: "Luxury Boutique",
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
    additionalImages: [
      "https://images.unsplash.com/photo-1600267489421-999456647904?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589183583742-9e415ffc52bb?q=80&w=1587&auto=format&fit=crop"
    ],
    material: "Mesh, Rubber",
    care: "Hand wash, Air dry",
    brand: "ActiveStride",
    size: "US 9",
    dimensions: "Sole Length: 11in",
    donatedBy: "Sports Equipment Store",
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
    additionalImages: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81df0e7ca6d8?q=80&w=1472&auto=format&fit=crop"
    ],
    material: "100% Silk",
    care: "Dry clean only",
    brand: "GalaSilks",
    size: "Small",
    dimensions: "Bust: 34in, Waist: 26in, Length: 52in",
    donatedBy: "High-End Fashion Outlet",
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
    additionalImages: [
      "https://images.unsplash.com/photo-1581044777550-4c034483b61c?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
    ],
    material: "Polyester, Spandex",
    care: "Machine wash cold, Tumble dry low",
    brand: "SportActive",
    size: "Large",
    dimensions: "Chest: 42in, Length: 30in",
    donatedBy: "Fitness Apparel Company",
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<typeof mockProducts[0] | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.image);
    }
  }, [id]);
  
  const handleAddToCart = () => {
    toast.success(`${product?.name} added to cart`, {
      description: `Quantity: ${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => navigate("/checkout"),
      },
    });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };
  
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };
  
  if (!product) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="animate-pulse text-center">
          <div className="h-12 w-48 bg-muted rounded mb-4 mx-auto"></div>
          <div className="h-64 w-full max-w-md bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  return (
    <div className="animate-enter">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0 mb-2"
          onClick={() => navigate("/marketplace")}
        >
          <ChevronLeft className="mr-1" />
          Back to Marketplace
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images Section */}
        <div className="space-y-4">
          <motion.div 
            className="overflow-hidden rounded-lg aspect-square bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-2">
            <motion.div 
              className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === product.image ? 'border-soft-pink' : 'border-transparent'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMainImage(product.image)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover" 
              />
            </motion.div>
            
            {product.additionalImages?.map((img, index) => (
              <motion.div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-soft-pink' : 'border-transparent'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMainImage(img)}
              >
                <img 
                  src={img}
                  alt={`${product.name} view ${index + 2}`}
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Product Info Section */}
        <div className="glass-morphism rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleWishlist}
                  className={isInWishlist ? "text-soft-pink" : ""}
                >
                  <Heart className={isInWishlist ? "fill-soft-pink" : ""} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <CircleCheck className="h-4 w-4 mr-1 text-green-500" />
                <span className="font-medium">{product.condition}</span>
              </div>
              {product.aiVerified && (
                <Badge className="bg-white border border-soft-pink text-soft-pink">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-end gap-3 mt-2">
              <span className="text-3xl font-bold text-soft-pink">${product.price.toFixed(2)}</span>
              <span className="text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              <Badge className="bg-soft-pink text-white">
                {discountPercentage}% OFF
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{product.size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{product.material}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Care</p>
                <p className="font-medium">{product.care}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200">
                  <div 
                    className="h-2 rounded-full bg-green-500" 
                    style={{ width: `${product.sustainabilityScore}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium">
                Sustainability Score: {product.sustainabilityScore}/100
              </span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-6 border-t">
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 rounded-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 rounded-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <Tabs defaultValue="details" className="glass-morphism rounded-lg p-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="origin">Origin & Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 p-4">
            <h3 className="text-xl font-semibold">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Size</span>
                  <span>{product.size}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Brand</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Material</span>
                  <span>{product.material}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Condition</span>
                  <span>{product.condition}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span>{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Care Instructions</span>
                  <span>{product.care}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sustainability" className="space-y-4 p-4">
            <h3 className="text-xl font-semibold">Sustainability Impact</h3>
            <p>By purchasing this pre-loved item instead of buying new, you're making a positive environmental impact:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <h4 className="font-medium">Water Saved</h4>
                <p className="text-2xl font-bold text-green-600">~1,200 L</p>
                <p className="text-sm text-muted-foreground">Equivalent to 8 full bathtubs</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <h4 className="font-medium">CO₂ Reduced</h4>
                <p className="text-2xl font-bold text-green-600">~6 kg</p>
                <p className="text-sm text-muted-foreground">Equivalent to 24 miles of driving</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <h4 className="font-medium">Waste Diverted</h4>
                <p className="text-2xl font-bold text-green-600">~0.5 kg</p>
                <p className="text-sm text-muted-foreground">From landfill</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="origin" className="space-y-4 p-4">
            <h3 className="text-xl font-semibold">Origin & Community Impact</h3>
            <p>This item was donated by: <strong>{product.donatedBy}</strong></p>
            <p className="mt-4">Your purchase contributes to our community initiatives:</p>
            
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="font-medium">At-Risk Youth Programs</h4>
              <p className="text-sm text-muted-foreground mt-2">
                20% of all proceeds from this sale will directly fund educational and vocational 
                training programs for at-risk youth in the local community.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
