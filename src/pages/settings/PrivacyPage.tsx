
import { useEffect } from "react";
import PrivacySettings from "@/components/settings/PrivacySettings";
import { useLocation } from "react-router-dom";

const PrivacyPage = () => {
  const location = useLocation();
  
  // If this page was accessed directly, send analytics
  useEffect(() => {
    if (!location.state?.from) {
      // You would typically log an analytics event here
      console.log("Privacy page accessed directly");
    }
  }, [location]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy & Consent Settings</h1>
      <p className="mb-8 text-muted-foreground max-w-3xl mx-auto">
        Please review and update your privacy preferences to comply with data protection regulations.
        These settings control how your data is processed and shared within our platform.
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
