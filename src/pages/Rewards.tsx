
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardsTier } from "@/components/rewards/RewardsTier";
import { ImpactDashboard } from "@/components/rewards/ImpactDashboard";
import { EducationalContent } from "@/components/rewards/EducationalContent";
import SocialSharingWidget from "@/components/social/SocialSharingWidget";
import { Card } from "@/components/ui/card";
import { Award, Share, BookOpen, BarChart2 } from "lucide-react";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("rewards");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards & Impact</h1>
        <p className="text-muted-foreground">
          Track your sustainability journey, earn rewards, and share your impact
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden md:inline">Rewards Tier</span>
            <span className="inline md:hidden">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden md:inline">Impact Dashboard</span>
            <span className="inline md:hidden">Impact</span>
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span className="hidden md:inline">Social Sharing</span>
            <span className="inline md:hidden">Share</span>
          </TabsTrigger>
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Educational Content</span>
            <span className="inline md:hidden">Learn</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards" className="mt-6">
          <RewardsTier />
        </TabsContent>
        
        <TabsContent value="impact" className="mt-6">
          <ImpactDashboard />
        </TabsContent>
        
        <TabsContent value="share" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocialSharingWidget 
              achievementType="impact"
              achievementTitle="My Sustainability Journey"
              achievementDescription="I've saved the equivalent of 15 gallons of water and prevented 2 lbs of textiles from entering landfills!"
            />
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Share Your Impact?</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Award className="h-4 w-4" />
                  </span>
                  <span>Inspire others to make sustainable choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Award className="h-4 w-4" />
                  </span>
                  <span>Earn additional reward points for social shares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Award className="h-4 w-4" />
                  </span>
                  <span>Help build a community of sustainable fashion advocates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Award className="h-4 w-4" />
                  </span>
                  <span>Track and showcase your environmental contributions</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="learn" className="mt-6">
          <EducationalContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
