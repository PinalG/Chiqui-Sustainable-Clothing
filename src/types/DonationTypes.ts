
export interface DonationItem {
  id: string;
  userId: string;
  itemName: string;
  category: string;
  condition: string;
  description?: string;
  imageUrl?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'processed';
  createDate: number;
  updateDate: number;
  sustainabilityImpact?: {
    waterSaved?: number; // gallons
    co2Reduced?: number; // lbs
    wasteReduced?: number; // lbs
  };
  complianceData?: {
    reviewed: boolean;
    reviewedBy?: string;
    reviewDate?: number;
    complianceNotes?: string;
    regulatoryStatus?: 'compliant' | 'pending' | 'non-compliant';
  };
}

export interface SocialInteraction {
  id: string;
  userId: string;
  type: 'share' | 'like' | 'comment';
  platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  referenceId?: string; // ID of the content being interacted with
  createDate: number;
  content?: string; // For comments or custom share text
}

export interface UserInteraction {
  donations: DonationItem[];
  socialInteractions: SocialInteraction[];
  lastInteractionDate: number;
}

export interface AnalyticsDataPoint {
  timestamp: number;
  type: 'donation' | 'purchase' | 'social' | 'sustainability';
  value: number;
  metadata?: Record<string, any>;
}

export interface ComplianceStatus {
  id: string;
  area: string;
  status: 'compliant' | 'warning' | 'violation';
  compliance: number;
  lastUpdated: number;
  details: {
    name: string;
    status: 'compliant' | 'warning' | 'violation';
    score: number;
  }[];
}

export interface ComplianceAuditLog {
  id: string;
  date: number;
  action: string;
  result: 'Passed' | 'Action Required' | 'Failed';
  compliance: string;
  user: string;
  notes?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  condition: string;
  conditionScore: number;
  sustainabilityScore: number;
  description: string;
  tags: string[];
  image: string;
  aiVerified: boolean;
  additionalImages?: string[];
  material?: string;
  care?: string;
  brand?: string;
  size?: string;
  dimensions?: string;
  donatedBy?: string;
}

export interface ProductFilter {
  category?: string;
  condition?: string;
  priceRange?: string;
  sustainabilityFilter?: string;
  searchQuery?: string;
  sortBy?: string;
}
