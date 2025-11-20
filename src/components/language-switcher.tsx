"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Language = "fr" | "nl" | "en" | "es" | "de" | "it" | "pt";

export function LanguageSwitcher() {
  const { language: currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    fr: "FR",
    nl: "NL",
    en: "EN",
    es: "ES",
    de: "DE",
    it: "IT",
    pt: "PT"
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors border border-primary/20"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="font-medium">{languages[currentLanguage]}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
            {Object.entries(languages).map(([code, label]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors ${
                  currentLanguage === code ? "bg-primary/20 font-semibold" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}