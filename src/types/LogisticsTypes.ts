
export interface ShippingBid {
  id: string;
  carrierId: string;
  carrierName: string;
  price: number;
  estimatedDeliveryTime: number; // in hours
  carbonFootprint: number; // in kg of CO2
  reliability: number; // score from 0-100
  isWinningBid: boolean;
  timestamp: number;
}

export interface BidRequest {
  origin: string;
  destination: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  itemValue: number;
  urgency: 'standard' | 'expedited' | 'priority';
  requestId: string;
}

export type ShippingCarrier = {
  id: string;
  name: string;
  logo?: string;
  sustainabilityRating: number; // 0-100
  avgResponseTime: number; // in minutes
  specialties: string[];
  regions: string[];
};
