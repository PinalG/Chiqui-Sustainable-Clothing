
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
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getProductById } from "@/services/productService";
import { ProductItem } from "@/types/DonationTypes";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          setMainImage(productData.image);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="animate-pulse text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-soft-pink" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The requested product could not be found."}</p>
          <Button onClick={() => navigate("/marketplace")}>
            Return to Marketplace
          </Button>
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
                  Verified
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
              {product.size && (
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{product.size}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
              )}
              {product.material && (
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-medium">{product.material}</p>
                </div>
              )}
              {product.care && (
                <div>
                  <p className="text-sm text-muted-foreground">Care</p>
                  <p className="font-medium">{product.care}</p>
                </div>
              )}
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
                  <span>{product.size || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Brand</span>
                  <span>{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Material</span>
                  <span>{product.material || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Condition</span>
                  <span>{product.condition}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span>{product.dimensions || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Care Instructions</span>
                  <span>{product.care || 'N/A'}</span>
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
            <p>This item was donated by: <strong>{product.donatedBy || "Anonymous Donor"}</strong></p>
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
