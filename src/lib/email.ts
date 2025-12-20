import { Resend } from 'resend';
import { PRICING } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

// Prix par page supplémentaire
const PAGE_EXTRA_COST = 100;

// Traductions pour les valeurs des options du formulaire
const optionTranslations = {
  // Types de sites vitrine
  "Site vitrine simple (1 à 3 pages)": {
    fr: "Site vitrine simple (1 à 3 pages)",
    nl: "Eenvoudige showcase site (1 tot 3 pagina's)",
    en: "Simple showcase website (1 to 3 pages)"
  },
  "Site vitrine standard (4 à 5 pages)": {
    fr: "Site vitrine standard (4 à 5 pages)",
    nl: "Standaard showcase site (4 tot 5 pagina's)",
    en: "Standard showcase website (4 to 5 pages)"
  },
  "Site vitrine avancé (6 à 8 pages)": {
    fr: "Site vitrine avancé (6 à 8 pages)",
    nl: "Geavanceerde showcase site (6 tot 8 pagina's)",
    en: "Advanced showcase website (6 to 8 pages)"
  },
  "Site vitrine premium (9 à 12 pages)": {
    fr: "Site vitrine premium (9 à 12 pages)",
    nl: "Premium showcase site (9 tot 12 pagina's)",
    en: "Premium showcase website (9 to 12 pages)"
  },
  "Portfolio / site personnel": {
    fr: "Portfolio / site personnel",
    nl: "Portfolio / persoonlijke website",
    en: "Portfolio / personal website"
  },
  // Types e-commerce
  "Petite boutique (1-20 produits)": {
    fr: "Petite boutique (1-20 produits)",
    nl: "Kleine winkel (1-20 producten)",
    en: "Small shop (1-20 products)"
  },
  "Boutique moyenne (21-100 produits)": {
    fr: "Boutique moyenne (21-100 produits)",
    nl: "Gemiddelde winkel (21-100 producten)",
    en: "Medium shop (21-100 products)"
  },
  "Grande boutique (100+ produits)": {
    fr: "Grande boutique (100+ produits)",
    nl: "Grote winkel (100+ producten)",
    en: "Large shop (100+ products)"
  },
  // Fonctionnalités
  "Formulaire de contact simple": {
    fr: "Formulaire de contact simple",
    nl: "Eenvoudig contactformulier",
    en: "Simple contact form"
  },
  "Formulaire de demande de devis": {
    fr: "Formulaire de demande de devis",
    nl: "Offerteaanvraagformulier",
    en: "Quote request form"
  },
  "Envoi automatique d'emails de confirmation (pour devis)": {
    fr: "Envoi automatique d'emails de confirmation (pour devis)",
    nl: "Automatische verzending van bevestigingsmails (voor offertes)",
    en: "Automatic confirmation email sending (for quotes)"
  },
  "Système de prise de rendez-vous en ligne (avec emails automatiques)": {
    fr: "Système de prise de rendez-vous en ligne (avec emails automatiques)",
    nl: "Online afsprakenboekingssysteem (met automatische emails)",
    en: "Online appointment booking system (with automatic emails)"
  },
  "Intégration calendrier (Google Calendar, etc.)": {
    fr: "Intégration calendrier (Google Calendar, etc.)",
    nl: "Agenda-integratie (Google Calendar, etc.)",
    en: "Calendar integration (Google Calendar, etc.)"
  },
  "Multilingue": {
    fr: "Multilingue",
    nl: "Meertalig",
    en: "Multilingual"
  },
  "Blog / actualités": {
    fr: "Blog / actualités",
    nl: "Blog / nieuws",
    en: "Blog / news"
  },
  // Fonctionnalités e-commerce
  "Catalogue de produits": {
    fr: "Catalogue de produits",
    nl: "Productcatalogus",
    en: "Product catalog"
  },
  "Panier d'achat": {
    fr: "Panier d'achat",
    nl: "Winkelwagen",
    en: "Shopping cart"
  },
  "Passerelle de paiement (Stripe, PayPal, etc.)": {
    fr: "Passerelle de paiement (Stripe, PayPal, etc.)",
    nl: "Betalingsgateway (Stripe, PayPal, etc.)",
    en: "Payment gateway (Stripe, PayPal, etc.)"
  },
  "Gestion des commandes": {
    fr: "Gestion des commandes",
    nl: "Bestellingenbeheer",
    en: "Order management"
  },
  "Gestion des stocks": {
    fr: "Gestion des stocks",
    nl: "Voorraadbeheer",
    en: "Inventory management"
  },
  "Comptes clients": {
    fr: "Comptes clients",
    nl: "Klantenaccounts",
    en: "Customer accounts"
  },
  // Optimisation
  "Pack Tout Inclus (SEO + Performance + SSL + RGPD)": {
    fr: "Pack Tout Inclus (SEO + Performance + SSL + RGPD)",
    nl: "All-inclusive Pakket (SEO + Prestaties + SSL + AVG)",
    en: "All-Inclusive Pack (SEO + Performance + SSL + GDPR)"
  },
  "SEO de base (balises, titres, URLs)": {
    fr: "SEO de base (balises, titres, URLs)",
    nl: "Basis SEO (tags, titels, URL's)",
    en: "Basic SEO (tags, titles, URLs)"
  },
  "Optimisation vitesse / performance": {
    fr: "Optimisation vitesse / performance",
    nl: "Snelheid / prestaties optimalisatie",
    en: "Speed / performance optimization"
  },
  "Certificat SSL / HTTPS": {
    fr: "Certificat SSL / HTTPS",
    nl: "SSL-certificaat / HTTPS",
    en: "SSL certificate / HTTPS"
  },
  "RGPD / conformité légale": {
    fr: "RGPD / conformité légale",
    nl: "AVG / wettelijke naleving",
    en: "GDPR / legal compliance"
  },
  // Hébergement et domaine
  "Inclus dans le projet": {
    fr: "Inclus dans le projet",
    nl: "Inbegrepen in het project",
    en: "Included in the project"
  },
  "Fourni par le client": {
    fr: "Fourni par le client",
    nl: "Geleverd door de klant",
    en: "Provided by the client"
  },
  "À discuter": {
    fr: "À discuter",
    nl: "Te bespreken",
    en: "To discuss"
  },
  // Menu / Site de commande
    "Menu / Site de commande (système de base)": {
      fr: "Menu / Site de commande (système de base)",
      nl: "Menu / Bestelsite (basissysteem)",
      en: "Menu / Ordering site (base system)"
    },
      // Abonnements Menu
      "Pack Menu Simple": {
        fr: "Pack Menu Simple",
        nl: "Eenvoudig Menupakket",
        en: "Simple Menu Pack"
      },
      "Pack Menu Complet": {
        fr: "Pack Menu Complet",
        nl: "Compleet Menupakket",
        en: "Complete Menu Pack"
      },
    // Fonctionnalités Menu Client
  "Ajout au panier": {
    fr: "Ajout au panier",
    nl: "Toevoegen aan winkelwagen",
    en: "Add to cart"
  },
  "Sur place / à emporter": {
    fr: "Sur place / à emporter",
    nl: "Ter plaatse / afhalen",
    en: "Dine-in / takeaway"
  },
  "Confirmation de commande": {
    fr: "Confirmation de commande",
    nl: "Bestelbevestiging",
    en: "Order confirmation"
  },
  "Email automatique client": {
    fr: "Email automatique client",
    nl: "Automatische klant email",
    en: "Automatic customer email"
  },
    // Fonctionnalités Menu Restaurant
    "Dashboard Cuisine": {
      fr: "Dashboard Cuisine",
      nl: "Keuken dashboard",
      en: "Kitchen dashboard"
    },
    "Statuts de commande cuisine": {
      fr: "Statuts de commande cuisine",
      nl: "Keuken bestelstatus",
      en: "Kitchen order status"
    },
    "Gestion menu": {
      fr: "Gestion menu",
      nl: "Menu beheer",
      en: "Menu management"
    },
    "Dashboard Serveur": {
      fr: "Dashboard Serveur",
      nl: "Ober dashboard",
      en: "Waiter dashboard"
    },
  "Statuts de commande serveur": {
    fr: "Statuts de commande serveur",
    nl: "Ober bestelstatus",
    en: "Waiter order status"
  },
  // Langues
  "Français (FR)": {
    fr: "Français (FR)",
    nl: "Frans (FR)",
    en: "French (FR)"
  },
  "Néerlandais (NL)": {
    fr: "Néerlandais (NL)",
    nl: "Nederlands (NL)",
    en: "Dutch (NL)"
  },
  "English (ENG)": {
    fr: "Anglais (ENG)",
    nl: "Engels (ENG)",
    en: "English (ENG)"
  },
  "Autre": {
    fr: "Autre",
    nl: "Andere",
    en: "Other"
  }
};

// Fonction pour traduire une option
function translateOption(option: string, lang: 'fr' | 'nl' | 'en' = 'fr'): string {
  const translation = optionTranslations[option as keyof typeof optionTranslations];
  return translation ? translation[lang] : option;
}

// Traductions pour les emails
const emailTranslations = {
  fr: {
    // Owner email
    owner: {
      subject: (firstName: string, lastName: string, min: number, max: number, hasRange: boolean) => 
        `🎨 Nouvelle demande - ${firstName} ${lastName} - ${hasRange ? `${min}€ à ${max}€` : `${min}€`} (-30%)`,
      title: "🎨 Nouvelle Demande de Devis",
      subtitle: "Vous avez reçu une nouvelle demande de création de site web",
      clientInfo: "👤 Informations Client",
      fullName: "Nom Complet",
      email: "Email",
      company: "Entreprise",
      sector: "Secteur d'Activité",
      projectDetails: "📋 Détails du Projet",
      siteType: "Type de Site",
      pages: "Nombre de Pages",
      hosting: "Hébergement",
      domain: "Nom de Domaine",
      requestedFeatures: "⚡ Fonctionnalités Demandées:",
      languages: "🌐 Langues:",
      otherLang: "Autre:",
      optimization: "🔒 Optimisation & Sécurité:",
      pricing: "💰 Estimation Tarifaire avec -30%",
      breakdown: (cat: string) => cat,
      categorySiteType: "🎨 Type de site",
      categoryExtraPages: "📄 Pages supplémentaires",
      categoryFeatures: "⚡ Fonctionnalités",
      categoryLanguages: "🌐 Langues",
      categoryOptimization: "🔒 Optimisation & Sécurité",
      categoryDomain: "🌐 Nom de domaine",
      extraPages: (count: number) => `${count} page(s) supplémentaire(s)`,
      includedInMultilingual: "Inclus dans Multilingue",
      firstYear: "première année",
      included: "Inclus",
      discount: "🎉 Réduction Promotionnelle -30%",
      originalPrice: "Prix Original HT",
      priceWithDiscount: "Prix avec -30% HT",
      vat: "TVA (21%)",
      totalTTC: "💳 Total TTC:",
      clientMessage: "💬 Message du Client",
      replyToClient: "📧 Répondre au Client",
      footer: "© 2025 GUAPO Web Designer - Gestion des Devis"
    },
    // Client email
    client: {
      subject: "✅ Votre estimation avec -30% - GUAPO Web Designer",
      title: "✅ Demande Reçue",
      greeting: (firstName: string, lastName: string) => `Bonjour ${firstName} ${lastName},`,
      intro: (company: string) => `Merci pour <strong style="color:#8b5cf6">GUAPO Web Designer</strong> ! Demande reçue pour <strong>${company}</strong>.`,
      estimationTitle: "💰 Votre Estimation (-30%)",
      discount: "🎉 Réduction -30%",
      originalPrice: "Prix original",
      priceWithDiscount: "Prix avec -30%",
      vat: "TVA (21%)",
      totalTTC: "Total TTC:",
      nextSteps: "📋 Prochaines Étapes",
      contactDetails: "Contact sous <strong>24-48h</strong> pour finaliser.",
      signature: "À bientôt,<br><strong style=\"color:#8b5cf6\">L'équipe GUAPO</strong>",
      footer: "© 2025 GUAPO Web Designer"
    }
  },
  nl: {
    // Owner email
    owner: {
      subject: (firstName: string, lastName: string, min: number, max: number, hasRange: boolean) => 
        `🎨 Nieuwe aanvraag - ${firstName} ${lastName} - ${hasRange ? `${min}€ tot ${max}€` : `${min}€`} (-30%)`,
      title: "🎨 Nieuwe Offerte Aanvraag",
      subtitle: "U heeft een nieuwe aanvraag ontvangen voor het maken van een website",
      clientInfo: "👤 Klantinformatie",
      fullName: "Volledige Naam",
      email: "Email",
      company: "Bedrijf",
      sector: "Bedrijfssector",
      projectDetails: "📋 Projectdetails",
      siteType: "Type Website",
      pages: "Aantal Pagina's",
      hosting: "Hosting",
      domain: "Domeinnaam",
      requestedFeatures: "⚡ Gevraagde Functionaliteiten:",
      languages: "🌐 Talen:",
      otherLang: "Andere:",
      optimization: "🔒 Optimalisatie & Beveiliging:",
      pricing: "💰 Prijsschatting met -30%",
      breakdown: (cat: string) => cat,
      categorySiteType: "🎨 Type website",
      categoryExtraPages: "📄 Extra pagina's",
      categoryFeatures: "⚡ Functionaliteiten",
      categoryLanguages: "🌐 Talen",
      categoryOptimization: "🔒 Optimalisatie & Beveiliging",
      categoryDomain: "🌐 Domeinnaam",
      extraPages: (count: number) => `${count} extra pagina('s)`,
      includedInMultilingual: "Inbegrepen in Meertalig",
      firstYear: "eerste jaar",
      included: "Inbegrepen",
      discount: "🎉 Promotionele Korting -30%",
      originalPrice: "Originele Prijs excl. BTW",
      priceWithDiscount: "Prijs met -30% excl. BTW",
      vat: "BTW (21%)",
      totalTTC: "💳 Totaal incl. BTW:",
      clientMessage: "💬 Bericht van de Klant",
      replyToClient: "📧 Antwoord aan Klant",
      footer: "© 2025 GUAPO Web Designer - Offertebeheer"
    },
    // Client email
    client: {
      subject: "✅ Uw schatting met -30% - GUAPO Web Designer",
      title: "✅ Aanvraag Ontvangen",
      greeting: (firstName: string, lastName: string) => `Hallo ${firstName} ${lastName},`,
      intro: (company: string) => `Bedankt voor <strong style="color:#8b5cf6">GUAPO Web Designer</strong>! Aanvraag ontvangen voor <strong>${company}</strong>.`,
      estimationTitle: "💰 Uw Schatting (-30%)",
      discount: "🎉 Korting -30%",
      originalPrice: "Originele prijs",
      priceWithDiscount: "Prijs met -30%",
      vat: "BTW (21%)",
      totalTTC: "Totaal incl. BTW:",
      nextSteps: "📋 Volgende Stappen",
      contactDetails: "Contact binnen <strong>24-48u</strong> om te finaliseren.",
      signature: "Tot binnenkort,<br><strong style=\"color:#8b5cf6\">Het GUAPO team</strong>",
      footer: "© 2025 GUAPO Web Designer"
    }
  },
  en: {
    // Owner email
    owner: {
      subject: (firstName: string, lastName: string, min: number, max: number, hasRange: boolean) => 
        `🎨 New request - ${firstName} ${lastName} - ${hasRange ? `${min}€ to ${max}€` : `${min}€`} (-30%)`,
      title: "🎨 New Quote Request",
      subtitle: "You have received a new website creation request",
      clientInfo: "👤 Client Information",
      fullName: "Full Name",
      email: "Email",
      company: "Company",
      sector: "Business Sector",
      projectDetails: "📋 Project Details",
      siteType: "Website Type",
      pages: "Number of Pages",
      hosting: "Hosting",
      domain: "Domain Name",
      requestedFeatures: "⚡ Requested Features:",
      languages: "🌐 Languages:",
      otherLang: "Other:",
      optimization: "🔒 Optimization & Security:",
      pricing: "💰 Price Estimate with -30%",
      breakdown: (cat: string) => cat,
      categorySiteType: "🎨 Website type",
      categoryExtraPages: "📄 Extra pages",
      categoryFeatures: "⚡ Features",
      categoryLanguages: "🌐 Languages",
      categoryOptimization: "🔒 Optimization & Security",
      categoryDomain: "🌐 Domain name",
      extraPages: (count: number) => `${count} extra page(s)`,
      includedInMultilingual: "Included in Multilingual",
      firstYear: "first year",
      included: "Included",
      discount: "🎉 Promotional Discount -30%",
      originalPrice: "Original Price excl. VAT",
      priceWithDiscount: "Price with -30% excl. VAT",
      vat: "VAT (21%)",
      totalTTC: "💳 Total incl. VAT:",
      clientMessage: "💬 Client Message",
      replyToClient: "📧 Reply to Client",
      footer: "© 2025 GUAPO Web Designer - Quote Management"
    },
    // Client email
    client: {
      subject: "✅ Your estimate with -30% - GUAPO Web Designer",
      title: "✅ Request Received",
      greeting: (firstName: string, lastName: string) => `Hello ${firstName} ${lastName},`,
      intro: (company: string) => `Thank you for <strong style="color:#8b5cf6">GUAPO Web Designer</strong>! Request received for <strong>${company}</strong>.`,
      estimationTitle: "💰 Your Estimate (-30%)",
      discount: "🎉 Discount -30%",
      originalPrice: "Original price",
      priceWithDiscount: "Price with -30%",
      vat: "VAT (21%)",
      totalTTC: "Total incl. VAT:",
      nextSteps: "📋 Next Steps",
      contactDetails: "Contact within <strong>24-48h</strong> to finalize.",
      signature: "See you soon,<br><strong style=\"color:#8b5cf6\">The GUAPO team</strong>",
      footer: "© 2025 GUAPO Web Designer"
    }
  }
};

// Helper function to get translations
function getT(lang: 'fr' | 'nl' | 'en' = 'fr') {
  return emailTranslations[lang] || emailTranslations.fr;
}

function calculatePricing(data: {
  siteType: string;
  pageCount?: number;
  features?: string[];
  menuSubscription?: string;
  optimization?: string[];
  domain?: string;
  languages?: string[];
  otherLanguages?: string;
}, lang: 'fr' | 'nl' | 'en' = 'fr') {
  let minTotal = 0;
  let maxTotal = 0;
  let monthlySubscription = 0;
  let totalMonthlyForMenu = 0; // Pour le Model B (Abonnement fonctionnalités)
    const monthlyBreakdown: { item: string; price: number }[] = [];
    const breakdown: { category: string; item: string; price: string }[] = [];
    const t = getT(lang);

    const isMenuProject = data.siteType.includes('Menu / Site de commande');

    // Type de site (prix de base)
    const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
    const siteTypePrice = PRICING.siteTypes[siteTypeKey];
    if (siteTypePrice) {
      minTotal += siteTypePrice.min;
      maxTotal += siteTypePrice.max;
      breakdown.push({
        category: t.owner.categorySiteType,
        item: translateOption(data.siteType, lang),
        price: siteTypePrice.min === siteTypePrice.max 
          ? `${siteTypePrice.min}€` 
          : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`
      });
    }

      // Abonnements Menu (Monthly) - Pack Gestion
      if (data.menuSubscription) {
        const subKey = data.menuSubscription as keyof typeof PRICING.subscriptions;
        const subPrice = PRICING.subscriptions[subKey];
        
        if (subPrice) {
          monthlySubscription = subPrice;
          totalMonthlyForMenu = subPrice; // Initialisé avec le prix du pack
          monthlyBreakdown.push({ 
            item: translateOption(data.menuSubscription, lang), 
            price: subPrice 
          });
          breakdown.push({
            category: lang === 'fr' ? "Gestion du menu" : lang === 'nl' ? "Menu beheer" : "Menu management",
            item: translateOption(data.menuSubscription, lang),
            price: `${subPrice}€ / ${lang === 'fr' ? 'mois' : lang === 'nl' ? 'maand' : 'month'}`
          });
        }
      }


  // Pages supplémentaires
  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let basePagesLimit = 3;
    
    if (data.siteType.includes('1 à 3 pages') || data.siteType.includes('1 tot 3 pagina') || data.siteType.includes('1 to 3 pages')) {
      basePagesLimit = 3;
    } else if (data.siteType.includes('4 à 5 pages') || data.siteType.includes('4 tot 5 pagina') || data.siteType.includes('4 to 5 pages')) {
      basePagesLimit = 5;
    } else if (data.siteType.includes('6 à 8 pages') || data.siteType.includes('6 tot 8 pagina') || data.siteType.includes('6 to 8 pages')) {
      basePagesLimit = 8;
    } else if (data.siteType.includes('9 à 12 pages') || data.siteType.includes('9 tot 12 pagina') || data.siteType.includes('9 to 12 pages')) {
      basePagesLimit = 12;
    }
    
    if (pageCount > basePagesLimit) {
      const extraPages = pageCount - basePagesLimit;
      const extraCost = extraPages * PAGE_EXTRA_COST;
      minTotal += extraCost;
      maxTotal += extraCost;
      breakdown.push({
        category: t.owner.categoryExtraPages,
        item: t.owner.extraPages(extraPages),
        price: `${extraCost}€`
      });
    }
  }

      // Fonctionnalités
      if (data.features && data.features.length > 0) {
        data.features.forEach(feature => {
          const featureKey = feature as keyof typeof PRICING.features;
          const price = PRICING.features[featureKey];
          const monthlyPrice = (PRICING as any).monthlyMenuFeatures?.[feature];

            if (price !== undefined) {
              // Toujours ajouter au total unique (Model A)
              minTotal += price;
              maxTotal += price;
              
              // Pour le Model B (Abonnement), on ajoute à la liste du breakdown
              if (isMenuProject && monthlyPrice !== undefined) {
                monthlyBreakdown.push({ 
                  item: translateOption(feature, lang), 
                  price: monthlyPrice 
                });
              }

              breakdown.push({
                category: t.owner.categoryFeatures,
                item: translateOption(feature, lang) + (isMenuProject && monthlyPrice !== undefined ? ` (${monthlyPrice}€/${lang === 'fr' ? 'mois' : 'm'})` : ''),
                price: price > 0 ? `${price}€` : t.owner.included
              });
            }

        });
      }

  // Langues sélectionnées
  if (data.languages && data.languages.length > 0) {
    const langList = [...data.languages].map(l => translateOption(l, lang));
    if (data.otherLanguages) {
      langList.push(`${t.owner.otherLang} ${data.otherLanguages}`);
    }
    breakdown.push({
      category: t.owner.categoryLanguages,
      item: langList.join(', '),
      price: t.owner.includedInMultilingual
    });
  }

  // Optimisation & Sécurité
  if (data.optimization && data.optimization.length > 0) {
    data.optimization.forEach(opt => {
      const optKey = opt as keyof typeof PRICING.optimization;
      const price = PRICING.optimization[optKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: t.owner.categoryOptimization,
          item: translateOption(opt, lang),
          price: price > 0 ? `${price}€` : t.owner.included
        });
      }
    });
  }

  // Nom de domaine
  if (data.domain) {
    const domainKey = data.domain as keyof typeof PRICING.domain;
    const price = PRICING.domain[domainKey];
    if (price !== undefined && price > 0) {
      minTotal += price;
      maxTotal += price;
      breakdown.push({
        category: t.owner.categoryDomain,
        item: `${translateOption(data.domain, lang)} (${t.owner.firstYear})`,
        price: `${price}€`
      });
    }
  }

    // Calculer les prix avec réduction -30%
    const originalMinPrice = minTotal;
    const originalMaxPrice = maxTotal;
    let minDiscount = Math.round(originalMinPrice * 0.30);
    let maxDiscount = Math.round(originalMaxPrice * 0.30);
    let discountedMinPrice = originalMinPrice - minDiscount;
    let discountedMaxPrice = originalMaxPrice - maxDiscount;
    
    // Pour Model A (Menu Project), on ne fait pas de réduction -30% (demande utilisateur : 1910€ HTVA)
    if (isMenuProject) {
      discountedMinPrice = minTotal;
      discountedMaxPrice = maxTotal;
      minDiscount = 0;
      maxDiscount = 0;
    }
    
    // Modèle B : Somme des prix mensuels des options
    let totalMonthlyForModelB = 0;
    if (isMenuProject && data.features) {
      data.features.forEach(f => {
        const monthlyPrice = (PRICING as any).monthlyMenuFeatures?.[f];
        if (monthlyPrice !== undefined) {
          totalMonthlyForModelB += monthlyPrice;
        }
      });
    }

    // On ajoute le prix de base de l'abonnement (25 ou 35) au total mensuel
    totalMonthlyForModelB += monthlySubscription;
    
    // Capping at Pack price (35€) for Model B if it's a Menu project
    if (isMenuProject && totalMonthlyForModelB > 35) {
      totalMonthlyForModelB = 35;
    }

    // Frais de mise en service (Setup) pour le Modèle B
    // FIX: Pour les projets Menu, le setup est désormais de 0€
    let discountedBaseSetup = isMenuProject ? 0 : Math.round(minTotal * 0.70);
    
    const vatBaseSetup = Math.round(discountedBaseSetup * 0.21);
    const totalBaseSetupTTC = discountedBaseSetup + vatBaseSetup;

    const hasRange = minTotal !== maxTotal;

    // TVA sur le prix remisé (Model A)
    const minVat = Math.round(discountedMinPrice * 0.21);
    const maxVat = Math.round(discountedMaxPrice * 0.21);
    
    // Total TTC unique (Model A)
    const minTotalTTC = discountedMinPrice + minVat;
    const maxTotalTTC = discountedMaxPrice + maxVat;

    // Prix Menu Mensuel (Total) - Model A additionnel
    const menuMonthlyHT = monthlySubscription; // Pour le modèle A, on garde le prix du pack
    const menuMonthlyVat = Math.round(menuMonthlyHT * 0.21);
    const menuMonthlyTTC = menuMonthlyHT + menuMonthlyVat;

    return { 
      minTotal, 
      maxTotal, 
      breakdown,
      originalMinPrice,
      originalMaxPrice,
      minDiscount,
      maxDiscount,
      discountedMinPrice,
      discountedMaxPrice,
      minVat,
      maxVat,
      minTotalTTC,
      maxTotalTTC,
      menuMonthlyHT,
      menuMonthlyVat,
      menuMonthlyTTC,
      hasRange,
      monthlySubscription,
        isMenuProject,
        totalMonthlyForMenu: totalMonthlyForModelB,
        monthlyBreakdown,
        discountedBaseSetup,
        vatBaseSetup,
        totalBaseSetupTTC
      };
    }


export async function sendQuoteEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  sector?: string;
  siteType: string;
  pageCount?: number;
  features?: string[];
  menuSubscription?: string;
  languages?: string[];
  otherLanguages?: string;
  optimization?: string[];
  hosting?: string;
  domain?: string;
  message: string;
  language?: 'fr' | 'nl' | 'en';
}) {
  console.log('🚀 Starting email send process with Resend...');
  
  // Get translations based on language
  const lang = data.language || 'fr';
  const t = getT(lang);
  
  // Calculer les prix avec réduction -30%
  const pricing = calculatePricing({
    siteType: data.siteType,
    pageCount: data.pageCount,
    features: data.features,
    menuSubscription: data.menuSubscription,
    languages: data.languages,
    otherLanguages: data.otherLanguages,
    optimization: data.optimization,
    domain: data.domain
  }, lang);

  console.log('💰 Pricing calculated:', `Original: ${pricing.originalMinPrice}€, Avec -30%: ${pricing.discountedMinPrice}€`);

  // Préparer les données pour le tableau
  const tableRows: { item: string; unique: string; monthly: string }[] = [];
  
    // 1. Type de site
    const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
    const siteTypePrice = PRICING.siteTypes[siteTypeKey];
    if (siteTypePrice) {
      tableRows.push({
        item: translateOption(data.siteType, lang),
        unique: siteTypePrice.min === siteTypePrice.max ? `${siteTypePrice.min}€` : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`,
        monthly: '-'
      });
    }

  // 2. Pages supplémentaires
  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let baseLimit = 3;
    if (data.siteType.includes('1 à 3')) baseLimit = 3;
    else if (data.siteType.includes('4 à 5')) baseLimit = 5;
    else if (data.siteType.includes('6 à 8')) baseLimit = 8;
    else if (data.siteType.includes('9 à 12')) baseLimit = 12;
    
    if (pageCount > baseLimit) {
      const extra = pageCount - baseLimit;
      const cost = extra * PAGE_EXTRA_COST;
      tableRows.push({
        item: t.owner.extraPages(extra),
        unique: `${cost}€`,
        monthly: '-'
      });
    }
  }

        // 3. Fonctionnalités
        if (data.features) {
          data.features.forEach(f => {
            const uPrice = (PRICING.features as any)[f];
            const mPrice = (PRICING as any).monthlyMenuFeatures?.[f];
            
            tableRows.push({
              item: translateOption(f, lang),
              unique: uPrice !== undefined ? (uPrice > 0 ? `${uPrice}€` : t.owner.included) : '-',
              monthly: mPrice !== undefined ? `${mPrice}€` : '-'
            });
          });
        }

  // 4. Optimisation
  if (data.optimization) {
    data.optimization.forEach(o => {
      const price = (PRICING.optimization as any)[o];
      tableRows.push({
        item: translateOption(o, lang),
        unique: price !== undefined ? (price > 0 ? `${price}€` : t.owner.included) : '-',
        monthly: '-'
      });
    });
  }

  // 5. Domaine
  if (data.domain) {
    const dPrice = (PRICING.domain as any)[data.domain];
    tableRows.push({
      item: `${translateOption(data.domain, lang)} (${t.owner.firstYear})`,
      unique: dPrice !== undefined && dPrice > 0 ? `${dPrice}€` : t.owner.included,
      monthly: '-'
    });
  }

    // 6. Abonnement Pack (Menu)
    if (data.menuSubscription) {
      const mPrice = (PRICING.subscriptions as any)[data.menuSubscription];
      tableRows.push({
        item: translateOption(data.menuSubscription, lang),
        unique: '-',
        monthly: `${mPrice}€`
      });
    }

    // EMAIL 1: Pour le propriétaire
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body{font-family:sans-serif;color:#334155;max-width:600px;margin:0 auto;padding:20px;background:#f1f5f9}
            .h{background:#8b5cf6;color:#fff;padding:20px;border-radius:10px 10px 0 0;text-align:center}
            .c{background:#fff;padding:20px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0}
            .sh{font-size:12px;font-weight:800;color:#7c3aed;margin:15px 0 10px 0;text-transform:uppercase}
            .tbl{width:100%;border-collapse:collapse;margin:10px 0;font-size:12px}
            .tbl th{background:#f8fafc;padding:8px;text-align:left;border-bottom:1px solid #e2e8f0}
            .tbl td{padding:8px;border-bottom:1px solid #f1f5f9}
            .ps{background:#fdf2f8;border:1px solid #fbcfe8;padding:15px;border-radius:8px;margin:15px 0}
            .pt{background:#8b5cf6;color:#fff;padding:10px;border-radius:5px;text-align:center;font-size:16px;font-weight:800}
            .btn{display:inline-block;background:#8b5cf6;color:#fff;padding:12px 20px;text-decoration:none;border-radius:5px;font-weight:700;margin:10px 0}
          </style>
        </head>
        <body>
          <div class="h"><h2>${t.owner.title}</h2></div>
          <div class="c">
            <div class="sh">Client</div>
            <p><strong>${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</strong> (${escapeHtml(data.email)})<br>${escapeHtml(data.company || '')}</p>
            
            <div class="sh">Configuration</div>
            <table class="tbl">
              <thead><tr><th>Élément</th><th style="text-align:right">Unique</th><th style="text-align:right">Mensuel</th></tr></thead>
              <tbody>
                ${tableRows.map(row => `<tr><td>${escapeHtml(row.item)}</td><td style="text-align:right">${row.unique}</td><td style="text-align:right;color:#0ea5e9">${row.monthly}</td></tr>`).join('')}
              </tbody>
            </table>

            <div class="sh">💰 Modèle A (Unique)</div>
            <div class="ps">
              <p>Total Projet: <strong>${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`} TVAC</strong></p>
              ${pricing.isMenuProject ? `<p>Abonnement: ${pricing.menuMonthlyTTC}€/m TVAC</p>` : ''}
            </div>

            ${pricing.isMenuProject ? `
            <div class="sh">💳 Modèle B (Abonnement)</div>
            <div class="ps" style="background:#f0f9ff;border-color:#bae6fd">
              <p>Mise en service: <strong>${pricing.totalBaseSetupTTC}€ TVAC</strong></p>
              <p>Mensuel: <strong>${Math.round(pricing.totalMonthlyForMenu * 1.21)}€/m TVAC</strong></p>
            </div>
            ` : ''}

            <div style="text-align:center"><a href="mailto:${escapeHtml(data.email)}" class="btn">Répondre au client</a></div>
          </div>
        </body>
      </html>
    `;

    // EMAIL 2: Pour le client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body{font-family:sans-serif;color:#334155;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc}
            .h{background:#1e293b;color:#fff;padding:30px 20px;border-radius:10px 10px 0 0;text-align:center}
            .c{background:#fff;padding:25px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0}
            .tbl{width:100%;border-collapse:collapse;margin:15px 0;font-size:12px}
            .tbl th{background:#f8fafc;padding:10px;text-align:left;border-bottom:1px solid #e2e8f0}
            .tbl td{padding:10px;border-bottom:1px solid #f1f5f9}
            .box{border:1px solid #e2e8f0;border-radius:10px;padding:15px;background:#f8fafc}
            .btn-model{display:block;padding:12px;text-decoration:none;border-radius:6px;font-weight:700;margin-top:15px;font-size:13px;text-align:center}
            .btn-a{background:#1e293b;color:#fff}
            .btn-b{background:#10b981;color:#fff}
            .ft{text-align:center;margin-top:20px;color:#94a3b8;font-size:11px}
          </style>
        </head>
        <body>
          <div class="h"><h1>Votre Estimation</h1></div>
          <div class="c">
            <p>Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
            <p>Voici le récapitulatif détaillé pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> :</p>
            
            <table class="tbl">
              <thead><tr><th>Description</th><th style="text-align:right">Unique HT</th><th style="text-align:right">Mensuel HT</th></tr></thead>
              <tbody>
                ${tableRows.map(row => `<tr><td>${escapeHtml(row.item)}</td><td style="text-align:right;font-weight:bold">${row.unique}</td><td style="text-align:right;color:#0ea5e9;font-weight:bold">${row.monthly}</td></tr>`).join('')}
              </tbody>
            </table>

            <div style="margin:20px 0;text-align:center;font-weight:bold;font-size:16px;color:#1e293b">VOTRE CHOIX DE MODÈLE</div>

            ${pricing.isMenuProject ? `
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="48%" valign="top" class="box">
                  <div style="font-weight:800;font-size:14px;text-align:center">MODÈLE A</div>
                  <div style="font-size:10px;text-align:center;margin-bottom:10px;color:#64748b">INVESTISSEMENT UNIQUE</div>
                  <div style="font-size:11px;line-height:1.3;margin-bottom:10px">Pleine propriété du projet. Idéal pour la rentabilité à long terme.</div>
                  <div style="font-size:12px;border-top:1px solid #e2e8f0;padding-top:8px">
                    Projet: <strong>${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`} TVAC</strong><br>
                    Abonnement Pack: <strong>${pricing.menuMonthlyTTC}€/m TVAC</strong>
                    <div style="font-size:9px;color:#64748b;margin-top:4px">(Gestion, maintenance, accès plateforme)</div>
                  </div>
                  <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-a">CHOISIR MODÈLE A</a>
                </td>
                <td width="4%"></td>
                <td width="48%" valign="top" class="box" style="background:#ecfdf5;border-color:#a7f3d0">
                  <div style="font-weight:800;font-size:14px;text-align:center;color:#065f46">MODÈLE B</div>
                  <div style="font-size:10px;text-align:center;margin-bottom:10px;color:#059669">OPTION ABONNEMENT</div>
                  <div style="font-size:11px;line-height:1.3;margin-bottom:10px;color:#065f46">0€ d'investissement initial. Paiement par abonnement mensuel.</div>
                  <div style="font-size:11px;border-top:1px solid #a7f3d0;padding-top:8px;color:#065f46">
                    Mise en service: <strong>0€</strong><br>
                    ${pricing.monthlyBreakdown.map(i => `<div style="font-size:10px;opacity:0.8">${escapeHtml(i.item)}: ${i.price}€/m</div>`).join('')}
                    <strong>Mensuel Total: ${Math.round(pricing.totalMonthlyForMenu * 1.21)}€/m TVAC</strong>
                    <div style="font-size:9px;font-weight:bold;margin-top:4px;color:#059669">🎁 1ER MOIS OFFERT</div>
                  </div>
                  <a href="https://guapowebdesigner.com/confirm-quote?model=B&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-b">CHOISIR MODÈLE B</a>
                </td>
              </tr>
            </table>
            ` : `
            <div class="box" style="text-align:center">
              <div style="font-size:18px;font-weight:800;color:#10b981;margin-bottom:10px">TOTAL: ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`} TVAC</div>
              <p style="font-size:12px;color:#64748b">Réduction de 30% incluse dans ce tarif.</p>
              <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-b" style="display:inline-block;padding:15px 40px">VALIDER CE PROJET</a>
            </div>
            `}

            <div style="text-align:center;margin-top:20px">
              <a href="mailto:info@guapowebdesigner.com" style="color:#64748b;font-size:12px;text-decoration:none">Une question ? Répondez simplement à cet email.</a>
            </div>
          </div>
          <div class="ft">© 2025 GUAPO Web Designer</div>
        </body>
      </html>
    `;

    try {
      const ownerResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
        replyTo: data.email,
        subject: t.owner.subject(data.firstName, data.lastName, pricing.discountedMinPrice, pricing.discountedMaxPrice, pricing.hasRange),
        html: ownerEmailHtml,
      });

      const clientResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: data.email,
        replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
        subject: t.client.subject,
        html: clientEmailHtml,
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

    // EMAIL 2: Pour le client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body{font-family:sans-serif;color:#334155;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc}
            .h{background:#1e293b;color:#fff;padding:30px 20px;border-radius:10px 10px 0 0;text-align:center}
            .c{background:#fff;padding:25px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0}
            .tbl{width:100%;border-collapse:collapse;margin:15px 0;font-size:12px}
            .tbl th{background:#f8fafc;padding:10px;text-align:left;border-bottom:1px solid #e2e8f0}
            .tbl td{padding:10px;border-bottom:1px solid #f1f5f9}
            .box{border:1px solid #e2e8f0;border-radius:10px;padding:15px;background:#f8fafc}
            .btn-model{display:block;padding:12px;text-decoration:none;border-radius:6px;font-weight:700;margin-top:15px;font-size:13px;text-align:center}
            .btn-a{background:#1e293b;color:#fff}
            .btn-b{background:#10b981;color:#fff}
            .ft{text-align:center;margin-top:20px;color:#94a3b8;font-size:11px}
          </style>
        </head>
        <body>
          <div class="h"><h1>Votre Estimation</h1></div>
          <div class="c">
            <p>Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
            <p>Voici le récapitulatif détaillé pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> :</p>
            
            <table class="tbl">
              <thead><tr><th>Description</th><th style="text-align:right">Unique HT</th><th style="text-align:right">Mensuel HT</th></tr></thead>
              <tbody>
                ${tableRows.map(row => `<tr><td>${escapeHtml(row.item)}</td><td style="text-align:right;font-weight:bold">${row.unique}</td><td style="text-align:right;color:#0ea5e9;font-weight:bold">${row.monthly}</td></tr>`).join('')}
              </tbody>
            </table>

            <div style="margin:20px 0;text-align:center;font-weight:bold;font-size:16px;color:#1e293b">VOTRE CHOIX DE MODÈLE</div>

            ${pricing.isMenuProject ? `
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="48%" valign="top" class="box">
                  <div style="font-weight:800;font-size:14px;text-align:center">MODÈLE A</div>
                  <div style="font-size:10px;text-align:center;margin-bottom:10px;color:#64748b">INVESTISSEMENT UNIQUE</div>
                  <div style="font-size:11px;line-height:1.3;margin-bottom:10px">Pleine propriété du projet. Idéal pour la rentabilité à long terme.</div>
                  <div style="font-size:12px;border-top:1px solid #e2e8f0;padding-top:8px">
                    Projet: <strong>${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`} TVAC</strong><br>
                    Abonnement Pack: <strong>${pricing.menuMonthlyTTC}€/m TVAC</strong>
                    <div style="font-size:9px;color:#64748b;margin-top:4px">(Gestion, maintenance, accès plateforme)</div>
                  </div>
                  <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-a">CHOISIR MODÈLE A</a>
                </td>
                <td width="4%"></td>
                <td width="48%" valign="top" class="box" style="background:#ecfdf5;border-color:#a7f3d0">
                  <div style="font-weight:800;font-size:14px;text-align:center;color:#065f46">MODÈLE B</div>
                  <div style="font-size:10px;text-align:center;margin-bottom:10px;color:#059669">OPTION ABONNEMENT</div>
                  <div style="font-size:11px;line-height:1.3;margin-bottom:10px;color:#065f46">0€ d'investissement initial. Paiement par abonnement mensuel.</div>
                  <div style="font-size:11px;border-top:1px solid #a7f3d0;padding-top:8px;color:#065f46">
                    Mise en service: <strong>0€</strong><br>
                    ${pricing.monthlyBreakdown.map(i => `<div style="font-size:10px;opacity:0.8">${escapeHtml(i.item)}: ${i.price}€/m</div>`).join('')}
                    <strong>Mensuel Total: ${Math.round(pricing.totalMonthlyForMenu * 1.21)}€/m TVAC</strong>
                    <div style="font-size:9px;font-weight:bold;margin-top:4px;color:#059669">🎁 1ER MOIS OFFERT</div>
                  </div>
                  <a href="https://guapowebdesigner.com/confirm-quote?model=B&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-b">CHOISIR MODÈLE B</a>
                </td>
              </tr>
            </table>
            ` : `
            <div class="box" style="text-align:center">
              <div style="font-size:18px;font-weight:800;color:#10b981;margin-bottom:10px">TOTAL: ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`} TVAC</div>
              <p style="font-size:12px;color:#64748b">Réduction de 30% incluse dans ce tarif.</p>
              <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-b" style="display:inline-block;padding:15px 40px">VALIDER CE PROJET</a>
            </div>
            `}

            <div style="text-align:center;margin-top:20px">
              <a href="mailto:info@guapowebdesigner.com" style="color:#64748b;font-size:12px;text-decoration:none">Une question ? Répondez simplement à cet email.</a>
            </div>
          </div>
          <div class="ft">© 2025 GUAPO Web Designer</div>
        </body>
      </html>
    `;

  // EMAIL 1: Pour le propriétaire
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#334155;max-width:650px;margin:0 auto;padding:20px;background:#f1f5f9}
          .h{background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;padding:30px 20px;border-radius:12px 12px 0 0;text-align:center}
          .c{background:#fff;border:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:30px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
          .sh{font-size:14px;font-weight:800;color:#7c3aed;margin:25px 0 15px 0;text-transform:uppercase;letter-spacing:0.1em;display:flex;items-center:center;gap:8px}
          .sh:first-of-type{margin-top:0}
          .ig{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px}
          .ib{background:#f8fafc;padding:15px;border-radius:8px;border:1px solid #f1f5f9}
          .il{font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:6px}
          .iv{font-size:14px;color:#1e293b;font-weight:700}
          ${tableStyles}
          .ps {background:#fdf2f8;border:1px solid #fbcfe8;border-radius:12px;padding:25px;margin:25px 0}
          .db {background:#be185d;color:#fff;padding:15px;border-radius:8px;margin-bottom:20px;text-align:center}
          .pst {background:#fff;padding:15px;border-radius:8px;border:1px solid #fbcfe8}
          .pr {display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #f1f5f9}
          .pr:last-child {border-bottom:none}
          .pt {background:#8b5cf6;color:#fff;padding:15px;border-radius:8px;text-align:center;font-size:20px;font-weight:800;margin-top:10px}
          .btn{display:inline-block;background:#8b5cf6;color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;font-weight:700;margin:20px 0;font-size:15px}
          .ft{text-align:center;margin-top:30px;color:#94a3b8;font-size:12px}
        </style>
      </head>
      <body>
        <div class="h"><h1 style="margin:0;font-size:26px">${t.owner.title}</h1><p style="margin:8px 0 0 0;font-size:15px;opacity:0.9">${t.owner.subtitle}</p></div>
        <div class="c">
          <div class="sh">👤 Informations Client</div>
          <div class="ig">
            <div class="ib"><div class="il">Nom</div><div class="iv">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div></div>
            <div class="ib"><div class="il">Email</div><div class="iv">${escapeHtml(data.email)}</div></div>
            <div class="ib"><div class="il">Entreprise</div><div class="iv">${escapeHtml(data.company || '-')}</div></div>
            <div class="ib"><div class="il">Secteur</div><div class="iv">${escapeHtml(data.sector || '-')}</div></div>
          </div>

          <div class="sh">📋 Détails de la Configuration</div>
          <table class="ptbl">
            <thead>
              <tr>
                <th style="width: 50%;">Élément</th>
                <th style="text-align:right; width: 25%;">Unique (HT)</th>
                <th style="text-align:right; width: 25%;">Mensuel (HT)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.map(row => `
                <tr>
                  <td style="font-weight: 500;">${escapeHtml(row.item)}</td>
                  <td style="text-align:right" class="p-val">${row.unique}</td>
                  <td style="text-align:right" class="p-monthly">${row.monthly}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

                <div class="sh">💰 Modèle A : Investissement Unique (-30%)</div>
                <div class="ps">
                  <div class="db">
                    <div style="font-size:12px;opacity:0.9;margin-bottom:4px">RÉDUCTION APPLIQUÉE</div>
                    <div style="font-size:24px;font-weight:800">${pricing.hasRange ? `-${pricing.minDiscount}€ à -${pricing.maxDiscount}€` : `-${pricing.minDiscount}€`}</div>
                  </div>
                  <div class="pst">
                    <div class="pr"><span>Prix catalogue HTVA</span><span>${pricing.hasRange ? `${pricing.originalMinPrice}€ - ${pricing.originalMaxPrice}€` : `${pricing.originalMinPrice}€`}</span></div>
                    <div class="pr"><span>Réduction promotionnelle (-30%)</span><span style="color:#e11d48">-${pricing.hasRange ? `${pricing.minDiscount}€ - ${pricing.maxDiscount}€` : `${pricing.minDiscount}€`}</span></div>
                    <div class="pr" style="border-top:1px solid #f1f5f9; margin-top:5px; padding-top:10px"><span><strong>Sous-total Projet HTVA</strong></span><strong>${pricing.hasRange ? `${pricing.discountedMinPrice}€ - ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`}</strong></div>
                    <div class="pr"><span>TVA sur projet (21%)</span><span>${pricing.hasRange ? `${pricing.minVat}€ - ${pricing.maxVat}€` : `${pricing.minVat}€`}</span></div>
                    <div class="pt" style="margin-top:10px; font-size:18px">TOTAL CRÉATION : ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€ TVAC` : `${pricing.minTotalTTC}€ TVAC`}</div>
                  </div>
  
                  ${pricing.isMenuProject ? `
                  <div style="margin-top:20px; border-top:2px dashed #e2e8f0; padding-top:20px">
                    <div style="font-size:14px; font-weight:700; color:#1e293b; margin-bottom:10px">➕ DÉTAILS PACK MENU (Abonnement Mensuel)</div>
                    <div class="pst" style="border-color:#bae6fd; background:#f0f9ff">
                      <div class="pr"><span>Prix Pack Menu HTVA</span><span>${pricing.menuMonthlyHT}€ / mois</span></div>
                      <div class="pr"><span>TVA (21%)</span><span>${pricing.menuMonthlyVat}€ / mois</span></div>
                      <div class="pr" style="margin-top:5px; border-top:1px solid #bae6fd; padding-top:5px">
                        <span><strong>Total Mensuel TVAC</strong></span>
                        <strong style="color:#0ea5e9">${pricing.menuMonthlyTTC}€ / mois</strong>
                      </div>
                      <div style="font-size:11px; color:#0ea5e9; font-weight:800; margin-top:5px">🎁 PREMIER MOIS OFFERT</div>
                    </div>
                  </div>
                  ` : ''}
                </div>
  
            ${pricing.isMenuProject ? `
            <div class="sh">💳 Modèle B : Système d'Abonnement</div>
            <div class="ps" style="background:#f0f9ff;border-color:#bae6fd">
              <div class="pst" style="border-color:#7dd3fc">
                <div style="margin-bottom:15px">
                  <div class="pr"><span>Frais de mise en service HTVA (remisé)</span><span>${pricing.discountedBaseSetup}€</span></div>
                  <div class="pr"><span>TVA sur mise en service (21%)</span><span>${pricing.vatBaseSetup}€</span></div>
                  <div class="pr"><span><strong>Total Mise en service TVAC</strong></span><strong>${pricing.totalBaseSetupTTC}€</strong></div>
                </div>
                
                <div style="border-top: 1px dashed #7dd3fc; padding-top: 15px;">
                  <div style="font-size:11px; font-weight:700; color:#0369a1; margin-bottom:10px; text-transform:uppercase">Détails de l'abonnement :</div>
                  ${pricing.monthlyBreakdown.map(item => `
                    <div class="pr" style="color:#0369a1; font-size:12px">
                      <span>${escapeHtml(item.item)}</span>
                      <span>${item.price}€ / mois</span>
                    </div>
                  `).join('')}
                  
                  <div class="pr" style="margin-top:10px; border-top:1px solid #7dd3fc; padding-top:10px">
                    <span><strong>Prix Pack Mensuel HTVA</strong></span>
                    <strong>${pricing.totalMonthlyForMenu}€ / mois</strong>
                  </div>
                  <div class="pr"><span>TVA sur abonnement (21%)</span><span>${Math.round(pricing.totalMonthlyForMenu * 0.21)}€ / mois</span></div>
                  <div class="pr" style="margin-top:5px; border-top:1px solid #7dd3fc; padding-top:10px">
                    <span><strong>Total Mensuel TVAC</strong></span>
                    <strong style="color:#0ea5e9">${Math.round(pricing.totalMonthlyForMenu * 1.21)}€ / mois</strong>
                  </div>
                  <div style="font-size:12px;color:#0ea5e9;margin-top:5px;font-weight:700">🎁 PREMIER MOIS OFFERT</div>
                </div>
              </div>
            </div>` : ''}

          <div style="text-align:center">
            <a href="mailto:${escapeHtml(data.email)}" class="btn">Répondre au client</a>
          </div>
        </div>
        <div class="ft">GUAPO Web Designer • Devis #QL-${Date.now().toString().slice(-6)}</div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client
  const quoteSummary = `Bonjour,\n\nJ'ai bien reçu mon estimation et j'aimerais en discuter davantage.\n\n--- RÉSUMÉ ---\nProjet: ${data.company || 'Ma création web'}\nType: ${translateOption(data.siteType, lang)}\nTotal estimé: ${Math.round(pricing.discountedMinPrice * 1.21)}€ TTC`;
  const mailtoQuestionLink = `mailto:info@guapowebdesigner.com?subject=Question sur mon devis - ${data.company || data.firstName}&body=${encodeURIComponent(quoteSummary)}`;

    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#334155;max-width:650px;margin:0 auto;padding:20px;background:#f8fafc}
            .h{background:#1e293b;color:#fff;padding:40px 20px;border-radius:12px 12px 0 0;text-align:center}
            .c{background:#fff;border:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:35px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)}
            ${tableStyles}
            .ps {background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:25px;margin:25px 0}
            .pst {background:#fff;padding:15px;border-radius:8px;border:1px solid #e2e8f0}
            .pr {display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #f1f5f9}
            .pr:last-child {border-bottom:none}
            .pt {background:#10b981;color:#fff;padding:15px;border-radius:8px;text-align:center;font-size:22px;font-weight:800;margin-top:10px}
            .btn-green{display:inline-block;background:#10b981;color:#fff;padding:18px 36px;text-decoration:none;border-radius:8px;font-weight:700;margin:20px 0;font-size:16px;box-shadow:0 4px 6px rgba(16,185,129,0.2)}
            .btn-model{display:inline-block;padding:14px 20px;text-decoration:none;border-radius:8px;font-weight:700;margin-top:20px;font-size:14px;text-align:center;width:100%;box-sizing:border-box}
            .btn-a{background:#1e293b;color:#fff}
            .btn-b{background:#10b981;color:#fff}
            .ft{text-align:center;margin-top:40px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;padding-top:20px}
          </style>
        </head>
        <body>
          <div class="h">
            <h1 style="margin:0;font-size:28px">Votre Estimation de Projet</h1>
            <p style="margin:10px 0 0 0;font-size:16px;opacity:0.8">Prêt à donner vie à votre vision digitale ?</p>
          </div>
          <div class="c">
            <p style="font-size:18px;margin-bottom:25px">Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
            <p>Merci de votre confiance. Voici le récapitulatif détaillé pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> :</p>
            
              <div style="font-weight:700;color:#1e293b;margin-top:30px;font-size:16px">📊 Configuration choisie</div>
              <table class="ptbl">
                <thead>
                  <tr>
                    <th style="width: 50%;">Description</th>
                    <th style="text-align:right; width: 25%;">Unique HT</th>
                    <th style="text-align:right; width: 25%;">Mensuel HT</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows.map(row => `
                    <tr>
                      <td style="font-weight: 500;">${escapeHtml(row.item)}</td>
                      <td style="text-align:right" class="p-val">${row.unique}</td>
                      <td style="text-align:right" class="p-monthly">${row.monthly}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
    
              <div style="margin:40px 0;text-align:center;font-weight:800;color:#1e293b;font-size:18px;border-top:2px dashed #e2e8f0;padding-top:30px">
                COMPAREZ ET CHOISISSEZ VOTRE MODÈLE
              </div>
    
              ${pricing.isMenuProject ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                  <tr>
                    <td width="48%" valign="top" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px;">
                      <div style="text-align:center;font-weight:800;color:#1e293b;margin-bottom:5px;font-size:14px">MODÈLE A</div>
                      <div style="text-align:center;font-weight:bold;color:#1e293b;margin-bottom:12px;font-size:11px;text-transform:uppercase">Investissement Unique</div>
                      
                        <div style="font-size:12px; color:#64748b; margin-bottom:12px; line-height:1.4">
                          Paiement complet du projet pour une pleine propriété dès le départ. Idéal pour optimiser la rentabilité à long terme.
                        </div>

                        <div class="pst" style="padding:10px; font-size:12px">
                          <div class="pr"><span>Prix création HTVA</span><span>${pricing.hasRange ? `${pricing.discountedMinPrice}€ - ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`}</span></div>
                          <div class="pr"><span>TVA (21%)</span><span>${pricing.hasRange ? `${pricing.minVat}€ - ${pricing.maxVat}€` : `${pricing.minVat}€`}</span></div>
                          <div class="pr" style="margin-top:5px; border-top:1px solid #e2e8f0; padding-top:5px">
                            <span><strong>TOTAL CRÉATION</strong></span>
                            <strong style="color:#1e293b">${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`}</strong>
                          </div>
                        </div>
                        
                        <div style="margin-top:12px; background:#f0f9ff; padding:10px; border-radius:8px; border:1px solid #bae6fd; font-size:12px">
                          <div style="font-weight:700; color:#0369a1; margin-bottom:4px; font-size:11px">ABONNEMENT PACK</div>
                          <div style="font-size:11px; color:#64748b; margin-bottom:8px">Accès plateforme, maintenance et support.</div>
                          <div class="pr"><span>Abonnement Mensuel</span><span>${pricing.menuMonthlyHT}€ HT</span></div>
                          <div class="pr"><span>Total Mensuel TVAC</span><strong style="color:#0ea5e9">${pricing.menuMonthlyTTC}€</strong></div>
                          <div style="font-size:10px; color:#0ea5e9; font-weight:800; margin-top:4px">🎁 1ER MOIS OFFERT</div>
                        </div>

                      <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-a">CHOISIR MODÈLE A</a>
                    </td>
                    
                    <td width="4%"></td>
                    
                      <td width="48%" valign="top" style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:20px;">
                        <div style="text-align:center;font-weight:800;color:#065f46;margin-bottom:5px;font-size:14px">MODÈLE B</div>
                        <div style="text-align:center;font-weight:bold;color:#065f46;margin-bottom:12px;font-size:11px;text-transform:uppercase">Option Abonnement</div>
                        
                        <div style="font-size:12px; color:#065f46; margin-bottom:12px; line-height:1.4; opacity:0.8">
                          Lancez votre projet avec 0€ d'investissement initial et un abonnement mensuel calculé selon vos options.
                        </div>

                        <div class="pst" style="padding:10px; font-size:12px; border-color:#a7f3d0; background:#fff">
                          <div class="pr" style="color:#065f46"><span>Mise en service HT</span><strong>0€</strong></div>
                          <div class="pr" style="color:#065f46"><span>TVA (21%)</span><span>0€</span></div>
                          <div class="pr" style="margin-top:5px; border-top:1px solid #a7f3d0; padding-top:5px; color:#065f46">
                            <span><strong>TOTAL INITIAL</strong></span>
                            <strong style="color:#059669">0€</strong>
                          </div>
                        </div>

                        <div style="margin-top:12px; background:#fff; padding:10px; border-radius:8px; border:1px solid #a7f3d0; font-size:12px">
                          <div style="font-weight:700; color:#059669; margin-bottom:6px; font-size:11px; text-transform:uppercase">DÉTAIL ABONNEMENT :</div>
                          ${pricing.monthlyBreakdown.map(item => `
                            <div class="pr" style="color:#065f46; font-size:11px; padding:4px 0">
                              <span>${escapeHtml(item.item)}</span>
                              <span>${item.price}€/m</span>
                            </div>
                          `).join('')}
                          
                          <div class="pr" style="margin-top:8px; border-top:1px solid #a7f3d0; padding-top:8px">
                            <span><strong>TOTAL MENSUEL HT</strong></span>
                            <strong>${pricing.totalMonthlyForMenu}€</strong>
                          </div>
                          <div class="pr"><span>TVA (21%)</span><span>${Math.round(pricing.totalMonthlyForMenu * 0.21)}€</span></div>
                          <div class="pr" style="margin-top:4px; border-top:1px solid #a7f3d0; padding-top:4px">
                            <span><strong>TOTAL MENSUEL TVAC</strong></span>
                            <strong style="color:#059669; font-size:14px">${Math.round(pricing.totalMonthlyForMenu * 1.21)}€</strong>
                          </div>
                          <div style="font-size:11px; color:#059669; font-weight:800; margin-top:4px; text-align:center; background:#d1fae5; padding:4px; border-radius:4px">🎁 1ER MOIS OFFERT</div>
                        </div>

                        <a href="https://guapowebdesigner.com/confirm-quote?model=B&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-model btn-b">CHOISIR MODÈLE B</a>
                      </td>
                  </tr>

              </table>
              ` : `
              <div class="ps">
                <div style="text-align:center;font-weight:800;color:#1e293b;margin-bottom:15px">VOTRE ESTIMATION (-30%)</div>
                <div class="pst">
                  <div class="pr"><span>Prix catalogue HTVA</span><span>${pricing.hasRange ? `${pricing.originalMinPrice}€ - ${pricing.originalMaxPrice}€` : `${pricing.originalMinPrice}€`}</span></div>
                  <div class="pr"><span>Réduction promo (-30%)</span><span style="color:#e11d48">-${pricing.hasRange ? `${pricing.minDiscount}€ - ${pricing.maxDiscount}€` : `${pricing.minDiscount}€`}</span></div>
                  <div class="pr" style="border-top:1px solid #f1f5f9; margin-top:5px; padding-top:10px"><span><strong>Sous-total Projet HTVA</strong></span><strong>${pricing.hasRange ? `${pricing.discountedMinPrice}€ - ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`}</strong></div>
                  <div class="pr"><span>TVA sur projet (21%)</span><span>${pricing.hasRange ? `${pricing.minVat}€ - ${pricing.maxVat}€` : `${pricing.minVat}€`}</span></div>
                  <div class="pr" style="margin-top:10px; border-top:2px solid #e2e8f0; padding-top:10px">
                    <span><strong>TOTAL PROJET TVAC</strong></span>
                    <strong style="font-size:22px; color:#10b981">${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`}</strong>
                  </div>
                </div>
                <div style="text-align:center">
                  <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn-green">VALIDER CE PROJET</a>
                </div>
              </div>
              `}
    
              <div style="text-align:center;margin-top:30px">
                <a href="${mailtoQuestionLink}" style="color:#64748b;text-decoration:none;font-size:14px;font-weight:600">Poser une question sur ce devis →</a>
              </div>

  
            <div style="background:#f8fafc;padding:20px;border-radius:8px;margin-top:40px;font-size:13px;color:#64748b;line-height:1.6">
              <strong>Et après ?</strong> Une fois le projet validé, notre équipe vous contactera sous 24h pour planifier le lancement de votre site.
            </div>
          </div>
          <div class="ft">
            © 2025 GUAPO Web Designer<br>
            <a href="https://guapowebdesigner.com" style="color:#94a3b8;text-decoration:none">www.guapowebdesigner.com</a>
          </div>
        </body>
      </html>
    `;

    try {
      const ownerResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
        replyTo: data.email,
        subject: t.owner.subject(data.firstName, data.lastName, pricing.discountedMinPrice, pricing.discountedMaxPrice, pricing.hasRange),
        html: ownerEmailHtml,
      });

      const clientResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: data.email,
        replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
        subject: t.client.subject,
        html: clientEmailHtml,
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
