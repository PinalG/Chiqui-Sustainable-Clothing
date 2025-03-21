
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } from "firebase/firestore";

// Types for logistics
export interface ShippingBid {
  id?: string;
  providerId: string;
  providerName: string;
  price: number;
  estimatedDeliveryDays: number;
  carbonFootprint: number;
  timestamp: Date;
  selected?: boolean;
}

export interface ShipmentTrackingInfo {
  id: string;
  orderId: string;
  status: 'processing' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedDelivery: Date;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  history: Array<{
    status: string;
    location: string;
    timestamp: Date;
    description: string;
  }>;
}

export interface WarehouseItem {
  id?: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  locationCode: string;
  status: 'available' | 'reserved' | 'shipped';
  lastUpdated: Date;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  apiKey?: string;
  contactEmail: string;
  services: Array<{
    type: string;
    basePrice: number;
    carbonFootprint: number;
  }>;
  active: boolean;
}

// Mock data for development
const mockLogisticsPartners: LogisticsPartner[] = [
  {
    id: "partner-1",
    name: "EcoShip",
    contactEmail: "support@ecoship.com",
    services: [
      { type: "standard", basePrice: 5.99, carbonFootprint: 2.4 },
      { type: "express", basePrice: 12.99, carbonFootprint: 4.8 }
    ],
    active: true
  },
  {
    id: "partner-2",
    name: "GreenDelivery",
    contactEmail: "help@greendelivery.com",
    services: [
      { type: "standard", basePrice: 6.99, carbonFootprint: 1.9 },
      { type: "express", basePrice: 14.99, carbonFootprint: 3.5 }
    ],
    active: true
  },
  {
    id: "partner-3",
    name: "FastEco",
    contactEmail: "contact@fasteco.com",
    services: [
      { type: "standard", basePrice: 7.49, carbonFootprint: 2.1 },
      { type: "express", basePrice: 15.99, carbonFootprint: 4.2 }
    ],
    active: true
  }
];

// Helper function to calculate package-specific adjustment factor based on size, weight, etc.
const calculateAdjustmentFactor = (
  packageDetails: { 
    weight: number; 
    dimensions: { length: number; width: number; height: number }; 
    fragile: boolean;
  }
) => {
  const { weight, dimensions, fragile } = packageDetails;
  const volume = dimensions.length * dimensions.width * dimensions.height;
  
  // Base adjustment based on weight and volume
  let adjustment = 1.0 + (weight / 10) * 0.2 + (volume / 1000) * 0.1;
  
  // Additional adjustment for fragile items
  if (fragile) adjustment *= 1.15;
  
  return adjustment;
};

/**
 * Generates shipping bids from various logistics partners
 */
export const generateShippingBids = async (
  origin: { zipCode: string },
  destination: { zipCode: string },
  packageDetails: { 
    weight: number; 
    dimensions: { length: number; width: number; height: number }; 
    fragile: boolean;
  }
): Promise<ShippingBid[]> => {
  // In a real app, we would call each logistics partner's API
  // For development, we'll simulate the bidding process
  
  try {
    // For a real implementation, fetch partners from Firestore
    // const partnersSnapshot = await getDocs(collection(db, "logisticsPartners"));
    // const partners = partnersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const partners = mockLogisticsPartners;
    
    // Calculate distance-based price modification (simplified)
    const distanceFactor = Math.abs(parseInt(origin.zipCode) - parseInt(destination.zipCode)) / 10000;
    
    // Calculate package-specific adjustment
    const packageFactor = calculateAdjustmentFactor(packageDetails);
    
    // Generate bids from each partner
    const bids: ShippingBid[] = partners.map(partner => {
      // For each partner, generate bids for different service levels
      return partner.services.map(service => {
        // Calculate final price with adjustments
        const basePrice = service.basePrice;
        const adjustedPrice = basePrice * (1 + distanceFactor) * packageFactor;
        
        // Add some randomness to simulate competitive bidding
        const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
        const finalPrice = adjustedPrice * randomFactor;
        
        // Calculate estimated delivery days based on service type
        const baseDays = service.type === 'express' ? 2 : 5;
        const estimatedDays = Math.round(baseDays * (1 + distanceFactor * 0.5));
        
        return {
          id: `bid-${partner.id}-${service.type}-${Date.now()}`,
          providerId: partner.id,
          providerName: `${partner.name} ${service.type.charAt(0).toUpperCase() + service.type.slice(1)}`,
          price: parseFloat(finalPrice.toFixed(2)),
          estimatedDeliveryDays: estimatedDays,
          carbonFootprint: service.carbonFootprint * (packageDetails.weight / 5),
          timestamp: new Date(),
          selected: false
        };
      });
    }).flat();
    
    // Sort bids by price (lowest first)
    return bids.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Error generating shipping bids:", error);
    return [];
  }
};

/**
 * Select a winning bid and create a shipment
 */
export const selectShippingBid = async (orderId: string, bid: ShippingBid): Promise<string> => {
  try {
    // In a real app, save the selected bid to Firestore
    // const shipmentRef = await addDoc(collection(db, "shipments"), {
    //   orderId,
    //   bid,
    //   status: 'processing',
    //   createdAt: new Date()
    // });
    
    // For development, we'll return a mock shipment ID
    return `shipment-${orderId}-${Date.now()}`;
  } catch (error) {
    console.error("Error selecting shipping bid:", error);
    throw new Error("Failed to select shipping bid");
  }
};

/**
 * Get tracking information for a shipment
 */
export const getShipmentTracking = async (shipmentId: string): Promise<ShipmentTrackingInfo> => {
  try {
    // In a real app, fetch from Firestore
    // const shipmentDoc = await getDoc(doc(db, "shipments", shipmentId));
    // if (!shipmentDoc.exists()) throw new Error("Shipment not found");
    // const shipmentData = shipmentDoc.data();
    
    // For development, return mock tracking data
    const mockStatuses: ShipmentTrackingInfo['status'][] = [
      'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'
    ];
    
    const currentStatusIndex = Math.min(
      Math.floor(Math.random() * mockStatuses.length),
      mockStatuses.length - 1
    );
    
    const currentStatus = mockStatuses[currentStatusIndex];
    const mockLocations = [
      { address: "Warehouse A, Los Angeles", lat: 34.0522, lng: -118.2437 },
      { address: "Distribution Center, Phoenix", lat: 33.4484, lng: -112.0740 },
      { address: "Local Hub, Dallas", lat: 32.7767, lng: -96.7970 },
      { address: "Delivery Center, Houston", lat: 29.7604, lng: -95.3698 },
      { address: "Customer Address", lat: 30.2672, lng: -97.7431 }
    ];
    
    // Generate history based on current status
    const history = [];
    for (let i = 0; i <= currentStatusIndex; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (currentStatusIndex - i));
      
      history.push({
        status: mockStatuses[i],
        location: mockLocations[i].address,
        timestamp: date,
        description: `Package ${mockStatuses[i].replace('_', ' ')}`
      });
    }
    
    // Calculate estimated delivery
    const estimatedDelivery = new Date();
    if (currentStatus !== 'delivered') {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 
        (mockStatuses.length - 1 - currentStatusIndex));
    }
    
    return {
      id: shipmentId,
      orderId: shipmentId.split('-')[1],
      status: currentStatus,
      currentLocation: mockLocations[currentStatusIndex],
      estimatedDelivery,
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
      trackingUrl: `https://chiqui.org/track/${shipmentId}`,
      carrier: mockLogisticsPartners[Math.floor(Math.random() * mockLogisticsPartners.length)].name,
      history
    };
  } catch (error) {
    console.error("Error getting shipment tracking:", error);
    throw new Error("Failed to get shipment tracking");
  }
};

/**
 * Get warehouse inventory status
 */
export const getWarehouseInventory = async (warehouseId?: string): Promise<WarehouseItem[]> => {
  try {
    // In a real app, fetch from Firestore
    // const q = warehouseId 
    //   ? query(collection(db, "warehouseInventory"), where("warehouseId", "==", warehouseId))
    //   : collection(db, "warehouseInventory");
    // const snapshot = await getDocs(q);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as WarehouseItem }));
    
    // For development, return mock inventory data
    const mockInventory: WarehouseItem[] = [];
    const statuses: WarehouseItem['status'][] = ['available', 'reserved', 'shipped'];
    
    for (let i = 0; i < 20; i++) {
      const warehouseId = `warehouse-${1 + Math.floor(Math.random() * 3)}`;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      mockInventory.push({
        id: `item-${i}`,
        productId: `product-${Math.floor(Math.random() * 100)}`,
        warehouseId: warehouseId,
        quantity: Math.floor(Math.random() * 20) + 1,
        locationCode: `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(Math.random() * 100)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastUpdated: date
      });
    }
    
    return warehouseId 
      ? mockInventory.filter(item => item.warehouseId === warehouseId)
      : mockInventory;
  } catch (error) {
    console.error("Error getting warehouse inventory:", error);
    return [];
  }
};

/**
 * Get logistics partners
 */
export const getLogisticsPartners = async (): Promise<LogisticsPartner[]> => {
  try {
    // In a real app, fetch from Firestore
    // const snapshot = await getDocs(collection(db, "logisticsPartners"));
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as LogisticsPartner }));
    
    // For development, return mock partners
    return mockLogisticsPartners;
  } catch (error) {
    console.error("Error getting logistics partners:", error);
    return [];
  }
};
