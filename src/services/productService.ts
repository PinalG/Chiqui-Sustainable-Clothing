
import { ProductItem, ProductFilter } from "@/types/DonationTypes";

// Sample products for development purposes
// In a real implementation, this would be replaced with API calls
const sampleProducts: ProductItem[] = [
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
    description: "Stylish accessory that complements many outfits. This designer handbag features premium materials, ample storage space, and an elegant design. Perfect for both casual and formal occasions.",
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
    description: "Performance footwear with good tread and support. These running shoes provide excellent cushioning, breathability, and stability for all types of runners.",
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
    description: "Elegant piece suitable for professional settings and formal events. This silk evening dress features a timeless design with subtle details and a flattering silhouette.",
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
    description: "Performance wear with moisture-wicking properties for athletic activities. This shirt keeps you dry and comfortable during workouts and provides excellent freedom of movement.",
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

// Get all products with optional filtering
export const getProducts = async (filters?: ProductFilter): Promise<ProductItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // This would be replaced by an actual API call in production
  let filteredProducts = [...sampleProducts];
  
  if (filters) {
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category === filters.category
      );
    }
    
    // Apply condition filter
    if (filters.condition && filters.condition !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'under50':
          filteredProducts = filteredProducts.filter(product => product.price < 50);
          break;
        case '50to100':
          filteredProducts = filteredProducts.filter(
            product => product.price >= 50 && product.price <= 100
          );
          break;
        case 'over100':
          filteredProducts = filteredProducts.filter(product => product.price > 100);
          break;
      }
    }
    
    // Apply sustainability filter
    if (filters.sustainabilityFilter && filters.sustainabilityFilter !== 'all') {
      switch (filters.sustainabilityFilter) {
        case 'high':
          filteredProducts = filteredProducts.filter(product => product.sustainabilityScore >= 80);
          break;
        case 'medium':
          filteredProducts = filteredProducts.filter(
            product => product.sustainabilityScore >= 50 && product.sustainabilityScore < 80
          );
          break;
        case 'low':
          filteredProducts = filteredProducts.filter(product => product.sustainabilityScore < 50);
          break;
      }
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
          break;
      }
    }
  }
  
  return filteredProducts;
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<ProductItem | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // This would be replaced by an actual API call in production
  const product = sampleProducts.find(product => product.id === id);
  return product || null;
};
