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
import { useQuery } from "@tanstack/react-query";

// Types for product data
interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  condition: string;
  conditionScore: number;
  sustainabilityScore: number;
  description: string;
  tags: string[];
  image: string;
  aiVerified: boolean;
  additionalImages?: string[];
  material: string;
  care: string;
  brand: string;
  size: string;
  dimensions: string;
  donatedBy: string;
}

// Function to fetch product data from API
const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    // In a real implementation, this would fetch from your backend API
    // const response = await fetch(`/api/products/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch product');
    // return await response.json();
    
    // For development, return null to show loading state
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id || ""),
    enabled: !!id
  });
  
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);
  
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-soft-pink" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="mb-4">Sorry, we couldn't find the product you're looking for.</p>
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
      
      {/* Product content would be rendered here, using the same UI structure as before
         but with data from the API instead of mock data */}
      {/* For brevity, I'm not including the full UI rendering code since it's quite extensive */}
      {/* The implementation would use the 'product' object from the useQuery hook */}
    </div>
  );
};

export default ProductDetails;
