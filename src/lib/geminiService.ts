
import { GEMINI_API_KEY } from "./firebase";

// Use a TypeScript interface for the item analysis result
export interface ItemAnalysisResult {
  category: string;
  condition: string;
  conditionScore: number;
  estimatedValue: number;
  description: string;
  tags: string[];
  sustainabilityScore: number;
}

// Condition score mapping
const conditionScores: Record<string, number> = {
  "new with tags": 0.95,
  "like new": 0.85,
  "excellent": 0.75,
  "good": 0.65,
  "fair": 0.50,
  "poor": 0.30
};

// Base values for categories (in USD)
const categoryBaseValues: Record<string, number> = {
  "clothing": 30,
  "accessories": 25,
  "footwear": 45,
  "outerwear": 60,
  "sportswear": 35,
  "formalwear": 75
};

// In development mode, we'll simulate the Gemini AI response
const mockGeminiAnalysis = (imageData: string): Promise<ItemAnalysisResult> => {
  // Simulate network delay
  return new Promise((resolve) => {
    console.log("Using mock Gemini AI analysis");
    
    // Randomize the analysis to simulate AI variation
    const categories = ["clothing", "accessories", "footwear", "outerwear", "sportswear", "formalwear"];
    const conditions = ["new with tags", "like new", "excellent", "good", "fair", "poor"];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const conditionScore = conditionScores[condition];
    
    // Calculate a base value depending on category
    const baseValue = categoryBaseValues[category];
    
    // Apply condition multiplier to the base value
    const estimatedValue = Math.round(baseValue * conditionScore * (0.8 + Math.random() * 0.4));
    
    // Generate mock tags
    const tagSets: Record<string, string[]> = {
      "clothing": ["casual", "summer", "cotton", "breathable"],
      "accessories": ["stylish", "versatile", "trendy", "everyday"],
      "footwear": ["comfortable", "durable", "all-season", "stylish"],
      "outerwear": ["warm", "water-resistant", "layerable", "versatile"],
      "sportswear": ["moisture-wicking", "flexible", "breathable", "performance"],
      "formalwear": ["elegant", "tailored", "classic", "sophisticated"]
    };
    
    const tags = tagSets[category] || [];
    const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 3));
    
    // Generate a mock sustainability score (0-100)
    const sustainabilityScore = Math.floor(60 + Math.random() * 40);
    
    // Generate a description based on the category and condition
    const descriptionTemplates: Record<string, string[]> = {
      "clothing": [
        "Casual wear suitable for everyday use",
        "Versatile piece that can be styled in multiple ways",
        "Seasonal item with good construction"
      ],
      "accessories": [
        "Stylish accessory that complements many outfits",
        "Practical item with good craftsmanship",
        "Trendy piece that adds flair to basic outfits"
      ],
      "footwear": [
        "Comfortable footwear with good tread and support",
        "Stylish shoes with minimal wear on the soles",
        "All-season footwear suitable for various occasions"
      ],
      "outerwear": [
        "Warm layer with good insulation properties",
        "Weather-resistant outerwear with functional pockets",
        "Versatile jacket suitable for layering"
      ],
      "sportswear": [
        "Performance wear with moisture-wicking properties",
        "Flexible sportswear suitable for various activities",
        "Breathable athletic item with stretch components"
      ],
      "formalwear": [
        "Elegant piece suitable for professional settings",
        "Classic design with timeless appeal",
        "Well-tailored item with quality construction"
      ]
    };
    
    const descriptionOptions = descriptionTemplates[category] || [];
    const description = descriptionOptions[Math.floor(Math.random() * descriptionOptions.length)];
    
    // Simulate a loading delay to make the mock more realistic
    setTimeout(() => {
      resolve({
        category,
        condition,
        conditionScore,
        estimatedValue,
        description,
        tags: selectedTags,
        sustainabilityScore
      });
    }, 1500);
  });
};

// In production, this would make an actual API call to Google Gemini
const realGeminiAnalysis = async (imageData: string): Promise<ItemAnalysisResult> => {
  try {
    // This is a placeholder for the actual Gemini API call
    // In a real implementation, you would:
    // 1. Send the image to Gemini API
    // 2. Process the response
    // 3. Return structured data
    
    const response = await fetch('https://api.gemini.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        image: imageData,
        analysisType: 'clothing'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze image with Gemini API');
    }
    
    const data = await response.json();
    
    // Process the response and return structured data
    // This is a simplified example, actual response processing would be more complex
    return {
      category: data.category,
      condition: data.condition,
      conditionScore: conditionScores[data.condition.toLowerCase()] || 0.5,
      estimatedValue: data.estimatedValue || 30,
      description: data.description || '',
      tags: data.tags || [],
      sustainabilityScore: data.sustainabilityScore || 75
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fall back to mock data if the API call fails
    return mockGeminiAnalysis(imageData);
  }
};

// Main function to analyze clothing item from image
export const analyzeClothingItem = async (imageData: string): Promise<ItemAnalysisResult> => {
  // In development mode, use mock data
  // In production, use the real API call
  if (process.env.NODE_ENV === 'development' || !GEMINI_API_KEY) {
    return mockGeminiAnalysis(imageData);
  } else {
    return realGeminiAnalysis(imageData);
  }
};

// Function to estimate dynamic pricing based on various factors
export const calculateDynamicPrice = (
  basePrice: number,
  conditionScore: number,
  demandFactor: number = 1, // 0.8 to 1.2 based on current demand
  seasonalityFactor: number = 1, // 0.9 to 1.1 based on season relevance
  brandMultiplier: number = 1 // 1.0 to 2.5 based on brand prestige
): number => {
  // Apply all factors to calculate the final price
  const calculatedPrice = basePrice * conditionScore * demandFactor * seasonalityFactor * brandMultiplier;
  
  // Round to 2 decimal places and ensure minimum price
  return Math.max(5, Math.round(calculatedPrice * 100) / 100);
};
