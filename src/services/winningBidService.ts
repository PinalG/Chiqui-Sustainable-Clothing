
import { ShippingBid, BidRequest, ShippingCarrier } from '@/types/LogisticsTypes';

// Mock carriers for development
const MOCK_CARRIERS: ShippingCarrier[] = [
  {
    id: 'eco-ship-1',
    name: 'EcoShip',
    sustainabilityRating: 92,
    avgResponseTime: 3.5,
    specialties: ['Sustainable Packaging', 'Carbon Neutral', 'Electric Fleet'],
    regions: ['North America', 'Europe']
  },
  {
    id: 'green-logistics',
    name: 'Green Logistics',
    sustainabilityRating: 88,
    avgResponseTime: 5.2,
    specialties: ['Recycled Materials', 'Optimized Routes', 'Sustainable Warehousing'],
    regions: ['North America', 'Asia Pacific']
  },
  {
    id: 'swift-eco',
    name: 'Swift Eco',
    sustainabilityRating: 85,
    avgResponseTime: 2.7,
    specialties: ['Fast Delivery', 'Urban Areas', 'Last Mile Solutions'],
    regions: ['Europe', 'North America', 'Australia']
  },
  {
    id: 'global-green',
    name: 'Global Green Shipping',
    sustainabilityRating: 90,
    avgResponseTime: 6.1,
    specialties: ['International Shipping', 'Ocean Freight', 'Carbon Offsetting'],
    regions: ['Global']
  },
  {
    id: 'eco-express',
    name: 'Eco Express',
    sustainabilityRating: 82,
    avgResponseTime: 3.0,
    specialties: ['Express Delivery', 'Urban Centers', 'Bike Couriers'],
    regions: ['North America', 'Europe', 'Major Cities']
  }
];

// AI algorithm weights (would be configured based on retailer preferences)
const DEFAULT_WEIGHTS = {
  price: 0.35,
  time: 0.25,
  sustainability: 0.25,
  reliability: 0.15
};

/**
 * Calculates scores for each bid using a weighted formula
 */
const calculateBidScores = (
  bids: ShippingBid[], 
  weights = DEFAULT_WEIGHTS
): Map<string, number> => {
  // Normalize values across all bids
  const maxPrice = Math.max(...bids.map(bid => bid.price));
  const maxTime = Math.max(...bids.map(bid => bid.estimatedDeliveryTime));
  const maxCarbon = Math.max(...bids.map(bid => bid.carbonFootprint));
  
  const scores = new Map<string, number>();
  
  bids.forEach(bid => {
    // Lower values are better for price, time, and carbon footprint
    const priceScore = 1 - (bid.price / maxPrice);
    const timeScore = 1 - (bid.estimatedDeliveryTime / maxTime);
    const sustainabilityScore = 1 - (bid.carbonFootprint / maxCarbon);
    // Higher is better for reliability
    const reliabilityScore = bid.reliability / 100;
    
    // Calculate weighted score
    const score = (
      weights.price * priceScore +
      weights.time * timeScore +
      weights.sustainability * sustainabilityScore +
      weights.reliability * reliabilityScore
    );
    
    scores.set(bid.id, score);
  });
  
  return scores;
};

/**
 * Determines the winning bid based on the AI algorithm
 */
const determineWinningBid = (bids: ShippingBid[]): ShippingBid => {
  // Calculate bid scores
  const scores = calculateBidScores(bids);
  
  // Find the bid with the highest score
  let winningBid = bids[0];
  let highestScore = scores.get(winningBid.id) || 0;
  
  bids.forEach(bid => {
    const score = scores.get(bid.id) || 0;
    if (score > highestScore) {
      highestScore = score;
      winningBid = bid;
    }
  });
  
  return {
    ...winningBid,
    isWinningBid: true
  };
};

/**
 * Generates bids from available carriers based on the request parameters
 */
const generateBids = (request: BidRequest): ShippingBid[] => {
  // Calculate base price based on weight and dimensions
  const volume = request.dimensions.length * request.dimensions.width * request.dimensions.height;
  const basePrice = (request.weight * 0.5) + (volume * 0.001) + (request.itemValue * 0.02);
  
  // Urgency multiplier
  const urgencyMultiplier = 
    request.urgency === 'standard' ? 1.0 :
    request.urgency === 'expedited' ? 1.3 : 1.5;
  
  // Generate simulated bids from carriers
  return MOCK_CARRIERS.map(carrier => {
    // Add some randomness for simulated variation
    const priceVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    const timeVariation = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
    
    // Calculate bid specific values
    const price = basePrice * urgencyMultiplier * priceVariation;
    
    // Faster delivery for higher sustainability ratings (simulating efficient operations)
    const sustainabilityFactor = (100 - carrier.sustainabilityRating) / 100;
    const baseTime = request.urgency === 'standard' ? 72 : 
                    request.urgency === 'expedited' ? 48 : 24;
    const estimatedDeliveryTime = baseTime * timeVariation * (0.8 + (sustainabilityFactor * 0.4));
    
    // Lower carbon footprint for carriers with higher sustainability ratings
    const carbonBase = (request.weight * 0.1) + (volume * 0.00001);
    const carbonFootprint = carbonBase * (1.1 - (carrier.sustainabilityRating / 100));
    
    return {
      id: `bid-${carrier.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      carrierId: carrier.id,
      carrierName: carrier.name,
      price: Number(price.toFixed(2)),
      estimatedDeliveryTime: Number(estimatedDeliveryTime.toFixed(1)),
      carbonFootprint: Number(carbonFootprint.toFixed(2)),
      reliability: carrier.sustainabilityRating,
      isWinningBid: false,
      timestamp: Date.now()
    };
  });
};

/**
 * Main function to request bids and determine the winning bid
 */
export const requestShippingBids = async (request: BidRequest): Promise<ShippingBid[]> => {
  // In a real system, this would make API calls to shipping providers
  // For now, we'll simulate the process
  
  // Generate bids from carriers
  const bids = generateBids(request);
  
  // Determine the winning bid
  const winningBid = determineWinningBid(bids);
  
  // Update the bids array with the winning bid
  const finalBids = bids.map(bid => 
    bid.id === winningBid.id ? winningBid : bid
  );
  
  // Sort bids with winning bid first, then by price
  return finalBids.sort((a, b) => {
    if (a.isWinningBid) return -1;
    if (b.isWinningBid) return 1;
    return a.price - b.price;
  });
};

/**
 * Get available shipping carriers
 */
export const getShippingCarriers = async (): Promise<ShippingCarrier[]> => {
  // In a real system, this would fetch from an API
  // For now, return mock data
  return MOCK_CARRIERS;
};

/**
 * Create a new shipping bid request
 */
export const createBidRequest = (
  origin: string,
  destination: string,
  weight: number,
  dimensions: { length: number; width: number; height: number },
  itemValue: number,
  urgency: 'standard' | 'expedited' | 'priority' = 'standard'
): BidRequest => {
  return {
    origin,
    destination,
    weight,
    dimensions,
    itemValue,
    urgency,
    requestId: `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  };
};
