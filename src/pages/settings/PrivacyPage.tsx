
import { useEffect } from "react";
import PrivacySettings from "@/components/settings/PrivacySettings";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // If this page was accessed directly, send analytics
  useEffect(() => {
    if (!location.state?.from) {
      // You would typically log an analytics event here
      console.log("Privacy page accessed directly");
    }
  }, [location]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Privacy & Consent Settings</h1>
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <p className="mb-8 text-muted-foreground max-w-3xl mx-auto">
        Please review and update your privacy preferences to comply with data protection regulations.
        These settings control how your data is processed and shared within our platform.
        {userData?.role === "retailer" && " As a retail partner, consent settings are required for accessing donation features."}
      </p>
      
      <PrivacySettings />
      
      <div className="mt-8 max-w-3xl mx-auto text-sm text-muted-foreground">
        <p>
          For more information about how we handle your data, please refer to our 
          <a href="/legal/privacy-policy" className="text-soft-pink ml-1 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
