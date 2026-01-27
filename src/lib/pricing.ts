// Configuration centralisée des prix pour les devis
// Tous les prix sont en euros (€)

export const PRICING = {
  // Types de site
  siteTypes: {
    "Site vitrine simple (1 à 3 pages)": { min: 350, max: 350 },
    "Site vitrine standard (4 à 5 pages)": { min: 500, max: 500 },
    "Site vitrine avancé (6 à 8 pages)": { min: 650, max: 650 },
    "Site vitrine premium (9 à 12 pages)": { min: 850, max: 850 },
    "Portfolio / site personnel": { min: 600, max: 1200 },
    // Sites e-commerce avec différentes tailles
    "Petite boutique (1-20 produits)": { min: 800, max: 1000 },
    "Boutique moyenne (21-100 produits)": { min: 1800, max: 3100 },
    "Grande boutique (100+ produits)": { min: 3100, max: 5000 },
    // Menu / Site de commande
    "Menu / Site de commande (système de base)": { min: 800, max: 800 },
  },

  // Abonnements (Prix par mois)
  subscriptions: {
    "Pack Menu Simple": 25,
    "Pack Menu Complet": 35,
  },

  // Fonctionnalités
      features: {
        "Formulaire de contact simple": 50,
        "Formulaire de demande de devis": 100,
        "Envoi automatique d'emails de confirmation (pour devis)": 50,
        "Système de prise de rendez-vous en ligne (avec emails automatiques)": 130,
        "Ajouter au calendrier (Google Calendar, Outlook, ICS, etc.)": 50,
        "Intégration calendrier (Google Calendar, etc.)": 50, // Alias for form
        "Multilingue": 120,
        "Blog / actualités": 250,
        "Catalogue de produits": 300,
        "Panier d'achat": 200,
        "Passerelle de paiement (Stripe, PayPal, etc.)": 200,
        "Gestion des commandes": 200,
        "Comptes clients": 300,
        "Dashboard Cuisine": 400,
        "Statuts de commande cuisine": 150,
        "Gestion des stocks": 250,
        "Dashboard Serveur": 240,
        "Statuts de commande serveur": 60,
        "Ajout au panier": 120,
        "Sur place / à emporter": 100,
        "Confirmation de commande": 80,
        "Email automatique client": 60,
        "Gestion menu": 0, // Inclus dans le pack
      },

  // Prix mensuels alternatifs pour les fonctionnalités Menu
  monthlyMenuFeatures: {
    "Dashboard Cuisine": 20,
    "Statuts de commande cuisine": 8,
    "Gestion des stocks": 15,
    "Dashboard Serveur": 12,
    "Statuts de commande serveur": 6,
    "Ajout au panier": 6,
    "Sur place / à emporter": 5,
    "Confirmation de commande": 5,
    "Email automatique client": 8,
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

    // Maintenance
    maintenance: {
      "Pack annuel (6 interventions)": { price: 300, period: "year" },
      "À l'intervention": { price: 100, period: "intervention" },
      "Maintenance standard": { price: 30, period: "month" }
    }
  };

// Fonction pour calculer l'estimation totale
export function calculateEstimate(data: {
  siteType: string;
  features?: string[];
  menuSubscription?: string;
  optimization?: string[];
  domain: string;
}) {
  let minTotal = 0;
  let maxTotal = 0;
  let monthlySubscription = 0;

  // Prix du type de site
  const siteTypePrice = PRICING.siteTypes[data.siteType as keyof typeof PRICING.siteTypes];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
  }

  // Prix de l'abonnement mensuel (ne s'ajoute pas au total unique mais est suivi séparément)
  if (data.menuSubscription) {
    const subPrice = PRICING.subscriptions[data.menuSubscription as keyof typeof PRICING.subscriptions];
    if (subPrice) {
      monthlySubscription += subPrice;
    }
  }

  // Prix des fonctionnalités
  if (data.features) {
    data.features.forEach((feature) => {
      const featurePrice = PRICING.features[feature as keyof typeof PRICING.features];
      if (featurePrice) {
        minTotal += featurePrice;
        maxTotal += featurePrice;
      }

      // Ajouter aussi le prix mensuel si applicable (pour l'affichage du total mensuel)
      const monthlyPrice = (PRICING as any).monthlyMenuFeatures?.[feature];
      if (monthlyPrice) {
        monthlySubscription += monthlyPrice;
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

  return { minTotal, maxTotal, monthlySubscription };
}