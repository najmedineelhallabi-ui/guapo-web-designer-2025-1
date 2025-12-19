"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    "nav.quote": "Devis gratuit",
    
    // Promo -30%
    "promo.discount": "-30%",
    "promo.until": "jusqu'au",
    "promo.date": "31/12/25",
    "promo.banner": "-30% jusqu'au 31/12/25 + 1 mois de maintenance offert !",
    "promo.close": "Fermer",
    "promo.badge": "Premier Mois de Maintenance Offert !",
    
    // Hero
    "hero.badge": "Guapo Web Designer",
    "hero.title": "If you can imagine it, we can",
    "hero.title.highlight": "design it.",
    "hero.subtitle": "Des sites web conçus pour améliorer votre visibilité et professionnaliser votre entreprise",
    "hero.cta.projects": "Voir nos projets",
    "hero.cta.contact": "Nous contacter",
    
    // Announcement Banner
    "announcement.offer": "🎁 1 mois de maintenance inclus à la création de chaque site !",
    "announcement.subtitle": "Profitez de cette offre exceptionnelle pour votre projet web !",
    
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
    
    // Services - Website Cards Section
    "services.website.title.prefix": "Besoin d'un",
    "services.website.title.highlight": "Site Web",
    "services.website.subtitle": "Choisissez la solution adaptée à vos besoins",
    "services.website.showcase.title": "Site Vitrine",
    "services.website.showcase.desc": "Site professionnel pour présenter votre entreprise, vos services et votre expertise. Idéal pour restaurants, cabinets, PME et portfolios.",
    "services.website.ecommerce.title": "Site E-commerce",
    "services.website.ecommerce.desc": "Vendez vos produits en ligne avec une boutique professionnelle et sécurisée. Gestion des commandes, paiements en ligne, suivi des stocks.",
    "services.website.discuss.title": "Discutons Ensemble",
    "services.website.discuss.desc": "Vous avez un projet sur mesure ou des besoins spécifiques ? Contactez-nous pour en discuter et trouver la meilleure solution ensemble.",
    "services.website.discuss.cta": "Nous contacter",
    "services.website.cta": "Obtenir un devis",
    
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
    
    // Contact Section
    "contact.section.title": "Contactez-nous",
    "contact.section.subtitle": "Transformons vos idées en réalité digitale",
    "contact.section.desc": "Un projet en tête ? N'hésitez pas à nous contacter pour en discuter. Nous serons ravis de vous accompagner dans la création de votre site web.",
    "contact.quote.title": "Devis Gratuit",
    "contact.quote.desc": "Obtenez une estimation",
    
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
    
    // Quote Page
    "quote.page.badge": "Devis gratuit sous 48h",
    "quote.page.title": "Demande de",
    "quote.page.title.highlight": "Devis",
    "quote.page.subtitle": "Parlez-nous de votre projet et recevez un devis personnalisé adapté à vos besoins et votre budget.",
    "quote.page.card1.title": "Réponse rapide",
    "quote.page.card1.desc": "Devis sous 48h maximum",
    "quote.page.card2.title": "Devis gratuit",
    "quote.page.card2.desc": "Sans engagement",
    "quote.page.card3.title": "Sur mesure",
    "quote.page.ca