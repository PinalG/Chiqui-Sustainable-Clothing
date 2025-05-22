
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, CircleCheck, Leaf, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductItem } from "@/types/DonationTypes";

interface ProductCardProps {
  product: ProductItem;
  wishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductCard({ product, wishlisted = false, onToggleWishlist }: ProductCardProps) {
  const navigate = useNavigate();
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`${product.name} added to cart`);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };
  
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
          onClick={handleViewDetails}
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
              onClick={handleViewDetails}
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
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Add to Cart
          </Button>
          {onToggleWishlist && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-soft-pink text-soft-pink" : "text-muted-foreground"}`} />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
