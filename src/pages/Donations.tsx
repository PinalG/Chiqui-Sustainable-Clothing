
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialSharingWidget from "@/components/social/SocialSharingWidget";
import { Share, Package } from "lucide-react";
import DonationManagement from "@/components/donations/DonationManagement";

const Donations = () => {
  const [activeTab, setActiveTab] = useState("donations");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground">
          Manage and track individual clothing donations and your sustainability impact.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 md:gap-4">
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Donation Management</span>
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span>Share Impact</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="mt-6">
          <DonationManagement />
        </TabsContent>
        
        <TabsContent value="share" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocialSharingWidget 
              achievementType="donation"
              achievementTitle="My Donation Impact"
              achievementDescription="I've donated clothing through ACDRP and helped reduce textile waste!"
            />
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Share Your Donations?</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Share className="h-4 w-4" />
                  </span>
                  <span>Inspire others to donate their unused clothing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Share className="h-4 w-4" />
                  </span>
                  <span>Earn additional reward points when sharing your impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Share className="h-4 w-4" />
                  </span>
                  <span>Help build a community of sustainable fashion advocates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-soft-pink/20 text-soft-pink p-1 rounded-full mt-0.5">
                    <Share className="h-4 w-4" />
                  </span>
                  <span>Track and showcase your positive environmental impact</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Donations;
