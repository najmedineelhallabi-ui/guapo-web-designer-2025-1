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
      // Traductions des catégories de prix
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
      maintenanceOptions: "🔧 Options de Maintenance Disponibles",
      notSelected: "Le client n'a pas encore sélectionné d'option de maintenance",
      maintenanceShowcase: "📦 Maintenance Annuelle - 300€ HT/an (363€ TTC/an)",
      maintenanceShowcaseDetails: "✓ 6 interventions incluses par an<br>✓ Interventions supplémentaires : 100€ HT (121€ TTC)<br>✓ Délai d'intervention : 48h ouvrées<br>✓ Support prioritaire",
      maintenancePerIntervention: "💳 Maintenance par Intervention - 100€ HT (121€ TTC)",
      maintenancePerInterventionDetails: "✓ Sans engagement<br>✓ Paiement à la demande<br>✓ Délai d'intervention : 48h ouvrées<br>✓ Idéal pour besoins ponctuels",
      maintenanceEcommerce: "🛒 Options de Maintenance E-commerce",
      maintenancePremium: "📦 Maintenance Premium - 700€ HT/an (847€ TTC/an)",
      maintenancePremiumDetails: "✓ 12 interventions incluses par an<br>✓ Interventions supplémentaires : 150€ HT (181.50€ TTC)<br>✓ Délai d'intervention : 48h ouvrées<br>✓ Support prioritaire<br>✓ Suivi des performances e-commerce",
      maintenanceEcommercePerIntervention: "💳 Maintenance par Intervention - 150€ HT (181.50€ TTC)",
      maintenanceEcommercePerInterventionDetails: "✓ Sans engagement<br>✓ Paiement à la demande<br>✓ Délai d'intervention : 48h ouvrées<br>✓ Idéal pour besoins ponctuels",
      giftBanner: "🎁 <strong>Premier Mois de Maintenance Offert !</strong>",
      noMaintenanceSelected: "⚠️ Aucune option de maintenance sélectionnée",
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
      // Traductions des catégories pour le client
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
      originalPrice: "Prix original",
      priceWithDiscount: "Prix avec -30%",
      vat: "TVA (21%)",
      totalTTC: "Total TTC:",
      whyMaintenance: "🔧 Pourquoi Maintenance ?",
      maintenanceExplanation: "Site nécessite entretien pour rester <strong>sécurisé</strong> et <strong>performant</strong>.",
      maintenanceFeatures: "✅ Sécurité ✅ Sauvegardes ✅ Performance ✅ Support ✅ Corrections",
      showcaseOptions: "🌐 Options Vitrines",
      ecommerceOptions: "🛒 Options E-commerce",
      annualOption: "📦 Annuel",
      interventionOption: "💳 Intervention",
      giftBanner: "🎁 Premier Mois Offert !",
      estimationOK: "📋 Estimation OK ?",
      chooseOrAsk: "Choisissez maintenance ou posez questions",
      confirmAnnual: "📦 Confirmer Annuel",
      confirmIntervention: "💳 Confirmer Intervention",
      confirm: "✅ Confirmer",
      questionWithSummary: "💬 Question avec Résumé",
      questionTooltip: "Cliquer \"Question\" ouvre email pré-rempli avec votre résumé de devis",
      nextSteps: "📋 Prochaines Étapes",
      contactDetails: "Contact sous <strong>24-48h</strong> pour finaliser.",
      contactInfo: "📧 <strong style=\"color:#8b5cf6\">info@guapowebdesigner.com</strong><br>📱 <strong style=\"color:#8b5cf6\">@guapo_webdesigner</strong>",
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
      // Traductions des catégories de prix
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
      maintenanceOptions: "🔧 Beschikbare Onderhoudsopties",
      notSelected: "De klant heeft nog geen onderhoudsoptie geselecteerd",
      maintenanceShowcase: "📦 Jaarlijks Onderhoud - 300€ excl. BTW/jaar (363€ incl. BTW/jaar)",
      maintenanceShowcaseDetails: "✓ 6 interventies per jaar inbegrepen<br>✓ Extra interventies: 100€ excl. BTW (121€ incl. BTW)<br>✓ Interventietijd: 48u werkdagen<br>✓ Prioritaire ondersteuning",
      maintenancePerIntervention: "💳 Onderhoud per Interventie - 100€ excl. BTW (121€ incl. BTW)",
      maintenancePerInterventionDetails: "✓ Geen verplichting<br>✓ Betaling op aanvraag<br>✓ Interventietijd: 48u werkdagen<br>✓ Ideaal voor incidentele behoeften",
      maintenanceEcommerce: "🛒 E-commerce Onderhoudsopties",
      maintenancePremium: "📦 Premium Onderhoud - 700€ excl. BTW/jaar (847€ incl. BTW/jaar)",
      maintenancePremiumDetails: "✓ 12 interventies per jaar inbegrepen<br>✓ Extra interventies: 150€ excl. BTW (181.50€ incl. BTW)<br>✓ Interventietijd: 48u werkdagen<br>✓ Prioritaire ondersteuning<br>✓ E-commerce prestaties monitoring",
      maintenanceEcommercePerIntervention: "💳 Onderhoud per Interventie - 150€ excl. BTW (181.50€ incl. BTW)",
      maintenanceEcommercePerInterventionDetails: "✓ Geen verplichting<br>✓ Betaling op aanvraag<br>✓ Interventietijd: 48u werkdagen<br>✓ Ideaal voor incidentele behoeften",
      giftBanner: "🎁 <strong>Eerste Maand Onderhoud Gratis!</strong>",
      noMaintenanceSelected: "⚠️ Geen onderhoudsoptie geselecteerd",
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
      // Traductions des catégories pour le client
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
      originalPrice: "Originele prijs",
      priceWithDiscount: "Prijs met -30%",
      vat: "BTW (21%)",
      totalTTC: "Totaal incl. BTW:",
      whyMaintenance: "🔧 Waarom Onderhoud?",
      maintenanceExplanation: "Website vereist onderhoud om <strong>veilig</strong> en <strong>performant</strong> te blijven.",
      maintenanceFeatures: "✅ Veiligheid ✅ Back-ups ✅ Prestaties ✅ Support ✅ Correcties",
      showcaseOptions: "🌐 Vitrine Opties",
      ecommerceOptions: "🛒 E-commerce Opties",
      annualOption: "📦 Jaarlijks",
      interventionOption: "💳 Interventie",
      giftBanner: "🎁 Eerste Maand Gratis!",
      estimationOK: "📋 Schatting OK?",
      chooseOrAsk: "Kies onderhoud of stel vragen",
      confirmAnnual: "📦 Bevestig Jaarlijks",
      confirmIntervention: "💳 Bevestig Interventie",
      confirm: "✅ Bevestigen",
      questionWithSummary: "💬 Vraag met Samenvatting",
      questionTooltip: "Klik \"Vraag\" opent email vooraf ingevuld met uw offertesamenvatting",
      nextSteps: "📋 Volgende Stappen",
      contactDetails: "Contact binnen <strong>24-48u</strong> om te finaliseren.",
      contactInfo: "📧 <strong style=\"color:#8b5cf6\">info@guapowebdesigner.com</strong><br>📱 <strong style=\"color:#8b5cf6\">@guapo_webdesigner</strong>",
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
      // Traductions des catégories de prix
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
      maintenanceOptions: "🔧 Available Maintenance Options",
      notSelected: "The client has not yet selected a maintenance option",
      maintenanceShowcase: "📦 Annual Maintenance - 300€ excl. VAT/year (363€ incl. VAT/year)",
      maintenanceShowcaseDetails: "✓ 6 interventions per year included<br>✓ Additional interventions: 100€ excl. VAT (121€ incl. VAT)<br>✓ Intervention time: 48h working days<br>✓ Priority support",
      maintenancePerIntervention: "💳 Maintenance per Intervention - 100€ excl. VAT (121€ incl. VAT)",
      maintenancePerInterventionDetails: "✓ No commitment<br>✓ Payment on demand<br>✓ Intervention time: 48h working days<br>✓ Ideal for occasional needs",
      maintenanceEcommerce: "🛒 E-commerce Maintenance Options",
      maintenancePremium: "📦 Premium Maintenance - 700€ excl. VAT/year (847€ incl. VAT/year)",
      maintenancePremiumDetails: "✓ 12 interventions per year included<br>✓ Additional interventions: 150€ excl. VAT (181.50€ incl. VAT)<br>✓ Intervention time: 48h working days<br>✓ Priority support<br>✓ E-commerce performance tracking",
      maintenanceEcommercePerIntervention: "💳 Maintenance per Intervention - 150€ excl. VAT (181.50€ incl. VAT)",
      maintenanceEcommercePerInterventionDetails: "✓ No commitment<br>✓ Payment on demand<br>✓ Intervention time: 48h working days<br>✓ Ideal for occasional needs",
      giftBanner: "🎁 <strong>First Month of Maintenance Free!</strong>",
      noMaintenanceSelected: "⚠️ No maintenance option selected",
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
      // Traductions des catégories pour le client
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
      originalPrice: "Original price",
      priceWithDiscount: "Price with -30%",
      vat: "VAT (21%)",
      totalTTC: "Total incl. VAT:",
      whyMaintenance: "🔧 Why Maintenance?",
      maintenanceExplanation: "Website requires maintenance to stay <strong>secure</strong> and <strong>performant</strong>.",
      maintenanceFeatures: "✅ Security ✅ Backups ✅ Performance ✅ Support ✅ Fixes",
      showcaseOptions: "🌐 Showcase Options",
      ecommerceOptions: "🛒 E-commerce Options",
      annualOption: "📦 Annual",
      interventionOption: "💳 Intervention",
      giftBanner: "🎁 First Month Free!",
      estimationOK: "📋 Estimate OK?",
      chooseOrAsk: "Choose maintenance or ask questions",
      confirmAnnual: "📦 Confirm Annual",
      confirmIntervention: "💳 Confirm Intervention",
      confirm: "✅ Confirm",
      questionWithSummary: "💬 Question with Summary",
      questionTooltip: "Click \"Question\" opens pre-filled email with your quote summary",
      nextSteps: "📋 Next Steps",
      contactDetails: "Contact within <strong>24-48h</strong> to finalize.",
      contactInfo: "📧 <strong style=\"color:#8b5cf6\">info@guapowebdesigner.com</strong><br>📱 <strong style=\"color:#8b5cf6\">@guapo_webdesigner</strong>",
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
  optimization?: string[];
  domain?: string;
  languages?: string[];
  otherLanguages?: string;
}, lang: 'fr' | 'nl' | 'en' = 'fr') {
  let minTotal = 0;
  let maxTotal = 0;
  const breakdown: { category: string; item: string; price: string }[] = [];
  const t = getT(lang);

  // Type de site (prix de base) - TRADUIT
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
    breakdown.push({
      category: t.owner.categorySiteType,
      item: translateOption(data.siteType, lang), // TRADUIT
      price: siteTypePrice.min === siteTypePrice.max 
        ? `${siteTypePrice.min}€` 
        : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`
    });
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

  // Fonctionnalités - TRADUIT
  if (data.features && data.features.length > 0) {
    data.features.forEach(feature => {
      const featureKey = feature as keyof typeof PRICING.features;
      const price = PRICING.features[featureKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: t.owner.categoryFeatures,
          item: translateOption(feature, lang), // TRADUIT
          price: price > 0 ? `${price}€` : t.owner.included
        });
      }
    });
  }

  // Langues sélectionnées (si multilingue activé) - TRADUIT
  if (data.languages && data.languages.length > 0) {
    const langList = [...data.languages].map(l => translateOption(l, lang)); // TRADUIT
    if (data.otherLanguages) {
      langList.push(`${t.owner.otherLang} ${data.otherLanguages}`);
    }
    breakdown.push({
      category: t.owner.categoryLanguages,
      item: langList.join(', '),
      price: t.owner.includedInMultilingual
    });
  }

  // Optimisation & Sécurité - TRADUIT
  if (data.optimization && data.optimization.length > 0) {
    data.optimization.forEach(opt => {
      const optKey = opt as keyof typeof PRICING.optimization;
      const price = PRICING.optimization[optKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: t.owner.categoryOptimization,
          item: translateOption(opt, lang), // TRADUIT
          price: price > 0 ? `${price}€` : t.owner.included
        });
      }
    });
  }

  // Nom de domaine - TRADUIT
  if (data.domain) {
    const domainKey = data.domain as keyof typeof PRICING.domain;
    const price = PRICING.domain[domainKey];
    if (price !== undefined && price > 0) {
      minTotal += price;
      maxTotal += price;
      breakdown.push({
        category: t.owner.categoryDomain,
        item: `${translateOption(data.domain, lang)} (${t.owner.firstYear})`, // TRADUIT
        price: `${price}€`
      });
    }
  }

  // Calculer les prix avec réduction -30%
  const originalMinPrice = minTotal;
  const originalMaxPrice = maxTotal;
  const minDiscount = Math.round(originalMinPrice * 0.30);
  const maxDiscount = Math.round(originalMaxPrice * 0.30);
  const discountedMinPrice = originalMinPrice - minDiscount;
  const discountedMaxPrice = originalMaxPrice - maxDiscount;

  // Vérifier si on a une fourchette de prix ou un prix fixe
  const hasRange = minTotal !== maxTotal;

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
    hasRange
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
  languages?: string[];
  otherLanguages?: string;
  optimization?: string[];
  hosting?: string;
  domain?: string;
  message: string;
  language?: 'fr' | 'nl' | 'en';
}) {
  console.log('🚀 Starting email send process with Resend...');
  console.log('📧 Email FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev');
  console.log('📧 Owner Email TO:', process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com');
  console.log('📧 Client Email TO:', data.email);
  console.log('🌐 Language:', data.language || 'fr');
  
  // Get translations based on language
  const lang = data.language || 'fr';
  const t = getT(lang);
  
  // Traduire toutes les options en fonction de la langue
  const translatedSiteType = translateOption(data.siteType, lang);
  const translatedFeatures = data.features?.map(f => translateOption(f, lang)) || [];
  const translatedLanguages = data.languages?.map(l => translateOption(l, lang)) || [];
  const translatedOptimization = data.optimization?.map(o => translateOption(o, lang)) || [];
  const translatedHosting = data.hosting ? translateOption(data.hosting, lang) : '';
  const translatedDomain = data.domain ? translateOption(data.domain, lang) : '';
  
  // Calculer les prix avec réduction -30%
  const pricing = calculatePricing({
    siteType: data.siteType,
    pageCount: data.pageCount,
    features: data.features,
    languages: data.languages,
    otherLanguages: data.otherLanguages,
    optimization: data.optimization,
    domain: data.domain
  }, lang);

  console.log('💰 Pricing calculated:', `Original: ${pricing.originalMinPrice}€, Avec -30%: ${pricing.discountedMinPrice}€`);

  // Grouper les éléments par catégorie - items déjà traduits dans calculatePricing()
  const groupedBreakdown = pricing.breakdown.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    // Les items sont déjà traduits dans calculatePricing(), pas besoin de retraduire
    acc[item.category].push({ item: item.item, price: item.price });
    return acc;
  }, {} as Record<string, { item: string; price: string }[]>);

  // EMAIL 1: Pour le propriétaire (AVEC RÉDUCTION -30%)
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0 0;
            opacity: 0.95;
            font-size: 14px;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 12px 12px;
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 3px solid #e9d5ff;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            background: #f9fafb;
            border-radius: 10px;
            padding: 16px;
            border: 2px solid #e5e7eb;
          }
          .info-item {
            padding: 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .info-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .info-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 600;
            word-break: break-word;
          }
          .features-section {
            margin-top: 20px;
          }
          .features-label {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .feature-tag {
            background: #f3e8ff;
            color: #7c3aed;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            border: 2px solid #e9d5ff;
            text-align: center;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 3px solid #8b5cf6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .price-title {
            font-size: 20px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 20px;
          }
          .price-breakdown {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .price-category {
            font-size: 15px;
            font-weight: 700;
            color: #8b5cf6;
            margin-top: 18px;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e9d5ff;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
            align-items: center;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
            font-weight: 500;
            flex: 1;
          }
          .price-value {
            font-weight: 700;
            color: #8b5cf6;
            font-size: 15px;
            white-space: nowrap;
            margin-left: 16px;
          }
          .discount-highlight {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 18px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
          }
          .discount-label {
            font-size: 14px;
            opacity: 0.95;
            margin-bottom: 8px;
          }
          .discount-amount {
            font-size: 32px;
            font-weight: 700;
          }
          .price-summary {
            background: white;
            border-radius: 10px;
            padding: 18px;
            margin-top: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .price-final {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 18px;
            border-radius: 10px;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            margin-top: 15px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .message-box {
            background: #fef3c7;
            border-left: 5px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-title {
            font-size: 15px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 12px;
          }
          .message-text {
            color: #78350f;
            font-size: 14px;
            line-height: 1.7;
            white-space: pre-wrap;
          }
          .maintenance-section {
            background: #f0f9ff;
            border: 3px solid #0ea5e9;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .maintenance-title {
            color: #0369a1;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .option-card {
            background: white;
            padding: 18px;
            border-radius: 10px;
            margin: 12px 0;
            border: 2px solid #0ea5e9;
            box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
          }
          .option-name {
            font-weight: 700;
            color: #0369a1;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .option-details {
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
          }
          .gift-banner {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            text-align: center;
            font-weight: 700;
            color: #78350f;
            border: 2px solid #fbbf24;
          }
          .action-buttons {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            margin: 8px;
            font-size: 15px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .footer {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #9ca3af;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t.owner.title}</h1>
          <p>${t.owner.subtitle}</p>
        </div>
        
        <div class="content">
          <!-- INFORMATIONS CLIENT -->
          <div class="section">
            <div class="section-title">${t.owner.clientInfo}</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">${t.owner.fullName}</div>
                <div class="info-value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.owner.email}</div>
                <div class="info-value">${escapeHtml(data.email)}</div>
              </div>
              ${data.company ? `
              <div class="info-item">
                <div class="info-label">${t.owner.company}</div>
                <div class="info-value">${escapeHtml(data.company)}</div>
              </div>
              ` : ''}
              ${data.sector ? `
              <div class="info-item">
                <div class="info-label">${t.owner.sector}</div>
                <div class="info-value">${escapeHtml(data.sector)}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <!-- DÉTAILS DU PROJET -->
          <div class="section">
            <div class="section-title">${t.owner.projectDetails}</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">${t.owner.siteType}</div>
                <div class="info-value">${escapeHtml(translatedSiteType)}</div>
              </div>
              ${data.pageCount ? `
              <div class="info-item">
                <div class="info-label">${t.owner.pages}</div>
                <div class="info-value">${escapeHtml(data.pageCount.toString())} pages</div>
              </div>
              ` : ''}
              ${data.hosting ? `
              <div class="info-item">
                <div class="info-label">${t.owner.hosting}</div>
                <div class="info-value">${escapeHtml(translatedHosting)}</div>
              </div>
              ` : ''}
              ${data.domain ? `
              <div class="info-item">
                <div class="info-label">${t.owner.domain}</div>
                <div class="info-value">${escapeHtml(translatedDomain)}</div>
              </div>
              ` : ''}
            </div>

            ${translatedFeatures.length > 0 ? `
            <div class="features-section">
              <div class="features-label">${t.owner.requestedFeatures}</div>
              <div class="features-grid">
                ${translatedFeatures.map(feature => `<div class="feature-tag">${escapeHtml(feature)}</div>`).join('')}
              </div>
            </div>
            ` : ''}

            ${translatedLanguages.length > 0 ? `
            <div class="features-section">
              <div class="features-label">${t.owner.languages}</div>
              <div class="features-grid">
                ${translatedLanguages.map(lang => `<div class="feature-tag">${escapeHtml(lang)}</div>`).join('')}
                ${data.otherLanguages ? `<div class="feature-tag">${t.owner.otherLang} ${escapeHtml(data.otherLanguages)}</div>` : ''}
              </div>
            </div>
            ` : ''}

            ${translatedOptimization.length > 0 ? `
            <div class="features-section">
              <div class="features-label">${t.owner.optimization}</div>
              <div class="features-grid">
                ${translatedOptimization.map(opt => `<div class="feature-tag">${escapeHtml(opt)}</div>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- ESTIMATION TARIFAIRE -->
          <div class="price-section">
            <div class="price-title">${t.owner.pricing}</div>
            
            <div class="price-breakdown">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div class="price-category">${t.owner.breakdown(category)}</div>
                ${items.map(({ item, price }) => `
                  <div class="price-row">
                    <span class="price-label">${escapeHtml(item)}</span>
                    <span class="price-value">${escapeHtml(price)}</span>
                  </div>
                `).join('')}
              `).join('')}
            </div>

            <div class="discount-highlight">
              <div class="discount-label">${t.owner.discount}</div>
              <div class="discount-amount">${pricing.hasRange ? `-${pricing.minDiscount}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} -${pricing.maxDiscount}€` : `-${pricing.minDiscount}€`}</div>
            </div>

            <div class="price-summary">
              <div class="price-row">
                <span class="price-label" style="text-decoration: line-through; opacity: 0.6;">${t.owner.originalPrice}</span>
                <span class="price-value" style="text-decoration: line-through; opacity: 0.6;">${pricing.hasRange ? `${pricing.originalMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.originalMaxPrice}€` : `${pricing.originalMinPrice}€`}</span>
              </div>
              <div class="price-row">
                <span class="price-label"><strong>${t.owner.priceWithDiscount}</strong></span>
                <strong class="price-value" style="font-size: 17px;">${pricing.hasRange ? `${pricing.discountedMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.discountedMaxPrice}€` : `${pricing.discountedMinPrice}€`}</strong>
              </div>
              <div class="price-row">
                <span class="price-label">${t.owner.vat}</span>
                <span class="price-value">${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 0.21)}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${Math.round(pricing.discountedMaxPrice * 0.21)}€` : `${Math.round(pricing.discountedMinPrice * 0.21)}€`}</span>
              </div>
            </div>

            <div class="price-final">
              ${t.owner.totalTTC} ${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 1.21)}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${Math.round(pricing.discountedMaxPrice * 1.21)}€` : `${Math.round(pricing.discountedMinPrice * 1.21)}€`}
            </div>
          </div>

          <!-- MESSAGE DU CLIENT -->
          ${data.message ? `
          <div class="message-box">
            <div class="message-title">${t.owner.clientMessage}</div>
            <div class="message-text">${escapeHtml(data.message)}</div>
          </div>
          ` : ''}

          <!-- OPTIONS DE MAINTENANCE -->
          ${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') || data.siteType.toLowerCase().includes('showcase') ? `
          <div class="maintenance-section">
            <h3 class="maintenance-title">${t.owner.maintenanceOptions}</h3>
            <p style="text-align: center; color: #475569; font-size: 14px; margin-bottom: 15px;">
              ${t.owner.notSelected}
            </p>

            <div class="option-card">
              <div class="option-name">${t.owner.maintenanceShowcase}</div>
              <div class="option-details">
                ${t.owner.maintenanceShowcaseDetails}
              </div>
            </div>

            <div class="option-card">
              <div class="option-name">${t.owner.maintenancePerIntervention}</div>
              <div class="option-details">
                ${t.owner.maintenancePerInterventionDetails}
              </div>
            </div>

            <div class="gift-banner">
              ${t.owner.giftBanner}
            </div>
          </div>
          ` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') || data.siteType.toLowerCase().includes('shop') || data.siteType.toLowerCase().includes('winkel') ? `
          <div class="maintenance-section">
            <h3 class="maintenance-title">${t.owner.maintenanceEcommerce}</h3>
            <p style="text-align: center; color: #475569; font-size: 14px; margin-bottom: 15px;">
              ${t.owner.notSelected}
            </p>

            <div class="option-card">
              <div class="option-name">${t.owner.maintenancePremium}</div>
              <div class="option-details">
                ${t.owner.maintenancePremiumDetails}
              </div>
            </div>

            <div class="option-card">
              <div class="option-name">${t.owner.maintenanceEcommercePerIntervention}</div>
              <div class="option-details">
                ${t.owner.maintenanceEcommercePerInterventionDetails}
              </div>
            </div>

            <div class="gift-banner">
              ${t.owner.giftBanner}
            </div>
          </div>
          ` : `
          <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <strong style="color: #991b1b;">${t.owner.noMaintenanceSelected}</strong>
          </div>
          `}

          <!-- ACTIONS -->
          <div class="action-buttons">
            <a href="mailto:${escapeHtml(data.email)}" class="btn">
              ${t.owner.replyToClient}
            </a>
          </div>
        </div>

        <div class="footer">
          ${t.owner.footer}
        </div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client (VERSION ULTRA-OPTIMISÉE - MAXIMUM COMPACT AVEC -30%)
  
  // Créer un résumé du devis pour le bouton Question AVEC TRADUCTIONS
  const quoteSummaryText = lang === 'fr' 
    ? `Bonjour,

J'ai reçu mon estimation de devis et j'aurais une question concernant mon projet :`
    : lang === 'nl'
    ? `Hallo,

Ik heb mijn offerte schatting ontvangen en ik heb een vraag over mijn project:`
    : `Hello,

I received my quote estimate and I have a question about my project:`;

  const quoteSummary = `${quoteSummaryText}

--- ${lang === 'fr' ? 'RÉSUMÉ DE MON DEVIS' : lang === 'nl' ? 'SAMENVATTING VAN MIJN OFFERTE' : 'MY QUOTE SUMMARY'} ---
${lang === 'fr' ? 'Entreprise' : lang === 'nl' ? 'Bedrijf' : 'Company'}: ${data.company || (lang === 'fr' ? 'Mon projet' : lang === 'nl' ? 'Mijn project' : 'My project')}
${lang === 'fr' ? 'Type de site' : lang === 'nl' ? 'Type website' : 'Website type'}: ${translatedSiteType}
${lang === 'fr' ? 'Nombre de pages' : lang === 'nl' ? 'Aantal pagina\'s' : 'Number of pages'}: ${data.pageCount || (lang === 'fr' ? 'Non spécifié' : lang === 'nl' ? 'Niet gespecificeerd' : 'Not specified')}
${translatedFeatures.length > 0 ? `${lang === 'fr' ? 'Fonctionnalités' : lang === 'nl' ? 'Functionaliteiten' : 'Features'}: ${translatedFeatures.join(', ')}` : ''}
${translatedOptimization.length > 0 ? `${lang === 'fr' ? 'Optimisation' : lang === 'nl' ? 'Optimalisatie' : 'Optimization'}: ${translatedOptimization.join(', ')}` : ''}
${data.hosting ? `${lang === 'fr' ? 'Hébergement' : lang === 'nl' ? 'Hosting' : 'Hosting'}: ${translatedHosting}` : ''}
${data.domain ? `${lang === 'fr' ? 'Domaine' : lang === 'nl' ? 'Domein' : 'Domain'}: ${translatedDomain}` : ''}

${pricing.hasRange 
  ? `${lang === 'fr' ? 'Prix original' : lang === 'nl' ? 'Originele prijs' : 'Original price'}: ${pricing.originalMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.originalMaxPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}
${lang === 'fr' ? 'Réduction -30%' : lang === 'nl' ? 'Korting -30%' : 'Discount -30%'}: -${pricing.minDiscount}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} -${pricing.maxDiscount}€
${lang === 'fr' ? 'Prix final' : lang === 'nl' ? 'Eindprijs' : 'Final price'}: ${pricing.discountedMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.discountedMaxPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'} (${Math.round(pricing.discountedMinPrice * 1.21)}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${Math.round(pricing.discountedMaxPrice * 1.21)}€ ${lang === 'fr' ? 'TTC' : lang === 'nl' ? 'incl. BTW' : 'incl. VAT'})`
  : `${lang === 'fr' ? 'Prix original' : lang === 'nl' ? 'Originele prijs' : 'Original price'}: ${pricing.originalMinPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}
${lang === 'fr' ? 'Réduction -30%' : lang === 'nl' ? 'Korting -30%' : 'Discount -30%'}: -${pricing.minDiscount}€
${lang === 'fr' ? 'Prix final' : lang === 'nl' ? 'Eindprijs' : 'Final price'}: ${pricing.discountedMinPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'} (${Math.round(pricing.discountedMinPrice * 1.21)}€ ${lang === 'fr' ? 'TTC' : lang === 'nl' ? 'incl. BTW' : 'incl. VAT'})`
}
-----------------------

${lang === 'fr' ? 'Ma question' : lang === 'nl' ? 'Mijn vraag' : 'My question'}:
[${lang === 'fr' ? 'Écrivez votre question ici' : lang === 'nl' ? 'Schrijf uw vraag hier' : 'Write your question here'}]

${lang === 'fr' ? 'Cordialement' : lang === 'nl' ? 'Vriendelijke groeten' : 'Best regards'},
${data.firstName} ${data.lastName}
${data.email}`;

  const mailtoQuestionLink = `mailto:info@guapowebdesigner.com?subject=${encodeURIComponent(`${lang === 'fr' ? 'Question concernant mon devis' : lang === 'nl' ? 'Vraag over mijn offerte' : 'Question about my quote'} - ${data.company || data.firstName}`)}&body=${encodeURIComponent(quoteSummary)}`;

  const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body{font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:15px;background:#f8f9fa}
.h{background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center}
.c{background:#fff;border:2px solid #e2e8f0;border-radius:0 0 8px 8px;padding:20px}
.ps{background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border:2px solid #8b5cf6;border-radius:8px;padding:15px;margin:15px 0}
.pg{background:#fff;border-radius:6px;padding:12px;margin-bottom:12px}
.pr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
.pr:last-child{border-bottom:none}
.pc{font-size:13px;font-weight:600;color:#8b5cf6;margin-top:10px;margin-bottom:5px;padding-bottom:3px;border-bottom:2px solid #e9d5ff}
.pc:first-child{margin-top:0}
.db{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:12px;border-radius:6px;margin:10px 0;text-align:center}
.pst{background:#f9fafb;padding:10px 12px;border-radius:6px;margin-top:12px;border:2px solid #e5e7eb}
.pt{background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;padding:12px;border-radius:6px;text-align:center;font-size:18px;font-weight:700;margin-top:8px}
.mb{background:#f0f9ff;border:2px solid #0ea5e9;border-radius:8px;padding:15px;margin:15px 0}
.oc{background:#fff;padding:10px;border-radius:6px;margin:8px 0;border:2px solid #8b5cf6}
.btn{display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:700;margin:8px 4px;font-size:14px}
.btn-q{background:linear-gradient(135deg,#8b5cf6,#a855f7)}
.gift{background:#fef3c7;padding:10px;border-radius:6px;margin:10px 0;text-align:center;font-weight:600;color:#78350f;border:2px solid#fbbf24;font-size:13px}
.cb{background:#fef3c7;border:2px solid#fbbf24;border-radius:8px;padding:15px;margin:15px 0;text-align:center}
</style>
</head>
<body>
<div class="h"><h1 style="margin:0;font-size:22px">${t.client.title}</h1></div>
<div class="c">
<p style="margin:10px 0">${t.client.greeting(escapeHtml(data.firstName), escapeHtml(data.lastName))}</p>
<p style="margin:10px 0">${t.client.intro(escapeHtml(data.company || (lang === 'fr' ? 'votre projet' : lang === 'nl' ? 'uw project' : 'your project')))}</p>

<div class="ps">
<div style="font-size:16px;font-weight:700;color:#6d28d9;text-align:center;margin-bottom:12px">${t.client.estimationTitle}</div>
<div class="pg">
${Object.entries(groupedBreakdown).map(([category, items]) => `
<div class="pc">${t.owner.breakdown(category)}</div>
${items.map(({ item, price }) => `
<div class="pr"><span>${escapeHtml(item)}</span><strong style="color:#8b5cf6">${escapeHtml(price)}</strong></div>
`).join('')}
`).join('')}
</div>
<div class="db">
<div style="font-size:12px;opacity:0.9;margin-bottom:5px">${t.client.discount}</div>
<div style="font-size:24px;font-weight:700">${pricing.hasRange ? `-${pricing.minDiscount}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} -${pricing.maxDiscount}€` : `-${pricing.minDiscount}€`}</div>
</div>
<div class="pst">
<div class="pr"><span style="text-decoration:line-through;opacity:0.6">${t.client.originalPrice}</span><span style="text-decoration:line-through;opacity:0.6">${pricing.hasRange ? `${pricing.originalMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.originalMaxPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}` : `${pricing.originalMinPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}`}</span></div>
<div class="pr"><span><strong>${t.client.priceWithDiscount}</strong></span><strong style="color:#8b5cf6">${pricing.hasRange ? `${pricing.discountedMinPrice}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${pricing.discountedMaxPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}` : `${pricing.discountedMinPrice}€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'}`}</strong></div>
<div class="pr"><span>${t.client.vat}</span><strong style="color:#8b5cf6">${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 0.21)}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${Math.round(pricing.discountedMaxPrice * 0.21)}€` : `${Math.round(pricing.discountedMinPrice * 0.21)}€`}</strong></div>
</div>
<div class="pt">${t.client.totalTTC} ${pricing.hasRange ? `${Math.round(pricing.discountedMinPrice * 1.21)}€ ${lang === 'en' ? 'to' : lang === 'nl' ? 'tot' : 'à'} ${Math.round(pricing.discountedMaxPrice * 1.21)}€` : `${Math.round(pricing.discountedMinPrice * 1.21)}€`}</div>
</div>

<div class="mb">
<h3 style="color:#0369a1;text-align:center;margin:0 0 8px 0;font-size:15px">${t.client.whyMaintenance}</h3>
<p style="color:#475569;font-size:12px;text-align:center;margin:8px 0">${t.client.maintenanceExplanation}</p>
<div style="background:#fff;border-radius:5px;padding:10px;font-size:11px;color:#64748b">
${t.client.maintenanceFeatures}
</div>
</div>

${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') || data.siteType.toLowerCase().includes('showcase') ? `
<div style="background:#fff;border:2px solid#8b5cf6;border-radius:8px;padding:12px;margin:15px 0">
<h3 style="color:#8b5cf6;text-align:center;margin:0 0 10px 0;font-size:15px">${t.client.showcaseOptions}</h3>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">${t.client.annualOption} - 300€ ${lang === 'fr' ? 'HT/an (363€ TTC)' : lang === 'nl' ? 'excl. BTW/jaar (363€ incl. BTW)' : 'excl. VAT/year (363€ incl. VAT)'}</div>
<div style="font-size:11px;color:#4b5563">• 6 ${lang === 'fr' ? 'interventions/an' : lang === 'nl' ? 'interventies/jaar' : 'interventions/year'} • ${lang === 'fr' ? 'Supp' : lang === 'nl' ? 'Extra' : 'Extra'}: 100€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'} • ${lang === 'fr' ? 'Délai 48h' : lang === 'nl' ? 'Termijn 48u' : 'Delay 48h'}</div>
</div>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">${t.client.interventionOption} - 100€ ${lang === 'fr' ? 'HT (121€ TTC)' : lang === 'nl' ? 'excl. BTW (121€ incl. BTW)' : 'excl. VAT (121€ incl. VAT)'}</div>
<div style="font-size:11px;color:#4b5563">• ${lang === 'fr' ? 'Sans engagement' : lang === 'nl' ? 'Geen verplichting' : 'No commitment'} • ${lang === 'fr' ? 'Paiement à la demande' : lang === 'nl' ? 'Betaling op aanvraag' : 'Payment on demand'}</div>
</div>
<div class="gift">${t.client.giftBanner}</div>
</div>
` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') || data.siteType.toLowerCase().includes('shop') || data.siteType.toLowerCase().includes('winkel') ? `
<div style="background:#fff;border:2px solid#8b5cf6;border-radius:8px;padding:12px;margin:15px 0">
<h3 style="color:#8b5cf6;text-align:center;margin:0 0 10px 0;font-size:15px">${t.client.ecommerceOptions}</h3>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">${t.client.annualOption} - 700€ ${lang === 'fr' ? 'HT/an (847€ TTC)' : lang === 'nl' ? 'excl. BTW/jaar (847€ incl. BTW)' : 'excl. VAT/year (847€ incl. VAT)'}</div>
<div style="font-size:11px;color:#4b5563">• 12 ${lang === 'fr' ? 'interventions/an' : lang === 'nl' ? 'interventies/jaar' : 'interventions/year'} • ${lang === 'fr' ? 'Supp' : lang === 'nl' ? 'Extra' : 'Extra'}: 150€ ${lang === 'fr' ? 'HT' : lang === 'nl' ? 'excl. BTW' : 'excl. VAT'} • ${lang === 'fr' ? 'Délai 48h' : lang === 'nl' ? 'Termijn 48u' : 'Delay 48h'}</div>
</div>
<div class="oc">
<div style="font-weight:700;color:#8b5cf6;margin-bottom:5px;font-size:13px">${t.client.interventionOption} - 150€ ${lang === 'fr' ? 'HT (181.50€ TTC)' : lang === 'nl' ? 'excl. BTW (181.50€ incl. BTW)' : 'excl. VAT (181.50€ incl. VAT)'}</div>
<div style="font-size:11px;color:#4b5563">• ${lang === 'fr' ? 'Sans engagement' : lang === 'nl' ? 'Geen verplichting' : 'No commitment'} • ${lang === 'fr' ? 'Paiement à la demande' : lang === 'nl' ? 'Betaling op aanvraag' : 'Payment on demand'}</div>
</div>
<div class="gift">${t.client.giftBanner}</div>
</div>
` : ''}

<div class="cb">
<div style="font-size:15px;font-weight:700;color:#92400e;margin-bottom:10px">${t.client.estimationOK}</div>
<div style="font-size:12px;color:#78350f;margin-bottom:12px">${t.client.chooseOrAsk}</div>
${data.siteType.toLowerCase().includes('vitrine') || data.siteType.toLowerCase().includes('portfolio') || data.siteType.toLowerCase().includes('personnel') || data.siteType.toLowerCase().includes('showcase') ? `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent(lang === 'fr' ? 'Annuel 300€/an' : lang === 'nl' ? 'Jaarlijks 300€/jaar' : 'Annual 300€/year')}" class="btn">${t.client.confirmAnnual}</a>
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent(lang === 'fr' ? 'Intervention 100€' : lang === 'nl' ? 'Interventie 100€' : 'Intervention 100€')}" class="btn">${t.client.confirmIntervention}</a>
` : data.siteType.toLowerCase().includes('boutique') || data.siteType.toLowerCase().includes('e-commerce') || data.siteType.toLowerCase().includes('ecommerce') || data.siteType.toLowerCase().includes('shop') || data.siteType.toLowerCase().includes('winkel') ? `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent(lang === 'fr' ? 'Annuel 700€/an' : lang === 'nl' ? 'Jaarlijks 700€/jaar' : 'Annual 700€/year')}" class="btn">${t.client.confirmAnnual}</a>
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}&maintenanceType=${encodeURIComponent(lang === 'fr' ? 'Intervention 150€' : lang === 'nl' ? 'Interventie 150€' : 'Intervention 150€')}" class="btn">${t.client.confirmIntervention}</a>
` : `
<a href="https://guapowebdesigner.com/confirm-quote?firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}&minPrice=${pricing.discountedMinPrice}&maxPrice=${pricing.discountedMaxPrice}" class="btn">${t.client.confirm}</a>
`}
<div style="margin-top:10px">
<a href="${mailtoQuestionLink}" class="btn btn-q">${t.client.questionWithSummary}</a>
</div>
<div style="font-size:10px;color:#78350f;margin-top:10px;font-style:italic">${t.client.questionTooltip}</div>
</div>

<div style="background:#f9fafb;border-left:4px solid#8b5cf6;border-radius:6px;padding:10px;margin:12px 0">
<div style="font-weight:600;color:#6d28d9;margin-bottom:6px;font-size:13px">${t.client.nextSteps}</div>
<div style="font-size:12px;color:#4b5563">${t.client.contactDetails}</div>
</div>

<div style="text-align:center;padding:10px;background:#f3e8ff;border-radius:6px;margin:12px 0;font-size:12px">
${t.client.contactInfo}
</div>

<p style="margin:10px 0">${t.client.signature}</p>
</div>
<div style="text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid#e2e8f0;color:#9ca3af;font-size:10px">${t.client.footer}</div>
</body>
</html>
  `;

  try {
    console.log('📨 Sending emails via Resend...');
    
    // Envoyer EMAIL 1: Au propriétaire
    console.log('📧 1/2 - Sending email to owner...');
    const ownerResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: data.email,
      subject: t.owner.subject(data.firstName, data.lastName, pricing.discountedMinPrice, pricing.discountedMaxPrice, pricing.hasRange),
      html: ownerEmailHtml,
    });
    console.log('✅ 1/2 - Owner email sent successfully!', ownerResult);

    // Envoyer EMAIL 2: Au client
    console.log('📧 2/2 - Sending confirmation email to client...');
    const clientResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      subject: t.client.subject,
      html: clientEmailHtml,
    });
    console.log('✅ 2/2 - Client email sent successfully!', clientResult);

    console.log('🎉 Email process completed with Resend!');
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