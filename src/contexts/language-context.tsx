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
    "hero.title": "If you can imagine it, we can",
    "hero.title.highlight": "design it.",
    "hero.subtitle": "Des sites web conçus pour améliorer votre visibilité et professionnaliser votre entreprise",
    "hero.cta.projects": "Voir nos projets",
    "hero.cta.contact": "Nous contacter",
    
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
    "about.heading": "Créateur passionné",
    "about.intro": "Passionnés par le design et les nouvelles technologies, nous créons des sites web modernes, élégants et performants. Notre approche combine créativité, expertise technique et attention aux détails pour donner vie à vos projets digitaux.",
    "about.intro.highlight": "",
    "about.intro.text": "",
    "about.p1": "Chaque projet est unique et mérite une attention particulière.",
    "about.p2.prefix": "",
    "about.p2.creativity": "",
    "about.p2.innovation": "",
    "about.p2.excellence": "",
    "about.p2.suffix": "",
    "about.badge.design": "🎨 Design UI/UX",
    "about.badge.performance": "⚡ Performance optimale",
    "about.badge.tech": "🚀 Technologies modernes",
    
    // Services Page
    "services.page.title": "Nos Services",
    "services.desktop.title": "Sites Vitrine Desktop",
    "services.desktop.desc": "Sites web optimisés pour écrans larges avec designs professionnels et modernes",
    "services.tablet.title": "Adaptation Tablette",
    "services.tablet.desc": "Interfaces parfaitement adaptées aux tablettes pour une expérience fluide",
    "services.mobile.title": "Optimisation Mobile",
    "services.mobile.desc": "Navigation optimale sur smartphones avec performances maximales",
    "services.responsive.title": "Design Responsive",
    "services.responsive.desc": "Adaptation automatique à tous types d'appareils et résolutions",
    "services.branding.title": "Identité Visuelle",
    "services.branding.desc": "Création de logos, chartes graphiques et éléments visuels uniques",
    "services.performance.title": "Performance Web",
    "services.performance.desc": "Sites ultra-rapides optimisés pour le référencement et l'expérience utilisateur",
    "services.cta.title": "Besoin d'un site vitrine ? 🚀",
    "services.cta.desc": "Restaurant, cabinet professionnel, entreprise ou portfolio personnel : nous créons votre site vitrine accessible sur tous les appareils !",
    "services.cta.button": "Discutons de votre projet 💬",
    
    // Services
    "services.title": "Nos",
    "services.title.highlight": "Services",
    "services.subtitle": "Ce que nous pouvons faire pour vous",
    "services.design.title": "Design UI/UX",
    "services.design.desc": "Création d'interfaces utilisateur intuitives et attrayantes avec une expérience optimale.",
    "services.dev.title": "Développement Web",
    "services.dev.desc": "Développement de sites web modernes avec React, Next.js et les dernières technologies.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "Nos projets récents",
    
    // Contact
    "contact.title": "Travaillons",
    "contact.title.highlight": "Ensemble",
    "contact.subtitle": "Vous avez un projet en tête ? Contactez-nous et discutons de vos besoins.",
    
    // Contact Page
    "contact.page.title": "Contactez-nous",
    "contact.page.intro": "Besoin d'un site web moderne et performant ? Contactez-nous dès maintenant !",
    "contact.email.title": "Email",
    "contact.email.address": "info@guapowebdesigner.com",
    "contact.email.copy": "Copier",
    "contact.email.copied": "Email copié !",
    "contact.instagram.title": "Instagram",
    "contact.instagram.handle": "@guapo.webdesigner",
    "contact.instagram.copy": "Copier",
    "contact.instagram.copied": "Handle copié !",
    "contact.form.title": "Demande de devis",
    "contact.form.name": "Nom complet",
    "contact.form.email": "Email",
    "contact.form.phone": "Téléphone (optionnel)",
    "contact.form.message": "Message",
    "contact.form.submit": "Envoyer la demande",
    "contact.form.sending": "Envoi en cours...",
    "contact.form.success": "Demande envoyée avec succès !",
    "contact.form.error": "Erreur lors de l'envoi. Veuillez réessayer.",
    "footer.description": "Créateur de sites web modernes et performants. Votre vision, notre expertise.",
    "footer.links": "Liens rapides",
    "footer.social": "Suivez-nous",
    "footer.copyright": "Guapo Web Designer 2025",
    
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
    "hero.title": "Als je het kunt bedenken, kunnen wij het",
    "hero.title.highlight": "ontwerpen.",
    "hero.subtitle": "Websites ontworpen om uw zichtbaarheid te verbeteren en uw bedrijf te professionaliseren",
    "hero.cta.projects": "Bekijk onze projecten",
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
    "about.heading": "Gepassioneerde maker",
    "about.intro": "Gepassioneerd door design en nieuwe technologieën, creëren wij moderne, elegante en krachtige websites. Onze aanpak combineert creativiteit, technische expertise en aandacht voor detail om uw digitale projecten tot leven te brengen.",
    "about.intro.highlight": "",
    "about.intro.text": "",
    "about.p1": "Elk project is uniek en verdient bijzondere aandacht.",
    "about.p2.prefix": "",
    "about.p2.creativity": "",
    "about.p2.innovation": "",
    "about.p2.excellence": "",
    "about.p2.suffix": "",
    "about.badge.design": "🎨 UI/UX Design",
    "about.badge.performance": "⚡ Optimale prestaties",
    "about.badge.tech": "🚀 Moderne technologieën",
    
    // Services Page
    "services.page.title": "Onze Diensten",
    "services.desktop.title": "Desktop Showcase Sites",
    "services.desktop.desc": "Websites geoptimaliseerd voor grote schermen met professionele en moderne ontwerpen",
    "services.tablet.title": "Tablet Aanpassing",
    "services.tablet.desc": "Interfaces perfect aangepast aan tablets voor een vloeiende ervaring",
    "services.mobile.title": "Mobiele Optimalisatie",
    "services.mobile.desc": "Optimale navigatie op smartphones met maximale prestaties",
    "services.responsive.title": "Responsive Design",
    "services.responsive.desc": "Automatische aanpassing aan alle soorten apparaten en resoluties",
    "services.branding.title": "Visuele Identiteit",
    "services.branding.desc": "Creatie van logo's, grafische handvesten en unieke visuele elementen",
    "services.performance.title": "Web Prestaties",
    "services.performance.desc": "Ultrasnelle websites geoptimaliseerd voor SEO en gebruikerservaring",
    "services.cta.title": "Heeft u een showcase site nodig? 🚀",
    "services.cta.desc": "Restaurant, professioneel kantoor, bedrijf of persoonlijke portfolio: wij creëren uw showcase site toegankelijk op alle apparaten!",
    "services.cta.button": "Laten we praten over uw project 💬",
    
    // Services
    "services.title": "Onze",
    "services.title.highlight": "Diensten",
    "services.subtitle": "Wat wij voor u kunnen doen",
    "services.design.title": "UI/UX Design",
    "services.design.desc": "Creatie van intuïtieve en aantrekkelijke gebruikersinterfaces met een optimale ervaring.",
    "services.dev.title": "Web Ontwikkeling",
    "services.dev.desc": "Ontwikkeling van moderne websites met React, Next.js en de nieuwste technologieën.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "Onze recente projecten",
    
    // Contact
    "contact.title": "Laten we",
    "contact.title.highlight": "Samenwerken",
    "contact.subtitle": "Heeft u een project in gedachten? Neem contact met ons op en laten we uw behoeften bespreken.",
    
    // Contact Page
    "contact.page.title": "Neem contact op",
    "contact.page.intro": "Heeft u een moderne en krachtige website nodig? Neem nu contact met ons op!",
    "contact.email.title": "Email",
    "contact.email.address": "info@guapowebdesigner.com",
    "contact.email.copy": "Kopiëren",
    "contact.email.copied": "Email gekopieerd!",
    "contact.instagram.title": "Instagram",
    "contact.instagram.handle": "@guapo.webdesigner",
    "contact.instagram.copy": "Kopiëren",
    "contact.instagram.copied": "Handle gekopieerd!",
    "contact.form.title": "Offerte aanvraag",
    "contact.form.name": "Volledige naam",
    "contact.form.email": "Email",
    "contact.form.phone": "Telefoon (optioneel)",
    "contact.form.message": "Bericht",
    "contact.form.submit": "Verstuur aanvraag",
    "contact.form.sending": "Bezig met versturen...",
    "contact.form.success": "Aanvraag succesvol verzonden!",
    "contact.form.error": "Fout bij verzenden. Probeer het opnieuw.",
    "footer.description": "Maker van moderne en krachtige websites. Uw visie, onze expertise.",
    "footer.links": "Snelle links",
    "footer.social": "Volg ons",
    "footer.copyright": "Guapo Web Designer 2025",
    
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
    "hero.title": "If you can imagine it, we can",
    "hero.title.highlight": "design it.",
    "hero.subtitle": "Websites designed to improve your visibility and professionalize your business",
    "hero.cta.projects": "View our projects",
    "hero.cta.contact": "Contact us",
    
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
    "about.heading": "Passionate creator",
    "about.intro": "Passionate about design and new technologies, we create modern, elegant and powerful websites. Our approach combines creativity, technical expertise and attention to detail to bring your digital projects to life.",
    "about.intro.highlight": "",
    "about.intro.text": "",
    "about.p1": "Each project is unique and deserves special attention.",
    "about.p2.prefix": "",
    "about.p2.creativity": "",
    "about.p2.innovation": "",
    "about.p2.excellence": "",
    "about.p2.suffix": "",
    "about.badge.design": "🎨 UI/UX Design",
    "about.badge.performance": "⚡ Optimal performance",
    "about.badge.tech": "🚀 Modern technologies",
    
    // Services Page
    "services.page.title": "Our Services",
    "services.desktop.title": "Desktop Showcase Sites",
    "services.desktop.desc": "Websites optimized for large screens with professional and modern designs",
    "services.tablet.title": "Tablet Adaptation",
    "services.tablet.desc": "Interfaces perfectly adapted to tablets for a smooth experience",
    "services.mobile.title": "Mobile Optimization",
    "services.mobile.desc": "Optimal navigation on smartphones with maximum performance",
    "services.responsive.title": "Responsive Design",
    "services.responsive.desc": "Automatic adaptation to all types of devices and resolutions",
    "services.branding.title": "Visual Identity",
    "services.branding.desc": "Creation of logos, graphic guidelines and unique visual elements",
    "services.performance.title": "Web Performance",
    "services.performance.desc": "Ultra-fast websites optimized for SEO and user experience",
    "services.cta.title": "Need a showcase website? 🚀",
    "services.cta.desc": "Restaurant, professional office, company or personal portfolio: we create your showcase website accessible on all devices!",
    "services.cta.button": "Let's discuss your project 💬",
    
    // Services
    "services.title": "Our",
    "services.title.highlight": "Services",
    "services.subtitle": "What we can do for you",
    "services.design.title": "UI/UX Design",
    "services.design.desc": "Creation of intuitive and attractive user interfaces with an optimal experience.",
    "services.dev.title": "Web Development",
    "services.dev.desc": "Development of modern websites with React, Next.js and the latest technologies.",
    
    // Portfolio
    "portfolio.title.prefix": "Port",
    "portfolio.title.highlight": "folio",
    "portfolio.subtitle": "Our recent projects",
    
    // Contact
    "contact.title": "Let's Work",
    "contact.title.highlight": "Together",
    "contact.subtitle": "Have a project in mind? Contact us and let's discuss your needs.",
    
    // Contact Page
    "contact.page.title": "Contact Us",
    "contact.page.intro": "Need a modern and powerful website? Contact us now!",
    "contact.email.title": "Email",
    "contact.email.address": "info@guapowebdesigner.com",
    "contact.email.copy": "Copy",
    "contact.email.copied": "Email copied!",
    "contact.instagram.title": "Instagram",
    "contact.instagram.handle": "@guapo.webdesigner",
    "contact.instagram.copy": "Copy",
    "contact.instagram.copied": "Handle copied!",
    "contact.form.title": "Quote Request",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone (optional)",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Request",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Request sent successfully!",
    "contact.form.error": "Error sending. Please try again.",
    "footer.description": "Creator of modern and powerful websites. Your vision, our expertise.",
    "footer.links": "Quick Links",
    "footer.social": "Follow Us",
    "footer.copyright": "Guapo Web Designer 2025",
    
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