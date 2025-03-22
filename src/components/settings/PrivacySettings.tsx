
import { useState, useEffect } from "react";
import { useAuth, UserPreferences } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, ShieldCheck } from "lucide-react";

const PrivacySettings = () => {
  const { userData, updateConsentSettings } = useAuth();
  const { t } = useI18n();
  const [consentSettings, setConsentSettings] = useState({
    marketing: false,
    cookies: true,
    dataSharing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user consent settings when component mounts
  useEffect(() => {
    if (userData?.consentSettings) {
      setConsentSettings({
        marketing: userData.consentSettings.marketing || false,
        cookies: userData.consentSettings.cookies || true,
        dataSharing: userData.consentSettings.dataSharing || false,
      });
    }
  }, [userData]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateConsentSettings({
        ...consentSettings,
        lastUpdated: Date.now(),
      });
      toast.success(t('settings.saved'));
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-up">
      <CardHeader>
        <CardTitle>{t('privacy.title')}</CardTitle>
        <CardDescription>
          {t('privacy.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <Checkbox
            id="marketing-consent"
            label={t('privacy.marketingConsent')}
            description="We'll send occasional emails about new features, promotions, and sustainability tips."
            checked={consentSettings.marketing}
            onCheckedChange={(checked) =>
              setConsentSettings({
                ...consentSettings,
                marketing: checked as boolean,
              })
            }
          />

          <Checkbox
            id="cookies-consent"
            label={t('privacy.cookiesConsent')}
            description="Essential cookies are required for the application to function. Additional cookies help us improve your experience."
            checked={consentSettings.cookies}
            onCheckedChange={(checked) =>
              setConsentSettings({
                ...consentSettings,
                cookies: checked as boolean,
              })
            }
          />

          <Checkbox
            id="data-sharing-consent"
            label={t('privacy.dataSharingConsent')}
            description="We may share anonymized data with partners to improve our services and sustainability metrics."
            checked={consentSettings.dataSharing}
            onCheckedChange={(checked) =>
              setConsentSettings({
                ...consentSettings,
                dataSharing: checked as boolean,
              })
            }
          />
        </div>

        <div className="pt-6">
          <Button
            className="w-full"
            onClick={handleSaveSettings}
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {t('common.loading')}
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('common.save')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
