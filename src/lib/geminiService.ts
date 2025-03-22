
import { GEMINI_API_KEY, GEMINI_API_ENDPOINT } from "./firebase";

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

// This function formats the image data for the Gemini API
const formatImageForGemini = (imageData: string): any => {
  // Extract the base64 data without the prefix
  const base64Data = imageData.split(',')[1];
  
  return {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg" // Assuming JPEG, but could be dynamic based on image format
    }
  };
};

// Create the prompt for the Gemini API
const createGeminiPrompt = (): string => {
  return `
  Analyze this clothing item image and provide the following information in JSON format:
  - category: Determine if it's "clothing", "accessories", "footwear", "outerwear", "sportswear", or "formalwear"
  - condition: Assess as "new with tags", "like new", "excellent", "good", "fair", or "poor"
  - description: Write a brief description of the item (max 100 characters)
  - tags: List 2-4 relevant descriptive tags as an array
  - sustainabilityScore: Estimate sustainability on a scale of 0-100
  
  IMPORTANT: Respond ONLY with valid JSON. No introduction, explanation, or additional text.
  `;
};

// In production, this makes an actual API call to Google Gemini
const realGeminiAnalysis = async (imageData: string): Promise<ItemAnalysisResult> => {
  try {
    console.log("Calling Gemini 2.0 API for image analysis");
    
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Prepare the request payload
    const payload = {
      contents: [
        {
          parts: [
            { text: createGeminiPrompt() },
            formatImageForGemini(imageData)
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024
      }
    };

    // Make the API call
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Failed to analyze image with Gemini API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    let generatedText = '';
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
    
    // Parse the JSON response from the generated text
    let parsedResponse;
    try {
      // The response should be a JSON string
      parsedResponse = JSON.parse(generatedText);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', generatedText);
      throw new Error('Failed to parse Gemini response as JSON');
    }
    
    // Map the response to our ItemAnalysisResult interface
    const condition = parsedResponse.condition?.toLowerCase() || 'good';
    const category = parsedResponse.category?.toLowerCase() || 'clothing';
    
    return {
      category: category,
      condition: condition,
      conditionScore: conditionScores[condition] || 0.65,
      estimatedValue: calculateDynamicPrice(
        categoryBaseValues[category] || 30,
        conditionScores[condition] || 0.65
      ),
      description: parsedResponse.description || '',
      tags: parsedResponse.tags || [],
      sustainabilityScore: parsedResponse.sustainabilityScore || 75
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fall back to mock data if the API call fails
    return mockGeminiAnalysis(imageData);
  }
};

// Main function to analyze clothing item from image
export const analyzeClothingItem = async (imageData: string): Promise<ItemAnalysisResult> => {
  // In development mode or if no API key, use mock data
  // In production with API key, use the real API call
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
