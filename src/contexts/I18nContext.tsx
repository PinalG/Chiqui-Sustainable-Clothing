
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, UserPreferences } from '@/contexts/AuthContext';
import { translations, TranslationKey, AvailableLanguage } from '@/lib/translations';

interface I18nContextType {
  language: AvailableLanguage;
  setLanguage: (lang: AvailableLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  availableLanguages: { code: AvailableLanguage; name: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' },
];

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { userData, updateUserPreferences } = useAuth();
  const [language, setLanguageState] = useState<AvailableLanguage>('en');

  // Initialize language from user preferences or browser
  useEffect(() => {
    if (userData?.preferences?.language) {
      setLanguageState(userData.preferences.language as AvailableLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const isSupported = availableLanguages.some(lang => lang.code === browserLang);
      
      if (isSupported) {
        setLanguageState(browserLang as AvailableLanguage);
      }
    }
  }, [userData?.preferences?.language]);

  // Set HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Update user preferences when language changes
  const setLanguage = async (lang: AvailableLanguage) => {
    setLanguageState(lang);
    
    // Only update user preferences if logged in
    if (userData) {
      try {
        await updateUserPreferences({ language: lang });
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  };

  // Translation function
  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const translatedText = translations[language]?.[key] || translations.en[key] || key;
    
    if (params) {
      return Object.entries(params).reduce((text, [param, value]) => {
        return text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      }, translatedText);
    }
    
    return translatedText;
  };

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
