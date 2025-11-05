"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "nl" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    
    // Hero
    "hero.badge": "Guapo Web Designer",
    "hero.title": "If you can imagine it, I can",
    "hero.title.highlight": "design it.",
    "hero.subtitle": "Des sites web conçus pour améliorer votre visibilité et professionnaliser votre entreprise",
    "hero.cta.projects": "Voir mes projets",
    "hero.cta.contact": "Me contacter",
    
    // About
    "about.title": "À propos de Guapo",
    "about.values.passion": "Passion",
    "about.values.passion.desc": "Chaque projet est une nouvelle aventure créative",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc": "Toujours à l'avant-garde des tendances",
    "about.values.performance": "Performance",
    "about.values.performance.desc": "Des sites rapides et optimisés",
    "about.values.creativity": "Créativité",
    "about.values.creativity.desc": "Des designs uniques et mémorables",
    "about.heading": "Créateur d'expériences digitales",
    "about.intro": "Bienvenue chez",
    "about.intro.highlight": "Guapo Web Designer",
    "about.intro.text": ", votre partenaire créatif pour transformer vos idées en réalités digitales exceptionnelles.",
    "about.p1": "Avec une passion pour le design moderne et une expertise technique pointue, je crée des sites web qui ne se contentent pas d'être beaux, mais qui performent, convertissent et marquent les esprits.",
    "about.p2.prefix": "Mon approche combine",
    "about.p2.creativity": "créativité audacieuse",
    "about.p2.innovation": "innovation technologique",
    "about.p2.excellence": "excellence professionnelle",
    "about.p2.suffix": "pour donner vie à des projets web qui dépassent vos attentes.",
    "about.badge.design": "🎨 Design UI/UX",
    "about.badge.performance": "⚡ Performance optimale",
    "about.badge.tech": "🚀 Technologies modernes",
    
    // Services
    "services.title": "Mes",
    "services.title.highlight": "Services",
    "services.subtitle": "Ce que je peux faire pour vous",
    "services.design.title": "Design UI/UX",
    "services.design.desc": "Création d'interfaces utilisateur intuitives et attrayantes avec une expérience optimale.",
    "services.dev.title": "Développement Web",
    "services.dev.desc": "Développement de sites web modernes avec React, Next.js et les dernières technologies.",
    "services.responsive.title": "Design Responsive",
    "services.responsive.desc": "Sites web parfaitement adaptés à tous les écrans : mobile, tablette et desktop.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "Mes projets récents",
    
    // Contact
    "contact.title": "Travaillons",
    "contact.title.highlight": "Ensemble",
    "contact.subtitle": "Vous avez un projet en tête ? Contactez-moi et discutons de vos besoins.",
    
    // Footer
    "footer.rights": "Tous droits réservés."
  },
  nl: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "Over ons",
    "nav.services": "Diensten",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    
    // Hero
    "hero.badge": "Guapo Web Designer",
    "hero.title": "Als je het kunt bedenken, kan ik het",
    "hero.title.highlight": "ontwerpen.",
    "hero.subtitle": "Websites ontworpen om uw zichtbaarheid te verbeteren en uw bedrijf te professionaliseren",
    "hero.cta.projects": "Bekijk mijn projecten",
    "hero.cta.contact": "Neem contact op",
    
    // About
    "about.title": "Over Guapo",
    "about.values.passion": "Passie",
    "about.values.passion.desc": "Elk project is een nieuw creatief avontuur",
    "about.values.innovation": "Innovatie",
    "about.values.innovation.desc": "Altijd voorop in de trends",
    "about.values.performance": "Prestatie",
    "about.values.performance.desc": "Snelle en geoptimaliseerde websites",
    "about.values.creativity": "Creativiteit",
    "about.values.creativity.desc": "Unieke en gedenkwaardige ontwerpen",
    "about.heading": "Maker van digitale ervaringen",
    "about.intro": "Welkom bij",
    "about.intro.highlight": "Guapo Web Designer",
    "about.intro.text": ", uw creatieve partner om uw ideeën om te zetten in uitzonderlijke digitale realiteiten.",
    "about.p1": "Met een passie voor modern design en scherpe technische expertise creëer ik websites die niet alleen mooi zijn, maar ook presteren, converteren en indruk maken.",
    "about.p2.prefix": "Mijn aanpak combineert",
    "about.p2.creativity": "gedurfde creativiteit",
    "about.p2.innovation": "technologische innovatie",
    "about.p2.excellence": "professionele uitmuntendheid",
    "about.p2.suffix": "om webprojecten tot leven te brengen die uw verwachtingen overtreffen.",
    "about.badge.design": "🎨 UI/UX Design",
    "about.badge.performance": "⚡ Optimale prestaties",
    "about.badge.tech": "🚀 Moderne technologieën",
    
    // Services
    "services.title": "Mijn",
    "services.title.highlight": "Diensten",
    "services.subtitle": "Wat ik voor u kan doen",
    "services.design.title": "UI/UX Design",
    "services.design.desc": "Creatie van intuïtieve en aantrekkelijke gebruikersinterfaces met een optimale ervaring.",
    "services.dev.title": "Web Ontwikkeling",
    "services.dev.desc": "Ontwikkeling van moderne websites met React, Next.js en de nieuwste technologieën.",
    "services.responsive.title": "Responsive Design",
    "services.responsive.desc": "Websites perfect aangepast aan alle schermen: mobiel, tablet en desktop.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "Mijn recente projecten",
    
    // Contact
    "contact.title": "Laten we",
    "contact.title.highlight": "Samenwerken",
    "contact.subtitle": "Heeft u een project in gedachten? Neem contact met mij op en laten we uw behoeften bespreken.",
    
    // Footer
    "footer.rights": "Alle rechten voorbehouden."
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    
    // Hero
    "hero.badge": "Guapo Web Designer",
    "hero.title": "If you can imagine it, I can",
    "hero.title.highlight": "design it.",
    "hero.subtitle": "Websites designed to improve your visibility and professionalize your business",
    "hero.cta.projects": "View my projects",
    "hero.cta.contact": "Contact me",
    
    // About
    "about.title": "About Guapo",
    "about.values.passion": "Passion",
    "about.values.passion.desc": "Every project is a new creative adventure",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc": "Always at the forefront of trends",
    "about.values.performance": "Performance",
    "about.values.performance.desc": "Fast and optimized websites",
    "about.values.creativity": "Creativity",
    "about.values.creativity.desc": "Unique and memorable designs",
    "about.heading": "Digital experience creator",
    "about.intro": "Welcome to",
    "about.intro.highlight": "Guapo Web Designer",
    "about.intro.text": ", your creative partner to transform your ideas into exceptional digital realities.",
    "about.p1": "With a passion for modern design and sharp technical expertise, I create websites that are not only beautiful, but that perform, convert and make an impression.",
    "about.p2.prefix": "My approach combines",
    "about.p2.creativity": "bold creativity",
    "about.p2.innovation": "technological innovation",
    "about.p2.excellence": "professional excellence",
    "about.p2.suffix": "to bring to life web projects that exceed your expectations.",
    "about.badge.design": "🎨 UI/UX Design",
    "about.badge.performance": "⚡ Optimal performance",
    "about.badge.tech": "🚀 Modern technologies",
    
    // Services
    "services.title": "My",
    "services.title.highlight": "Services",
    "services.subtitle": "What I can do for you",
    "services.design.title": "UI/UX Design",
    "services.design.desc": "Creation of intuitive and attractive user interfaces with an optimal experience.",
    "services.dev.title": "Web Development",
    "services.dev.desc": "Development of modern websites with React, Next.js and the latest technologies.",
    "services.responsive.title": "Responsive Design",
    "services.responsive.desc": "Websites perfectly adapted to all screens: mobile, tablet and desktop.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "My recent projects",
    
    // Contact
    "contact.title": "Let's Work",
    "contact.title.highlight": "Together",
    "contact.subtitle": "Have a project in mind? Contact me and let's discuss your needs.",
    
    // Footer
    "footer.rights": "All rights reserved."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
