
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccessibilitySettings from "@/components/settings/AccessibilitySettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import { Card } from "@/components/ui/card";
import { Shield, Eye } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("accessibility");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="accessibility" className="flex items-center justify-center">
            <Eye className="mr-2 h-4 w-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center justify-center">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8 p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-4">Testing & Accessibility Features</h2>
        <p className="mb-4">
          Our platform is fully compatible with popular screen readers like JAWS, NVDA, and VoiceOver. 
          We regularly conduct WCAG 2.1 compliance testing to ensure accessibility for all users.
        </p>
        <h3 className="text-lg font-medium mt-4 mb-2">Keyboard Navigation</h3>
        <ul className="list-disc list-inside space-y-1 text-sm pl-4">
          <li>Use <kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd> to navigate between elements</li>
          <li>Use <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> to activate buttons</li>
          <li>Use <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close modals and dialogs</li>
          <li>Use arrow keys to navigate dropdown menus</li>
        </ul>
      </Card>
    </div>
  );
};

export default SettingsPage;
