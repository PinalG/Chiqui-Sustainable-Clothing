
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Gift, Sparkles, Star, Crown, ShoppingBag, Truck, Tag } from "lucide-react";
import { motion } from "framer-motion";

export const RewardsTier = () => {
  // Current user's points
  const currentPoints = 2450;
  
  // Tier thresholds
  const tiers = [
    { name: "Bronze", threshold: 1000, color: "#CD7F32", reached: true, progress: 100 },
    { name: "Silver", threshold: 2500, color: "#C0C0C0", reached: false, progress: Math.min(100, (currentPoints / 2500) * 100) },
    { name: "Gold", threshold: 5000, color: "#FFD700", reached: false, progress: Math.min(100, (currentPoints / 5000) * 100) },
    { name: "Platinum", threshold: 10000, color: "#E5E4E2", reached: false, progress: Math.min(100, (currentPoints / 10000) * 100) },
  ];
  
  // Tier benefits
  const tierBenefits = {
    "Bronze": [
      { icon: Gift, title: "Welcome Gift", description: "Receive a sustainable welcome package" },
      { icon: Tag, title: "5% Discount", description: "On all marketplace purchases" },
    ],
    "Silver": [
      { icon: Gift, title: "Welcome Gift", description: "Receive a sustainable welcome package" },
      { icon: Tag, title: "10% Discount", description: "On all marketplace purchases" },
      { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    ],
    "Gold": [
      { icon: Gift, title: "Welcome Gift", description: "Receive a sustainable welcome package" },
      { icon: Tag, title: "15% Discount", description: "On all marketplace purchases" },
      { icon: Truck, title: "Free Shipping", description: "On all orders" },
      { icon: Star, title: "Early Access", description: "Shop new arrivals 24h before others" },
    ],
    "Platinum": [
      { icon: Gift, title: "Welcome Gift", description: "Receive a premium sustainable package" },
      { icon: Tag, title: "20% Discount", description: "On all marketplace purchases" },
      { icon: Truck, title: "Free Shipping", description: "On all orders" },
      { icon: Star, title: "Early Access", description: "Shop new arrivals 48h before others" },
      { icon: Crown, title: "VIP Support", description: "Priority customer service" },
    ],
  };
  
  // Currently active tier
  const activeTier = tiers.reduce((prev, current) => 
    currentPoints >= prev.threshold && currentPoints < current.threshold ? prev : 
    currentPoints >= current.threshold ? current : prev
  );
  
  // Next tier
  const nextTierIndex = tiers.findIndex(tier => tier.name === activeTier.name) + 1;
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;
  
  // Points needed for next tier
  const pointsForNextTier = nextTier ? nextTier.threshold - currentPoints : 0;

  return (
    <div className="space-y-8">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-soft-pink" />
            Rewards Program
          </CardTitle>
          <CardDescription>
            Earn points with every purchase and donation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {nextTier ? (
            <div className="mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {currentPoints} / {nextTier.threshold} points
                </span>
                <span className="text-sm text-muted-foreground">
                  {pointsForNextTier} points until {nextTier.name}
                </span>
              </div>
              <Progress value={nextTier.progress} className="h-2" />
            </div>
          ) : (
            <div className="bg-soft-pink/10 rounded-lg p-4 mb-6">
              <p className="text-center font-medium flex items-center justify-center">
                <Crown className="mr-2 h-5 w-5 text-soft-pink" />
                You've reached the highest tier!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <Card className={`h-full ${tier.name === activeTier.name ? 'border-soft-pink ring-2 ring-soft-pink/20' : ''}`}>
                  {tier.name === activeTier.name && (
                    <div className="absolute -top-2 -right-2 bg-soft-pink text-white text-xs font-bold rounded-full px-2 py-1 flex items-center">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Current
                    </div>
                  )}
                  <CardHeader className="pb-2" style={{ backgroundColor: `${tier.color}20` }}>
                    <CardTitle className="text-center" style={{ color: tier.color }}>
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {tier.threshold.toLocaleString()} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pt-4">
                    <ul className="space-y-2">
                      {tierBenefits[tier.name].map((benefit, i) => {
                        const Icon = benefit.icon;
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-soft-pink" />
                            <span>{benefit.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-soft-pink" />
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-soft-pink/5 flex items-start gap-3">
              <div className="rounded-full bg-soft-pink/20 p-2 mt-1">
                <ShoppingBag className="h-5 w-5 text-soft-pink" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Shop in Marketplace</h4>
                <p className="text-sm text-muted-foreground">Earn 1 point for every $1 spent</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-soft-pink/5 flex items-start gap-3">
              <div className="rounded-full bg-soft-pink/20 p-2 mt-1">
                <Gift className="h-5 w-5 text-soft-pink" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Donate Items</h4>
                <p className="text-sm text-muted-foreground">Earn 50 points per donation</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-soft-pink/5 flex items-start gap-3">
              <div className="rounded-full bg-soft-pink/20 p-2 mt-1">
                <Share2 className="h-5 w-5 text-soft-pink" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Share on Social</h4>
                <p className="text-sm text-muted-foreground">Earn 10 points per share</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
