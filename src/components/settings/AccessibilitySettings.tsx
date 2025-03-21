
import { useState, useEffect } from "react";
import { useAuth, UserPreferences } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Eye, Type, MousePointer } from "lucide-react";

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' },
];

const AccessibilitySettings = () => {
  const { userData, updateUserPreferences } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user preferences when component mounts
  useEffect(() => {
    if (userData?.preferences) {
      setPreferences(userData.preferences);
    }
  }, [userData]);

  // Apply preferences to the document as they change
  useEffect(() => {
    // Apply high contrast mode
    document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
    
    // Apply large text mode
    document.documentElement.classList.toggle('large-text', preferences.largeText);
    
    // Apply reduced motion
    document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);

    // Apply screen reader optimizations
    document.documentElement.classList.toggle('screen-reader', preferences.screenReader);

    // Set language attribute on html element
    document.documentElement.setAttribute('lang', preferences.language);
  }, [preferences]);

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await updateUserPreferences(preferences);
      toast.success("Accessibility settings saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-up">
      <CardHeader>
        <CardTitle>Accessibility & Language Settings</CardTitle>
        <CardDescription>
          Customize your experience to meet your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Language</h3>
            <Select 
              value={preferences.language}
              onValueChange={(value) => setPreferences({...preferences, language: value})}
            >
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-6 pt-4">
            <h3 className="text-lg font-medium">Visual Preferences</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-soft-pink" />
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.highContrast}
                onCheckedChange={(checked) => setPreferences({...preferences, highContrast: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-soft-pink" />
                <Label htmlFor="large-text">Large Text Mode</Label>
              </div>
              <Switch
                id="large-text"
                checked={preferences.largeText}
                onCheckedChange={(checked) => setPreferences({...preferences, largeText: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-soft-pink" />
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
              </div>
              <Switch
                id="reduced-motion"
                checked={preferences.reducedMotion}
                onCheckedChange={(checked) => setPreferences({...preferences, reducedMotion: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
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
                  <path d="M18 8a6 6 0 0 0-9.33-5"></path>
                  <path d="m10.67 5.67 2.66-2.67 2.67 2.67"></path>
                  <path d="M6 15.33a6 6 0 0 0 9.33 5"></path>
                  <path d="m13.33 18.33-2.66 2.67-2.67-2.67"></path>
                  <path d="M12 4v16"></path>
                </svg>
                <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
              </div>
              <Switch
                id="screen-reader"
                checked={preferences.screenReader}
                onCheckedChange={(checked) => setPreferences({...preferences, screenReader: checked})}
              />
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleSavePreferences}
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
              Save Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
