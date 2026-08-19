'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LanguageCode, translations, Translations } from '@/lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function createFallbackProxy<T extends Record<string, any>>(target: T, fallback: T): T {
  return new Proxy(target, {
    get(obj, prop: string) {
      const val = obj[prop];
      const fallbackVal = fallback ? fallback[prop] : undefined;
      if (val === undefined || val === null) {
        return fallbackVal;
      }
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        return createFallbackProxy(val, fallbackVal || {});
      }
      return val;
    },
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      const saved = (localStorage.getItem('koicakonnect_lang') || localStorage.getItem('networth_lang')) as LanguageCode;
      if (saved && (saved === 'en' || saved === 'fr' || saved === 'ko')) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage unavailable exceptions in private browsing
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('koicakonnect_lang', lang);
    } catch {
      // Ignore
    }
  };

  const t = useMemo(() => {
    const raw = translations[language] || translations.en;
    return createFallbackProxy(raw, translations.en);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
