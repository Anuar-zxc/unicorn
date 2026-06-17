"use client";

import { ThemeProvider } from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type Locale = "en" | "ru";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("lexo-locale");
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale(nextLocale: Locale) {
        setLocaleState(nextLocale);
        window.localStorage.setItem("lexo-locale", nextLocale);
      }
    }),
    [locale]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </ThemeProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside AppProviders");
  return context;
}
