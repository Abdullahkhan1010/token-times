import React, { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translations";

const LanguageContext = createContext({
  language: "en",
  isUrdu: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("selected_lang") === "ur" ? "ur" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("selected_lang", language);
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ur" ? "en" : "ur"));
  };

  const t = (key, fallback) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    if (fallback !== undefined) return fallback;
    return TRANSLATIONS.en?.[key] || key;
  };

  const isUrdu = language === "ur";

  return (
    <LanguageContext.Provider
      value={{
        language,
        isUrdu,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
