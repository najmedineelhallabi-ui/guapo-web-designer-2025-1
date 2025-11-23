// Configuration centralisée des prix pour les devis
// Tous les prix sont en euros (€)

export const PRICING = {
  // Types de site
  siteTypes: {
    "Site vitrine simple (1 à 3 pages)": { min: 500, max: 500 },
    "Site vitrine standard (4 à 5 pages)": { min: 750, max: 750 },
    "Site vitrine avancé (6 à 8 pages)": { min: 1100, max: 1100 },
    "Site vitrine premium (9 à 12 pages)": { min: 1400, max: 1400 },
    "Portfolio / site personnel": { min: 600, max: 1200 },
    // Sites e-commerce avec différentes tailles
    "Petite boutique (1-20 produits)": { min: 1400, max: 1800 },
    "Boutique moyenne (21-100 produits)": { min: 1800, max: 3100 },
    "Grande boutique (100+ produits)": { min: 3100, max: 5000 },
  },

  // Fonctionnalités
  features: {
    "Formulaire de contact simple": 80,
    "Formulaire de demande de devis": 120,
    "Envoi automatique d'emails de confirmation (pour devis)": 85,
    "Système de prise de rendez-vous en ligne (avec emails automatiques)": 170,
    "Ajouter au calendrier (Google Calendar, Outlook, ICS, etc.)": 60,
    "Multilingue": 155,
    // Fonctionnalités E-commerce
    "Catalogue de produits": 300,
    "Panier d'achat": 0,
    "Passerelle de paiement (Stripe, PayPal, etc.)": 185,
    "Gestion des commandes": 250,
    "Gestion des stocks": 350,
    "Comptes clients": 200,
  },

  // Optimisation & Sécurité
  optimization: {
    "Pack Tout Inclus (SEO + Performance + SSL + RGPD)": 300,
    "SEO de base (balises, titres, URLs)": 100,
    "Optimisation vitesse / performance": 100,
    "Certificat SSL / HTTPS": 0, // Inclus gratuit
    "RGPD / conformité légale": 100,
  },

  // Hébergement & Domaine
  hosting: {
    "Inclus dans le projet": 0, // Toujours inclus
    "Fourni par le client": 0,
    "À discuter": 0,
  },

  domain: {
    "Inclus dans le projet": 50,
    "Fourni par le client": 0,
    "À discuter": 0,
  },
};

// Fonction pour calculer l'estimation totale
export function calculateEstimate(data: {
  siteType: string;
  features?: string[];
  optimization?: string[];
  domain: string;
}) {
  let minTotal = 0;
  let maxTotal = 0;

  // Prix du type de site
  const siteTypePrice = PRICING.siteTypes[data.siteType as keyof typeof PRICING.siteTypes];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
  }

  // Prix des fonctionnalités
  if (data.features) {
    data.features.forEach((feature) => {
      const featurePrice = PRICING.features[feature as keyof typeof PRICING.features];
      if (featurePrice) {
        minTotal += featurePrice;
        maxTotal += featurePrice;
      }
    });
  }

  // Prix des optimisations
  if (data.optimization) {
    data.optimization.forEach((opt) => {
      const optPrice = PRICING.optimization[opt as keyof typeof PRICING.optimization];
      if (optPrice) {
        minTotal += optPrice;
        maxTotal += optPrice;
      }
    });
  }

  // Nom de domaine
  const domainPrice = PRICING.domain[data.domain as keyof typeof PRICING.domain];
  if (domainPrice) {
    minTotal += domainPrice;
    maxTotal += domainPrice;
  }

  return { minTotal, maxTotal };
}