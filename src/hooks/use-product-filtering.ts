
import { useState, useEffect, useCallback } from "react";
import { ProductItem, ProductFilter } from "@/types/DonationTypes";
import { getProducts } from "@/services/productService";

export function useProductFiltering() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<ProductFilter>({
    searchQuery: "",
    category: "all",
    condition: "all",
    priceRange: "all",
    sustainabilityFilter: "all",
    sortBy: "featured"
  });
  
  // Wishlist state
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  
  // Cart state
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(filters);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  // Initial load
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProductFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      category: "all",
      condition: "all",
      priceRange: "all",
      sustainabilityFilter: "all",
      sortBy: "featured"
    });
  }, []);
  
  // Toggle wishlist item
  const toggleWishlistItem = useCallback((productId: string) => {
    setWishlistedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);
  
  // Add item to cart
  const addToCart = useCallback((productId: string) => {
    setCartItems(prev => [...prev, productId]);
  }, []);
  
  return {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    wishlistedItems,
    toggleWishlistItem,
    cartItems,
    addToCart,
    refreshProducts: loadProducts
  };
}
