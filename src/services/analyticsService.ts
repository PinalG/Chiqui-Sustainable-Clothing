
import { useQuery } from "@tanstack/react-query";

export interface InventoryStats {
  totalItems: number;
  availableItems: number;
  pendingItems: number;
  soldItems: number;
  lowStockItems: number;
  categories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  monthlyCounts: Array<{
    month: string;
    count: number;
  }>;
}

export interface BidStats {
  totalBids: number;
  averageBidAmount: number;
  winningBidsPercentage: number;
  averageDeliveryTime: number;
  carbonSaved: number;
  bidsByCarrier: Array<{
    carrier: string;
    count: number;
    percentage: number;
  }>;
  bidTrends: Array<{
    date: string;
    count: number;
    averageAmount: number;
  }>;
}

export interface TaxStats {
  totalTaxBenefits: number;
  inventoryBenefits: number;
  storageBenefits: number;
  projectedAnnualBenefits: number;
  monthlyBenefits: Array<{
    month: string;
    amount: number;
  }>;
}

export interface SalesStats {
  totalSales: number;
  revenueGenerated: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlySales: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  topSellingCategories: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

// In a real app, these would be API calls to your backend
const fetchInventoryStats = async (): Promise<InventoryStats> => {
  // Simulating an API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalItems: 4732,
        availableItems: 3984,
        pendingItems: 567,
        soldItems: 181,
        lowStockItems: 42,
        categories: [
          { name: "Clothing", count: 2876, percentage: 60.78 },
          { name: "Accessories", count: 985, percentage: 20.82 },
          { name: "Footwear", count: 643, percentage: 13.59 },
          { name: "Other", count: 228, percentage: 4.81 }
        ],
        monthlyCounts: [
          { month: "Jan", count: 3200 },
          { month: "Feb", count: 3450 },
          { month: "Mar", count: 3780 },
          { month: "Apr", count: 4120 },
          { month: "May", count: 4380 },
          { month: "Jun", count: 4732 }
        ]
      });
    }, 600);
  });
};

const fetchBidStats = async (): Promise<BidStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalBids: 1845,
        averageBidAmount: 12.32,
        winningBidsPercentage: 18.5,
        averageDeliveryTime: 42.8, // hours
        carbonSaved: 1284.5, // kg
        bidsByCarrier: [
          { carrier: "EcoShip", count: 745, percentage: 40.38 },
          { carrier: "FastTrack", count: 528, percentage: 28.62 },
          { carrier: "Green Logistics", count: 324, percentage: 17.56 },
          { carrier: "Others", count: 248, percentage: 13.44 }
        ],
        bidTrends: [
          { date: "Jan", count: 254, averageAmount: 10.75 },
          { date: "Feb", count: 312, averageAmount: 11.23 },
          { date: "Mar", count: 378, averageAmount: 11.87 },
          { date: "Apr", count: 415, averageAmount: 12.05 },
          { date: "May", count: 486, averageAmount: 12.28 },
          { date: "Jun", count: 1845, averageAmount: 12.32 }
        ]
      });
    }, 800);
  });
};

const fetchTaxStats = async (): Promise<TaxStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalTaxBenefits: 127850,
        inventoryBenefits: 94320,
        storageBenefits: 33530,
        projectedAnnualBenefits: 248000,
        monthlyBenefits: [
          { month: "Jan", amount: 14250 },
          { month: "Feb", amount: 18375 },
          { month: "Mar", amount: 21480 },
          { month: "Apr", amount: 23140 },
          { month: "May", amount: 25780 },
          { month: "Jun", amount: 24825 }
        ]
      });
    }, 700);
  });
};

const fetchSalesStats = async (): Promise<SalesStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalSales: 3254,
        revenueGenerated: 128750,
        averageOrderValue: 39.57,
        conversionRate: 4.8, // percentage
        monthlySales: [
          { month: "Jan", count: 435, revenue: 16840 },
          { month: "Feb", count: 512, revenue: 19875 },
          { month: "Mar", count: 578, revenue: 22150 },
          { month: "Apr", count: 615, revenue: 24380 },
          { month: "May", count: 654, revenue: 26340 },
          { month: "Jun", count: 460, revenue: 19165 }
        ],
        topSellingCategories: [
          { category: "Women's Apparel", sales: 1342, percentage: 41.24 },
          { category: "Men's Apparel", sales: 982, percentage: 30.18 },
          { category: "Footwear", sales: 587, percentage: 18.04 },
          { category: "Accessories", sales: 343, percentage: 10.54 }
        ]
      });
    }, 500);
  });
};

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ["inventoryStats"],
    queryFn: fetchInventoryStats,
  });
};

export const useBidStats = () => {
  return useQuery({
    queryKey: ["bidStats"],
    queryFn: fetchBidStats,
  });
};

export const useTaxStats = () => {
  return useQuery({
    queryKey: ["taxStats"],
    queryFn: fetchTaxStats,
  });
};

export const useSalesStats = () => {
  return useQuery({
    queryKey: ["salesStats"],
    queryFn: fetchSalesStats,
  });
};
