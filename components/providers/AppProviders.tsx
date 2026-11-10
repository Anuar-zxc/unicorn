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
  // Russian by default: Lexo's primary market is Kazakhstan.
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem("lexo-locale");
    } catch {
      // Storage can be unavailable (private mode, embedded browsers).
    }
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale(nextLocale: Locale) {
        setLocaleState(nextLocale);
        try {
          window.localStorage.setItem("lexo-locale", nextLocale);
        } catch {
          // Ignore: the choice still applies for this visit.
        }
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
