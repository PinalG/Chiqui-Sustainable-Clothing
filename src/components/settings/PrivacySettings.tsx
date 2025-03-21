
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Save, Shield, Cookie, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

interface ConsentSettings {
  marketing: boolean;
  cookies: boolean;
  dataSharing: boolean;
}

const PrivacySettings = () => {
  const { userData, updateConsentSettings } = useAuth();
  const [settings, setSettings] = useState<ConsentSettings>({
    marketing: false,
    cookies: true,
    dataSharing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize from user data
  useEffect(() => {
    if (userData?.consentSettings) {
      setSettings({
        marketing: userData.consentSettings.marketing,
        cookies: userData.consentSettings.cookies,
        dataSharing: userData.consentSettings.dataSharing,
      });
    }
  }, [userData]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateConsentSettings(settings);
      toast.success("Privacy settings saved successfully");
      
      // If we were redirected to this page, go back to the original destination
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      }
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast.error("Failed to save privacy settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-soft-pink" />
          Privacy & Consent Settings
        </CardTitle>
        <CardDescription>
          Control how your data is used throughout our platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-md flex items-start space-x-3 mb-6">
          <AlertCircle className="h-5 w-5 text-soft-pink mt-0.5" />
          <div>
            <h3 className="font-medium">Data Privacy Notice</h3>
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. Please review and update your consent preferences to comply with GDPR and CCPA regulations.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center space-x-2">
              <Cookie className="h-4 w-4 text-soft-pink" />
              <Label htmlFor="cookies">Essential Cookies</Label>
            </div>
            <Switch
              id="cookies"
              checked={settings.cookies}
              onCheckedChange={(checked) => setSettings({...settings, cookies: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="h-4 w-4 text-soft-pink"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 6v12"></path>
                <path d="M9 9h6"></path>
                <path d="M9 15h6"></path>
              </svg>
              <Label htmlFor="marketing">Marketing Communications</Label>
            </div>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={(checked) => setSettings({...settings, marketing: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-soft-pink" />
              <Label htmlFor="data-sharing">Data Sharing with Partners</Label>
            </div>
            <Switch
              id="data-sharing"
              checked={settings.dataSharing}
              onCheckedChange={(checked) => setSettings({...settings, dataSharing: checked})}
            />
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full mt-6">
          <AccordionItem value="privacy-policy">
            <AccordionTrigger>Privacy Policy</AccordionTrigger>
            <AccordionContent>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>Our platform is designed with your privacy in mind. We only collect data that is necessary for the functioning of our services and to provide you with a personalized experience.</p>
                <p>Your personal information is stored securely and is never sold to third parties. We comply with GDPR and CCPA regulations to ensure your right to privacy.</p>
                <p>You have the right to access, correct, or delete your personal data at any time. For more information, contact our data protection officer at privacy@chiqui.com.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data-usage">
            <AccordionTrigger>How We Use Your Data</AccordionTrigger>
            <AccordionContent>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p><strong>Essential Cookies:</strong> These cookies are necessary for the functioning of our platform and cannot be switched off. They are usually only set in response to actions made by you such as logging in or filling in forms.</p>
                <p><strong>Marketing Communications:</strong> If enabled, we may send you emails about new features, promotions, or updates. You can unsubscribe at any time.</p>
                <p><strong>Data Sharing:</strong> When enabled, we may share anonymized data with our logistics and retail partners to improve our services and delivery options.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Consent Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacySettings;
