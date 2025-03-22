
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
import { Save, Eye, Type, MousePointer, Palette, BookOpen } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    colorBlindFriendly: false,
    dyslexiaFriendly: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSetting, setPreviewSetting] = useState<keyof UserPreferences | null>(null);

  // Load user preferences when component mounts
  useEffect(() => {
    if (userData?.preferences) {
      setPreferences({
        ...preferences,
        ...userData.preferences,
      });
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
    
    // Apply color blind friendly mode
    document.documentElement.classList.toggle('color-blind-friendly', preferences.colorBlindFriendly);
    
    // Apply dyslexia friendly text
    document.documentElement.classList.toggle('dyslexia-friendly', preferences.dyslexiaFriendly);

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

  const handlePreview = (setting: keyof UserPreferences) => {
    setPreviewSetting(setting);
    setIsPreviewOpen(true);
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
              aria-label="Select language"
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
                <Eye className="h-4 w-4 text-soft-pink" aria-hidden="true" />
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => setPreferences({...preferences, highContrast: checked})}
                  aria-describedby="high-contrast-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('highContrast')}
                  aria-label="Preview high contrast mode"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="high-contrast-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Enhances visual boundaries with greater contrast between elements
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-soft-pink" aria-hidden="true" />
                <Label htmlFor="large-text">Large Text Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="large-text"
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => setPreferences({...preferences, largeText: checked})}
                  aria-describedby="large-text-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('largeText')}
                  aria-label="Preview large text mode"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="large-text-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Increases the font size across the application for improved readability
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-soft-pink" aria-hidden="true" />
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => setPreferences({...preferences, reducedMotion: checked})}
                  aria-describedby="reduced-motion-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('reducedMotion')}
                  aria-label="Preview reduced motion"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="reduced-motion-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Minimizes animations and transitions throughout the interface
            </p>
            
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
                  aria-hidden="true"
                >
                  <path d="M18 8a6 6 0 0 0-9.33-5"></path>
                  <path d="m10.67 5.67 2.66-2.67 2.67 2.67"></path>
                  <path d="M6 15.33a6 6 0 0 0 9.33 5"></path>
                  <path d="m13.33 18.33-2.66 2.67-2.67-2.67"></path>
                  <path d="M12 4v16"></path>
                </svg>
                <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="screen-reader"
                  checked={preferences.screenReader}
                  onCheckedChange={(checked) => setPreferences({...preferences, screenReader: checked})}
                  aria-describedby="screen-reader-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('screenReader')}
                  aria-label="Preview screen reader optimization"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="screen-reader-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Improves compatibility with screen readers and assistive technologies
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-soft-pink" aria-hidden="true" />
                <Label htmlFor="color-blind">Color Blind Friendly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color-blind"
                  checked={preferences.colorBlindFriendly}
                  onCheckedChange={(checked) => setPreferences({...preferences, colorBlindFriendly: checked})}
                  aria-describedby="color-blind-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('colorBlindFriendly')}
                  aria-label="Preview color blind friendly mode"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="color-blind-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Adjusts colors to be more distinguishable for those with color vision deficiencies
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-soft-pink" aria-hidden="true" />
                <Label htmlFor="dyslexia-friendly">Dyslexia Friendly Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="dyslexia-friendly"
                  checked={preferences.dyslexiaFriendly}
                  onCheckedChange={(checked) => setPreferences({...preferences, dyslexiaFriendly: checked})}
                  aria-describedby="dyslexia-friendly-description"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePreview('dyslexiaFriendly')}
                  aria-label="Preview dyslexia friendly text"
                >
                  Preview
                </Button>
              </div>
            </div>
            <p id="dyslexia-friendly-description" className="text-sm text-muted-foreground -mt-4 ml-6">
              Adjusts text spacing and font for easier reading for those with dyslexia
            </p>
          </div>
        </div>
        
        <Collapsible className="mt-6 border rounded-lg p-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium">Keyboard Navigation Tips</span>
            <Button variant="ghost" size="sm">
              <span className="sr-only">Toggle keyboard navigation tips</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Press <kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd> to navigate between elements</li>
              <li>Use <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> to activate buttons and links</li>
              <li>Press <kbd className="px-1 py-0.5 bg-muted rounded">Shift + Tab</kbd> to navigate backwards</li>
              <li>Use <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close dialogs and modals</li>
              <li>Press <kbd className="px-1 py-0.5 bg-muted rounded">Alt + Shift + A</kbd> to quickly access this accessibility menu from anywhere</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleSavePreferences}
          disabled={isLoading}
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Save Settings
            </>
          )}
        </Button>
      </CardContent>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview {previewSetting?.replace(/([A-Z])/g, ' $1').toLowerCase()}</DialogTitle>
            <DialogDescription>
              This is a preview of how the application would look with this setting enabled.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className={`p-4 border rounded-lg ${previewSetting}`}>
              <h3 className="text-lg font-medium mb-2">Sample Content</h3>
              <p className="mb-4">This is an example of how content would appear with the selected accessibility option enabled.</p>
              <div className="flex space-x-2">
                <Button size="sm">Primary Button</Button>
                <Button size="sm" variant="outline">Secondary Button</Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewOpen(false)}
            >
              Close Preview
            </Button>
            <Button 
              onClick={() => {
                if (previewSetting) {
                  setPreferences({
                    ...preferences,
                    [previewSetting]: !preferences[previewSetting as keyof UserPreferences]
                  });
                  setIsPreviewOpen(false);
                }
              }}
            >
              {previewSetting && preferences[previewSetting as keyof UserPreferences] 
                ? 'Disable' : 'Enable'} Setting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AccessibilitySettings;
