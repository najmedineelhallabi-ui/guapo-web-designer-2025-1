// Configuration centralisée des prix pour les devis
// Tous les prix sont en euros (€)

export const PRICING = {
  // Types de site
  siteTypes: {
    "Site vitrine simple (1 à 3 pages)": { min: 800, max: 1200 },
    "Site vitrine standard (4 à 5 pages)": { min: 1200, max: 1800 },
    "Site vitrine avancé (6 à 8 pages)": { min: 1800, max: 2500 },
    "Site vitrine premium (9 à 12 pages)": { min: 2500, max: 3500 },
    "Portfolio / site personnel": { min: 600, max: 1200 },
    "Site e-commerce": { min: 3000, max: 8000 },
  },

  // Fonctionnalités
  features: {
    "Formulaire de contact simple": 150,
    "Formulaire de demande de devis": 200,
    "Système de prise de rendez-vous en ligne": 500,
    "Envoi automatique d'emails client + entreprise (pour rendez-vous)": 300,
    "Intégration calendrier (Google Calendar, etc.)": 400,
    "Newsletter / inscription mailing": 250,
    "Multilingue": 400,
    // Fonctionnalités E-commerce
    "Catalogue de produits": 800,
    "Panier d'achat": 500,
    "Passerelle de paiement (Stripe, PayPal, etc.)": 600,
    "Gestion des commandes": 700,
    "Gestion des stocks": 500,
    "Comptes clients": 400,
  },

  // Optimisation & Sécurité
  optimization: {
    "SEO de base (balises, titres, URLs)": 300,
    "Optimisation vitesse / performance": 250,
    "Certificat SSL / HTTPS": 0, // Inclus gratuit
    "RGPD / conformité légale": 200,
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