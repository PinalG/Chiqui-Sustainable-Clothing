
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Gift, Trophy, Leaf, Share2, Users, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RewardsTier } from "@/components/rewards/RewardsTier";
import { ImpactDashboard } from "@/components/rewards/ImpactDashboard";
import { SocialSharing } from "@/components/rewards/SocialSharing";
import { EducationalContent } from "@/components/rewards/EducationalContent";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("tiers");

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Rewards & Impact</h1>
          <p className="text-muted-foreground">Track your sustainability journey and earn rewards</p>
        </div>
        <Button className="bg-soft-pink hover:bg-soft-pink/90">
          <Gift className="mr-2 h-4 w-4" />
          Redeem Points
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card hover-lift">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Points</p>
              <p className="text-3xl font-bold">2,450</p>
            </div>
            <Award className="h-12 w-12 text-soft-pink opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Tier</p>
              <p className="text-3xl font-bold">Silver</p>
            </div>
            <Trophy className="h-12 w-12 text-heather-grey opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              <p className="text-3xl font-bold">128 kg</p>
            </div>
            <Leaf className="h-12 w-12 text-green-500 opacity-80" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tiers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="tiers" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Trophy className="mr-2 h-4 w-4" />
            Rewards Tiers
          </TabsTrigger>
          <TabsTrigger value="impact" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Leaf className="mr-2 h-4 w-4" />
            Impact Dashboard
          </TabsTrigger>
          <TabsTrigger value="sharing" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <Share2 className="mr-2 h-4 w-4" />
            Social Sharing
          </TabsTrigger>
          <TabsTrigger value="learn" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
            <HelpCircle className="mr-2 h-4 w-4" />
            Learn
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="tiers" className="mt-0">
            <RewardsTier />
          </TabsContent>
          
          <TabsContent value="impact" className="mt-0">
            <ImpactDashboard />
          </TabsContent>
          
          <TabsContent value="sharing" className="mt-0">
            <SocialSharing />
          </TabsContent>
          
          <TabsContent value="learn" className="mt-0">
            <EducationalContent />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default Rewards;
