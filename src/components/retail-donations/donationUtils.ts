
import { z } from "zod";

// Enhanced tax benefit calculation with more detailed parameters
export const calculateTaxBenefit = (
  totalValue: number, 
  donationCategory?: string, 
  fiscalYear?: string
): number => {
  // Different rates based on donation category (if provided)
  const categoryRates: Record<string, number> = {
    'Apparel': 0.32,
    'Footwear': 0.30,
    'Accessories': 0.28,
    'Home Textiles': 0.25,
    'Children\'s Items': 0.35,
  };
  
  // Different rates based on fiscal year (if provided)
  const yearRates: Record<string, number> = {
    '2023': 0.30,
    '2024': 0.32,
    '2025': 0.33,
  };
  
  // Default rate is 30%
  let rate = 0.30;
  
  // Apply category-specific rate if available
  if (donationCategory && categoryRates[donationCategory]) {
    rate = categoryRates[donationCategory];
  }
  
  // Apply year-specific rate if available (overrides category rate)
  if (fiscalYear && yearRates[fiscalYear]) {
    rate = yearRates[fiscalYear];
  }
  
  return totalValue * rate;
};

// Enhanced storage benefit calculation with more detailed parameters
export const calculateStorageBenefit = (
  storageArea: number, 
  storageType?: string,
  location?: string
): number => {
  // Different rates based on storage type
  const typeRates: Record<string, number> = {
    'Warehouse': 2.75,
    'Retail Space': 3.25,
    'Climate Controlled': 3.50,
    'Outdoor': 1.75,
  };
  
  // Different rates based on location
  const locationMultipliers: Record<string, number> = {
    'Urban': 1.2,
    'Suburban': 1.0,
    'Rural': 0.8,
  };
  
  // Default rate is $2.50 per sq ft
  let rate = 2.50;
  
  // Apply storage type specific rate if available
  if (storageType && typeRates[storageType]) {
    rate = typeRates[storageType];
  }
  
  // Apply location multiplier if available
  if (location && locationMultipliers[location]) {
    rate *= locationMultipliers[location];
  }
  
  return storageArea * rate;
};

// Generate a unique batch ID for donations
export const generateBatchId = (): string => {
  return `RTL-${Math.floor(100000 + Math.random() * 900000)}`;
};

// Generate a default batch name for new donations
export const generateDefaultBatchName = (): string => {
  return `Batch #${Math.floor(1000 + Math.random() * 9000)}`;
};

// Generate a tax compliance document ID
export const generateTaxDocumentId = (): string => {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TAX-${timestamp}-${random}`;
};

// Format currency values consistently
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

// Helper to calculate tax deadline based on fiscal year
export const calculateTaxDeadline = (fiscalYear: string): Date => {
  const year = parseInt(fiscalYear);
  // Tax deadline is typically April 15th of the following year
  return new Date(year + 1, 3, 15);
};

// Validation schema for tax entity information
export const taxEntitySchema = z.object({
  taxEntityName: z.string().min(2, { message: "Tax entity name is required" }),
  taxId: z.string().min(9, { message: "Valid Tax ID is required" }),
  fiscalYearEnd: z.string().optional(),
  entityType: z.enum(["corporation", "llc", "partnership", "soleProprietorship"]),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export type TaxEntityInfo = z.infer<typeof taxEntitySchema>;

// Validate federal tax ID (EIN) format
export const isValidFederalTaxId = (taxId: string): boolean => {
  // Basic EIN validation (9 digits, may have hyphens)
  const cleanTaxId = taxId.replace(/[^0-9]/g, '');
  return cleanTaxId.length === 9;
};

// Calculate effective tax rate based on corporate tax rate
export const calculateEffectiveTaxRate = (
  corporateTaxRate: number,
  donationBenefit: number,
  totalRevenue: number
): number => {
  // Calculate tax savings
  const taxSavings = donationBenefit * (corporateTaxRate / 100);
  
  // Calculate effective tax rate reduction
  return taxSavings / totalRevenue * 100;
};
